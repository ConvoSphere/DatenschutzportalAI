from pydantic import BaseModel, Field
from typing import List
import yaml
import os
import logging

logger = logging.getLogger(__name__)

class CheckItem(BaseModel):
    id: str = Field(description="Unique identifier for the check item")
    description: str = Field(description="Description of what to check")
    category: str = Field(description="Category of the check (e.g., 'VVT', 'TOMs', 'ROPA', 'General')")

class AuditCriteria(BaseModel):
    check_items: List[CheckItem] = Field(description="List of items to check in the documents")
    system_prompt: str = Field(description="System prompt for the AI auditor")

def load_audit_criteria() -> AuditCriteria:
    """
    Loads audit criteria from audit_criteria.yaml located in the same directory.
    Fallback to defaults if file not found or invalid.
    """
    current_dir = os.path.dirname(os.path.abspath(__file__))
    yaml_path = os.path.join(current_dir, "audit_criteria.yaml")
    
    try:
        if os.path.exists(yaml_path):
            with open(yaml_path, 'r', encoding='utf-8') as f:
                data = yaml.safe_load(f)
                logger.info(f"Loaded audit criteria from {yaml_path}")
                return AuditCriteria(**data)
        else:
            logger.warning(f"Audit criteria YAML not found at {yaml_path}, using hardcoded defaults.")
    except Exception as e:
        logger.error(f"Failed to load audit criteria from YAML: {e}, using defaults.")

    # Fallback / Default values if YAML fails
    return AuditCriteria(
        check_items=[
            CheckItem(id="general_completeness", category="General", description="Sind alle notwendigen Dokumente vorhanden (VVT, Datenschutzkonzept, TOMs)?"),
            CheckItem(id="vvt_legal_basis", category="VVT", description="Ist für jede Verarbeitungstätigkeit eine Rechtsgrundlage angegeben (z.B. Art. 6 DSGVO)?"),
        ],
        system_prompt="Du bist ein Datenschutz-Auditor. Prüfe die Dokumente."
    )

# Load criteria once on module import
# You can also call load_audit_criteria() inside the service to enable hot-reloading
DEFAULT_AUDIT_CRITERIA = load_audit_criteria()
