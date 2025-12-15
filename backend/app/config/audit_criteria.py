from pydantic import BaseModel, Field
from typing import List, Optional

class CheckItem(BaseModel):
    id: str = Field(description="Unique identifier for the check item")
    description: str = Field(description="Description of what to check")
    category: str = Field(description="Category of the check (e.g., 'VVT', 'TOMs', 'ROPA', 'General')")

class AuditCriteria(BaseModel):
    check_items: List[CheckItem] = Field(description="List of items to check in the documents")
    system_prompt: str = Field(description="System prompt for the AI auditor")

# Define the criteria
DEFAULT_AUDIT_CRITERIA = AuditCriteria(
    check_items=[
        CheckItem(id="general_completeness", category="General", description="Sind alle notwendigen Dokumente vorhanden (VVT, Datenschutzkonzept, TOMs)?"),
        CheckItem(id="vvt_legal_basis", category="VVT", description="Ist für jede Verarbeitungstätigkeit eine Rechtsgrundlage angegeben (z.B. Art. 6 DSGVO)?"),
        CheckItem(id="vvt_purpose", category="VVT", description="Ist der Zweck der Datenverarbeitung klar definiert?"),
        CheckItem(id="vvt_deletion", category="VVT", description="Sind Löschfristen definiert?"),
        CheckItem(id="toms_encryption", category="TOMs", description="Werden Verschlüsselungsmaßnahmen erwähnt?"),
        CheckItem(id="toms_access_control", category="TOMs", description="Gibt es Regelungen zur Zugriffskontrolle?"),
        CheckItem(id="ropa_completeness", category="ROPA", description="Enthält das Verzeichnis von Verarbeitungstätigkeiten (VVT/ROPA) Angaben zu Verantwortlichen und Empfängern?"),
        CheckItem(id="consistency", category="Consistency", description="Widersprechen sich Angaben in verschiedenen Dokumenten (z.B. unterschiedliche Speicherfristen)?"),
        CheckItem(id="sensitive_data", category="Sensitive Data", description="Werden besondere Kategorien personenbezogener Daten (Art. 9 DSGVO) verarbeitet und sind entsprechende Schutzmaßnahmen erwähnt?"),
    ],
    system_prompt="""Du bist ein erfahrener Datenschutz-Auditor. Deine Aufgabe ist es, Datenschutzdokumente (VVT, TOMs, Konzepte, etc.) zu analysieren und auf Vollständigkeit und Plausibilität zu prüfen.
    
    Analysiere die bereitgestellten Texte aus den Dokumenten.
    Prüfe jeden Punkt der Checkliste sorgfältig.
    
    Berücksichtige dabei:
    - Die Dokumente können in Deutsch oder Englisch sein.
    - Es kann sich um PDFs, Word-Dokumente oder Excel-Tabellen handeln.
    - Sei kritisch, aber konstruktiv.
    
    Wenn Informationen fehlen oder unklar sind, merke dies an.
    Wenn Widersprüche bestehen, hebe diese hervor.
    """
)
