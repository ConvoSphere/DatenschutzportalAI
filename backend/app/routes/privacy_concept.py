from fastapi import APIRouter, UploadFile, File, Form, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from typing import List, Optional
import tempfile
import os
import shutil
import logging

from app.services.privacy_concept import PrivacyConceptService
from app.models.privacy_concept import ExtractedStudyData, ConceptGenerationRequest, ExportRequest, ConceptResponse

router = APIRouter()
service = PrivacyConceptService()
logger = logging.getLogger(__name__)

@router.post("/extract", response_model=ExtractedStudyData)
async def extract_data(
    files: List[UploadFile] = File(default=[]),
    manual_text: Optional[str] = Form(None)
):
    temp_files = []
    try:
        # Save uploads to temp files
        for file in files:
            suffix = os.path.splitext(file.filename)[1]
            if not suffix:
                suffix = ".tmp"
            
            # create a temp file
            tmp_path = os.path.join(tempfile.gettempdir(), f"upload_{os.urandom(8).hex()}{suffix}")
            with open(tmp_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            temp_files.append(tmp_path)
        
        if not temp_files and not manual_text:
             raise HTTPException(status_code=400, detail="No files or text provided")

        result = await service.extract_data(temp_files, manual_text)
        return result
    except Exception as e:
        logger.error(f"Extraction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Cleanup temp files
        for path in temp_files:
            try:
                os.remove(path)
            except:
                pass

@router.post("/generate", response_model=ConceptResponse)
async def generate_concept(request: ConceptGenerationRequest):
    try:
        markdown = await service.generate_concept(request.data)
        return ConceptResponse(concept_markdown=markdown)
    except Exception as e:
        logger.error(f"Generation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/export")
async def export_concept(request: ExportRequest, background_tasks: BackgroundTasks):
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
