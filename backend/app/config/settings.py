from pydantic_settings import BaseSettings
from typing import List, Literal, Optional

class Settings(BaseSettings):
    # API
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    api_debug: bool = False
    cors_origins: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]
    
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
    smtp_encryption: Literal["starttls", "ssl", "none"] = "starttls"
    
    # Notifications
    notification_emails: List[str]
    
    # Security
    secret_key: str
    api_token: str
    algorithm: str = "HS256"
    
    # File Upload
    max_file_size: int = 52428800  # 50 MB
    allowed_file_types: List[str] = [".pdf", ".doc", ".docx", ".zip", ".odt", ".ods", ".odp", ".png", ".jpg", ".jpeg", ".xlsx", ".xls"]
    
    # AI Audit
    ai_api_base_url: str = "https://api.openai.com/v1"
    ai_api_key: str
    ai_model_name: str = "gpt-4-turbo-preview"
    ai_proxy: Optional[str] = None

    class Config:
        env_file = ".env"

settings = Settings()
