# Backend Setup & Integration

## Übersicht

Das Backend wird mit **Python FastAPI** entwickelt und bietet REST API Endpunkte für den Upload, Projektmanagement und E-Mail-Benachrichtigungen.

## Technologie-Stack

### Core
- **Python**: 3.11+
- **FastAPI**: 0.100+
- **Uvicorn**: ASGI Server
- **Pydantic**: Data Validation

### Datei-Speicherung
- **WebDAV Client**: Hessenbox Integration
- **Libraries**: `webdavclient3` oder `easywebdav`

### E-Mail
- **SMTP**: Python `smtplib`
- **Jinja2**: E-Mail Templates

### Optional
- **SQLite/PostgreSQL**: Projekt-Metadaten
- **Redis**: Session Management / Caching

## Projektstruktur (Backend)

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI App
│   ├── config.py               # Konfiguration
│   ├── models/
│   │   ├── __init__.py
│   │   ├── project.py          # Pydantic Models
│   │   └── upload.py
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── upload.py           # Upload Endpoints
│   │   ├── projects.py         # Projekt-Management
│   │   └── health.py           # Health Check
│   ├── services/
│   │   ├── __init__.py
│   │   ├── hessenbox.py        # WebDAV Integration
│   │   ├── email_service.py    # E-Mail Versand
│   │   └── validation.py       # Business Logic
│   ├── utils/
│   │   ├── __init__.py
│   │   └── helpers.py
│   └── templates/
│       ├── email_confirmation_de.html
│       └── email_confirmation_en.html
├── tests/
│   ├── __init__.py
│   ├── test_upload.py
│   └── test_hessenbox.py
├── requirements.txt
├── .env.example
├── Dockerfile
└── docker-compose.yml
```

## Installation

### 1. Python Environment

```bash
# Python Virtual Environment erstellen
python3 -m venv venv

# Aktivieren
source venv/bin/activate  # Linux/Mac
# oder
venv\Scripts\activate     # Windows

# Dependencies installieren
pip install -r requirements.txt
```

### 2. Requirements.txt

```txt
# Core
fastapi==0.109.0
uvicorn[standard]==0.27.0
python-multipart==0.0.6
pydantic==2.5.0
pydantic-settings==2.1.0

# WebDAV Client
webdavclient3==3.14.6

# E-Mail
jinja2==3.1.2
aiosmtplib==3.0.1

# Optional: Database
sqlalchemy==2.0.25
alembic==1.13.1

# Optional: Authentication
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4

# Development
pytest==7.4.4
pytest-asyncio==0.23.3
httpx==0.26.0
python-dotenv==1.0.0
```

## Konfiguration

### .env Datei

```env
# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
API_DEBUG=False
CORS_ORIGINS=http://localhost:3000,https://your-frontend-domain.com

# Hessenbox Configuration
HESSENBOX_URL=https://hessenbox.tu-darmstadt.de/remote.php/webdav/
HESSENBOX_USERNAME=your_username
HESSENBOX_PASSWORD=your_password
HESSENBOX_BASE_PATH=/Datenschutzportal

# SMTP Configuration
SMTP_HOST=smtp.uni-frankfurt.de
SMTP_PORT=587
SMTP_USERNAME=your_email@uni-frankfurt.de
SMTP_PASSWORD=your_password
SMTP_FROM_EMAIL=datenschutz@uni-frankfurt.de
SMTP_FROM_NAME=Datenschutzportal

# Notification E-Mails
NOTIFICATION_EMAILS=team1@uni-frankfurt.de,team2@uni-frankfurt.de

# Optional: Database
DATABASE_URL=sqlite:///./datenschutzportal.db
# oder PostgreSQL
# DATABASE_URL=postgresql://user:password@localhost/datenschutzportal

