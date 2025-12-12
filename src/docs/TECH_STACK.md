# Tech Stack Dokumentation

## Frontend-Technologien

### Core Framework

#### React (TypeScript)
- **Version**: Latest (über Figma Make)
- **Verwendung**: Haupt-Framework für die UI
- **Vorteile**: 
  - Komponentenbasierte Architektur
  - TypeScript für Type Safety
  - Große Community & Ecosystem

### Styling

#### Tailwind CSS 4.0
- **Verwendung**: Utility-First CSS Framework
- **Konfiguration**: `/styles/globals.css`
- **Features**:
  - CSS Custom Properties für Theming
  - Dark Mode Support (vorbereitet)
  - Responsive Design Utilities
  - Custom Variants

```css
/* Beispiel aus globals.css */
:root {
  --primary: #030213;
  --destructive: #d4183d;
  --radius: 0.625rem;
}
```

#### Class Variance Authority (CVA)
- **Version**: 0.7.1
- **Verwendung**: Variant-basierte Komponenten-Styles
- **Beispiel**:

```typescript
const buttonVariants = cva("base-classes", {
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground",
      destructive: "bg-destructive text-white"
    }
  }
})
```

### UI-Komponenten

#### Radix UI
- **Version**: 1.1.2+ (verschiedene Pakete)
- **Verwendung**: Headless UI Primitives
- **Komponenten in Verwendung**:
  - `@radix-ui/react-slot` - Composition Pattern
  - Dialog, Popover, Select (über shadcn/ui)
  - Accordion, Checkbox, Radio Group
  - Und weitere 20+ Komponenten

**Vorteile**:
- Vollständig barrierefrei (ARIA)
- Ungestyled (flexible Anpassung)
- Keyboard Navigation
- Screen Reader Support

#### shadcn/ui Komponenten
Alle UI-Komponenten unter `/components/ui/` basieren auf shadcn/ui:
- Button, Card, Input, Label
- Dialog, Dropdown, Select
- Progress, Tabs, Toast (Sonner)
- Form, Table, und mehr

### Icons

#### Lucide React
- **Verwendung**: Icon Library
- **Verwendete Icons**:
  - `Upload`, `Mail`, `FileText` - Dokument-Icons
  - `CheckCircle2`, `AlertCircle`, `Info` - Status-Icons
  - `Eye`, `ZoomIn`, `ZoomOut`, `Download` - Aktions-Icons
  - `ArrowLeft`, `X` - Navigation-Icons

```tsx
import { Upload, CheckCircle2 } from 'lucide-react';

<Upload className="w-6 h-6 text-blue-600" />
```

### State Management

#### React Context API
- **Verwendung**: Globaler State für Sprache
- **Implementierung**: `/contexts/LanguageContext.tsx`

```typescript
interface LanguageContextType {
  language: 'de' | 'en';
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}
```

**Vorteile**:
- Keine externe Dependency
- Einfache Integration
- Type-Safe mit TypeScript

### Form Handling

#### Native React State
- **Verwendung**: Lokaler State für Formulare
- **Pattern**: Controlled Components

```tsx
const [email, setEmail] = useState('');
const [errors, setErrors] = useState<string[]>([]);
```

**Validierung**:
- Client-seitige Validierung mit RegEx
- Echtzeit-Feedback
- Conditional Required Fields

### File Handling

#### Drag & Drop
- **Implementierung**: Native HTML5 Drag & Drop API
- **Features**:
  - Multiple File Upload
  - File Type Validation
  - Drag Visual Feedback

```tsx
const handleDrop = (e: React.DragEvent) => {
  e.preventDefault();
  const files = Array.from(e.dataTransfer.files);
  onFilesAdded(files);
};
```

#### PDF Preview
- **Implementierung**: Native `<object>` Tag
- **Features**:
  - Zoom-Funktion (50%-200%)
  - Download-Button
  - Fallback für nicht-PDF Dateien

```tsx
<object
  data={fileUrl}
  type="application/pdf"
  className="w-full h-[800px]"
/>
```

## Internationalisierung (i18n)

### Custom Translation System
- **Implementierung**: Context-basiert
- **Sprachen**: Deutsch (de), Englisch (en)
- **Translations**: 230+ Keys

```typescript
const translations = {
  de: {
    'form.email': 'E-Mail-Adresse',
    'form.title': 'Projekttitel',
    // ... 230+ weitere
  },
  en: { /* ... */ }
};
```

**Verwendung**:
```tsx
const { t } = useLanguage();
<label>{t('form.email')}</label>
```

## Backend-Technologien (Geplant)

### Python FastAPI
- **Version**: 0.100+
- **Verwendung**: REST API Backend
- **Features**:
  - Async/Await Support
  - Automatic OpenAPI Documentation
  - Type Validation mit Pydantic
  - High Performance

### WebDAV Client
- **Library**: `webdavclient3` oder `easywebdav`
- **Verwendung**: Hessenbox Integration
- **Operationen**:
  - Upload Files
  - Create Directories
  - List Files
  - Download Files

### E-Mail
- **Library**: `smtplib` (Python Standard Library)
- **Verwendung**: Benachrichtigungen
- **Features**:
  - HTML E-Mails
  - Attachments (optional)
  - Template System

### Docker
- **Base Image**: `python:3.11-slim`
- **Services**:
  - Frontend (Nginx)
  - Backend (FastAPI)
  - (Optional) Database

## Build Tools

### Figma Make
- **Plattform**: Figma Make Web Builder
- **Features**:
  - Hot Module Replacement
  - TypeScript Compilation
  - Automatic Dependency Resolution
  - Production Build

## Browser Support

### Unterstützte Browser
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Required Browser Features
- ES6+ JavaScript
- CSS Grid & Flexbox
- Drag & Drop API
- File API
- Blob & URL.createObjectURL

## Performance Optimierungen

### React
- Functional Components mit Hooks
- Memoization (wo nötig)
- Lazy Loading (geplant für große Komponenten)

### CSS
- Tailwind JIT Compiler
- CSS Custom Properties
- Minimales Bundle durch PurgeCSS

### Assets
- SVG für Icons (Lucide)
- WebP für Bilder (geplant)
- Lazy Loading für Bilder

## Sicherheit

### Frontend
- XSS Protection durch React
- CSRF Token (geplant für Backend)
- Content Security Policy (geplant)
- Input Sanitization

### Backend (Geplant)
- HTTPS nur
- Rate Limiting
- Input Validation
- Secure File Upload
- E-Mail Validation

## Abhängigkeiten

### Core Dependencies
```json
{
  "react": "latest",
  "lucide-react": "latest",
  "class-variance-authority": "0.7.1",
  "@radix-ui/react-slot": "1.1.2"
}
```

### Keine externe Form Library
Bewusste Entscheidung für native React State statt react-hook-form, da:
- Einfache Form-Struktur
- Weniger Dependencies
- Volle Kontrolle über Validierung
- Kleineres Bundle

## Entwicklungstools

### TypeScript
- Strict Mode
- Type Checking
- IntelliSense Support

### Code Style
- Functional Components
- TypeScript Interfaces
- Consistent Naming Convention
- Component Composition Pattern

## Zukünftige Erweiterungen

### Geplante Libraries
- **React Query/TanStack Query**: API State Management
- **Zod**: Schema Validation
- **React Hook Form**: Falls Forms komplexer werden
- **Sentry**: Error Tracking
- **Plausible/Matomo**: Privacy-friendly Analytics
