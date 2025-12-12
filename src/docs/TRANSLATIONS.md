# Übersetzungen / Translations

## Übersicht

Das Datenschutzportal unterstützt vollständige Mehrsprachigkeit mit **Deutsch** und **Englisch**.

## System

### Implementierung

Die Internationalisierung ist über einen **Context-basierten Ansatz** implementiert:

- **Location**: `/contexts/LanguageContext.tsx`
- **Unterstützte Sprachen**: `de` (Deutsch), `en` (Englisch)
- **Anzahl Übersetzungen**: 230+ Keys

### Verwendung

```typescript
import { useLanguage } from '../contexts/LanguageContext';

const { t, language, setLanguage } = useLanguage();

// Übersetzen
<label>{t('form.email')}</label>

// Sprache wechseln
<button onClick={() => setLanguage('en')}>English</button>
```

## Translation Keys

### Institution Selection

| Key | DE | EN |
|-----|----|----|
| `institution.title` | Datenschutzportal | Data Protection Portal |
| `institution.subtitle` | Willkommen beim Datenschutzportal für Forschungsprojekte | Welcome to the Data Protection Portal for Research Projects |
| `institution.question` | Zu welcher Institution gehören Sie? | Which institution do you belong to? |
| `institution.description` | Bitte wählen Sie die Institution aus, in deren Rahmen Sie Ihre Studie durchführen | Please select the institution under which you are conducting your study |
| `institution.university` | Universität Frankfurt | University of Frankfurt |
| `institution.university.desc` | Für Forschungsprojekte der Goethe-Universität Frankfurt am Main | For research projects of Goethe University Frankfurt am Main |
| `institution.clinic` | Universitätsklinikum Frankfurt | University Hospital Frankfurt |
| `institution.clinic.desc` | Für klinische Forschungsprojekte des Universitätsklinikums | For clinical research projects of the University Hospital |
| `institution.footer` | Bei Fragen zur richtigen Auswahl wenden Sie sich bitte an das Datenschutz-Team | If you have questions about the right choice, please contact the Data Protection Team |

### Project Type Selection

| Key | DE | EN |
|-----|----|----|
| `projectType.title` | Datenschutzportal | Data Protection Portal |
| `projectType.question` | Was möchten Sie tun? | What would you like to do? |
| `projectType.description` | Wählen Sie aus, ob Sie ein neues Projekt einreichen oder ein bestehendes Projekt bearbeiten möchten | Choose whether you want to submit a new project or edit an existing project |
| `projectType.new` | Neues Projekt einreichen | Submit New Project |
| `projectType.new.desc` | Reichen Sie Datenschutzunterlagen für ein neues Forschungsprojekt ein | Submit data protection documents for a new research project |
| `projectType.existing` | Bestehendes Projekt bearbeiten | Edit Existing Project |
| `projectType.existing.desc` | Laden Sie zusätzliche Dokumente für ein bereits bestehendes Projekt hoch | Upload additional documents for an existing project |
| `projectType.info` | Hinweis: Für bestehende Projekte benötigen Sie Ihre Projekt-ID... | Note: For existing projects, you need your project ID... |
| `projectType.back` | Zurück zur Institution-Auswahl | Back to Institution Selection |

### Existing Project Form

| Key | DE | EN |
|-----|----|----|
| `existingProject.title` | Bestehendes Projekt bearbeiten | Edit Existing Project |
| `existingProject.search` | Projekt suchen | Search Project |
| `existingProject.label` | Projekt-ID oder Projekttitel | Project ID or Project Title |
| `existingProject.placeholder` | z.B. PRJ-2024-001 oder "Studie zur..." | e.g. PRJ-2024-001 or "Study on..." |
| `existingProject.hint` | Geben Sie die Projekt-ID oder den vollständigen Projekttitel ein | Enter the project ID or the complete project title |
| `existingProject.searching` | Suche läuft... | Searching... |
| `existingProject.searchButton` | Projekt suchen | Search Project |
| `existingProject.infoTitle` | Hinweise zur Projektsuche | Project Search Tips |
| `existingProject.info1` | Die Projekt-ID finden Sie in Ihrer ursprünglichen Bestätigungs-E-Mail | You can find the project ID in your original confirmation email |
| `existingProject.info2` | Alternativ können Sie nach dem exakten Projekttitel suchen | Alternatively, you can search by exact project title |
| `existingProject.info3` | Groß- und Kleinschreibung wird bei der Suche nicht berücksichtigt | Case sensitivity is not considered in the search |
| `existingProject.notFound` | Projekt nicht gefunden. Bitte überprüfen Sie Ihre Eingabe. | Project not found. Please check your input. |
| `existingProject.error` | Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut. | An error occurred. Please try again. |
| `existingProject.back` | Zurück zur Auswahl | Back to Selection |

