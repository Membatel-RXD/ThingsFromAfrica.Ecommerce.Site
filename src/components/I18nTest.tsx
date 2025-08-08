import React from 'react';
import { useTranslation } from 'react-i18next';

const I18nTest: React.FC = () => {
  const { t, i18n } = useTranslation();

  return (
    <div className="p-4 border border-red-500 m-4">
      <h3>I18n Test Component</h3>
      <p>Current language: {i18n.language}</p>
      <p>Is initialized: {i18n.isInitialized ? 'Yes' : 'No'}</p>
      <p>Nav home: {t('nav.home')}</p>
      <p>Pages about title: {t('pages.about.title')}</p>
      <button onClick={() => i18n.changeLanguage('es')}>Switch to Spanish</button>
    </div>
  );
};

export default I18nTest;