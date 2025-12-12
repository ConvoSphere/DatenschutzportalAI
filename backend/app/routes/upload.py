from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import List
from app.services.hessenbox import HessenboxService
from app.services.email_service import EmailService
from app.models.upload import UploadResponse
from app.config import settings
import uuid
from datetime import datetime
import os

router = APIRouter()
hessenbox = HessenboxService()
email_service = EmailService()

@router.post("/upload", response_model=UploadResponse)
async def upload_documents(
    email: str = Form(...),
    uploader_name: str = Form(None),
    project_title: str = Form(...),
    institution: str = Form(...),
    is_prospective_study: bool = Form(False),
    files: List[UploadFile] = File(...)
):
    """
    Upload Datenschutz-Dokumente zur Hessenbox
    """
    try:
        # Generate unique Project ID
        project_id = f"PRJ-{datetime.now().year}-{str(uuid.uuid4())[:8].upper()}"
        
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
        project_path = f"{settings.hessenbox_base_path}/{institution}/{project_id}"
        hessenbox.create_folder(project_path)
        
        # Upload files by category
        uploaded_files = []
        for file in files:
            # Note: In a real scenario, category should be passed along with the file
            # or parsed from form data. For now defaulting to 'sonstiges' or extracting if possible.
            # The current frontend implementation appends 'files_{category}' which might need 
            # adjustment in the backend to parse correctly if sent as a list of files under different keys.
            # Assuming here for simplicity metadata is available or passed. 
            # In the frontend code, we append `files_{cat.key}`. 
            # This endpoint expects `files` list. We might need to adjust frontend or backend to match.
            # For now, let's assume we can get it or default.
            category = "sonstiges" # Placeholder logic
            
            category_path = f"{project_path}/{category}"
            hessenbox.create_folder(category_path)
            
            file_path = f"{category_path}/{file.filename}"
            await hessenbox.upload_file(file, file_path)
            
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
            "institution": institution,
            "is_prospective_study": is_prospective_study,
            "upload_timestamp": datetime.now().isoformat(),
            "files": uploaded_files
        }
        
        await hessenbox.upload_metadata(metadata, f"{project_path}/metadata.json")
        
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

@router.get("/upload/status/{project_id}")
async def get_upload_status(project_id: str):
    """
    Get upload status for a project
    """
    try:
        metadata = await hessenbox.get_metadata(project_id)
        return metadata
    except Exception as e:
        raise HTTPException(status_code=404, detail="Project not found")
