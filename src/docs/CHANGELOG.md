# Changelog

Alle wichtigen Änderungen am Datenschutzportal werden in dieser Datei dokumentiert.

Das Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.0.0/),
und dieses Projekt folgt [Semantic Versioning](https://semver.org/lang/de/).

## [Unreleased]

### Geplant
- Backend-Entwicklung mit FastAPI
- Hessenbox-Integration
- E-Mail-Service-Konfiguration
- Projekt-Suchfunktionalität
- Admin-Dashboard
- Docker-Deployment

## [1.0.0] - 2024-12-12

### Hinzugefügt

#### Workflow & Navigation
- ✅ Mehrstufiger Workflow mit Institution-Auswahl
- ✅ Projekt-Typ-Auswahl (neu/bestehend)
- ✅ Zurück-Navigation zwischen Steps
- ✅ Breadcrumb-Navigation (visuell)
- ✅ Bestätigungsseite mit Upload-Details

#### Dokumenten-Upload
- ✅ 7 kategorisierte Upload-Bereiche:
  - Datenschutzkonzept (Pflicht)
  - Übernahme der Verantwortung (Pflicht)
  - Schulung Uni Nachweis (Pflicht)
  - Schulung UKF Nachweis (Pflicht)
  - Einwilligung (bedingt Pflicht)
  - Ethikvotum (optional)
  - Sonstiges (optional)
- ✅ Drag & Drop Upload-Funktion
- ✅ Multi-File Support pro Kategorie
- ✅ Dateiliste mit Größenangabe
- ✅ Datei-Entfernen-Funktion
- ✅ Upload-Fortschrittsanzeige (0-100%)
- ✅ PDF-Vorschau mit Zoom (50%-200%)

#### Formular & Validierung
- ✅ E-Mail-Validierung (RegEx)
- ✅ Projekttitel (Pflichtfeld)
- ✅ Uploader-Name (optional)
- ✅ Prospektive Studie Checkbox
- ✅ Conditional Required Fields (Einwilligung)
- ✅ Echtzeit-Fehleranzeige
- ✅ Warning-System für optionale Felder
- ✅ Client-seitige Validierung

#### Internationalisierung
- ✅ Vollständige DE/EN Übersetzung (230+ Keys)
- ✅ Sprachwechsel-Button
- ✅ Context-basiertes i18n System
- ✅ Alle UI-Elemente übersetzt
- ✅ Fehler- und Erfolgsmeldungen übersetzt

#### UI/UX
- ✅ Responsive Design (Mobile/Tablet/Desktop)
- ✅ Moderne UI mit Tailwind CSS 4.0
- ✅ shadcn/ui Komponenten
- ✅ Radix UI für Accessibility
- ✅ Lucide React Icons
- ✅ Hover-Effekte und Transitions
- ✅ Loading States
- ✅ Error States
- ✅ Success States

#### Komponenten
- ✅ DataProtectionPortal (Hauptkomponente)
- ✅ InstitutionSelection
- ✅ ProjectTypeSelection
- ✅ ExistingProjectForm
- ✅ FileUploadSection
- ✅ UploadProgress
- ✅ PDFPreview
- ✅ ConfirmationPage
- ✅ LanguageSwitch
- ✅ 30+ wiederverwendbare UI-Komponenten

#### Dokumentation
- ✅ README.md mit Projekt-Übersicht
- ✅ TECH_STACK.md mit Tech-Details
- ✅ FRONTEND_ARCHITECTURE.md
- ✅ BACKEND_SETUP.md
- ✅ API_DOCUMENTATION.md
- ✅ DEPLOYMENT.md
- ✅ TRANSLATIONS.md
- ✅ CONTRIBUTING.md
- ✅ CHANGELOG.md

### Technische Details

#### Frontend Stack
- React mit TypeScript
- Tailwind CSS 4.0
- Radix UI 1.1.2+
- Class Variance Authority 0.7.1
- Lucide React Icons
- Context API für State Management

#### Code-Qualität
- TypeScript Strict Mode
- Functional Components
- Custom Hooks
- Component Composition Pattern
- Type-Safe Props

## [0.1.0] - 2024-12-01

### Hinzugefügt
- Projekt-Initialisierung
- Basis-Struktur
- Erste Komponenten-Prototypen

## Version History Format

```
## [Version] - YYYY-MM-DD

### Hinzugefügt (Added)
- Neue Features

### Geändert (Changed)
- Änderungen an bestehendem Code

### Veraltet (Deprecated)
- Features die bald entfernt werden

### Entfernt (Removed)
- Entfernte Features

### Behoben (Fixed)
- Bugfixes

### Sicherheit (Security)
- Sicherheitsfixes
```

## Nächste Version (2.0.0) - Geplant

### Backend Integration

#### API Endpunkte
- [ ] POST `/api/upload` - Dokument-Upload
- [ ] GET `/api/projects/search` - Projektsuche
- [ ] POST `/api/projects/{id}/documents` - Dokumente hinzufügen
- [ ] GET `/api/upload/status/{id}` - Upload-Status
- [ ] GET `/api/health` - Health Check

#### Services
- [ ] Hessenbox WebDAV Integration
- [ ] E-Mail-Service (SMTP)
- [ ] Projekt-Verwaltung
- [ ] Audit-Logging

#### Sicherheit
- [ ] Rate Limiting
- [ ] Input Sanitization
- [ ] CSRF Protection
- [ ] File Type Validation (Server-Side)
- [ ] Virus Scanning (ClamAV)

### Frontend Erweiterungen

#### Features
- [ ] Datei-Upload mit echtem Progress
- [ ] Drag & Drop File Reordering
- [ ] Batch-Delete für Dateien
- [ ] Auto-Save (Draft)
- [ ] Session Recovery
- [ ] Offline Support (Service Worker)

#### UI Verbesserungen
- [ ] Dark Mode
- [ ] Toast Notifications (statt Alerts)
- [ ] Animationen (Motion)
- [ ] Skeleton Loading States
- [ ] Empty States mit Illustrations

### Admin Features

#### Dashboard
- [ ] Upload-Übersicht
- [ ] Projekt-Verwaltung
- [ ] Benutzer-Statistiken
- [ ] Download aller Dokumente
- [ ] Projekt-Status ändern
- [ ] E-Mail-Templates bearbeiten

#### Authentifizierung
- [ ] Login für Admin-Bereich
- [ ] JWT-basierte Auth
- [ ] Role-Based Access Control
- [ ] Single Sign-On (Uni-Login)

### DevOps

#### Deployment
- [ ] Docker Compose Setup
- [ ] Kubernetes Manifests
- [ ] CI/CD Pipeline (GitHub Actions)
- [ ] Automated Testing
- [ ] Security Scanning

#### Monitoring
- [ ] Prometheus Metrics
- [ ] Grafana Dashboards
- [ ] Error Tracking (Sentry)
- [ ] Log Aggregation (ELK)
- [ ] Uptime Monitoring

### Dokumentation
- [ ] API Documentation (Swagger/ReDoc)
- [ ] User Guide (End-User)
- [ ] Admin Guide
- [ ] Video Tutorials
- [ ] FAQ

## Support & Contact

**Entwickler-Team**: dev-team@datenschutzportal.uni-frankfurt.de  
**Datenschutz-Team**: datenschutz@uni-frankfurt.de  
**Issue Tracker**: https://github.com/uni-frankfurt/datenschutzportal/issues
