import { FilePlus, FolderOpen } from 'lucide-react';
import { LanguageSwitch } from './LanguageSwitch';
import { useLanguage } from '../contexts/LanguageContext';

interface ProjectTypeSelectionProps {
  onSelect: (type: 'new' | 'existing') => void;
}

export function ProjectTypeSelection({ onSelect }: ProjectTypeSelectionProps) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Language Switch */}
        <div className="flex justify-end mb-6">
          <LanguageSwitch />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-gray-900 mb-2">{t('projectType.title')}</h1>
          <p className="text-gray-600">{t('institution.university')} / {t('institution.clinic')}</p>
        </div>

        {/* Project Type Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <h2 className="text-gray-900 mb-2 text-center">{t('projectType.question')}</h2>
          <p className="text-gray-600 text-center mb-8">
            {t('projectType.description')}
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Neues Projekt */}
            <button
              onClick={() => onSelect('new')}
              className="group relative bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-green-500 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-500 transition-colors">
                  <FilePlus className="w-10 h-10 text-green-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-gray-900 mb-2">{t('projectType.new')}</h3>
                <p className="text-gray-600">
                  {t('projectType.new.desc')}
                </p>
              </div>
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>

            {/* Bestehendes Projekt */}
            <button
              onClick={() => onSelect('existing')}
              className="group relative bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-blue-500 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors">
                  <FolderOpen className="w-10 h-10 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-gray-900 mb-2">{t('projectType.existing')}</h3>
                <p className="text-gray-600">
                  {t('projectType.existing.desc')}
                </p>
              </div>
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-900 text-sm">
            <span className="font-semibold">Hinweis:</span> {t('projectType.info')}
          </p>
        </div>
      </div>
    </div>
  );
}
