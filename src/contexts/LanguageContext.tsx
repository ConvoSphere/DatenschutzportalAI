import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'de' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  de: {
    // Institution Selection
    'institution.title': 'Datenschutzportal',
    'institution.subtitle': 'Willkommen beim Datenschutzportal für Forschungsprojekte',
    'institution.question': 'Zu welcher Institution gehören Sie?',
    'institution.description': 'Bitte wählen Sie die Institution aus, in deren Rahmen Sie Ihre Studie durchführen',
    'institution.university': 'Universität Frankfurt',
    'institution.university.desc': 'Für Forschungsprojekte der Goethe-Universität Frankfurt am Main',
    'institution.clinic': 'Universitätsklinikum Frankfurt',
    'institution.clinic.desc': 'Für klinische Forschungsprojekte des Universitätsklinikums',
    'institution.footer': 'Bei Fragen zur richtigen Auswahl wenden Sie sich bitte an das Datenschutz-Team',
    
    // Project Type Selection
    'projectType.title': 'Datenschutzportal',
    'projectType.question': 'Was möchten Sie tun?',
    'projectType.description': 'Wählen Sie aus, ob Sie ein neues Projekt einreichen oder ein bestehendes Projekt bearbeiten möchten',
    'projectType.new': 'Neues Projekt einreichen',
    'projectType.new.desc': 'Reichen Sie Datenschutzunterlagen für ein neues Forschungsprojekt ein',
    'projectType.existing': 'Bestehendes Projekt bearbeiten',
    'projectType.existing.desc': 'Laden Sie zusätzliche Dokumente für ein bereits bestehendes Projekt hoch',
    'projectType.info': 'Hinweis: Für bestehende Projekte benötigen Sie Ihre Projekt-ID oder den ursprünglichen Projekttitel zur Identifikation.',
    'projectType.back': 'Zurück zur Institution-Auswahl',
    
    // Existing Project Form
    'existingProject.title': 'Bestehendes Projekt bearbeiten',
    'existingProject.search': 'Projekt suchen',
    'existingProject.label': 'Projekt-ID oder Projekttitel',
    'existingProject.placeholder': 'z.B. PRJ-2024-001 oder "Studie zur..."',
    'existingProject.hint': 'Geben Sie die Projekt-ID oder den vollständigen Projekttitel ein, den Sie bei der Ersteinreichung verwendet haben',
    'existingProject.searching': 'Suche läuft...',
    'existingProject.searchButton': 'Projekt suchen',
    'existingProject.infoTitle': 'Hinweise zur Projektsuche',
    'existingProject.info1': 'Die Projekt-ID finden Sie in Ihrer ursprünglichen Bestätigungs-E-Mail',
    'existingProject.info2': 'Alternativ können Sie nach dem exakten Projekttitel suchen',
    'existingProject.info3': 'Groß- und Kleinschreibung wird bei der Suche nicht berücksichtigt',
    'existingProject.notFound': 'Projekt nicht gefunden. Bitte überprüfen Sie Ihre Eingabe.',
    'existingProject.error': 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
    'existingProject.back': 'Zurück zur Auswahl',
    
    // Form
    'form.title': 'Datenschutzportal',
    'form.info': 'Bitte laden Sie alle erforderlichen datenschutzrelevanten Dokumente für Ihr Forschungsprojekt hoch. Die Dokumente werden sicher in der Hessenbox gespeichert. Sie erhalten eine Bestätigungsmail nach erfolgreichem Upload.',
    'form.baseData': 'Basisdaten',
    'form.email': 'E-Mail-Adresse',
    'form.uploaderName': 'Name des Uploaders (optional)',
    'form.projectTitle': 'Projekttitel',
    'form.prospectiveStudy': 'Prospektive Studie / Prospektiver Anteil',
    'form.documents': 'Dokumente hochladen',
    'form.required': '*',
    'form.emailPlaceholder': 'ihre.email@uni-frankfurt.de',
    'form.namePlaceholder': 'Max Mustermann',
    'form.titlePlaceholder': 'Titel des Forschungsprojekts',
    'form.back': 'Zurück zur Auswahl',
    
    // Categories
    'category.datenschutzkonzept': 'Datenschutzkonzept',
    'category.verantwortung': 'Übernahme der Verantwortung',
    'category.schulung_uni': 'Schulung Uni Nachweis',
    'category.schulung_ukf': 'Schulung UKF Nachweis',
    'category.einwilligung': 'Einwilligung',
    'category.ethikvotum': 'Ethikvotum',
    'category.sonstiges': 'Sonstiges',
    
    // File Upload
    'upload.dropzone': 'Klicken Sie hier oder ziehen Sie Dateien hierher',
    'upload.formats': 'PDF, DOC, DOCX, ZIP oder andere Dateiformate',
    'upload.preview': 'Vorschau',
    'upload.close': 'Schließen',
    
    // Errors
    'error.title': 'Bitte beheben Sie folgende Fehler:',
    'error.emailRequired': 'E-Mail-Adresse ist erforderlich',
    'error.emailInvalid': 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
    'error.titleRequired': 'Projekttitel ist erforderlich',
    'error.categoryRequired': 'ist ein Pflichtfeld',
    'error.uploadFailed': 'Ein Fehler ist beim Upload aufgetreten. Bitte versuchen Sie es erneut.',
    
    // Submit
    'submit.filesReady': 'bereit zum Upload',
    'submit.noFiles': 'Keine Dateien ausgewählt',
    'submit.uploading': 'Wird hochgeladen...',
    'submit.button': 'Formular absenden und Dokumente hochladen',
    'submit.confirmation': 'Mit dem Absenden bestätigen Sie die Richtigkeit Ihrer Angaben',
    'submit.file': 'Datei',
    'submit.files': 'Dateien',
    
    // Confirmation
    'confirmation.success': 'Upload erfolgreich abgeschlossen!',
    'confirmation.message': 'Ihre Dokumente wurden erfolgreich hochgeladen und in der Hessenbox gespeichert. Eine Bestätigungs-E-Mail wurde an Ihre E-Mail-Adresse versendet.',
    'confirmation.details': 'Upload-Details',
    'confirmation.projectTitle': 'Projekttitel',
    'confirmation.uploader': 'Uploader',
    'confirmation.email': 'E-Mail-Adresse',
    'confirmation.timestamp': 'Upload-Zeitpunkt',
    'confirmation.documents': 'Hochgeladene Dokumente',
    'confirmation.emailNotification': 'E-Mail-Benachrichtigung',
    'confirmation.emailSent': 'Eine Bestätigungs-E-Mail wurde an {email} gesendet mit allen Details zu Ihrem Upload.',
    'confirmation.teamNotified': 'Das Datenschutz-Team wurde ebenfalls über Ihren Upload informiert und wird Ihre Dokumente zeitnah prüfen.',
    'confirmation.nextSteps': 'Wie geht es weiter?',
    'confirmation.step1': 'Das Datenschutz-Team prüft Ihre hochgeladenen Dokumente',
    'confirmation.step2': 'Bei Rückfragen werden Sie per E-Mail kontaktiert',
    'confirmation.step3': 'Nach erfolgreicher Prüfung erhalten Sie eine Freigabe',
    'confirmation.newUpload': 'Weiteren Upload durchführen',
    'confirmation.footer': 'Bei Fragen wenden Sie sich bitte an das Datenschutz-Team',
    'confirmation.institution': 'Universität Frankfurt / Universitätsklinik',
    
    // Common
    'common.back': 'Zurück',
  },
  en: {
    // Institution Selection
    'institution.title': 'Data Protection Portal',
    'institution.subtitle': 'Welcome to the Data Protection Portal for Research Projects',
    'institution.question': 'Which institution do you belong to?',
    'institution.description': 'Please select the institution under which you are conducting your study',
    'institution.university': 'University of Frankfurt',
    'institution.university.desc': 'For research projects of Goethe University Frankfurt am Main',
    'institution.clinic': 'University Hospital Frankfurt',
    'institution.clinic.desc': 'For clinical research projects of the University Hospital',
    'institution.footer': 'If you have questions about the right choice, please contact the Data Protection Team',
    
    // Project Type Selection
    'projectType.title': 'Data Protection Portal',
    'projectType.question': 'What would you like to do?',
    'projectType.description': 'Choose whether you want to submit a new project or edit an existing project',
    'projectType.new': 'Submit New Project',
    'projectType.new.desc': 'Submit data protection documents for a new research project',
    'projectType.existing': 'Edit Existing Project',
    'projectType.existing.desc': 'Upload additional documents for an existing project',
    'projectType.info': 'Note: For existing projects, you need your project ID or the original project title for identification.',
    'projectType.back': 'Back to Institution Selection',
    
    // Existing Project Form
    'existingProject.title': 'Edit Existing Project',
    'existingProject.search': 'Search Project',
    'existingProject.label': 'Project ID or Project Title',
    'existingProject.placeholder': 'e.g. PRJ-2024-001 or "Study on..."',
    'existingProject.hint': 'Enter the project ID or the complete project title you used during initial submission',
    'existingProject.searching': 'Searching...',
    'existingProject.searchButton': 'Search Project',
    'existingProject.infoTitle': 'Project Search Tips',
    'existingProject.info1': 'You can find the project ID in your original confirmation email',
    'existingProject.info2': 'Alternatively, you can search by exact project title',
    'existingProject.info3': 'Case sensitivity is not considered in the search',
    'existingProject.notFound': 'Project not found. Please check your input.',
    'existingProject.error': 'An error occurred. Please try again.',
    'existingProject.back': 'Back to Selection',
    
    // Form
    'form.title': 'Data Protection Portal',
    'form.info': 'Please upload all required data protection documents for your research project. The documents will be securely stored in Hessenbox. You will receive a confirmation email after successful upload.',
    'form.baseData': 'Basic Data',
    'form.email': 'Email Address',
    'form.uploaderName': 'Uploader Name (optional)',
    'form.projectTitle': 'Project Title',
    'form.prospectiveStudy': 'Prospective Study / Prospective Component',
    'form.documents': 'Upload Documents',
    'form.required': '*',
    'form.emailPlaceholder': 'your.email@uni-frankfurt.de',
    'form.namePlaceholder': 'John Doe',
    'form.titlePlaceholder': 'Title of Research Project',
    'form.back': 'Back to Selection',
    
    // Categories
    'category.datenschutzkonzept': 'Data Protection Concept',
    'category.verantwortung': 'Assumption of Responsibility',
    'category.schulung_uni': 'University Training Certificate',
    'category.schulung_ukf': 'UKF Training Certificate',
    'category.einwilligung': 'Consent',
    'category.ethikvotum': 'Ethics Approval',
    'category.sonstiges': 'Other',
    
    // File Upload
    'upload.dropzone': 'Click here or drag files here',
    'upload.formats': 'PDF, DOC, DOCX, ZIP or other file formats',
    'upload.preview': 'Preview',
    'upload.close': 'Close',
    
    // Errors
    'error.title': 'Please fix the following errors:',
    'error.emailRequired': 'Email address is required',
    'error.emailInvalid': 'Please enter a valid email address',
    'error.titleRequired': 'Project title is required',
    'error.categoryRequired': 'is a required field',
    'error.uploadFailed': 'An error occurred during upload. Please try again.',
    
    // Submit
    'submit.filesReady': 'ready for upload',
    'submit.noFiles': 'No files selected',
    'submit.uploading': 'Uploading...',
    'submit.button': 'Submit Form and Upload Documents',
    'submit.confirmation': 'By submitting you confirm the accuracy of your information',
    'submit.file': 'file',
    'submit.files': 'files',
    
    // Confirmation
    'confirmation.success': 'Upload Completed Successfully!',
    'confirmation.message': 'Your documents have been successfully uploaded and stored in Hessenbox. A confirmation email has been sent to your email address.',
    'confirmation.details': 'Upload Details',
    'confirmation.projectTitle': 'Project Title',
    'confirmation.uploader': 'Uploader',
    'confirmation.email': 'Email Address',
    'confirmation.timestamp': 'Upload Time',
    'confirmation.documents': 'Uploaded Documents',
    'confirmation.emailNotification': 'Email Notification',
    'confirmation.emailSent': 'A confirmation email was sent to {email} with all details about your upload.',
    'confirmation.teamNotified': 'The Data Protection Team has also been informed about your upload and will review your documents promptly.',
    'confirmation.nextSteps': 'What happens next?',
    'confirmation.step1': 'The Data Protection Team reviews your uploaded documents',
    'confirmation.step2': 'You will be contacted by email if there are any questions',
    'confirmation.step3': 'You will receive approval after successful review',
    'confirmation.newUpload': 'Perform Another Upload',
    'confirmation.footer': 'If you have questions, please contact the Data Protection Team',
    'confirmation.institution': 'University of Frankfurt / University Hospital',
    
    // Common
    'common.back': 'Back',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('de');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
