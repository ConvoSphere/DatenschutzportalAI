from webdav3.client import Client
from app.config import settings
import json
from typing import Dict, Any, Tuple
from fastapi import UploadFile
import tempfile
import os
import logging

logger = logging.getLogger(__name__)

class NextcloudService:
    def __init__(self):
        self.client = Client({
            'webdav_hostname': settings.nextcloud_url,
            'webdav_login': settings.nextcloud_username,
            'webdav_password': settings.nextcloud_password,
            'webdav_timeout': 30
        })
    
    def test_connection(self) -> Tuple[bool, str]:
        """
        Test the connection to Nextcloud and verify credentials.
        Returns (success: bool, message: str)
        """
        try:
            # Try to list the root directory to verify connection
            self.client.list('/')
            logger.info("Nextcloud connection test successful")
            return True, "Connection successful"
        except Exception as e:
            error_msg = f"Failed to connect to Nextcloud: {e}"
            logger.error(error_msg, exc_info=True)
            return False, error_msg
    
    def create_folder(self, path: str) -> bool:
        """
        Create a folder in Nextcloud, including all parent directories if needed.
        """
        try:
            # Normalize path: remove leading/trailing slashes and split
            normalized_path = path.strip('/')
            if not normalized_path:
                logger.error("Empty path provided for folder creation")
                return False
            
            path_parts = normalized_path.split('/')
            
            # Create each directory in the path hierarchy
            current_path = ""
            for part in path_parts:
                if not part:
                    continue
                    
                if current_path:
                    current_path = f"{current_path}/{part}"
                else:
                    current_path = part
                
                # Ensure path starts with / for WebDAV
                full_path = f"/{current_path}"
                
                try:
                    if not self.client.check(full_path):
                        logger.debug(f"Creating folder: {full_path}")
                        self.client.mkdir(full_path)
                        logger.debug(f"Successfully created folder: {full_path}")
                    else:
                        logger.debug(f"Folder already exists: {full_path}")
                except Exception as e:
                    logger.error(f"Error creating intermediate folder {full_path}: {e}", exc_info=True)
                    raise
            
            logger.info(f"Successfully ensured folder structure exists: {path}")
            return True
        except Exception as e:
            logger.error(f"Error creating folder {path}: {e}", exc_info=True)
            return False 
    
    async def upload_file(self, file: UploadFile, remote_path: str) -> bool:
        """
        Upload a file to Nextcloud
        """
        tmp_path = None
        try:
            logger.debug(f"Uploading file {file.filename} ({file.size} bytes) to {remote_path}")
            # Save to temporary file
            with tempfile.NamedTemporaryFile(delete=False) as tmp_file:
                content = await file.read()
                tmp_file.write(content)
                tmp_path = tmp_file.name
                logger.debug(f"Saved file to temporary location: {tmp_path}")
            
            # Upload to Nextcloud
            self.client.upload_sync(remote_path=remote_path, local_path=tmp_path)
            logger.info(f"Successfully uploaded file {file.filename} to {remote_path}")
            
            # Clean up
            if tmp_path and os.path.exists(tmp_path):
                os.unlink(tmp_path)
            
            return True
        except Exception as e:
            logger.error(f"Error uploading file {file.filename} to {remote_path}: {e}", exc_info=True)
            # Clean up on error
            if tmp_path and os.path.exists(tmp_path):
                try:
                    os.unlink(tmp_path)
                except OSError:
                    pass
            return False
    
    async def upload_metadata(self, metadata: Dict[Any, Any], remote_path: str) -> bool:
        """
        Upload metadata JSON to Nextcloud
        """
        tmp_path = None
        try:
            logger.debug(f"Uploading metadata to {remote_path}")
            with tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.json') as tmp_file:
                json.dump(metadata, tmp_file, indent=2)
                tmp_path = tmp_file.name
            
            self.client.upload_sync(remote_path=remote_path, local_path=tmp_path)
            logger.info(f"Successfully uploaded metadata to {remote_path}")
            
            if tmp_path and os.path.exists(tmp_path):
                os.unlink(tmp_path)
            
            return True
        except Exception as e:
            logger.error(f"Error uploading metadata to {remote_path}: {e}", exc_info=True)
            if tmp_path and os.path.exists(tmp_path):
                try:
                    os.unlink(tmp_path)
                except OSError:
                    pass
            return False

    async def upload_content(self, content: str, remote_path: str) -> bool:
        """
        Upload text content to Nextcloud
        """
        tmp_path = None
        try:
            logger.debug(f"Uploading content ({len(content)} chars) to {remote_path}")
            with tempfile.NamedTemporaryFile(mode='w', delete=False, encoding='utf-8') as tmp_file:
                tmp_file.write(content)
                tmp_path = tmp_file.name
            
            self.client.upload_sync(remote_path=remote_path, local_path=tmp_path)
            logger.info(f"Successfully uploaded content to {remote_path}")
            
            if tmp_path and os.path.exists(tmp_path):
                os.unlink(tmp_path)
            
            return True
        except Exception as e:
            logger.error(f"Error uploading content to {remote_path}: {e}", exc_info=True)
            if tmp_path and os.path.exists(tmp_path):
                try:
                    os.unlink(tmp_path)
                except OSError:
                    pass
            return False
    
    async def get_metadata(self, project_id: str) -> Dict[Any, Any]:
        """
        Retrieve project metadata from Nextcloud
        """
        tmp_path = None
        try:
            logger.debug(f"Retrieving metadata for project: {project_id}")
            path = f"{settings.nextcloud_base_path}/{project_id}/metadata.json"
            if self.client.check(path):
                logger.debug(f"Found metadata at: {path}")
                with tempfile.NamedTemporaryFile(delete=False) as tmp_file:
                    tmp_path = tmp_file.name
                
                self.client.download_sync(remote_path=path, local_path=tmp_path)
                
                with open(tmp_path, 'r') as f:
                    metadata = json.load(f)
                
                if tmp_path and os.path.exists(tmp_path):
                    os.unlink(tmp_path)
                
                logger.info(f"Successfully retrieved metadata for project: {project_id}")
                return metadata
            
            logger.warning(f"Project {project_id} not found")
            raise FileNotFoundError(f"Project {project_id} not found")
        except FileNotFoundError:
            raise
        except Exception as e:
            logger.error(f"Error retrieving metadata for project {project_id}: {e}", exc_info=True)
            if tmp_path and os.path.exists(tmp_path):
                try:
                    os.unlink(tmp_path)
                except OSError:
                    pass
            raise
    
    def list_files(self, path: str) -> list:
        """
        List files in a Nextcloud directory
        """
        try:
            logger.debug(f"Listing files in: {path}")
            files = self.client.list(path)
            logger.debug(f"Found {len(files)} files in {path}")
            return files
        except Exception as e:
            logger.error(f"Error listing files in {path}: {e}", exc_info=True)
            raise
