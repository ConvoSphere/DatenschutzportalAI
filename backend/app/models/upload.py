from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime

class FileUpload(BaseModel):
    filename: str
    category: str
    size: int
    content_type: str

class ProjectSubmission(BaseModel):
    email: EmailStr
    uploader_name: Optional[str] = None
    project_title: str = Field(..., min_length=3)
    institution: str = Field(..., pattern="^(university|clinic)$")
    is_prospective_study: bool = False
    files: List[FileUpload]
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "researcher@uni-frankfurt.de",
                "uploader_name": "Dr. Max Mustermann",
                "project_title": "Studie zur Datenschutz-Compliance",
                "institution": "university",
                "is_prospective_study": True,
                "files": [
                    {
                        "filename": "datenschutzkonzept.pdf",
                        "category": "datenschutzkonzept",
                        "size": 1024000,
                        "content_type": "application/pdf"
                    }
                ]
            }
        }

class UploadResponse(BaseModel):
    success: bool
    project_id: str
    timestamp: datetime
    files_uploaded: int
    message: str
