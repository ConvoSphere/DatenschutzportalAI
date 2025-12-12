from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from typing import List, Dict, Optional
from app.services.nextcloud import NextcloudService
from app.services.email_service import EmailService
from app.models.upload import UploadResponse
from app.config import settings
from app.utils.auth import verify_token
import uuid
from datetime import datetime
import os
import json

router = APIRouter()
nextcloud = NextcloudService()
email_service = EmailService()

@router.post("/upload", response_model=UploadResponse, dependencies=[Depends(verify_token)])
async def upload_documents(
    email: str = Form(...),
    uploader_name: str = Form(None),
    project_title: str = Form(...),
    institution: str = Form(...),
    is_prospective_study: bool = Form(False),
    project_details: str = Form(None),
    files: List[UploadFile] = File(...),
    file_categories: str = Form(None)
):
    """
    Upload data protection documents to Nextcloud
    """
    try:
        # Generate unique Project ID
        project_id = f"PRJ-{datetime.now().year}-{str(uuid.uuid4())[:8].upper()}"
        
        # Parse categories if provided
        categories_map = {}
        if file_categories:
            try:
                categories_map = json.loads(file_categories)
            except:
                pass
        
        # Validate files
        for file in files:
            if file.size > settings.max_file_size:
                raise HTTPException(
                    status_code=413,
                    detail=f"File {file.filename} exceeds maximum size of 50 MB"
                )
            
            file_ext = os.path.splitext(file.filename)[1].lower()
            if file_ext not in settings.allowed_file_types:
                raise HTTPException(
                    status_code=400,
                    detail=f"File type {file_ext} not allowed"
                )
        
        # Create project folder structure
        project_path = f"{settings.nextcloud_base_path}/{institution}/{project_id}"
        nextcloud.create_folder(project_path)
        
        # Upload files by category
        uploaded_files = []
        for file in files:
            category = categories_map.get(file.filename, "sonstiges")
            
            category_path = f"{project_path}/{category}"
            nextcloud.create_folder(category_path)
            
            file_path = f"{category_path}/{file.filename}"
            await nextcloud.upload_file(file, file_path)
            
            uploaded_files.append({
                "filename": file.filename,
                "category": category,
                "path": file_path
            })
        
        # Create metadata file
        metadata = {
            "project_id": project_id,
            "email": email,
            "uploader_name": uploader_name,
            "project_title": project_title,
            "project_details": project_details,
            "institution": institution,
            "is_prospective_study": is_prospective_study,
            "upload_timestamp": datetime.now().isoformat(),
            "files": uploaded_files
        }
        
        await nextcloud.upload_metadata(metadata, f"{project_path}/metadata.json")

        # Create README.md
        readme_content = f"""# {project_title}

**Projekt-ID:** {project_id}
**Datum:** {datetime.now().strftime('%d.%m.%Y %H:%M')}

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

        await nextcloud.upload_content(readme_content, f"{project_path}/README.md")
        
        # Send confirmation email to user
        await email_service.send_confirmation_email(
            to_email=email,
            project_id=project_id,
            project_title=project_title,
            uploader_name=uploader_name,
            files=uploaded_files
        )
        
        # Send notification to team
        await email_service.send_team_notification(
            project_id=project_id,
            project_title=project_title,
            uploader_email=email,
            institution=institution,
            files_count=len(files)
        )
        
        return UploadResponse(
            success=True,
            project_id=project_id,
            timestamp=datetime.now(),
            files_uploaded=len(files),
            message="Documents uploaded successfully"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/upload/status/{project_id}", dependencies=[Depends(verify_token)])
async def get_upload_status(project_id: str):
    """
    Get upload status for a project
    """
    try:
        metadata = await nextcloud.get_metadata(project_id)
        return metadata
    except Exception as e:
        raise HTTPException(status_code=404, detail="Project not found")
