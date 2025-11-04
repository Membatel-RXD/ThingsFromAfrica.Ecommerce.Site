import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Award, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const HeroSection = () => {
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleLanguageChange = (lng) => {
      setLang(lng);
    };
    
    i18n.on('languageChanged', handleLanguageChange);
    
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const parallaxOffset = scrollY * 0.5;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute w-96 h-96 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-full blur-3xl"
          style={{
            top: '10%',
            left: '5%',
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02 - parallaxOffset}px)`
          }}
        />
        <div 
          className="absolute w-96 h-96 bg-gradient-to-br from-red-400/20 to-pink-400/20 rounded-full blur-3xl"
          style={{
            bottom: '10%',
            right: '5%',
            transform: `translate(${-mousePosition.x * 0.02}px, ${-mousePosition.y * 0.02 - parallaxOffset}px)`
          }}
        />
        
        {/* Decorative patterns */}
        <div className="absolute top-20 right-20 w-32 h-32 opacity-10">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <pattern id="pattern1" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="2" fill="currentColor" />
            </pattern>
            <rect width="100" height="100" fill="url(#pattern1)" />
          </svg>
        </div>
        <div className="absolute bottom-40 left-20 w-24 h-24 opacity-10">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <pattern id="pattern2" x="0" y="0" width="25" height="25" patternUnits="userSpaceOnUse">
              <path d="M12.5 0 L12.5 25 M0 12.5 L25 12.5" stroke="currentColor" strokeWidth="2" />
            </pattern>
            <rect width="100" height="100" fill="url(#pattern2)" />
          </svg>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-6 pt-20 pb-32">
        <div className="max-w-6xl mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-8 animate-fadeIn">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-amber-200">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium text-gray-800">Handcrafted with Heritage</span>
            </div>
          </div>

          {/* Main headline */}
          <div className="text-center mb-8">
            <h1 className="text-6xl lg:text-8xl font-bold mb-6 leading-tight">
              <span className="inline-block bg-gradient-to-r from-black via-gray-800 to-gray-600 bg-clip-text text-transparent animate-fadeIn">
                {t('pages.home.authentic')}
              </span>
              <br />
              <span className="inline-block text-gray-900 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
                {t('pages.home.africanCrafts')}
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-700 mb-10 max-w-3xl mx-auto leading-relaxed animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              {t('pages.home.heroDescription')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
              <Link
                to="/crafts"
                className="group relative px-8 py-4 bg-black text-white font-semibold rounded-full overflow-hidden transition-all hover:shadow-2xl hover:scale-105 inline-flex items-center justify-center"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {t('pages.home.exploreCrafts')}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              
              <Link
                to="/artisan-stories"
                className="px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-900 font-semibold rounded-full border-2 border-gray-900 hover:bg-gray-900 hover:text-white transition-all hover:scale-105 inline-flex items-center justify-center"
              >
                {t('pages.home.readStories')}
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-fadeIn" style={{ animationDelay: '0.4s' }}>
              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all hover:scale-105 border border-amber-100">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">500+</div>
                <div className="text-gray-600 font-medium">{t('pages.home.uniqueCrafts')}</div>
              </div>

              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all hover:scale-105 border border-orange-100">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">50+</div>
                <div className="text-gray-600 font-medium">{t('pages.home.masterArtisans')}</div>
              </div>

              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all hover:scale-105 border border-red-100">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">25+</div>
                <div className="text-gray-600 font-medium">{t('pages.home.yearsHeritage')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full h-auto">
          <path
            fill="#ffffff"
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          />
        </svg>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default HeroSection;