# Frontend-Architektur

## Architektur-Übersicht

Die Frontend-Architektur folgt einem **komponentenbasierten Ansatz** mit klarer Trennung von Verantwortlichkeiten und einem mehrstufigen Workflow-System. Die Geschäftslogik ist von der UI getrennt.

```
┌─────────────────────────────────────────────────────┐
│                    App.tsx                          │
│              (Entry Point + Provider)               │
└────────────────────┬────────────────────────────────┘
                     │
        ┌────────────▼────────────┐
        │   LanguageProvider      │
        │   (Context API)         │
        └────────────┬────────────┘
                     │
        ┌────────────▼────────────────────┐
        │  DataProtectionPortal           │
        │  (Main Component)               │
        │  Uses: useDataProtectionWorkflow│
        └────────────┬────────────────────┘
                     │
        ┌────────────┼──────────────────────────────┐
        │            │                              │
   ┌────▼────────┐   │   ┌───────────────┐     ┌────▼──────────┐
   │  Workflow   │   ├───►  Hooks        │     │  UI Components│
   │ Components  │   │   │ (Logic)       │     │   (shadcn/ui) │
   └─────────────┘   │   └───────┬───────┘     └───────────────┘
                     │           │
                     │    ┌──────▼───────┐
                     │    │  Services    │
                     │    │  (API/Mock)  │
                     │    └──────────────┘
```

## Komponenten-Hierarchie

### App.tsx (Entry Point)
```tsx
<LanguageProvider>
  <DataProtectionPortal />
</LanguageProvider>
```

**Verantwortlichkeiten**:
- Initialisierung der Anwendung
- Provider Setup
- Globale Context Bereitstellung

### DataProtectionPortal.tsx (Hauptkomponente)

Die Hauptkomponente delegiert die gesamte Logik an den Custom Hook `useDataProtectionWorkflow`.

**Workflow-States (in Hook)**:
```typescript
type WorkflowStep = 
  | 'institution'      // Schritt 1: Institution wählen
  | 'projectType'      // Schritt 2: Projekt-Typ wählen
  | 'form'             // Schritt 3a: Neues Projekt
  | 'existingProject'  // Schritt 3b: Bestehendes Projekt
  | 'confirmation'     // Schritt 4: Bestätigung
```

## Business Logic Separation (Hooks & Services)

### useDataProtectionWorkflow (Hook)
Verwaltet den gesamten State und die Validierungslogik.

**State Management**:
```typescript
// Workflow State
const [currentStep, setCurrentStep] = useState<WorkflowStep>('institution');
const [selectedInstitution, setSelectedInstitution] = useState<Institution>(null);

// Form State
const [email, setEmail] = useState('');
// ... weitere Formular-Felder

// Actions
const validateForm = () => { ... };
const handleSubmit = async () => { ... };
```

### Services (API Layer)
Die Kommunikation mit dem Backend (oder Mock) ist in Services gekapselt.

**src/services/api.ts**:
```typescript
export const api = {
  upload: async (data: UploadData): Promise<UploadResult> => {
    // Mock Implementierung oder echter API Call
  }
};
```

## Workflow-Komponenten

### 1. InstitutionSelection.tsx

**Zweck**: Auswahl zwischen Universität Frankfurt und Universitätsklinikum

**Props**:
```typescript
interface InstitutionSelectionProps {
  onSelect: (institution: Institution) => void;
}
```

**Features**:
- Karten-basierte Auswahl
- Icon-Visualisierung
- Beschreibungen für jede Institution
- Hover-Effekte

### 2. ProjectTypeSelection.tsx

**Zweck**: Auswahl zwischen neuem Projekt und bestehendem Projekt

**Props**:
```typescript
interface ProjectTypeSelectionProps {
  institution: Institution;
  onSelect: (type: ProjectType) => void;
  onBack: () => void;
}
```

**Features**:
- Zurück-Navigation zur Institution
- Hinweis-Box für bestehende Projekte
- Kontext-Information zur Institution

