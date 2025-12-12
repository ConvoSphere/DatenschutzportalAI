# Frontend-Architektur

## Architektur-Übersicht

Die Frontend-Architektur folgt einem **komponentenbasierten Ansatz** mit klarer Trennung von Verantwortlichkeiten und einem mehrstufigen Workflow-System.

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
        │  (Main Component + Workflow)    │
        └────────────┬────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
   ┌────▼────────┐       ┌───────▼───────┐
   │  Workflow   │       │  UI Components│
   │ Components  │       │   (shadcn/ui) │
   └─────────────┘       └───────────────┘
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

**Workflow-States**:
```typescript
type WorkflowStep = 
  | 'institution'      // Schritt 1: Institution wählen
  | 'projectType'      // Schritt 2: Projekt-Typ wählen
  | 'form'             // Schritt 3a: Neues Projekt
  | 'existingProject'  // Schritt 3b: Bestehendes Projekt
  | 'confirmation'     // Schritt 4: Bestätigung
```

**State Management**:
```typescript
// Workflow State
const [currentStep, setCurrentStep] = useState<WorkflowStep>('institution');
const [selectedInstitution, setSelectedInstitution] = useState<Institution>(null);
const [selectedProjectType, setSelectedProjectType] = useState<ProjectType>(null);

// Form State
const [email, setEmail] = useState('');
const [uploaderName, setUploaderName] = useState('');
const [projectTitle, setProjectTitle] = useState('');
const [isProspectiveStudy, setIsProspectiveStudy] = useState(false);

// Upload State
const [categories, setCategories] = useState<FileCategory[]>([...]);
const [isSubmitting, setIsSubmitting] = useState(false);

// Feedback State
const [errors, setErrors] = useState<string[]>([]);
const [warnings, setWarnings] = useState<string[]>([]);
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

**Progress Simulation**:
```typescript
useEffect(() => {
  if (isUploading) {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return 95; // Wartet auf echten Upload
        return prev + Math.random() * 10;
      });
    }, 200);
    return () => clearInterval(interval);
  }
}, [isUploading]);
```

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
  categories: FileCategory[];
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
};
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
Validation (validateForm)
    ↓
setIsSubmitting(true)
    ↓
<UploadProgress /> anzeigen
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

### Aktuelle Mock-Implementierung

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!validateForm()) return;
  
  setIsSubmitting(true);
  
  // Simuliert Upload (3 Sekunden)
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  setUploadTimestamp(new Date().toLocaleString('de-DE'));
  setShowSuccess(true);
  setIsSubmitting(false);
  setCurrentStep('confirmation');
};
```

## Validierungslogik

### Form-Validierung

```typescript
const validateForm = (): boolean => {
  const newErrors: string[] = [];
  const newWarnings: string[] = [];
  
  // E-Mail Validierung
  if (!email.trim()) {
    newErrors.push(t('error.emailRequired'));
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    newErrors.push(t('error.emailInvalid'));
  }
  
  // Projekttitel Validierung
  if (!projectTitle.trim()) {
    newErrors.push(t('error.titleRequired'));
  }
  
  // Kategorien Validierung
  categories.forEach(cat => {
    if (cat.required && cat.files.length === 0) {
      newErrors.push(`${t(`category.${cat.key}`)} ${t('error.categoryRequired')}`);
    }
    
    // Conditional Required: Einwilligung bei prospektiver Studie
    if (cat.key === 'einwilligung' && 
        isProspectiveStudy && 
        cat.files.length === 0) {
      newWarnings.push(t('warning.einwilligungProspective'));
    }
  });
  
  setErrors(newErrors);
  setWarnings(newWarnings);
  
  return newErrors.length === 0;
};
```

## File Category System

### FileCategory Interface

```typescript
interface FileCategory {
  key: string;              // Eindeutiger Identifier
  label: string;            // Anzeigename (deprecated, nutzt i18n)
  required: boolean;        // Pflichtfeld
  conditionalRequired?: boolean;  // Bedingt Pflicht
  files: File[];            // Hochgeladene Dateien
}
```

### Kategorien-Definition

```typescript
const categories = [
  { key: 'datenschutzkonzept', required: true },
  { key: 'verantwortung', required: true },
  { key: 'schulung_uni', required: true },
  { key: 'schulung_ukf', required: true },
  { key: 'einwilligung', required: false, conditionalRequired: true },
  { key: 'ethikvotum', required: false },
  { key: 'sonstiges', required: false }
];
```

## Responsive Design

### Breakpoint-Strategie

- **Mobile First**: Base Styles für Mobile
- **Tablet**: `md:` Prefix (768px+)
- **Desktop**: `lg:` Prefix (1024px+)

### Beispiel

```tsx
<div className="
  grid 
  grid-cols-1        // Mobile: 1 Spalte
  md:grid-cols-2     // Tablet: 2 Spalten
  lg:grid-cols-3     // Desktop: 3 Spalten
  gap-4
">
```

## Barrierefreiheit (A11y)

### Implementierte Features

- **Semantic HTML**: `<label>`, `<button>`, `<input>`
- **ARIA Labels**: `aria-label`, `aria-describedby`
- **Keyboard Navigation**: Alle interaktiven Elemente
- **Focus States**: Sichtbare Focus-Ringe
- **Screen Reader Support**: Radix UI Primitives

### Beispiel

```tsx
<button
  aria-label={t('upload.close')}
  onClick={onClose}
>
  <X className="w-5 h-5" />
</button>
```

## Performance-Optimierungen

### Implementiert

- **useRef** für File Input: Vermeidet Re-Renders
- **Functional Components**: Leichtgewichtig
- **Lazy State Updates**: Batch-Updates

### Geplant

- **React.memo**: Für teure Komponenten
- **useMemo**: Für komplexe Berechnungen
- **Code Splitting**: Lazy Loading für Routes

## Error Handling

### Ebenen

1. **Client-Validation**: Sofortiges Feedback
2. **Error State**: `errors` und `warnings` Arrays
3. **Visual Feedback**: Alert-Komponenten
4. **Backend Errors** (geplant): Try-Catch mit Toast

```typescript
try {
  const response = await uploadFiles();
  // Success
} catch (error) {
  setErrors([t('error.uploadFailed')]);
  console.error('Upload failed:', error);
}
```

## Zukünftige Erweiterungen

### Geplante Features

- **Drag & Drop Reordering**: Datei-Reihenfolge ändern
- **Batch Operations**: Mehrere Dateien gleichzeitig löschen
- **Upload Resume**: Unterbrochene Uploads fortsetzen
- **Preview für weitere Dateitypen**: DOCX, XLSX
- **Dark Mode**: Vollständige Theme-Unterstützung
- **Offline Support**: Service Worker für offline Funktionalität
