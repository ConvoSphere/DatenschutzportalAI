# Datenschutzportal - Universität Frankfurt & Universitätsklinikum

## Überblick

Das Datenschutzportal ist eine webbasierte Anwendung für Forscher der Universität Frankfurt und des Universitätsklinikums Frankfurt zur Einreichung datenschutzrelevanter Dokumente für Forschungsprojekte.

## Hauptfunktionen

### ✅ Implementierte Features (Frontend)

#### Must-Have Features
- **Kategorisierte Upload-Bereiche**: 7 verschiedene Dokumentkategorien
  - Datenschutzkonzept (Pflicht)
  - Übernahme der Verantwortung (Pflicht)
  - Schulung Uni Nachweis (Pflicht)
  - Schulung UKF Nachweis (Pflicht)
  - Einwilligung (bedingt Pflicht bei prospektiven Studien)
  - Ethikvotum (optional)
  - Sonstiges (optional)

- **Pflichtfeld-Validierung**: Automatische Validierung aller Pflichtfelder
- **Drag & Drop Upload**: Intuitive Datei-Upload-Funktion
- **Mehrstufiger Workflow**:
  1. Institution-Auswahl (Universität/Klinikum)
  2. Projekt-Typ-Auswahl (neu/bestehend)
  3. Formular-Ausfüllung oder Projektsuche
  4. Bestätigungsseite

- **Vollständige Mehrsprachigkeit**: Deutsch und Englisch (230+ Übersetzungen)

#### Nice-to-Have Features
- **Upload-Fortschrittsanzeige**: Visuelles Feedback mit Prozentangabe
- **PDF-Vorschau**: Integrierte PDF-Anzeige mit Zoom-Funktion (50%-200%)
- **Responsive Design**: Optimiert für Desktop und Mobile
- **Error Handling**: Umfassende Fehler- und Warnmeldungen
- **Conditional Required Fields**: Dynamische Pflichtfelder basierend auf Studientyp

### 🚧 Geplante Features (Backend)

- **Hessenbox-Integration**: Sichere Speicherung via WebDAV
- **E-Mail-Benachrichtigungen**: Automatische Bestätigungs-E-Mails
- **Projekt-Verwaltung**: Suche und Bearbeitung bestehender Projekte
- **Audit-Logging**: Protokollierung aller Upload-Aktivitäten
- **Admin-Dashboard**: Verwaltungsoberfläche für das Datenschutz-Team

## Technologie-Stack

### Frontend
- **React** mit TypeScript
- **Tailwind CSS 4.0** für Styling
- **Radix UI** für barrierefreie UI-Komponenten
- **Lucide React** für Icons
- **Context API** für State Management

### Backend (geplant)
- **Python FastAPI** für REST API
- **Hessenbox WebDAV** für Dateispeicherung
- **SMTP** für E-Mail-Versand
- **Docker** für Deployment

## Projektstruktur

```
/
├── frontend/
│   ├── src/
│   │   ├── components/              # React Komponenten
│   │   │   ├── DataProtectionPortal.tsx    # Hauptkomponente mit Workflow
│   │   │   ├── ...
│   │   │   └── ui/                         # Wiederverwendbare UI-Komponenten
│   │   ├── contexts/
│   │   │   └── LanguageContext.tsx         # Internationalisierung
│   │   ├── hooks/
│   │   │   └── useDataProtectionWorkflow.ts # Workflow Logik
│   │   ├── services/
│   │   │   └── api.ts                      # API Layer
│   │   ├── styles/
│   │   │   └── globals.css                 # Globale Styles
│   │   ├── types/
│   │   │   └── index.ts                    # Shared Types
│   │   └── App.tsx                         # Entry Point
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
├── docs/                               # Projektdokumentation
│   ├── API_DOCUMENTATION.md
│   ├── FRONTEND_ARCHITECTURE.md
│   └── ...
```

## Quick Start

### Voraussetzungen
- Node.js 18+ oder Bun
- Moderne Browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Abhängigkeiten installieren
npm install
# oder
bun install

# Development Server starten
npm run dev
# oder
bun dev
```

### Verwendung

1. **Institution wählen**: Wählen Sie zwischen Universität Frankfurt oder Universitätsklinikum
2. **Projekt-Typ auswählen**: Neues Projekt oder bestehendes Projekt bearbeiten
3. **Dokumente hochladen**: Laden Sie alle erforderlichen Dokumente hoch
4. **Formular absenden**: Überprüfen Sie Ihre Angaben und senden Sie das Formular ab
5. **Bestätigung**: Sie erhalten eine Bestätigung und E-Mail-Benachrichtigung

## Weitere Dokumentation

- [Tech Stack Details](./TECH_STACK.md) - Detaillierte Technologie-Beschreibung
- [Frontend Architektur](./FRONTEND_ARCHITECTURE.md) - Komponenten-Architektur
- [Backend Setup](./BACKEND_SETUP.md) - Backend-Entwicklung & Integration
- [API Dokumentation](./API_DOCUMENTATION.md) - REST API Endpunkte
- [Deployment Guide](./DEPLOYMENT.md) - Produktiv-Deployment
- [Übersetzungen](./TRANSLATIONS.md) - Mehrsprachigkeit verwalten

## Support & Kontakt

Bei Fragen wenden Sie sich bitte an das Datenschutz-Team der Universität Frankfurt.

## Lizenz

© 2024 Universität Frankfurt & Universitätsklinikum Frankfurt
