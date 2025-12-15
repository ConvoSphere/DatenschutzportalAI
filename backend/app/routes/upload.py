from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends, BackgroundTasks
from typing import List
from app.services.nextcloud import NextcloudService
from app.services.email_service import EmailService
from app.services.ai_audit import AIAuditService
from app.models.upload import UploadResponse
from app.config import settings
from app.utils.auth import verify_token
from datetime import datetime
import os
import json
import re
import logging
import tempfile
import shutil

logger = logging.getLogger(__name__)

router = APIRouter()
nextcloud = NextcloudService()
email_service = EmailService()
ai_service = AIAuditService()

async def perform_audit_and_notify(
    project_id: str,
    project_title: str,
    email: str,
    file_names: List[str]
):
    """
    Background task to perform AI audit and notify the team.
    """
    logger.info(f"Starting background audit for project {project_id}")
    temp_dir = tempfile.mkdtemp()
    try:
        # Download files
        local_file_paths = []
        for filename in file_names:
            remote_path = f"{settings.nextcloud_base_path}/{project_id}/{filename}"
            local_path = os.path.join(temp_dir, filename)
            
            try:
                # We access the webdav client directly for download
                nextcloud.client.download_sync(remote_path=remote_path, local_path=local_path)
                local_file_paths.append(local_path)
            except Exception as e:
                logger.error(f"Failed to download {filename} for audit: {e}")

        if not local_file_paths:
            raise Exception("No files could be downloaded for audit")

        # Perform Audit
        audit_result = await ai_service.perform_audit(project_id, local_file_paths)
        
        # Generate Report
        report_filename = "AUDIT_REPORT.md"
        report_path = os.path.join(temp_dir, report_filename)
        await ai_service.generate_report(audit_result, report_path)
        
        # Upload Report
        # Read the report content to upload using existing service method
        with open(report_path, 'r', encoding='utf-8') as f:
            report_content = f.read()
        
        remote_report_path = f"{settings.nextcloud_base_path}/{project_id}/{report_filename}"
        await nextcloud.upload_content(report_content, remote_report_path)
        
        # Send Team Notification
        await email_service.send_team_notification(
            project_id=project_id,
            project_title=project_title,
            uploader_email=email,
            file_names=file_names,
            audit_summary=audit_result.summary,
            audit_status=audit_result.overall_status
        )
        
    except Exception as e:
        logger.error(f"Error in background audit task: {e}", exc_info=True)
        # Notify team about the error
        try:
            await email_service.send_team_notification(
                project_id=project_id,
                project_title=project_title,
                uploader_email=email,
                file_names=file_names,
                audit_summary=f"Automatischer Audit fehlgeschlagen: {str(e)}",
                audit_status="ERROR"
            )
        except Exception as notify_error:
            logger.error(f"Failed to send error notification: {notify_error}")
            pass
            
    finally:
        # Cleanup
        if os.path.exists(temp_dir):
            shutil.rmtree(temp_dir)

