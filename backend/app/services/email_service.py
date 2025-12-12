import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from jinja2 import Environment, FileSystemLoader
from app.config import settings
from typing import List, Dict

class EmailService:
    def __init__(self):
        # Ensure templates directory exists or handle missing templates gracefully
        try:
            self.template_env = Environment(
                loader=FileSystemLoader('app/templates')
            )
        except:
            self.template_env = None
    
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
            # raise
            return False
    
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
        if self.template_env:
            try:
                template = self.template_env.get_template('email_confirmation_de.html')
                html_content = template.render(
                    project_id=project_id,
                    project_title=project_title,
                    uploader_name=uploader_name or "N/A",
                    files=files,
                    files_count=len(files)
                )
            except:
                html_content = f"Confirmation for project {project_title} (ID: {project_id})"
        else:
            html_content = f"Confirmation for project {project_title} (ID: {project_id})"
        
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
