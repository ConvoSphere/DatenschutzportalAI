import { useState } from 'react';
import { Upload, Mail, FileText, AlertCircle, Info, ArrowLeft } from 'lucide-react';
import { FileUploadSection } from './FileUploadSection';
import { ConfirmationPage } from './ConfirmationPage';
import { InstitutionSelection } from './InstitutionSelection';
import { ProjectTypeSelection } from './ProjectTypeSelection';
import { ExistingProjectForm } from './ExistingProjectForm';
import { LanguageSwitch } from './LanguageSwitch';
import { UploadProgress } from './UploadProgress';
import { useLanguage } from '../contexts/LanguageContext';

interface FileCategory {
  key: string;
  label: string;
  required: boolean;
  conditionalRequired?: boolean;
  files: File[];
}

type WorkflowStep = 'institution' | 'projectType' | 'form' | 'existingProject' | 'confirmation';
type Institution = 'university' | 'clinic' | null;
type ProjectType = 'new' | 'existing' | null;

export function DataProtectionPortal() {
  const { t } = useLanguage();

  // Workflow state
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('institution');
  const [selectedInstitution, setSelectedInstitution] = useState<Institution>(null);
  const [selectedProjectType, setSelectedProjectType] = useState<ProjectType>(null);

  // Form state
  const [email, setEmail] = useState('');
  const [uploaderName, setUploaderName] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [isProspectiveStudy, setIsProspectiveStudy] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploadTimestamp, setUploadTimestamp] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);

  const [categories, setCategories] = useState<FileCategory[]>([
    { key: 'datenschutzkonzept', label: 'Datenschutzkonzept', required: true, files: [] },
    { key: 'verantwortung', label: 'Übernahme der Verantwortung', required: true, files: [] },
    { key: 'schulung_uni', label: 'Schulung Uni Nachweis', required: true, files: [] },
    { key: 'schulung_ukf', label: 'Schulung UKF Nachweis', required: true, files: [] },
    { key: 'einwilligung', label: 'Einwilligung', required: false, conditionalRequired: true, files: [] },
    { key: 'ethikvotum', label: 'Ethikvotum', required: false, files: [] },
    { key: 'sonstiges', label: 'Sonstiges', required: false, files: [] },
  ]);

  // Workflow handlers
  const handleInstitutionSelect = (institution: Institution) => {
    setSelectedInstitution(institution);
    setCurrentStep('projectType');
  };

  const handleProjectTypeSelect = (type: ProjectType) => {
    setSelectedProjectType(type);
    if (type === 'new') {
      setCurrentStep('form');
    } else {
      setCurrentStep('existingProject');
    }
  };

  const handleBackToInstitution = () => {
    setCurrentStep('institution');
    setSelectedInstitution(null);
    setSelectedProjectType(null);
  };

  const handleBackToProjectType = () => {
    setCurrentStep('projectType');
    setSelectedProjectType(null);
  };

  const handleFilesAdded = (categoryKey: string, newFiles: File[]) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.key === categoryKey
          ? { ...cat, files: [...cat.files, ...newFiles] }
          : cat
      )
    );
  };

  const handleFileRemoved = (categoryKey: string, fileIndex: number) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.key === categoryKey
          ? { ...cat, files: cat.files.filter((_, i) => i !== fileIndex) }
          : cat
      )
    );
  };

  const validateForm = (): boolean => {
    const newErrors: string[] = [];
    const newWarnings: string[] = [];

    // Pflichtfelder prüfen
    if (!email.trim()) {
      newErrors.push('E-Mail-Adresse ist erforderlich');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.push('Bitte geben Sie eine gültige E-Mail-Adresse ein');
    }

    if (!projectTitle.trim()) {
      newErrors.push('Projekttitel ist erforderlich');
    }

    // Kategorien prüfen
    categories.forEach(cat => {
      const isRequired = cat.required || (cat.conditionalRequired && isProspectiveStudy);
      
      if (isRequired && cat.files.length === 0) {
        newErrors.push(`${cat.label} ist ein Pflichtfeld`);
      }
    });

    setErrors(newErrors);
    setWarnings(newWarnings);

    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Mock API Call - In production würde dies gegen FastAPI Backend gehen
      const formData = new FormData();
      formData.append('email', email);
      formData.append('uploader_name', uploaderName);
      formData.append('project_title', projectTitle);
      formData.append('is_prospective_study', String(isProspectiveStudy));
      const timestamp = new Date().toISOString();
      formData.append('upload_timestamp', timestamp);

      // Alle Dateien mit Kategorie-Tags hinzufügen
      categories.forEach(cat => {
        cat.files.forEach((file, index) => {
          formData.append(`files_${cat.key}`, file);
        });
      });

      // Mock Upload mit simulierter Verzögerung
      await new Promise(resolve => setTimeout(resolve, 2000));

      /*
       * BACKEND INTEGRATION HINWEISE:
       * 
       * POST /api/upload endpoint sollte:
       * 1. Dateien in Hessenbox hochladen
       * 2. Eindeutige Upload-ID/Tag generieren
       * 3. E-Mail an Uploader senden
       * 4. E-Mail an vordefinierte Adresse senden
       * 5. Metadaten speichern
       * 
       * Beispiel:
       * const response = await fetch('/api/upload', {
       *   method: 'POST',
       *   body: formData,
       * });
       * 
       * const result = await response.json();
       * if (!response.ok) throw new Error(result.message);
       */

      console.log('Upload erfolgreich (Mock)', {
        email,
        uploaderName,
        projectTitle,
        isProspectiveStudy,
        fileCount: categories.reduce((sum, cat) => sum + cat.files.length, 0),
      });

      setUploadTimestamp(timestamp);
      setShowSuccess(true);

    } catch (error) {
      setErrors(['Ein Fehler ist beim Upload aufgetreten. Bitte versuchen Sie es erneut.']);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewUpload = () => {
    setEmail('');
    setUploaderName('');
    setProjectTitle('');
    setIsProspectiveStudy(false);
    setCategories(prev => prev.map(cat => ({ ...cat, files: [] })));
    setShowSuccess(false);
    setUploadTimestamp('');
    setErrors([]);
    setWarnings([]);
    setCurrentStep('institution');
    setSelectedInstitution(null);
    setSelectedProjectType(null);
  };

  const totalFiles = categories.reduce((sum, cat) => sum + cat.files.length, 0);

  const institutionName = selectedInstitution === 'university' 
    ? 'Universität Frankfurt' 
    : selectedInstitution === 'clinic'
    ? 'Universitätsklinikum Frankfurt'
    : '';

  // Render different steps
  if (currentStep === 'institution') {
    return <InstitutionSelection onSelect={handleInstitutionSelect} />;
  }

  if (currentStep === 'projectType') {
    return (
      <ProjectTypeSelection
        institution={selectedInstitution!}
        onSelect={handleProjectTypeSelect}
        onBack={handleBackToInstitution}
      />
    );
  }

  if (currentStep === 'existingProject') {
    return (
      <ExistingProjectForm
        institution={selectedInstitution!}
        onBack={handleBackToProjectType}
      />
    );
  }

  // Wenn Upload erfolgreich war, zeige Bestätigungsseite
  if (showSuccess) {
    const uploadedFiles = categories
      .filter(cat => cat.files.length > 0)
      .flatMap(cat =>
        cat.files.map(file => ({
          category: cat.label,
          fileName: file.name,
        }))
      );

    return (
      <ConfirmationPage
        email={email}
        uploaderName={uploaderName}
        projectTitle={projectTitle}
        uploadedFiles={uploadedFiles}
        uploadTimestamp={uploadTimestamp}
        onNewUpload={handleNewUpload}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Language Switch */}
        <div className="flex justify-end mb-6">
          <LanguageSwitch />
        </div>

        {/* Back Button */}
        <button
          onClick={handleBackToProjectType}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t('form.back')}</span>
        </button>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-gray-900">{t('form.title')}</h1>
              <p className="text-gray-600">{institutionName}</p>
            </div>
          </div>
        </div>

        {/* Informationsbox */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-blue-900">
              {t('form.info')}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Basisdaten */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-gray-900 mb-4">{t('form.baseData')}</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-gray-700 mb-2">
                  {t('form.email')} <span className="text-red-500">{t('form.required')}</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t('form.emailPlaceholder')}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="uploaderName" className="block text-gray-700 mb-2">
                  {t('form.uploaderName')}
                </label>
                <input
                  type="text"
                  id="uploaderName"
                  value={uploaderName}
                  onChange={(e) => setUploaderName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('form.namePlaceholder')}
                />
              </div>

              <div>
                <label htmlFor="projectTitle" className="block text-gray-700 mb-2">
                  {t('form.projectTitle')} <span className="text-red-500">{t('form.required')}</span>
                </label>
                <input
                  type="text"
                  id="projectTitle"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('form.titlePlaceholder')}
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="prospectiveStudy"
                  checked={isProspectiveStudy}
                  onChange={(e) => setIsProspectiveStudy(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="prospectiveStudy" className="text-gray-700">
                  {t('form.prospectiveStudy')}
                </label>
              </div>
            </div>
          </div>

          {/* Dokumente Upload */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-gray-900 mb-4">{t('form.documents')}</h2>
            
            <div className="space-y-4">
              {categories.map((category) => {
                const isRequired = category.required || (category.conditionalRequired && isProspectiveStudy);
                
                return (
                  <FileUploadSection
                    key={category.key}
                    category={category}
                    isRequired={isRequired}
                    onFilesAdded={(files) => handleFilesAdded(category.key, files)}
                    onFileRemoved={(index) => handleFileRemoved(category.key, index)}
                  />
                );
              })}
            </div>
          </div>

          {/* Fehler und Warnungen */}
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-red-900 mb-2">{t('error.title')}</p>
                  <ul className="list-disc list-inside space-y-1">
                    {errors.map((error, index) => (
                      <li key={index} className="text-red-800">{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {warnings.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-yellow-900 mb-2">Warnungen:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {warnings.map((warning, index) => (
                      <li key={index} className="text-yellow-800">{warning}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-gray-600">
                {totalFiles > 0 ? (
                  <span>{totalFiles} {totalFiles === 1 ? t('submit.file') : t('submit.files')} {t('submit.filesReady')}</span>
                ) : (
                  <span>{t('submit.noFiles')}</span>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-md hover:shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{t('submit.uploading')}</span>
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  <span>{t('submit.button')}</span>
                </>
              )}
            </button>
            
            <p className="text-gray-500 text-sm text-center mt-3">
              {t('submit.confirmation')}
            </p>
          </div>
        </form>

        {/* Upload Progress */}
        <UploadProgress isUploading={isSubmitting} filesCount={totalFiles} />
      </div>
    </div>
  );
}