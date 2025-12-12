from webdav3.client import Client
from app.config import settings
import json
from typing import Dict, Any
from fastapi import UploadFile
import tempfile
import os

class NextcloudService:
    def __init__(self):
        self.client = Client({
            'webdav_hostname': settings.nextcloud_url,
            'webdav_login': settings.nextcloud_username,
            'webdav_password': settings.nextcloud_password,
            'webdav_timeout': 30
        })
    
    def create_folder(self, path: str) -> bool:
        """
        Create a folder in Nextcloud
        """
        try:
            if not self.client.check(path):
                self.client.mkdir(path)
            return True
        except Exception as e:
            print(f"Error creating folder {path}: {e}")
            # raise # Suppress for now to allow mock functionality if server not reachable
            return False 
    
    async def upload_file(self, file: UploadFile, remote_path: str) -> bool:
        """
        Upload a file to Nextcloud
        """
        try:
            # Save to temporary file
            with tempfile.NamedTemporaryFile(delete=False) as tmp_file:
                content = await file.read()
                tmp_file.write(content)
                tmp_path = tmp_file.name
            
            # Upload to Nextcloud
            self.client.upload_sync(remote_path=remote_path, local_path=tmp_path)
            
            # Clean up
            os.unlink(tmp_path)
            
            return True
        except Exception as e:
            print(f"Error uploading file {file.filename}: {e}")
            # raise
            return False
    
    async def upload_metadata(self, metadata: Dict[Any, Any], remote_path: str) -> bool:
        """
        Upload metadata JSON to Nextcloud
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
            # raise
            return False

    async def upload_content(self, content: str, remote_path: str) -> bool:
        """
        Upload text content to Nextcloud
        """
        try:
            with tempfile.NamedTemporaryFile(mode='w', delete=False, encoding='utf-8') as tmp_file:
                tmp_file.write(content)
                tmp_path = tmp_file.name
            
            self.client.upload_sync(remote_path=remote_path, local_path=tmp_path)
            os.unlink(tmp_path)
            
            return True
        except Exception as e:
            print(f"Error uploading content: {e}")
            return False
    
    async def get_metadata(self, project_id: str) -> Dict[Any, Any]:
        """
        Retrieve project metadata from Nextcloud
        """
        try:
            # Search in both university and clinic folders
            for institution in ['university', 'clinic']:
                path = f"{settings.nextcloud_base_path}/{institution}/{project_id}/metadata.json"
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
        List files in a Nextcloud directory
        """
        try:
            return self.client.list(path)
        except Exception as e:
            print(f"Error listing files in {path}: {e}")
            raise