### Form

| Key | DE | EN |
|-----|----|----|
| `form.title` | Datenschutzportal | Data Protection Portal |
| `form.info` | Bitte laden Sie alle erforderlichen datenschutzrelevanten Dokumente... | Please upload all required data protection documents... |
| `form.baseData` | Basisdaten | Basic Data |
| `form.email` | E-Mail-Adresse | Email Address |
| `form.uploaderName` | Name des Uploaders (optional) | Uploader Name (optional) |
| `form.projectTitle` | Projekttitel | Project Title |
| `form.prospectiveStudy` | Prospektive Studie / Prospektiver Anteil | Prospective Study / Prospective Component |
| `form.documents` | Dokumente hochladen | Upload Documents |
| `form.required` | * | * |
| `form.emailPlaceholder` | ihre.email@uni-frankfurt.de | your.email@uni-frankfurt.de |
| `form.namePlaceholder` | Max Mustermann | John Doe |
| `form.titlePlaceholder` | Titel des Forschungsprojekts | Title of Research Project |
| `form.back` | Zurück zur Auswahl | Back to Selection |

### Document Categories

| Key | DE | EN |
|-----|----|----|
| `category.datenschutzkonzept` | Datenschutzkonzept | Data Protection Concept |
| `category.verantwortung` | Übernahme der Verantwortung | Assumption of Responsibility |
| `category.schulung_uni` | Schulung Uni Nachweis | University Training Certificate |
| `category.schulung_ukf` | Schulung UKF Nachweis | UKF Training Certificate |
| `category.einwilligung` | Einwilligung | Consent |
| `category.ethikvotum` | Ethikvotum | Ethics Approval |
| `category.sonstiges` | Sonstiges | Other |

### File Upload

| Key | DE | EN |
|-----|----|----|
| `upload.dropzone` | Klicken Sie hier oder ziehen Sie Dateien hierher | Click here or drag files here |
| `upload.formats` | PDF, DOC, DOCX, ZIP oder andere Dateiformate | PDF, DOC, DOCX, ZIP or other file formats |
| `upload.preview` | Vorschau | Preview |
| `upload.close` | Schließen | Close |

### Errors

| Key | DE | EN |
|-----|----|----|
| `error.title` | Bitte beheben Sie folgende Fehler: | Please fix the following errors: |
| `error.emailRequired` | E-Mail-Adresse ist erforderlich | Email address is required |
| `error.emailInvalid` | Bitte geben Sie eine gültige E-Mail-Adresse ein | Please enter a valid email address |
| `error.titleRequired` | Projekttitel ist erforderlich | Project title is required |
| `error.categoryRequired` | ist ein Pflichtfeld | is a required field |
| `error.uploadFailed` | Ein Fehler ist beim Upload aufgetreten... | An error occurred during upload... |

### Submit

| Key | DE | EN |
|-----|----|----|
| `submit.filesReady` | bereit zum Upload | ready for upload |
| `submit.noFiles` | Keine Dateien ausgewählt | No files selected |
| `submit.uploading` | Wird hochgeladen... | Uploading... |
| `submit.button` | Formular absenden und Dokumente hochladen | Submit Form and Upload Documents |
| `submit.confirmation` | Mit dem Absenden bestätigen Sie die Richtigkeit Ihrer Angaben | By submitting you confirm the accuracy of your information |
| `submit.file` | Datei | file |
| `submit.files` | Dateien | files |

