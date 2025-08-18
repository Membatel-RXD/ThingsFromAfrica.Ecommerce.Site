import React, { useState, useEffect } from 'react';
import { ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const HeroSection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language);
  
  useEffect(() => {
    const handleLanguageChange = (lng) => {
      setLang(lng);
    };
    
    i18n.on('languageChanged', handleLanguageChange);
    
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  return (
    <div className="min-h-[40em] bg-white flex items-start justify-center pt-4">
      <div className="text-center">
        <div className="max-w-6xl">
          <h1 className="text-6xl lg:text-8 font-bold mb-5 text-black">
            {t('pages.home.authentic')}
            <br />
            <span className="bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">
              {t('pages.home.africanCrafts')}
            </span>
          </h1>
          
          <p className="text-xl lg:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
            {t('pages.home.heroDescription')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4 px-5">
            <Link
              to="/crafts"
              className="btn btn-lg bg-black text-white border-none hover:bg-gray-800">
              {t('pages.home.exploreCrafts')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            
            <Link
              to="/artisan-stories"
              className="btn btn-lg btn-outline border-black text-black hover:bg-black hover:text-white"
            >
              {t('pages.home.readStories')}
            </Link>
          </div>
          
          <div className="stats stats-horizontal shadow-2xl bg-white border border-gray-200">
            <div className="stat">
              <div className="stat-value text-black">500+</div>
              <div className="stat-title text-gray-600">{t('pages.home.uniqueCrafts')}</div>
            </div>
            <div className="stat">
              <div className="stat-value text-black">50+</div>
              <div className="stat-title text-gray-600">{t('pages.home.masterArtisans')}</div>
            </div>
            <div className="stat">
              <div className="stat-value text-black">25+</div>
              <div className="stat-title text-gray-600">{t('pages.home.yearsHeritage')}</div>
            </div>
          </div>
          


        </div>
      </div>
    </div>
  );
};

export default HeroSection;