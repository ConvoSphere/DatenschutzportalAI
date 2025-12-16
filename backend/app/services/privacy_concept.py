import os
import logging
import json
import pypdf
import docx
import openpyxl
from typing import List, Optional
from datetime import datetime

from pydantic_ai import Agent
from app.config import settings
from app.models.privacy_concept import ExtractedStudyData

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.db_models import PrivacyConceptDB

logger = logging.getLogger(__name__)

class PrivacyConceptService:
    def __init__(self, db: Optional[AsyncSession] = None):
        self.db = db
        # Configure OpenAI env vars for Pydantic AI
        if settings.ai_api_key:
            os.environ["OPENAI_API_KEY"] = settings.ai_api_key
        if settings.ai_api_base_url:
            os.environ["OPENAI_BASE_URL"] = settings.ai_api_base_url
        if settings.ai_proxy:
            os.environ["HTTP_PROXY"] = settings.ai_proxy
            os.environ["HTTPS_PROXY"] = settings.ai_proxy

        self.extraction_agent = Agent(
            model=settings.ai_model_name,
            system_prompt="""Du bist ein Datenschutzexperte für medizinische Forschung.
Analysiere den Forschungsantrag und extrahiere strukturiert die Daten für das Datenschutzkonzept.
Antworte AUSSCHLIESSLICH mit den geforderten Daten.""",
            result_type=ExtractedStudyData,
        )

        self.generation_agent = Agent(
            model=settings.ai_model_name,
            system_prompt="""Du bist ein Datenschutzbeauftragter für die Universitätsmedizin Frankfurt.
Erstelle ein VOLLSTÄNDIGES Datenschutzkonzept basierend auf den bereitgestellten Daten.
Das Konzept muss GDPR (Art. 6, 9, 12-21, 89) und HDSIG § 24 konform sein.
Verwende Markdown für die Formatierung.""",
            result_type=str,
        )

    def extract_text_from_file(self, file_path: str) -> str:
        """Extract text based on file extension."""
        ext = os.path.splitext(file_path)[1].lower()
        try:
            if ext == '.pdf':
                return self._extract_from_pdf(file_path)
            elif ext in ['.docx', '.doc']:
                return self._extract_from_docx(file_path)
            elif ext in ['.txt', '.md']:
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    return f.read()
            else:
                logger.warning(f"Unsupported file type for text extraction: {ext}")
                return ""
        except Exception as e:
            logger.error(f"Error extracting text from {file_path}: {e}")
            return ""

    def _extract_from_pdf(self, path: str) -> str:
        text = ""
        with open(path, 'rb') as f:
            reader = pypdf.PdfReader(f)
            for page in reader.pages:
                text += page.extract_text() + "\n"
        return text

    def _extract_from_docx(self, path: str) -> str:
        doc = docx.Document(path)
        return "\n".join([p.text for p in doc.paragraphs])

    async def extract_data(self, file_paths: List[str], manual_text: Optional[str] = None) -> ExtractedStudyData:
        combined_text = ""
        if manual_text:
            combined_text += f"\n\n--- MANUAL TEXT ---\n\n{manual_text}"
            
        for file_path in file_paths:
            text = self.extract_text_from_file(file_path)
            filename = os.path.basename(file_path)
            if text:
                combined_text += f"\n\n--- FILE: {filename} ---\n\n{text}"
        
        if not combined_text.strip():
            raise ValueError("No text provided for extraction.")

        prompt = f"""
        Analysiere den folgenden Forschungsantrag und extrahiere die relevanten Daten:
        
        {combined_text[:100000]}
        """
        
        result = await self.extraction_agent.run(prompt)
        return result.data

    async def generate_concept(self, data: ExtractedStudyData) -> str:
        prompt = f"""
        Erstelle ein Datenschutzkonzept für folgende Studie:
        
        Titel: {data.study_title}
        Typ: {data.study_type}
        PI: {data.principal_investigator}
        Institution: {data.institution}
        Ziel: {data.study_goal}
        Datenarten: {', '.join(data.data_types)}
        Patientenzahl: {data.patient_count}
        Quellen: {', '.join(data.data_sources)}
        Verarbeitung: {data.processing_methods}
        Pseudonymisierung: {'Ja' if data.pseudonymization_usage else 'Nein'}
        Externe Weitergabe: {'Ja' if data.external_data_sharing else 'Nein'}
        Ethikvotum: {data.ethics_vote or 'Nicht angegeben'}
        
        Zusatzinfos:
        Minimierung: {data.data_minimization}
        Speicherort: {data.storage_location}
        Archivierung: {data.archiving_period}
        Interne Zugriffe: {', '.join(data.internal_access)}
        Externe Partner: {data.external_partners}
        
        Struktur:
        1. Darstellung des Forschungsvorhabens
        2. Organisatorische Struktur
        3. Beschreibung der Datenverarbeitung
        4. Grundlagen zum Schutz
        5. Rechte der Betroffenen
        6. Organisatorische Maßnahmen
        7. Technische Maßnahmen
        
        Antworte NUR mit dem Markdown-Text.
        """
        
        result = await self.generation_agent.run(prompt)
        return result.data

    def export_to_docx(self, markdown_text: str, output_path: str):
        doc = docx.Document()
        for line in markdown_text.split('\n'):
            if line.startswith('# '):
                doc.add_heading(line[2:], level=1)
            elif line.startswith('## '):
                doc.add_heading(line[3:], level=2)
            elif line.startswith('### '):
                doc.add_heading(line[4:], level=3)
            elif line.strip() == '':
                continue
            else:
                doc.add_paragraph(line)
        doc.save(output_path)

    async def save_concept(self, extracted_data: ExtractedStudyData, markdown: str, session_id: Optional[str] = None) -> str:
        if not self.db:
             raise ValueError("DB Session not initialized")
        
        db_obj = PrivacyConceptDB(
            extracted_data=extracted_data.model_dump(),
            concept_markdown=markdown,
            session_id=session_id
        )
        self.db.add(db_obj)
        await self.db.commit()
        await self.db.refresh(db_obj)
        return db_obj.id

    async def get_concept(self, concept_id: str) -> Optional[PrivacyConceptDB]:
        if not self.db:
             raise ValueError("DB Session not initialized")
        
        result = await self.db.execute(select(PrivacyConceptDB).where(PrivacyConceptDB.id == concept_id))
        return result.scalars().first()
