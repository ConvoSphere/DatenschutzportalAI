# API Dokumentation

## Übersicht

Die Datenschutzportal REST API bietet Endpunkte für Dokument-Upload, Projektverwaltung und Status-Abfragen.

**Base URL**: `https://api.datenschutzportal.uni-frankfurt.de/api`  
**Version**: 1.0.0  
**Format**: JSON

## Authentifizierung

Aktuell: **Keine Authentifizierung erforderlich** (öffentlicher Upload-Service)

Geplant für Admin-Bereich:
- **Bearer Token** (JWT)
- **OAuth 2.0** (Single Sign-On mit Uni-Login)

## Endpunkte

### 1. Upload Dokumente

Upload von Datenschutz-Dokumenten für ein Forschungsprojekt.

```http
POST /api/upload
```

#### Request

**Content-Type**: `multipart/form-data`

**Form Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | ✅ | E-Mail-Adresse des Uploaders |
| `uploader_name` | string | ❌ | Name des Uploaders (optional) |
| `project_title` | string | ✅ | Titel des Forschungsprojekts (min. 3 Zeichen) |
| `institution` | string | ✅ | `university` oder `clinic` |
| `is_prospective_study` | boolean | ❌ | `true` für prospektive Studien (default: `false`) |
| `files` | file[] | ✅ | Array von Dateien (max. 50 MB pro Datei) |

**File Metadata** (als JSON im Form-Field):

Jede Datei benötigt Metadaten über die Kategorie:

```json
{
  "category": "datenschutzkonzept"
}
```

**Kategorien**:
- `datenschutzkonzept` (Pflicht)
- `verantwortung` (Pflicht)
- `schulung_uni` (Pflicht)
- `schulung_ukf` (Pflicht)
- `einwilligung` (bedingt Pflicht bei prospektiven Studien)
- `ethikvotum` (optional)
- `sonstiges` (optional)

#### Beispiel Request (cURL)

```bash
curl -X POST "https://api.datenschutzportal.uni-frankfurt.de/api/upload" \
  -H "Content-Type: multipart/form-data" \
  -F "email=researcher@uni-frankfurt.de" \
  -F "uploader_name=Dr. Max Mustermann" \
  -F "project_title=Studie zur Datenschutz-Compliance" \
  -F "institution=university" \
  -F "is_prospective_study=true" \
  -F "files=@datenschutzkonzept.pdf;type=application/pdf" \
  -F "files=@schulung_uni.pdf;type=application/pdf"
```

#### Beispiel Request (JavaScript/Fetch)

```javascript
const formData = new FormData();
formData.append('email', 'researcher@uni-frankfurt.de');
formData.append('uploader_name', 'Dr. Max Mustermann');
formData.append('project_title', 'Studie zur Datenschutz-Compliance');
formData.append('institution', 'university');
formData.append('is_prospective_study', 'true');

// Dateien hinzufügen
categories.forEach(category => {
  category.files.forEach(file => {
    formData.append('files', file);
    // Kategorie-Info als separate Form-Field
    formData.append(`file_categories`, JSON.stringify({
      filename: file.name,
      category: category.key
    }));
  });
});

const response = await fetch('https://api.datenschutzportal.uni-frankfurt.de/api/upload', {
  method: 'POST',
  body: formData
});

const result = await response.json();
```

#### Response

**Status**: `200 OK`

```json
{
  "success": true,
  "project_id": "PRJ-2024-A3F5B8C1",
  "timestamp": "2024-12-12T14:30:00.000Z",
  "files_uploaded": 5,
  "message": "Documents uploaded successfully",
  "hessenbox_path": "/Datenschutzportal/university/PRJ-2024-A3F5B8C1"
}
```

**Response Fields**:

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Upload-Status |
| `project_id` | string | Eindeutige Projekt-ID (für spätere Referenz) |
| `timestamp` | string | ISO 8601 Zeitstempel des Uploads |
| `files_uploaded` | number | Anzahl erfolgreich hochgeladener Dateien |
| `message` | string | Status-Nachricht |
| `hessenbox_path` | string | Pfad in der Hessenbox |

#### Error Responses

