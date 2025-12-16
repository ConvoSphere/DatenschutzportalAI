from typing import List, Optional
from pydantic import BaseModel, Field

class ExtractedStudyData(BaseModel):
    study_title: str = Field(..., description="Title of the research study")
    study_type: str = Field(..., description="Type of study (retrospective, prospective, mixed)")
    principal_investigator: str = Field(..., description="Name and title of the Principal Investigator")
    institution: str = Field(..., description="Institution or Clinic responsible for the study")
    study_goal: str = Field(..., description="Short description of the study goal")
    data_types: List[str] = Field(..., description="List of data types used (e.g., genetic data, biosamples)")
    patient_count: str = Field(..., description="Estimated number of patients")
    data_sources: List[str] = Field(..., description="Sources of data (e.g., Orbis, iBDF, DIZ)")
    processing_methods: str = Field(..., description="Methods of data processing (e.g., statistical analysis)")
    pseudonymization_usage: bool = Field(..., description="Whether pseudonymization is used")
    external_data_sharing: bool = Field(..., description="Whether data is shared externally")
    ethics_vote: Optional[str] = Field(None, description="Ethics vote number if available")
    
    # Specific fields for detailed concept
    data_minimization: Optional[str] = Field(None, description="Explanation of data minimization")
    storage_location: Optional[str] = Field("U:\\Klifo", description="Storage location of data")
    archiving_period: Optional[str] = Field("10 Jahre nach guter wissenschaftlicher Praxis", description="Archiving period")
    internal_access: List[str] = Field(default_factory=list, description="Who has internal access")
    external_partners: Optional[str] = Field(None, description="External partners if any")
    
class ConceptGenerationRequest(BaseModel):
    data: ExtractedStudyData
    
class ConceptResponse(BaseModel):
    concept_markdown: str

class ExportRequest(BaseModel):
    format: str = Field(..., pattern="^(docx|json|markdown)$")
    data: Optional[ExtractedStudyData] = None
    markdown_content: Optional[str] = None
