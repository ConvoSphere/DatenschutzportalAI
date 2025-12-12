import { useState } from 'react';
import { Search, ArrowLeft, AlertCircle } from 'lucide-react';
import { LanguageSwitch } from './LanguageSwitch';
import { useLanguage } from '../contexts/LanguageContext';

interface ExistingProjectFormProps {
  institution: 'university' | 'clinic';
  onBack: () => void;
}

export function ExistingProjectForm({ institution, onBack }: ExistingProjectFormProps) {
  const [projectId, setProjectId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');
  const { t } = useLanguage();

  const institutionName = institution === 'university' 
    ? t('institution.university')
    : t('institution.clinic');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectId.trim()) {
      setError(t('error.titleRequired'));
      return;
    }

    setIsSearching(true);
    setError('');

    try {
      // Mock API Call - In production würde dies gegen FastAPI Backend gehen
      await new Promise(resolve => setTimeout(resolve, 1500));

      /*
       * BACKEND INTEGRATION HINWEISE:
       * 
       * GET /api/projects/search?query={projectId} endpoint sollte:
       * 1. Nach Projekt-ID oder Projekttitel suchen
       * 2. Projektdetails und bisherige Uploads zurückgeben
       * 3. Authentifizierung prüfen
       * 
       * Beispiel:
       * const response = await fetch(`/api/projects/search?query=${encodeURIComponent(projectId)}`);
       * const result = await response.json();
       * if (response.ok) {
       *   // Zu Upload-Formular mit vorausgefüllten Daten navigieren
       * } else {
       *   setError('Projekt nicht gefunden');
       * }
       */

      // Mock: Projekt nicht gefunden
      setError(t('existingProject.notFound'));
    } catch (error) {
      setError(t('existingProject.error'));
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Language Switch */}
        <div className="flex justify-end mb-6">
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
          <p className="text-gray-600">{institutionName}</p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <h2 className="text-gray-900 mb-4">{t('existingProject.search')}</h2>
          
          <form onSubmit={handleSearch}>
            <div className="mb-4">
              <label htmlFor="projectId" className="block text-gray-700 mb-2">
                {t('existingProject.label')}
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="projectId"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('existingProject.placeholder')}
                />
              </div>
              <p className="text-gray-500 text-sm mt-2">
                {t('existingProject.hint')}
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-800">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSearching}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              {isSearching ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{t('existingProject.searching')}</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>{t('existingProject.searchButton')}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-blue-900 mb-2">{t('existingProject.infoTitle')}</h3>
          <ul className="space-y-2 text-blue-800 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>{t('existingProject.info1')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>{t('existingProject.info2')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>{t('existingProject.info3')}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}