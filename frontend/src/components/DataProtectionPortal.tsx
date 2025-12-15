import React from 'react';
import { Upload, Mail, FileText, AlertCircle, Info, ArrowLeft, ExternalLink } from 'lucide-react';
import { FileUploadSection } from './FileUploadSection';
import { ConfirmationPage } from './ConfirmationPage';
import { ProjectTypeSelection } from './ProjectTypeSelection';
import { ExistingProjectForm } from './ExistingProjectForm';
import { LanguageSwitch } from './LanguageSwitch';
import { PortalLogos } from './PortalLogos';
import { UploadProgress } from './UploadProgress';
import { useLanguage } from '../contexts/LanguageContext';
import { useDataProtectionWorkflow } from '../hooks/useDataProtectionWorkflow';
import { useState } from 'react';

export function DataProtectionPortal() {
  const { t } = useLanguage();
  
  const {
    // State
    currentStep,
    selectedInstitution,
    // selectedProjectType, // Not used directly in render
    email,
    uploaderName,
    projectTitle,
    projectDetails,
    isProspectiveStudy,
    isSubmitting,
    showSuccess,
    uploadTimestamp,
    errors,
    warnings,
    categories,
    
    // Setters
    setEmail,
    setUploaderName,
    setProjectTitle,
    setProjectDetails,
    setIsProspectiveStudy,
    
    // Handlers
    handleProjectTypeSelect,
    handleBackToProjectType,
    handleFilesAdded,
    handleFileRemoved,
    handleSubmit: originalHandleSubmit,
    handleNewUpload
  } = useDataProtectionWorkflow();

  const [localErrors, setLocalErrors] = useState<string[]>([]);

  const totalFiles = categories.reduce((sum, cat) => sum + cat.files.length, 0);

  // Institution name is now static/combined
  const institutionName = `${t('institution.university')} / ${t('institution.clinic')}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalErrors([]);
    originalHandleSubmit(e);
  };

  // If the upload was successful, show the confirmation page (for both new + existing flows)
  if (showSuccess) {
    const uploadedFiles = categories
      .filter(cat => cat.files.length > 0)
      .flatMap(cat =>
        cat.files.map(file => ({
          categoryKey: cat.key,
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

  // Render different steps
  if (currentStep === 'projectType') {
    return (
      <ProjectTypeSelection
        onSelect={handleProjectTypeSelect}
      />
    );
  }

  if (currentStep === 'existingProject') {
    return (
      <ExistingProjectForm
        institution={selectedInstitution!}
        onBack={handleBackToProjectType}
        email={email}
        setEmail={setEmail}
        uploaderName={uploaderName}
        setUploaderName={setUploaderName}
        projectTitle={projectTitle}
        setProjectTitle={setProjectTitle}
        projectDetails={projectDetails}
        setProjectDetails={setProjectDetails}
        categories={categories}
        onFilesAdded={handleFilesAdded}
        onFileRemoved={handleFileRemoved}
        onSubmit={originalHandleSubmit}
        isSubmitting={isSubmitting}
        errors={errors}
        warnings={warnings}
      />
    );
  }

  const allErrors = [...errors, ...localErrors];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6">
          <PortalLogos />
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
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex gap-3 mb-4">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-blue-900 mb-2">
                {t('form.info')}
              </p>
            </div>
          </div>
          
          <div className="border-t border-blue-200 pt-3 mt-2 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <a href="#" className="flex items-center gap-2 text-blue-700 hover:text-blue-900 hover:underline">
              <ExternalLink className="w-4 h-4" />
              {t('link.moodle')}
            </a>
            <a href="#" className="flex items-center gap-2 text-blue-700 hover:text-blue-900 hover:underline">
              <ExternalLink className="w-4 h-4" />
              {t('link.sop')}
            </a>
            <a href="#" className="flex items-center gap-2 text-blue-700 hover:text-blue-900 hover:underline">
              <ExternalLink className="w-4 h-4" />
              {t('link.research')}
            </a>
             <a href="mailto:datenschutz@uni-frankfurt.de" className="flex items-center gap-2 text-blue-700 hover:text-blue-900 hover:underline">
              <Mail className="w-4 h-4" />
              {t('link.email')}
            </a>
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
                <p className="text-sm text-gray-500 mt-1">{t('form.projectTitleHint')}</p>
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
                  <div key={category.key}>
                    <FileUploadSection
                      category={category}
                      isRequired={isRequired}
                      onFilesAdded={(files) => handleFilesAdded(category.key, files)}
                      onFileRemoved={(index) => handleFileRemoved(category.key, index)}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Fehler und Warnungen */}
          {allErrors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-red-900 mb-2">{t('error.title')}</p>
                  <ul className="list-disc list-inside space-y-1">
                    {allErrors.map((error, index) => (
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
                  <p className="text-yellow-900 mb-2">{t('common.warnings')}</p>
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