### 3. ExistingProjectForm.tsx

**Zweck**: Suche nach bestehendem Projekt via ID oder Titel

**Props**:
```typescript
interface ExistingProjectFormProps {
  institution: Institution;
  onBack: () => void;
}
```

**Features**:
- Suche nach Projekt-ID oder Titel
- Loading-State während Suche
- Fehlerbehandlung (nicht gefunden)
- Info-Box mit Suchhinweisen

**State**:
```typescript
const [searchQuery, setSearchQuery] = useState('');
const [isSearching, setIsSearching] = useState(false);
const [searchError, setSearchError] = useState('');
```

### 4. FileUploadSection.tsx

**Zweck**: Upload-Bereich für eine Dokumentkategorie

**Props**:
```typescript
interface FileUploadSectionProps {
  category: FileCategory;
  isRequired: boolean;
  onFilesAdded: (files: File[]) => void;
  onFileRemoved: (index: number) => void;
}
```

**Features**:
- Drag & Drop Upload
- Click-to-Upload
- Multi-File Support
- Dateiliste mit Größenangabe
- PDF-Vorschau Button
- Löschen-Funktion

**Implementation**:
```typescript
const handleDrop = (e: React.DragEvent) => {
  e.preventDefault();
  const files = Array.from(e.dataTransfer.files);
  onFilesAdded(files);
};
```

### 5. UploadProgress.tsx

**Zweck**: Visuelles Feedback während des Uploads

**Props**:
```typescript
interface UploadProgressProps {
  isUploading: boolean;
  filesCount: number;
}
```

**Features**:
- Fortschrittsbalken (0-100%)
- Dateianzahl-Anzeige
- Loading-Animation
- Success-State

### 6. PDFPreview.tsx

**Zweck**: Modal-Preview für PDF-Dateien

**Props**:
```typescript
interface PDFPreviewProps {
  file: File;
  onClose: () => void;
}
```

**Features**:
- Zoom-Kontrolle (50%-200%)
- Download-Button
- Fullscreen-Modal
- Fallback für Nicht-PDF Dateien

**Implementation**:
```typescript
const fileUrl = URL.createObjectURL(file);

<object
  data={fileUrl}
  type="application/pdf"
  className="w-full h-[800px]"
/>
```

### 7. ConfirmationPage.tsx

**Zweck**: Erfolgsbestätigung nach Upload

**Props**:
```typescript
interface ConfirmationPageProps {
  projectTitle: string;
  uploaderName: string;
  email: string;
  uploadTimestamp: string;
  uploadedFiles: Array<{ category: string; fileName: string }>;
  onNewUpload: () => void;
}
```

**Features**:
- Zusammenfassung aller Daten
- Liste aller hochgeladenen Dateien
- Nächste Schritte
- "Weiteren Upload" Button

### 8. LanguageSwitch.tsx

**Zweck**: Sprachwechsel zwischen Deutsch und Englisch

**Features**:
- Toggle zwischen DE/EN
- Persistenter State über Context
- Icon-basierte Darstellung

## Context System

### LanguageContext.tsx

**Struktur**:
```typescript
interface LanguageContextType {
  language: 'de' | 'en';
  setLanguage: (lang: Language) => void;
  t: (key: string) => string; // Translation Function
}
```

**Translation Object**:
```typescript
const translations = {
  de: { /* 230+ Keys */ },
  en: { /* 230+ Keys */ }
}
```

**Verwendung in Komponenten**:
```typescript
const { t, language, setLanguage } = useLanguage();

<label>{t('form.email')}</label>
```

## UI-Komponenten (/components/ui/)

### Basis-Komponenten (shadcn/ui)

Alle UI-Komponenten folgen dem **Composition Pattern**:

#### Button
```typescript
<Button variant="default" size="lg">
  <Upload className="mr-2" />
  {t('submit.button')}
</Button>
```

