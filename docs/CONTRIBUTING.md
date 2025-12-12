# Contributing Guide

## Willkommen

Vielen Dank für Ihr Interesse, zum Datenschutzportal beizutragen! Dieses Dokument enthält Richtlinien für Entwickler.

## Inhaltsverzeichnis

1. [Code of Conduct](#code-of-conduct)
2. [Erste Schritte](#erste-schritte)
3. [Entwicklungsworkflow](#entwicklungsworkflow)
4. [Coding Standards](#coding-standards)
5. [Testing](#testing)
6. [Pull Requests](#pull-requests)
7. [Issue Guidelines](#issue-guidelines)

## Code of Conduct

- Respektvoller Umgang mit allen Beitragenden
- Konstruktives Feedback
- Fokus auf das Projekt und dessen Ziele
- Einhaltung von Datenschutzrichtlinien

## Erste Schritte

### Repository klonen

```bash
git clone https://github.com/uni-frankfurt/datenschutzportal.git
cd datenschutzportal
```

### Development Setup

```bash
# Frontend
npm install
npm run dev

# Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Branch erstellen

```bash
git checkout -b feature/your-feature-name
# oder
git checkout -b fix/your-bugfix-name
```

## Entwicklungsworkflow

### Branch Naming Convention

- **Features**: `feature/feature-name`
- **Bugfixes**: `fix/bug-name`
- **Dokumentation**: `docs/doc-name`
- **Refactoring**: `refactor/refactor-name`
- **Tests**: `test/test-name`

### Commit Messages

Folge dem **Conventional Commits** Standard:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: Neues Feature
- `fix`: Bugfix
- `docs`: Dokumentation
- `style`: Formatierung (keine Code-Änderung)
- `refactor`: Code-Refactoring
- `test`: Tests hinzufügen/ändern
- `chore`: Build/Tool-Änderungen

**Beispiele**:

```bash
feat(upload): add progress bar for file uploads

Add visual feedback during upload process with percentage indicator.
Closes #123

---

fix(validation): correct email regex pattern

The previous regex did not accept valid email addresses with plus signs.
Fixed by updating the regex pattern in validation.ts.

Fixes #456

---

docs(api): update API documentation for upload endpoint

Added examples and error codes to improve clarity.
```

### Code Review Process

1. Erstelle einen Pull Request
2. Mindestens 1 Reviewer erforderlich
3. Alle Tests müssen bestehen
4. Code-Qualität wird geprüft
5. Nach Approval wird gemerged

## Coding Standards

### TypeScript/React (Frontend)

#### Naming Conventions

```typescript
// Components: PascalCase
export function FileUploadSection() {}

// Hooks: camelCase mit 'use' Prefix
export function useLanguage() {}

// Constants: UPPER_SNAKE_CASE
const MAX_FILE_SIZE = 52428800;

// Variables: camelCase
const uploadProgress = 0;

// Types/Interfaces: PascalCase
interface UploadResponse {}
type WorkflowStep = 'institution' | 'form';
```

#### Component Structure

```typescript
import { useState } from 'react';
import { Button } from './ui/button';
import { useLanguage } from '../contexts/LanguageContext';

// 1. Types/Interfaces
interface MyComponentProps {
  title: string;
  onSubmit: () => void;
}

// 2. Component
export function MyComponent({ title, onSubmit }: MyComponentProps) {
  // 3. Hooks
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  
  // 4. Handlers
  const handleSubmit = () => {
    setIsLoading(true);
    onSubmit();
    setIsLoading(false);
  };
  
  // 5. Render
  return (
    <div>
      <h1>{title}</h1>
      <Button onClick={handleSubmit} disabled={isLoading}>
        {t('submit.button')}
      </Button>
    </div>
  );
}
```

#### Code Style

```typescript
// ✅ Good
const files = categories.flatMap(cat => cat.files);

// ❌ Bad
const files: File[] = [];
categories.forEach(cat => {
  cat.files.forEach(file => {
    files.push(file);
  });
});

// ✅ Good: Early return
if (!email) {
  return;
}
processEmail(email);

// ❌ Bad: Nested if
if (email) {
  processEmail(email);
}

// ✅ Good: Destructuring
const { email, projectTitle } = formData;

// ❌ Bad
const email = formData.email;
const projectTitle = formData.projectTitle;
```

#### TypeScript Best Practices

```typescript
// ✅ Good: Type inference
const [count, setCount] = useState(0);

// ❌ Bad: Redundant type
const [count, setCount] = useState<number>(0);

// ✅ Good: Interface for objects
interface User {
  email: string;
  name?: string;
}

// ❌ Bad: Type for objects
type User = {
  email: string;
  name?: string;
};

// ✅ Good: Use unknown instead of any
const data: unknown = JSON.parse(response);

// ❌ Bad: Avoid any
const data: any = JSON.parse(response);
```

### Python (Backend)

#### Naming Conventions

```python
# Functions: snake_case
def upload_file():
    pass

# Classes: PascalCase
class HessenboxService:
    pass

# Constants: UPPER_SNAKE_CASE
MAX_FILE_SIZE = 52428800

# Variables: snake_case
upload_progress = 0
```

#### Code Style (PEP 8)

```python
# ✅ Good
def upload_documents(
    email: str,
    project_title: str,
    files: List[UploadFile]
) -> UploadResponse:
    """
    Upload documents to Hessenbox.
    
    Args:
        email: User email address
        project_title: Title of the research project
        files: List of files to upload
        
    Returns:
        Upload response with project ID
    """
    pass

# Imports gruppiert und sortiert
import os
import sys
from typing import List

from fastapi import FastAPI, UploadFile
from pydantic import BaseModel

from app.services.hessenbox import HessenboxService
```

#### Type Hints

```python
# ✅ Good: Type hints
def process_file(file: UploadFile) -> bool:
    return True

# ❌ Bad: No type hints
def process_file(file):
    return True

# ✅ Good: Optional types
from typing import Optional

def get_user(user_id: str) -> Optional[User]:
    return user or None
```

### CSS/Tailwind

```tsx
// ✅ Good: Logical order (layout → spacing → typography → colors → effects)
<div className="
  flex flex-col           // Layout
  gap-4 p-6              // Spacing
  text-lg                // Typography
  bg-white text-gray-900 // Colors
  rounded-lg shadow-md   // Effects
">

// ❌ Bad: Random order
<div className="text-lg rounded-lg flex gap-4 bg-white p-6 shadow-md">

// ✅ Good: Extract repeated classes to component
const Card = ({ children }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    {children}
  </div>
);

// ❌ Bad: Duplicate classes everywhere
<div className="bg-white rounded-lg shadow-md p-6">...</div>
<div className="bg-white rounded-lg shadow-md p-6">...</div>
```

## Testing

### Frontend Tests

```typescript
// Component Test
import { render, screen } from '@testing-library/react';
import { FileUploadSection } from './FileUploadSection';

describe('FileUploadSection', () => {
  test('renders upload button', () => {
    render(
      <FileUploadSection
        category={{ key: 'test', label: 'Test', required: true, files: [] }}
        isRequired={true}
        onFilesAdded={jest.fn()}
        onFileRemoved={jest.fn()}
      />
    );
    
    expect(screen.getByText(/upload/i)).toBeInTheDocument();
  });
  
  test('handles file selection', async () => {
    const onFilesAdded = jest.fn();
    render(<FileUploadSection {...props} onFilesAdded={onFilesAdded} />);
    
    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    const input = screen.getByLabelText(/upload/i);
    
    await userEvent.upload(input, file);
    
    expect(onFilesAdded).toHaveBeenCalledWith([file]);
  });
});
```

### Backend Tests

```python
import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_upload_documents():
    async with AsyncClient(app=app, base_url="http://test") as client:
        files = [
            ("files", ("test.pdf", b"content", "application/pdf"))
        ]
        data = {
            "email": "test@uni-frankfurt.de",
            "project_title": "Test Project",
            "institution": "university"
        }
        
        response = await client.post("/api/upload", data=data, files=files)
        
        assert response.status_code == 200
        assert response.json()["success"] is True
        assert "project_id" in response.json()

@pytest.mark.asyncio
async def test_validation_error():
    async with AsyncClient(app=app, base_url="http://test") as client:
        # Missing email
        data = {"project_title": "Test"}
        
        response = await client.post("/api/upload", data=data)
        
        assert response.status_code == 422
```

### Test ausführen

```bash
# Frontend
npm test
npm run test:coverage

# Backend
pytest
pytest --cov=app tests/
```

## Pull Requests

### PR Checklist

- [ ] Code folgt den Coding Standards
- [ ] Alle Tests bestehen
- [ ] Neue Tests für neue Features hinzugefügt
- [ ] Dokumentation aktualisiert
- [ ] Commit Messages folgen Convention
- [ ] Branch ist aktuell mit main
- [ ] Keine Merge-Konflikte

### PR Template

```markdown
## Beschreibung
<!-- Kurze Beschreibung der Änderungen -->

## Typ der Änderung
- [ ] Bugfix
- [ ] Neues Feature
- [ ] Breaking Change
- [ ] Dokumentation

## Wie wurde getestet?
<!-- Beschreibung der Tests -->

## Screenshots (falls UI-Änderungen)
<!-- Screenshots vor/nach der Änderung -->

## Checklist
- [ ] Code folgt Coding Standards
- [ ] Tests hinzugefügt/aktualisiert
- [ ] Dokumentation aktualisiert
- [ ] Keine Breaking Changes (oder dokumentiert)

## Related Issues
Closes #123
```

### Review Process

1. **Automatische Checks**:
   - Linting
   - Tests
   - Build
   - Code Coverage

2. **Code Review**:
   - Code-Qualität
   - Best Practices
   - Performance
   - Security

3. **Approval**:
   - Mindestens 1 Approval erforderlich
   - Alle Kommentare resolved

4. **Merge**:
   - Squash and Merge (für Features)
   - Rebase and Merge (für Bugfixes)

## Issue Guidelines

### Issue Template: Bug Report

```markdown
## Bug Beschreibung
<!-- Klare Beschreibung des Bugs -->

## Schritte zur Reproduktion
1. Gehe zu '...'
2. Klicke auf '...'
3. Scrolle zu '...'
4. Fehler tritt auf

## Erwartetes Verhalten
<!-- Was sollte passieren? -->

## Aktuelles Verhalten
<!-- Was passiert stattdessen? -->

## Screenshots
<!-- Falls zutreffend -->

## Umgebung
- Browser: [z.B. Chrome 120]
- OS: [z.B. Windows 11]
- Version: [z.B. 1.0.0]

## Zusätzlicher Kontext
<!-- Weitere relevante Informationen -->
```

### Issue Template: Feature Request

```markdown
## Feature Beschreibung
<!-- Klare Beschreibung des Features -->

## Problem das gelöst wird
<!-- Welches Problem löst dieses Feature? -->

## Vorgeschlagene Lösung
<!-- Wie könnte das Feature implementiert werden? -->

## Alternativen
<!-- Welche anderen Lösungen wurden erwogen? -->

## Zusätzlicher Kontext
<!-- Screenshots, Mockups, etc. -->
```

### Labels

- `bug` - Fehler
- `feature` - Neues Feature
- `enhancement` - Verbesserung
- `documentation` - Dokumentation
- `good first issue` - Gut für Einsteiger
- `help wanted` - Hilfe benötigt
- `priority: high` - Hohe Priorität
- `priority: low` - Niedrige Priorität

## Fragen?

Bei Fragen wenden Sie sich an:
- **E-Mail**: dev-team@datenschutzportal.uni-frankfurt.de
- **Issue**: Erstellen Sie ein Issue mit dem Label `question`

## Lizenz

Indem Sie zum Projekt beitragen, stimmen Sie zu, dass Ihre Beiträge unter derselben Lizenz wie das Projekt lizenziert werden.
