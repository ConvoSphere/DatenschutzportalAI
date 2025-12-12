# Tech Stack Dokumentation

## Frontend-Technologien

### Core Framework

#### React (TypeScript)
- **Version**: 18.3+
- **Verwendung**: Haupt-Framework für die UI
- **Vorteile**: 
  - Komponentenbasierte Architektur
  - TypeScript für Type Safety
  - Große Community & Ecosystem

### Styling

#### Tailwind CSS
- **Verwendung**: Utility-First CSS Framework
- **Konfiguration**: `/styles/globals.css`
- **Features**:
  - CSS Custom Properties für Theming
  - Dark Mode Support
  - Responsive Design Utilities

#### Class Variance Authority (CVA)
- **Version**: 0.7.1
- **Verwendung**: Variant-basierte Komponenten-Styles

### UI-Komponenten

#### Radix UI
- **Version**: Diverse Pakete
- **Verwendung**: Headless UI Primitives
- **Komponenten in Verwendung**:
  - Dialog, Popover, Select
  - Accordion, Checkbox, Radio Group
  - Und weitere

**Vorteile**:
- Vollständig barrierefrei (ARIA)
- Ungestyled (flexible Anpassung)

#### shadcn/ui Komponenten
Alle UI-Komponenten unter `/components/ui/` basieren auf shadcn/ui.

### Icons

#### Lucide React
- **Verwendung**: Icon Library
- **Version**: 0.487+

### Form Handling

#### React Hook Form
- **Version**: ^7.55.0
- **Verwendung**: Formular-Management und Validierung
- **Vorteile**:
  - Performance (uncontrolled components)
  - Eingebaute Validierung
  - Geringer Boilerplate

### Weitere Libraries
- **Recharts**: Datenvisualisierung
- **Sonner**: Toast Notifications
- **Vaul**: Drawer Component
- **React Day Picker**: Datepicker

## Backend-Technologien

### Python FastAPI
- **Version**: 0.109+
- **Verwendung**: REST API Backend
- **Features**:
  - Async/Await Support
  - Automatic OpenAPI Documentation
  - Type Validation mit Pydantic
  - High Performance

### Datei-Speicherung
- **WebDAV Client**: `webdavclient3`
- **Verwendung**: Nextcloud Integration
- **Operationen**:
  - Upload Files
  - Create Directories
  - List Files
  - Download Files

### E-Mail
- **Library**: `aiosmtplib` (Async SMTP)
- **Verwendung**: Benachrichtigungen
- **Features**:
  - Async Support
  - HTML E-Mails
  - Template System (Jinja2)

### Datenbank (Optional)
- **SQLAlchemy**: ORM (installiert, derzeit primär Nextcloud als Storage genutzt)
- **Alembic**: Migrationen

## Build Tools

### Vite
- **Version**: 6.3+
- **Verwendung**: Frontend Build Tool & Dev Server
- **Features**:
  - Extrem schnelles HMR
  - Optimierte Builds

## Sicherheit

### Frontend
- XSS Protection durch React
- Input Sanitization

### Backend
- Authentifizierung via Bearer Token
- Rate Limiting (via FastAPI/Middleware)
- Input Validation (Pydantic)
- Secure File Upload (Type & Size Validation)
