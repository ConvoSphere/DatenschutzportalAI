from sqlalchemy import Column, String, Text, DateTime, JSON
from sqlalchemy.sql import func
from app.database import Base
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class PrivacyConceptDB(Base):
    __tablename__ = "privacy_concepts"

    id = Column(String, primary_key=True, default=generate_uuid, index=True)
    user_id = Column(String, nullable=True, index=True) # For future auth
    session_id = Column(String, nullable=True, index=True) # For anonymous session tracking
    
    # Store the raw extracted data as JSON
    extracted_data = Column(JSON, nullable=False)
    
    # Store the generated markdown
    concept_markdown = Column(Text, nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