# Security
SECRET_KEY=your-secret-key-here-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# File Upload Limits
MAX_FILE_SIZE=52428800  # 50 MB in Bytes
ALLOWED_FILE_TYPES=.pdf,.doc,.docx,.zip,.txt
```

### config.py

```python
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # API
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    api_debug: bool = False
    cors_origins: List[str] = ["http://localhost:3000"]
    
    # Hessenbox
    hessenbox_url: str
    hessenbox_username: str
    hessenbox_password: str
    hessenbox_base_path: str = "/Datenschutzportal"
    
    # SMTP
    smtp_host: str
    smtp_port: int = 587
    smtp_username: str
    smtp_password: str
    smtp_from_email: str
    smtp_from_name: str = "Datenschutzportal"
    
    # Notifications
    notification_emails: List[str]
    
    # Security
    secret_key: str
    algorithm: str = "HS256"
    
    # File Upload
    max_file_size: int = 52428800  # 50 MB
    allowed_file_types: List[str] = [".pdf", ".doc", ".docx", ".zip"]
    
    class Config:
        env_file = ".env"

settings = Settings()
```

## API Implementation

### main.py

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routes import upload, projects, health

app = FastAPI(
    title="Datenschutzportal API",
    description="API für Datenschutz-Dokument Upload",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(upload.router, prefix="/api", tags=["upload"])
app.include_router(projects.router, prefix="/api", tags=["projects"])
app.include_router(health.router, prefix="/api", tags=["health"])

@app.get("/")
async def root():
    return {"message": "Datenschutzportal API", "version": "1.0.0"}
```

### models/upload.py

```python
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
```

### routes/upload.py

```python
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import List
from app.services.hessenbox import HessenboxService
from app.services.email_service import EmailService
from app.models.upload import UploadResponse
from app.config import settings
import uuid
from datetime import datetime

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
            category = file.metadata.get("category", "sonstiges")
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
```

### services/hessenbox.py

```python
from webdav3.client import Client
from app.config import settings
import json
from typing import Dict, Any
from fastapi import UploadFile
import tempfile
import os

class HessenboxService:
    def __init__(self):
        self.client = Client({
            'webdav_hostname': settings.hessenbox_url,
            'webdav_login': settings.hessenbox_username,
            'webdav_password': settings.hessenbox_password,
            'webdav_timeout': 30
        })
    
    def create_folder(self, path: str) -> bool:
        """
        Create a folder in Hessenbox
        """
        try:
            if not self.client.check(path):
                self.client.mkdir(path)
            return True
        except Exception as e:
            print(f"Error creating folder {path}: {e}")
            raise
    
    async def upload_file(self, file: UploadFile, remote_path: str) -> bool:
        """
        Upload a file to Hessenbox
        """
        try:
            # Save to temporary file
            with tempfile.NamedTemporaryFile(delete=False) as tmp_file:
                content = await file.read()
                tmp_file.write(content)
                tmp_path = tmp_file.name
            
            # Upload to Hessenbox
            self.client.upload_sync(remote_path=remote_path, local_path=tmp_path)
            
            # Clean up
            os.unlink(tmp_path)
            
            return True
        except Exception as e:
            print(f"Error uploading file {file.filename}: {e}")
            raise
    
    async def upload_metadata(self, metadata: Dict[Any, Any], remote_path: str) -> bool:
        """
        Upload metadata JSON to Hessenbox
        """
        try:
            with tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.json') as tmp_file:
                json.dump(metadata, tmp_file, indent=2)
                tmp_path = tmp_file.name
            
            self.client.upload_sync(remote_path=remote_path, local_path=tmp_path)
            os.unlink(tmp_path)
            
            return True
        except Exception as e:
            print(f"Error uploading metadata: {e}")
            raise
    
    async def get_metadata(self, project_id: str) -> Dict[Any, Any]:
        """
        Retrieve project metadata from Hessenbox
        """
        try:
            # Search in both university and clinic folders
            for institution in ['university', 'clinic']:
                path = f"{settings.hessenbox_base_path}/{institution}/{project_id}/metadata.json"
                if self.client.check(path):
                    with tempfile.NamedTemporaryFile(delete=False) as tmp_file:
                        tmp_path = tmp_file.name
                    
                    self.client.download_sync(remote_path=path, local_path=tmp_path)
                    
                    with open(tmp_path, 'r') as f:
                        metadata = json.load(f)
                    
                    os.unlink(tmp_path)
                    return metadata
            
            raise FileNotFoundError(f"Project {project_id} not found")
        except Exception as e:
            print(f"Error retrieving metadata: {e}")
            raise
    
    def list_files(self, path: str) -> list:
        """
        List files in a Hessenbox directory
        """
        try:
            return self.client.list(path)
        except Exception as e:
            print(f"Error listing files in {path}: {e}")
            raise
```

