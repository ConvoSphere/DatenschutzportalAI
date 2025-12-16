from fastapi import APIRouter, UploadFile, File, Form, HTTPException, BackgroundTasks, Depends
from fastapi.responses import FileResponse
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
import tempfile
import os
import shutil
import logging
import pypdf

from app.services.privacy_concept import PrivacyConceptService
from app.models.privacy_concept import ExtractedStudyData, ConceptGenerationRequest, ExportRequest, ConceptResponse, SaveConceptRequest, SaveConceptResponse
from app.database import get_db
from app.utils.rate_limit import RateLimiter
from app.config import settings

router = APIRouter()
logger = logging.getLogger(__name__)

# Initialize rate limiters
extract_limiter = RateLimiter(requests_per_minute=5)
generate_limiter = RateLimiter(requests_per_minute=10)

def get_service(db: AsyncSession = Depends(get_db)) -> PrivacyConceptService:
    return PrivacyConceptService(db)

def validate_file(file: UploadFile):
    """
    Validates file size, extension, and checks for PDF encryption.
    """
    # Check file size (approximate, since we read the spool)
    # Ideally, check Content-Length header or read chunks
    # Here we rely on reading into temp file and checking size
    
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in settings.allowed_file_types:
        raise HTTPException(status_code=400, detail=f"File type {ext} not allowed.")

    return True

@router.post("/save", response_model=SaveConceptResponse)
async def save_concept(
    request: SaveConceptRequest,
    service: PrivacyConceptService = Depends(get_service)
):
    try:
        concept_id = await service.save_concept(
            request.extracted_data, 
            request.concept_markdown, 
            request.session_id
        )
        return SaveConceptResponse(id=concept_id, message="Concept saved successfully")
    except Exception as e:
        logger.error(f"Save error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/extract", response_model=ExtractedStudyData, dependencies=[Depends(extract_limiter)])
async def extract_data(
    files: List[UploadFile] = File(default=[]),
    manual_text: Optional[str] = Form(None),
    service: PrivacyConceptService = Depends(get_service)
):
    temp_files = []
    try:
        # Validate and save uploads
        for file in files:
            validate_file(file)
            
            suffix = os.path.splitext(file.filename)[1]
            if not suffix:
                suffix = ".tmp"
            
            tmp_path = os.path.join(tempfile.gettempdir(), f"upload_{os.urandom(8).hex()}{suffix}")
            
            # Write to disk to check size and content
            with open(tmp_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            
            # Check size
            file_size = os.path.getsize(tmp_path)
            if file_size > settings.max_file_size:
                os.remove(tmp_path)
                raise HTTPException(status_code=400, detail=f"File {file.filename} exceeds size limit.")
            
            # Check if PDF is encrypted
            if suffix.lower() == '.pdf':
                try:
                    with open(tmp_path, 'rb') as f:
                        reader = pypdf.PdfReader(f)
                        if reader.is_encrypted:
                            os.remove(tmp_path)
                            raise HTTPException(status_code=400, detail=f"File {file.filename} is encrypted. Please provide an unencrypted PDF.")
                except Exception as e:
                    # If pypdf fails to read, it might be a corrupted file
                    if os.path.exists(tmp_path):
                         os.remove(tmp_path)
                    logger.warning(f"Failed to read PDF {file.filename}: {e}")
                    raise HTTPException(status_code=400, detail=f"File {file.filename} appears to be corrupted or invalid.")

            temp_files.append(tmp_path)
        
        if not temp_files and not manual_text:
             raise HTTPException(status_code=400, detail="No files or text provided")

        result = await service.extract_data(temp_files, manual_text)
        return result
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Extraction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Cleanup temp files
        for path in temp_files:
            try:
                if os.path.exists(path):
                    os.remove(path)
            except:
                pass

@router.post("/generate", response_model=ConceptResponse, dependencies=[Depends(generate_limiter)])
async def generate_concept(
    request: ConceptGenerationRequest,
    service: PrivacyConceptService = Depends(get_service)
):
    try:
        markdown = await service.generate_concept(request.data)
        return ConceptResponse(concept_markdown=markdown)
    except Exception as e:
        logger.error(f"Generation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/export")
async def export_concept(
    request: ExportRequest, 
    background_tasks: BackgroundTasks,
    service: PrivacyConceptService = Depends(get_service)
):
    try:
        if request.format == "docx":
            if not request.markdown_content:
                raise HTTPException(status_code=400, detail="Markdown content required for DOCX export")
            
            # Create a temp file for the docx
            tmp_path = os.path.join(tempfile.gettempdir(), f"concept_{os.urandom(8).hex()}.docx")
            
            service.export_to_docx(request.markdown_content, tmp_path)
            
            # Add cleanup task
            background_tasks.add_task(os.remove, tmp_path)
            
            return FileResponse(
                tmp_path, 
                media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                filename="Datenschutzkonzept.docx"
            )
        else:
             raise HTTPException(status_code=400, detail="Only DOCX export is currently implemented via file download endpoint.")
    except Exception as e:
        logger.error(f"Export error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
