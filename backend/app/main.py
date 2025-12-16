from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routes import upload, projects, health, privacy_concept
import logging
import sys

# Configure logging
logging.basicConfig(
    level=logging.DEBUG if settings.api_debug else logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)

logger = logging.getLogger(__name__)

app = FastAPI(
    title="Datenschutzportal API",
    description="API für Datenschutz-Dokument Upload",
    version="1.0.0"
)

logger.info("Starting Datenschutzportal API")

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
app.include_router(privacy_concept.router, prefix="/api/privacy-concept", tags=["privacy-concept"])

@app.get("/")
async def root():
    return {"message": "Datenschutzportal API", "version": "1.0.0"}