**Variants**: default, destructive, outline, secondary, ghost, link  
**Sizes**: default, sm, lg, icon

#### Card
```typescript
<Card>
  <CardHeader>
    <CardTitle>{title}</CardTitle>
    <CardDescription>{description}</CardDescription>
  </CardHeader>
  <CardContent>{children}</CardContent>
</Card>
```

#### Input & Label
```typescript
<div>
  <Label htmlFor="email">{t('form.email')}</Label>
  <Input
    id="email"
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
</div>
```

#### Progress
```typescript
<Progress value={uploadProgress} className="w-full" />
```

#### Alert
```typescript
<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>{t('error.title')}</AlertTitle>
  <AlertDescription>{errors[0]}</AlertDescription>
</Alert>
```

## Datenfluss

### Upload-Workflow

```
User Input
    ↓
Validation (in useDataProtectionWorkflow)
    ↓
setIsSubmitting(true)
    ↓
<UploadProgress /> anzeigen
    ↓
Service Call (api.upload)
    ↓
[TODO] API Call zu FastAPI
    ↓
[TODO] Hessenbox Upload
    ↓
[TODO] E-Mail senden
    ↓
setShowSuccess(true)
    ↓
<ConfirmationPage /> anzeigen
```

### Aktuelle Mock-Implementierung (in api.ts)

```typescript
export const api = {
  upload: async (data: UploadData) => {
    // Simuliert Upload (2 Sekunden)
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { success: true, ... };
  }
};
```

## Validierungslogik

### Form-Validierung (in Hook)

```typescript
const validateForm = (): boolean => {
  const newErrors: string[] = [];
  
  // E-Mail Validierung
  if (!email.trim()) {
    newErrors.push(t('error.emailRequired'));
  }
  
  // ... weitere Validierungen
  
  return newErrors.length === 0;
};
```

## File Category System

### FileCategory Interface

```typescript
interface FileCategory {
  key: string;              // Eindeutiger Identifier
  label: string;            // Anzeigename
  required: boolean;        // Pflichtfeld
  conditionalRequired?: boolean;  // Bedingt Pflicht
  files: File[];            // Hochgeladene Dateien
}
```

## Responsive Design

### Breakpoint-Strategie

- **Mobile First**: Base Styles für Mobile
- **Tablet**: `md:` Prefix (768px+)
- **Desktop**: `lg:` Prefix (1024px+)

## Barrierefreiheit (A11y)

### Implementierte Features

- **Semantic HTML**: `<label>`, `<button>`, `<input>`
- **ARIA Labels**: `aria-label`, `aria-describedby`
- **Keyboard Navigation**: Alle interaktiven Elemente
- **Focus States**: Sichtbare Focus-Ringe
- **Screen Reader Support**: Radix UI Primitives

## Performance-Optimierungen

### Implementiert

- **useRef** für File Input: Vermeidet Re-Renders
- **Functional Components**: Leichtgewichtig
- **Lazy State Updates**: Batch-Updates
- **Hooks Separation**: Bessere Performance durch Logik-Trennung

### Geplant

- **React.memo**: Für teure Komponenten
- **useMemo**: Für komplexe Berechnungen
- **Code Splitting**: Lazy Loading für Routes

## Error Handling

### Ebenen

1. **Client-Validation**: Sofortiges Feedback
2. **Error State**: `errors` und `warnings` Arrays
3. **Visual Feedback**: Alert-Komponenten
4. **Backend Errors** (via Service): Try-Catch mit Error Message Mapping

## Zukünftige Erweiterungen

### Geplante Features

- **Drag & Drop Reordering**: Datei-Reihenfolge ändern
- **Batch Operations**: Mehrere Dateien gleichzeitig löschen
- **Upload Resume**: Unterbrochene Uploads fortsetzen
- **Preview für weitere Dateitypen**: DOCX, XLSX
- **Dark Mode**: Vollständige Theme-Unterstützung
- **Offline Support**: Service Worker für offline Funktionalität