**400 Bad Request** - Validierungsfehler

```json
{
  "detail": "Invalid email address format"
}
```

**413 Payload Too Large** - Datei zu groß

```json
{
  "detail": "File datenschutzkonzept.pdf exceeds maximum size of 50 MB"
}
```

**422 Unprocessable Entity** - Fehlende Pflichtfelder

```json
{
  "detail": [
    {
      "loc": ["body", "project_title"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

**500 Internal Server Error** - Server-Fehler

```json
{
  "detail": "Hessenbox connection failed"
}
```

---

### 2. Projekt suchen

Suche nach bestehendem Projekt via ID oder Titel.

```http
GET /api/projects/search?q={query}
```

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `q` | string | ✅ | Projekt-ID oder Projekttitel (min. 3 Zeichen) |

#### Beispiel Request

```bash
curl "https://api.datenschutzportal.uni-frankfurt.de/api/projects/search?q=PRJ-2024-A3F5B8C1"
```

#### Response

**Status**: `200 OK`

```json
{
  "success": true,
  "project": {
    "project_id": "PRJ-2024-A3F5B8C1",
    "project_title": "Studie zur Datenschutz-Compliance",
    "institution": "university",
    "uploader_email": "researcher@uni-frankfurt.de",
    "uploader_name": "Dr. Max Mustermann",
    "is_prospective_study": true,
    "upload_timestamp": "2024-12-12T14:30:00.000Z",
    "files_count": 5,
    "files": [
      {
        "filename": "datenschutzkonzept.pdf",
        "category": "datenschutzkonzept",
        "size": 1024000,
        "uploaded_at": "2024-12-12T14:30:00.000Z"
      }
    ]
  }
}
```

#### Error Responses

**404 Not Found** - Projekt nicht gefunden

```json
{
  "detail": "Project not found"
}
```

---

### 3. Dokumente zu bestehendem Projekt hinzufügen

Zusätzliche Dokumente zu einem existierenden Projekt hochladen.

```http
POST /api/projects/{project_id}/documents
```

#### Request

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `project_id` | string | Projekt-ID |

**Content-Type**: `multipart/form-data`

**Form Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `files` | file[] | ✅ | Array von Dateien |
| `uploader_email` | string | ✅ | E-Mail zur Verifikation |

#### Beispiel Request

```bash
curl -X POST "https://api.datenschutzportal.uni-frankfurt.de/api/projects/PRJ-2024-A3F5B8C1/documents" \
  -F "uploader_email=researcher@uni-frankfurt.de" \
  -F "files=@additional_document.pdf"
```

#### Response

**Status**: `200 OK`

```json
{
  "success": true,
  "project_id": "PRJ-2024-A3F5B8C1",
  "files_added": 1,
  "timestamp": "2024-12-12T15:00:00.000Z"
}
```

---

### 4. Upload-Status abrufen

Status eines Uploads abrufen.

```http
GET /api/upload/status/{project_id}
```

#### Request

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `project_id` | string | Projekt-ID |

#### Beispiel Request

```bash
curl "https://api.datenschutzportal.uni-frankfurt.de/api/upload/status/PRJ-2024-A3F5B8C1"
```

#### Response

**Status**: `200 OK`

```json
{
  "project_id": "PRJ-2024-A3F5B8C1",
  "status": "completed",
  "upload_timestamp": "2024-12-12T14:30:00.000Z",
  "files_uploaded": 5,
  "email_sent": true,
  "team_notified": true
}
```

**Status Values**:
- `uploading` - Upload läuft
- `completed` - Erfolgreich abgeschlossen
- `failed` - Fehler aufgetreten
- `processing` - Backend verarbeitet Dateien

---

### 5. Health Check

Überprüfung der API-Verfügbarkeit.

```http
GET /api/health
```

#### Response

**Status**: `200 OK`

```json
{
  "status": "healthy",
  "version": "1.0.0",
  "services": {
    "database": "ok",
    "hessenbox": "ok",
    "smtp": "ok"
  },
  "timestamp": "2024-12-12T14:30:00.000Z"
}
```

---

## Rate Limiting

**Aktuell**: Kein Rate Limiting

**Geplant**:
- 100 Requests pro IP pro Stunde
- 10 Uploads pro IP pro Tag
- Erhöhte Limits für authentifizierte Benutzer

## CORS

**Allowed Origins**:
- `https://datenschutzportal.uni-frankfurt.de`
- `http://localhost:3000` (Development)

