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
- **WebDAV Client**: Nextcloud Integration
- **Libraries**: `webdavclient3`

### E-Mail
- **SMTP**: Python `aiosmtplib`
- **Jinja2**: E-Mail Templates

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
│   │   ├── nextcloud.py        # WebDAV Integration
│   │   ├── email_service.py    # E-Mail Versand
│   │   └── validation.py       # Business Logic
│   ├── utils/
│   │   ├── __init__.py
│   │   ├── auth.py             # Authentifizierung
│   │   └── helpers.py
│   └── templates/
│       ├── email_confirmation_de.html
│       ├── email_confirmation_en.html
│       └── missing_documents.html
├── tests/
│   ├── __init__.py
│   ├── test_upload.py
│   └── test_nextcloud.py
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
fastapi==0.109.0
uvicorn[standard]==0.27.0
python-multipart==0.0.6
pydantic>=2.9.0
pydantic-settings>=2.5.0
webdavclient3==3.14.6
jinja2==3.1.2
aiosmtplib==3.0.1
sqlalchemy==2.0.25
alembic==1.13.1
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
pytest==7.4.4
pytest-asyncio==0.23.3
httpx==0.26.0
python-dotenv==1.0.0
email-validator==2.1.0
```

## Konfiguration

### .env Datei

```env
# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
API_DEBUG=False
CORS_ORIGINS=http://localhost:3000,https://your-frontend-domain.com

# Nextcloud Configuration
NEXTCLOUD_URL=https://nextcloud.example.com/remote.php/webdav/
NEXTCLOUD_USERNAME=your_username
NEXTCLOUD_PASSWORD=your_password
NEXTCLOUD_BASE_PATH=/Datenschutzportal

# SMTP Configuration
SMTP_HOST=smtp.uni-frankfurt.de
SMTP_PORT=587
SMTP_USERNAME=your_email@uni-frankfurt.de
SMTP_PASSWORD=your_password
SMTP_FROM_EMAIL=datenschutz@uni-frankfurt.de
SMTP_FROM_NAME=Datenschutzportal

# Notification E-Mails
NOTIFICATION_EMAILS=team1@uni-frankfurt.de,team2@uni-frankfurt.de

# Security
SECRET_KEY=your-secret-key-here-change-in-production
API_TOKEN=your-secret-token
ALGORITHM=HS256

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
    
    # Nextcloud
    nextcloud_url: str
    nextcloud_username: str
    nextcloud_password: str
    nextcloud_base_path: str = "/Datenschutzportal"
    
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
    api_token: str
    algorithm: str = "HS256"
    
    # File Upload
    max_file_size: int = 52428800  # 50 MB
    allowed_file_types: List[str] = [".pdf", ".doc", ".docx", ".zip", ".odt", ".ods", ".odp", ".png", ".jpg", ".jpeg"]
    
    class Config:
        env_file = ".env"

settings = Settings()
```

## Deployment

Siehe [Deployment Guide](../deployment/index.md) für detaillierte Deployment-Anleitung.

## Nächste Schritte

1. ✅ Python Environment aufsetzen
2. ✅ Requirements installieren
3. ✅ API Endpunkte implementieren
4. ✅ E-Mail Templates erstellen
5. ⬜ Nextcloud Zugangsdaten konfigurieren
6. ⬜ SMTP Server konfigurieren
7. ⬜ Integration Tests erweitern
8. ⬜ Frontend mit Backend verbinden
9. ⬜ Docker Container deployen
