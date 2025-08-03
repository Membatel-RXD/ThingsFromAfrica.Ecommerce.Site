import React from 'react';
import { useTranslation } from 'react-i18next';

// Example component showing how to use translations
const LanguageExample: React.FC = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">{t('nav.home')}</h2>
      <p className="mb-4">{t('nav.welcome')}</p>
      
      {/* Language switcher buttons */}
      <div className="flex gap-2 mb-4">
        <button 
          onClick={() => changeLanguage('en')}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          English
        </button>
        <button 
          onClick={() => changeLanguage('es')}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          Español
        </button>
        <button 
          onClick={() => changeLanguage('fr')}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          Français
        </button>
        <button 
          onClick={() => changeLanguage('it')}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          Italiano
        </button>
        <button 
          onClick={() => changeLanguage('sw')}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          Kiswahili
        </button>
      </div>

      <p>Current language: {i18n.language}</p>
    </div>
  );
};

export default LanguageExample;