### services/email_service.py

```python
import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from jinja2 import Environment, FileSystemLoader
from app.config import settings
from typing import List, Dict

class EmailService:
    def __init__(self):
        self.template_env = Environment(
            loader=FileSystemLoader('app/templates')
        )
    
    async def send_email(
        self,
        to_email: str,
        subject: str,
        html_content: str
    ) -> bool:
        """
        Send an email via SMTP
        """
        try:
            message = MIMEMultipart('alternative')
            message['From'] = f"{settings.smtp_from_name} <{settings.smtp_from_email}>"
            message['To'] = to_email
            message['Subject'] = subject
            
            html_part = MIMEText(html_content, 'html')
            message.attach(html_part)
            
            await aiosmtplib.send(
                message,
                hostname=settings.smtp_host,
                port=settings.smtp_port,
                username=settings.smtp_username,
                password=settings.smtp_password,
                use_tls=True
            )
            
            return True
        except Exception as e:
            print(f"Error sending email: {e}")
            raise
    
    async def send_confirmation_email(
        self,
        to_email: str,
        project_id: str,
        project_title: str,
        uploader_name: str,
        files: List[Dict]
    ) -> bool:
        """
        Send confirmation email to user
        """
        template = self.template_env.get_template('email_confirmation_de.html')
        
        html_content = template.render(
            project_id=project_id,
            project_title=project_title,
            uploader_name=uploader_name or "N/A",
            files=files,
            files_count=len(files)
        )
        
        subject = f"Bestätigung Upload: {project_title} (ID: {project_id})"
        
        return await self.send_email(to_email, subject, html_content)
    
    async def send_team_notification(
        self,
        project_id: str,
        project_title: str,
        uploader_email: str,
        institution: str,
        files_count: int
    ) -> bool:
        """
        Send notification to data protection team
        """
        subject = f"Neuer Upload: {project_title} ({institution})"
        
        html_content = f"""
        <html>
        <body>
            <h2>Neuer Dokument-Upload</h2>
            <p><strong>Projekt-ID:</strong> {project_id}</p>
            <p><strong>Projekttitel:</strong> {project_title}</p>
            <p><strong>Institution:</strong> {institution}</p>
            <p><strong>Uploader E-Mail:</strong> {uploader_email}</p>
            <p><strong>Anzahl Dateien:</strong> {files_count}</p>
            <p><a href="{settings.hessenbox_url}">Zur Hessenbox</a></p>
        </body>
        </html>
        """
        
        # Send to all team members
        for email in settings.notification_emails:
            await self.send_email(email, subject, html_content)
        
        return True
```

## Testing

### test_upload.py

```python
import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_upload_documents():
    async with AsyncClient(app=app, base_url="http://test") as client:
        files = [
            ("files", ("test.pdf", b"fake pdf content", "application/pdf"))
        ]
        
        data = {
            "email": "test@uni-frankfurt.de",
            "project_title": "Test Project",
            "institution": "university",
            "is_prospective_study": False
        }
        
        response = await client.post("/api/upload", data=data, files=files)
        
        assert response.status_code == 200
        assert response.json()["success"] == True
        assert "project_id" in response.json()
```

## Deployment

Siehe [DEPLOYMENT.md](./DEPLOYMENT.md) für detaillierte Deployment-Anleitung.

## Nächste Schritte

1. ✅ Python Environment aufsetzen
2. ✅ Requirements installieren
3. ⬜ Hessenbox Zugangsdaten erhalten
4. ⬜ SMTP Server konfigurieren
5. ⬜ API Endpunkte implementieren
6. ⬜ E-Mail Templates erstellen
7. ⬜ Integration Tests schreiben
8. ⬜ Frontend mit Backend verbinden
9. ⬜ Docker Container erstellen
10. ⬜ Produktiv deployment