### Confirmation

| Key | DE | EN |
|-----|----|----|
| `confirmation.success` | Upload erfolgreich abgeschlossen! | Upload Completed Successfully! |
| `confirmation.message` | Ihre Dokumente wurden erfolgreich hochgeladen... | Your documents have been successfully uploaded... |
| `confirmation.details` | Upload-Details | Upload Details |
| `confirmation.projectTitle` | Projekttitel | Project Title |
| `confirmation.uploader` | Uploader | Uploader |
| `confirmation.email` | E-Mail-Adresse | Email Address |
| `confirmation.timestamp` | Upload-Zeitpunkt | Upload Time |
| `confirmation.documents` | Hochgeladene Dokumente | Uploaded Documents |
| `confirmation.emailNotification` | E-Mail-Benachrichtigung | Email Notification |
| `confirmation.emailSent` | Eine Bestätigungs-E-Mail wurde an {email} gesendet... | A confirmation email was sent to {email}... |
| `confirmation.teamNotified` | Das Datenschutz-Team wurde ebenfalls über Ihren Upload informiert... | The Data Protection Team has also been informed... |
| `confirmation.nextSteps` | Wie geht es weiter? | What happens next? |
| `confirmation.step1` | Das Datenschutz-Team prüft Ihre hochgeladenen Dokumente | The Data Protection Team reviews your uploaded documents |
| `confirmation.step2` | Bei Rückfragen werden Sie per E-Mail kontaktiert | You will be contacted by email if there are any questions |
| `confirmation.step3` | Nach erfolgreicher Prüfung erhalten Sie eine Freigabe | You will receive approval after successful review |
| `confirmation.newUpload` | Weiteren Upload durchführen | Perform Another Upload |
| `confirmation.footer` | Bei Fragen wenden Sie sich bitte an das Datenschutz-Team | If you have questions, please contact the Data Protection Team |
| `confirmation.institution` | Universität Frankfurt / Universitätsklinik | University of Frankfurt / University Hospital |

### Common

| Key | DE | EN |
|-----|----|----|
| `common.back` | Zurück | Back |

## Neue Übersetzung hinzufügen

### 1. Key in LanguageContext hinzufügen

```typescript
// /contexts/LanguageContext.tsx
const translations = {
  de: {
    // ... existing translations
    'new.key': 'Deutsche Übersetzung',
  },
  en: {
    // ... existing translations
    'new.key': 'English Translation',
  }
};
```

### 2. In Komponente verwenden

```tsx
const { t } = useLanguage();

<p>{t('new.key')}</p>
```

## Best Practices

### Naming Convention

```
[section].[subsection].[element]
```

**Beispiele**:
- `form.email` - Formular → E-Mail
- `error.emailInvalid` - Fehler → E-Mail ungültig
- `category.datenschutzkonzept` - Kategorie → Datenschutzkonzept

### Pluralisierung

Verwende separate Keys für Singular/Plural:

```typescript
{
  'submit.file': 'Datei',
  'submit.files': 'Dateien'
}

// Verwendung
const text = count === 1 ? t('submit.file') : t('submit.files');
```

### Variablen in Übersetzungen

Für dynamische Werte nutze Template-Replacement:

```typescript
// Translation
'confirmation.emailSent': 'Eine E-Mail wurde an {email} gesendet'

// Usage
const message = t('confirmation.emailSent').replace('{email}', userEmail);
```

### Fallback

Wenn ein Key nicht gefunden wird, wird der Key selbst zurückgegeben:

```typescript
t('unknown.key') // → 'unknown.key'
```

## Sprache ändern

### In Komponenten

```tsx
import { useLanguage } from '../contexts/LanguageContext';

function MyComponent() {
  const { language, setLanguage } = useLanguage();
  
  return (
    <button onClick={() => setLanguage(language === 'de' ? 'en' : 'de')}>
      {language === 'de' ? 'English' : 'Deutsch'}
    </button>
  );
}
```

