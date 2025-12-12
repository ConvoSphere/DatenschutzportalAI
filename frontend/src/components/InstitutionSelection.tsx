import { Building2, Hospital } from 'lucide-react';
import { LanguageSwitch } from './LanguageSwitch';
import { useLanguage } from '../contexts/LanguageContext';
import { Institution } from '../types';

interface InstitutionSelectionProps {
  onSelect: (institution: Institution) => void;
}

export function InstitutionSelection({ onSelect }: InstitutionSelectionProps) {
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
          <h1 className="text-gray-900 mb-2">{t('institution.title')}</h1>
          <p className="text-gray-600">
            {t('institution.subtitle')}
          </p>
        </div>

        {/* Institution Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <h2 className="text-gray-900 mb-2 text-center">{t('institution.question')}</h2>
          <p className="text-gray-600 text-center mb-8">
            {t('institution.description')}
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Universität Frankfurt */}
            <button
              onClick={() => onSelect('university')}
              className="group relative bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-blue-500 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors">
                  <Building2 className="w-10 h-10 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-gray-900 mb-2">{t('institution.university')}</h3>
                <p className="text-gray-600">
                  {t('institution.university.desc')}
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

            {/* Universitätsklinikum */}
            <button
              onClick={() => onSelect('clinic')}
              className="group relative bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-blue-500 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors">
                  <Hospital className="w-10 h-10 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-gray-900 mb-2">{t('institution.clinic')}</h3>
                <p className="text-gray-600">
                  {t('institution.clinic.desc')}
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

        {/* Footer Info */}
        <div className="text-center text-gray-500 text-sm">
          <p>{t('institution.footer')}</p>
        </div>
      </div>
    </div>
  );
}