**Allowed Methods**: `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`

**Allowed Headers**: `Content-Type`, `Authorization`

## File Upload Limits

- **Max File Size**: 50 MB pro Datei
- **Max Files**: 20 Dateien pro Upload
- **Allowed Types**: `.pdf`, `.doc`, `.docx`, `.zip`, `.txt`
- **Total Size**: 500 MB pro Upload

## Error Handling

Alle Fehler folgen dem Format:

```json
{
  "detail": "Error message",
  "error_code": "ERROR_CODE",
  "timestamp": "2024-12-12T14:30:00.000Z"
}
```

### Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Eingabevalidierung fehlgeschlagen |
| `FILE_TOO_LARGE` | Datei überschreitet Größenlimit |
| `FILE_TYPE_NOT_ALLOWED` | Dateityp nicht erlaubt |
| `PROJECT_NOT_FOUND` | Projekt nicht gefunden |
| `HESSENBOX_ERROR` | Fehler bei Hessenbox-Verbindung |
| `EMAIL_ERROR` | Fehler beim E-Mail-Versand |
| `INTERNAL_ERROR` | Interner Server-Fehler |

## Webhooks (Geplant)

Benachrichtigung über Upload-Events.

```http
POST https://your-server.com/webhook
```

**Payload**:

```json
{
  "event": "upload.completed",
  "project_id": "PRJ-2024-A3F5B8C1",
  "timestamp": "2024-12-12T14:30:00.000Z",
  "data": {
    "project_title": "Studie zur Datenschutz-Compliance",
    "files_count": 5
  }
}
```

**Events**:
- `upload.started` - Upload gestartet
- `upload.completed` - Upload abgeschlossen
- `upload.failed` - Upload fehlgeschlagen
- `document.added` - Dokument hinzugefügt
- `project.reviewed` - Projekt geprüft (Admin)

## SDK & Client Libraries

### Python

```python
from datenschutzportal import Client

client = Client(base_url="https://api.datenschutzportal.uni-frankfurt.de")

# Upload
response = client.upload_documents(
    email="researcher@uni-frankfurt.de",
    project_title="My Project",
    institution="university",
    files=[
        ("datenschutzkonzept.pdf", "datenschutzkonzept"),
        ("schulung_uni.pdf", "schulung_uni")
    ]
)

print(response.project_id)
```

### TypeScript/JavaScript

```typescript
import { DataProtectionPortalClient } from '@uni-frankfurt/datenschutzportal-client';

const client = new DataProtectionPortalClient({
  baseUrl: 'https://api.datenschutzportal.uni-frankfurt.de'
});

const result = await client.uploadDocuments({
  email: 'researcher@uni-frankfurt.de',
  projectTitle: 'My Project',
  institution: 'university',
  files: [
    { file: datenschutzkonzeptFile, category: 'datenschutzkonzept' },
    { file: schulungFile, category: 'schulung_uni' }
  ]
});

console.log(result.projectId);
```

## OpenAPI / Swagger

Interaktive API-Dokumentation verfügbar unter:

**Swagger UI**: `https://api.datenschutzportal.uni-frankfurt.de/docs`  
**ReDoc**: `https://api.datenschutzportal.uni-frankfurt.de/redoc`  
**OpenAPI JSON**: `https://api.datenschutzportal.uni-frankfurt.de/openapi.json`

## Versioning

Die API verwendet URL-basiertes Versioning:

- **v1**: `https://api.datenschutzportal.uni-frankfurt.de/api/v1/...`
- **v2** (geplant): `https://api.datenschutzportal.uni-frankfurt.de/api/v2/...`

Aktuelle Version ohne Prefix nutzt automatisch die neueste stabile Version.

## Support

**API Support**: api-support@datenschutz.uni-frankfurt.de  
**Status Page**: https://status.datenschutzportal.uni-frankfurt.de
