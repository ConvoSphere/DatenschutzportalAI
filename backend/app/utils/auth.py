from fastapi import HTTPException, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from app.config import settings
import logging

logger = logging.getLogger(__name__)

security = HTTPBearer()

def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    """
    Verify the Bearer Token
    """
    token = credentials.credentials
    logger.debug("Token verification requested")
    
    if token != settings.api_token:
        logger.warning(f"Invalid token provided (token length: {len(token) if token else 0})")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    logger.debug("Token verified successfully")
    return token
