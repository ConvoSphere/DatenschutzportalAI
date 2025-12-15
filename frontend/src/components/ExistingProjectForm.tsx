import React from 'react';
import { ArrowLeft, AlertCircle, Upload, Mail, Info, ExternalLink } from 'lucide-react';
import { LanguageSwitch } from './LanguageSwitch';
import { PortalLogos } from './PortalLogos';
import { useLanguage } from '../contexts/LanguageContext';
import { Institution, FileCategory } from '../types';
import { FileUploadSection } from './FileUploadSection';
import { UploadProgress } from './UploadProgress';
import { useState } from 'react';

interface ExistingProjectFormProps {
  institution: Institution;
  onBack: () => void;
  
  // Hook props
  email: string;
  setEmail: (email: string) => void;
  uploaderName: string;
  setUploaderName: (name: string) => void;
  projectTitle: string;
  setProjectTitle: (title: string) => void;
  projectDetails: string;
  setProjectDetails: (details: string) => void;
  categories: FileCategory[];
  onFilesAdded: (key: string, files: File[]) => void;
  onFileRemoved: (key: string, index: number) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  errors: string[];
  warnings: string[];
}

export function ExistingProjectForm({ 
  institution, 
  onBack,
  email,
  setEmail,
  uploaderName,
  setUploaderName,
  projectTitle,
  setProjectTitle,
  projectDetails,
  setProjectDetails,
  categories,
  onFilesAdded,
  onFileRemoved,
  onSubmit: originalOnSubmit,
  isSubmitting,
  errors,
  warnings
}: ExistingProjectFormProps) {
  const { t } = useLanguage();

  const [localErrors, setLocalErrors] = useState<string[]>([]);

  const institutionName = `${t('institution.university')} / ${t('institution.clinic')}`;

  const totalFiles = categories.reduce((sum, cat) => sum + cat.files.length, 0);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalErrors([]);
    originalOnSubmit(e);
  };

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
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t('existingProject.back')}</span>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-gray-900 mb-2">{t('existingProject.title')}</h1>
          {/* Note: Institution name is shown but selection is disabled/hidden in previous steps as per flow */}
          <p className="text-gray-600">{institutionName}</p>
        </div>

        {/* Warning Box */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div className="flex gap-4">
                <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0" />
                <div>
                    <h3 className="text-red-900 font-bold mb-2">{t('existingProject.infoTitle')}</h3>
                    <p className="text-red-800 font-bold">
                        {t('existingProject.warning')}
                    </p>
                    <a href="#" className="text-red-700 underline mt-2 block hover:text-red-900">
                        {t('existingProject.moreInfo')}
                    </a>
                </div>
            </div>
        </div>

        {/* Templates Link */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <a href="#" className="flex items-center gap-2 text-blue-700 hover:text-blue-900 hover:underline">
              <ExternalLink className="w-4 h-4" />
              {t('existingProject.templates')}
            </a>
        </div>

        <form onSubmit={onSubmit}>
          {/* Form Fields */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
            <h2 className="text-gray-900 mb-6">{t('form.baseData')}</h2>
            
            <div className="space-y-6">
                {/* Project Title */}
                <div>
                    <label htmlFor="projectTitle" className="block text-gray-700 font-medium mb-2">
                        {t('form.projectTitle')} <span className="text-red-500">{t('form.required')}</span>
                    </label>
                    <input
                        type="text"
                        id="projectTitle"
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={t('form.titlePlaceholder')}
                        required
                    />
                     <p className="text-sm text-gray-500 mt-1">{t('form.projectTitleHint')}</p>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                    {t('form.email')} <span className="text-red-500">{t('form.required')}</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={t('form.emailPlaceholder')}
                      required
                    />
                  </div>
                </div>

                {/* Submitter Name */}
                <div>
                  <label htmlFor="uploaderName" className="block text-gray-700 font-medium mb-2">
                    {t('form.uploaderName')}
                  </label>
                  <input
                    type="text"
                    id="uploaderName"
                    value={uploaderName}
                    onChange={(e) => setUploaderName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t('form.namePlaceholder')}
                  />
                </div>

                {/* Project Details (Large Text Area) */}
                <div>
                    <label htmlFor="projectDetails" className="block text-gray-700 font-medium mb-2">
                        {t('existingProject.projectDetails')} <span className="text-red-500">{t('form.required')}</span>
                    </label>
                    <textarea
                        id="projectDetails"
                        value={projectDetails}
                        onChange={(e) => setProjectDetails(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[150px]"
                        placeholder={t('existingProject.projectDetailsPlaceholder')}
                        required
                    />
                </div>
            </div>
          </div>

          {/* File Uploads */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
            <h2 className="text-gray-900 mb-6">{t('form.documents')}</h2>
            
            <div className="space-y-6">
              {categories.map((category) => {
                const isRequired = category.required; 
                
                return (
                  <div key={category.key}>
                      {category.key === 'sonstiges' && (
                          <div className="mb-2 text-sm text-gray-600 bg-gray-50 p-3 rounded border border-gray-200">
                              <Info className="w-4 h-4 inline-block mr-1 text-blue-500" />
                              {t('category.sonstiges.desc')}
                          </div>
                      )}
                      <FileUploadSection
                        category={category}
                        isRequired={isRequired}
                        onFilesAdded={(files) => onFilesAdded(category.key, files)}
                        onFileRemoved={(index) => onFileRemoved(category.key, index)}
                      />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Errors and Warnings */}
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