### Automatische Spracherkennung (geplant)

```typescript
// Detect browser language
const browserLang = navigator.language.split('-')[0];
const initialLang = ['de', 'en'].includes(browserLang) ? browserLang : 'de';

const [language, setLanguage] = useState<Language>(initialLang);
```

### Persistierung (geplant)

```typescript
// Save to localStorage
useEffect(() => {
  localStorage.setItem('language', language);
}, [language]);

// Load from localStorage
const [language, setLanguage] = useState<Language>(
  () => (localStorage.getItem('language') as Language) || 'de'
);
```

## E-Mail Templates

E-Mail-Templates haben separate Übersetzungen:

### Backend Templates

```
backend/app/templates/
├── email_confirmation_de.html
└── email_confirmation_en.html
```

### Beispiel: email_confirmation_de.html

```html
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <title>Upload-Bestätigung</title>
</head>
<body>
    <h1>Upload erfolgreich</h1>
    <p>Hallo {{ uploader_name }},</p>
    <p>Ihr Upload wurde erfolgreich verarbeitet.</p>
    <p><strong>Projekt-ID:</strong> {{ project_id }}</p>
    <p><strong>Projekttitel:</strong> {{ project_title }}</p>
    
    <h2>Hochgeladene Dokumente:</h2>
    <ul>
    {% for file in files %}
        <li>{{ file.filename }} ({{ file.category }})</li>
    {% endfor %}
    </ul>
    
    <p>Mit freundlichen Grüßen,<br>
    Ihr Datenschutz-Team</p>
</body>
</html>
```

## Testing Übersetzungen

### Manual Testing

1. Sprachwechsel-Button klicken
2. Alle Seiten durchgehen
3. Prüfen ob alle Texte korrekt übersetzt werden

### Automatisierte Tests (geplant)

```typescript
// tests/translations.test.ts
import { translations } from '../contexts/LanguageContext';

describe('Translations', () => {
  test('All DE keys have EN translations', () => {
    const deKeys = Object.keys(translations.de);
    const enKeys = Object.keys(translations.en);
    
    expect(deKeys.sort()).toEqual(enKeys.sort());
  });
  
  test('No empty translations', () => {
    Object.values(translations.de).forEach(value => {
      expect(value).not.toBe('');
    });
    
    Object.values(translations.en).forEach(value => {
      expect(value).not.toBe('');
    });
  });
});
```

## Export für Übersetzer

### JSON Export

```typescript
// scripts/export-translations.ts
import fs from 'fs';
import { translations } from '../contexts/LanguageContext';

// Export als separate JSON files
fs.writeFileSync(
  'translations/de.json',
  JSON.stringify(translations.de, null, 2)
);

fs.writeFileSync(
  'translations/en.json',
  JSON.stringify(translations.en, null, 2)
);
```

### CSV Export (für Übersetzer)

```typescript
// scripts/export-csv.ts
import fs from 'fs';
import { translations } from '../contexts/LanguageContext';

const keys = Object.keys(translations.de);
const csv = ['Key,DE,EN'];

keys.forEach(key => {
  csv.push(`${key},"${translations.de[key]}","${translations.en[key]}"`);
});

fs.writeFileSync('translations.csv', csv.join('\n'));
```

## Zukünftige Erweiterungen

### Weitere Sprachen

Französisch, Spanisch, etc. können einfach hinzugefügt werden:

```typescript
type Language = 'de' | 'en' | 'fr' | 'es';

const translations = {
  de: { /* ... */ },
  en: { /* ... */ },
  fr: { /* ... */ },
  es: { /* ... */ }
};
```

### ICU Message Format (geplant)

Für komplexere Übersetzungen:

```typescript
import { IntlProvider, FormattedMessage } from 'react-intl';

<FormattedMessage
  id="confirmation.emailSent"
  values={{ email: userEmail }}
/>
```

### Translation Management System

Integration mit Tools wie:
- **Lokalise**
- **Crowdin**
- **POEditor**

Für professionelle Übersetzungsverwaltung.