@router.post("/upload", response_model=UploadResponse, dependencies=[Depends(verify_token)])
async def upload_documents(
    background_tasks: BackgroundTasks,
    email: str = Form(...),
    uploader_name: str = Form(None),
    project_title: str = Form(...),
    institution: str = Form(...),
    is_prospective_study: bool = Form(False),
    project_details: str = Form(None),
    files: List[UploadFile] = File(...),
    file_categories: str = Form(None),
    project_type: str = Form("new")
):
    """
    Upload data protection documents to Nextcloud
    """
    logger.info(f"Upload request received - Email: {email}, Project: {project_title}, Files: {len(files)}")
    logger.debug(f"Upload details - Institution: {institution}, Project type: {project_type}, Prospective: {is_prospective_study}")
    
    try:
        # Sanitize project title for folder name
        # Replace non-alphanumeric characters (except spaces, dashes, underscores) with underscore
        safe_title = re.sub(r'[^a-zA-Z0-9 \-_]', '_', project_title)
        # Replace spaces with underscores
        safe_title = safe_title.replace(' ', '_')
        # Remove multiple underscores
        safe_title = re.sub(r'_+', '_', safe_title)
        # Trim underscores
        safe_title = safe_title.strip('_')
        
        date_str = datetime.now().strftime('%Y-%m-%d')
        
        if project_type == 'existing':
            folder_name = f"RE_{safe_title}_{date_str}"
        else:
            folder_name = f"{safe_title}_{date_str}"
            
        # Use folder_name as project_id for consistency with storage
        project_id = folder_name
        logger.debug(f"Generated project_id: {project_id}")
        
        # Parse categories if provided
        categories_map = {}
        if file_categories:
            try:
                categories_map = json.loads(file_categories)
                logger.debug(f"Parsed file categories: {len(categories_map)} mappings")
            except Exception as e:
                logger.warning(f"Failed to parse file_categories JSON: {e}")
                pass
        
        # Validate files
        logger.debug("Validating files...")
        for file in files:
            logger.debug(f"Validating file: {file.filename}, size: {file.size} bytes, content_type: {file.content_type}")
            if file.size > settings.max_file_size:
                logger.error(f"File {file.filename} exceeds maximum size: {file.size} > {settings.max_file_size}")
                raise HTTPException(
                    status_code=413,
                    detail=f"File {file.filename} exceeds maximum size of 50 MB"
                )
            
            file_ext = os.path.splitext(file.filename)[1].lower()
            if file_ext not in settings.allowed_file_types:
                logger.error(f"File {file.filename} has disallowed extension: {file_ext}")
                raise HTTPException(
                    status_code=400,
                    detail=f"File type {file_ext} not allowed"
                )
        
        logger.info("File validation passed")
        
        # Create project folder structure
        project_path = f"{settings.nextcloud_base_path}/{project_id}"
        logger.info(f"Creating project folder: {project_path}")
        
        # Test connection before attempting folder creation
        connection_ok, connection_msg = nextcloud.test_connection()
        if not connection_ok:
            logger.error(f"Nextcloud connection failed: {connection_msg}")
            raise HTTPException(
                status_code=503,
                detail=f"Nextcloud connection failed. Please check Nextcloud configuration and credentials. Error: {connection_msg}"
            )
        
        if not nextcloud.create_folder(project_path):
            logger.error(f"Failed to create project folder: {project_path}")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to create project folder in Nextcloud at path: {project_path}. Please check Nextcloud permissions and ensure the base path exists."
            )
        
        # Upload files directly to project folder (no subfolders)
        uploaded_files = []
        logger.info(f"Starting upload of {len(files)} files...")
        for idx, file in enumerate(files, 1):
            category = categories_map.get(file.filename, "sonstiges")
            logger.debug(f"Uploading file {idx}/{len(files)}: {file.filename} to category: {category}")
            
            # Upload directly to project folder, no category subfolders
            file_path = f"{project_path}/{file.filename}"
            if not await nextcloud.upload_file(file, file_path):
                logger.error(f"Failed to upload file: {file.filename} to {file_path}")
                raise HTTPException(status_code=500, detail=f"Failed to upload file: {file.filename}")
            
            logger.debug(f"Successfully uploaded file: {file.filename}")
            uploaded_files.append({
                "filename": file.filename,
                "category": category,
                "path": file_path
            })
        
        logger.info(f"Successfully uploaded {len(uploaded_files)} files")
        
        # Create metadata file
        logger.debug("Creating metadata file...")
        metadata = {
            "project_id": project_id,
            "email": email,
            "uploader_name": uploader_name,
            "project_title": project_title,
            "project_details": project_details,
            "institution": institution,
            "is_prospective_study": is_prospective_study,
            "upload_timestamp": datetime.now().isoformat(),
            "files": uploaded_files,
            "project_type": project_type
        }
        
        metadata_path = f"{project_path}/metadata.json"
        if not await nextcloud.upload_metadata(metadata, metadata_path):
            logger.error(f"Failed to upload metadata to {metadata_path}")
            raise HTTPException(status_code=500, detail="Failed to upload metadata")

        # Create README.md
        logger.debug("Creating README.md...")
        readme_content = f"""# {project_title}

**Projekt-ID:** {project_id}
**Datum:** {datetime.now().strftime('%d.%m.%Y %H:%M')}
**Typ:** {'Nachreichung' if project_type == 'existing' else 'Neueinreichung'}

## Kontaktinformationen
- **Name:** {uploader_name if uploader_name else 'Nicht angegeben'}
- **E-Mail:** {email}
- **Institution:** {institution}

## Projektdetails
{project_details if project_details else 'Keine weiteren Details angegeben.'}

## Hochgeladene Dateien
"""
        
        for file_info in uploaded_files:
            readme_content += f"- **{file_info['category']}:** {file_info['filename']}\n"

        readme_path = f"{project_path}/README.md"
        if not await nextcloud.upload_content(readme_content, readme_path):
            logger.error(f"Failed to upload README.md to {readme_path}")
            raise HTTPException(status_code=500, detail="Failed to upload README.md")
        
        # Send confirmation email to user
        logger.info(f"Sending confirmation email to {email}...")
        try:
            await email_service.send_confirmation_email(
                to_email=email,
                project_id=project_id,
                project_title=project_title,
                uploader_name=uploader_name,
                files=uploaded_files,
                project_type=project_type
            )
            logger.info("Confirmation email sent successfully")
        except Exception as e:
            logger.error(f"Failed to send confirmation email: {e}", exc_info=True)
            # Don't fail the upload if email fails
        
        # Trigger background audit and team notification
        background_tasks.add_task(
            perform_audit_and_notify,
            project_id=project_id,
            project_title=project_title,
            email=email,
            file_names=[f["filename"] for f in uploaded_files]
        )
        
        logger.info(f"Upload completed successfully for project: {project_id}. Background audit triggered.")
        return UploadResponse(
            success=True,
            project_id=project_id,
            timestamp=datetime.now(),
            files_uploaded=len(files),
            message="Documents uploaded successfully. Audit and team notification will follow."
        )
        
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        logger.error(f"Unexpected error during upload: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/upload/status/{project_id}", dependencies=[Depends(verify_token)])
async def get_upload_status(project_id: str):
    """
    Get upload status for a project
    """
    try:
        metadata = await nextcloud.get_metadata(project_id)
        return metadata
    except Exception:
        raise HTTPException(status_code=404, detail="Project not found")
