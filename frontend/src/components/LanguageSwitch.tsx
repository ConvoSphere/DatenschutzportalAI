import { Languages } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function LanguageSwitch() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
      <Languages className="w-4 h-4 text-gray-500 ml-2" />
      <button
        onClick={() => setLanguage('de')}
        className={`px-3 py-1 rounded text-sm transition-colors ${
          language === 'de'
            ? 'bg-blue-600 text-white'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        DE
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 rounded text-sm transition-colors ${
          language === 'en'
            ? 'bg-blue-600 text-white'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        EN
      </button>
    </div>
  );
}
