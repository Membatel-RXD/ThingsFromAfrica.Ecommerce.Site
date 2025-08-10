import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import AppLayout from '@/components/AppLayout';
import { CraftType } from '@/models/members';
import { apiService, IAPIResponse } from '@/lib/api';
import { Hammer, Palette, Scissors, Zap, Package, Gem } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const fetchCraftTypes = async (): Promise<CraftType[]> => {
  try {
      const response = await apiService.get<IAPIResponse<CraftType[]>>('CraftTypes/GetAll');
      return response.payload || [];
  } catch (error) {
    throw new Error('Failed to fetch craft types');
  }
};

const OurCrafts: React.FC = () => {
  const { t, currentLanguage } = useLanguage();
  const [lang, setLang] = useState(currentLanguage);
  
  useEffect(() => {
    setLang(currentLanguage);
  }, [currentLanguage]);
  
  useEffect(() => {
    const handleStorageChange = () => {
      const newLang = localStorage.getItem('selectedLanguage') || 'en';
      if (newLang !== lang) {
        setLang(newLang);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    const interval = setInterval(() => {
      const currentLang = localStorage.getItem('selectedLanguage') || 'en';
      if (currentLang !== lang) {
        setLang(currentLang);
      }
    }, 50);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [lang]);

  const { data: craftTypes = [], isLoading, error } = useQuery({
    queryKey: ['craftTypes'],
    queryFn: fetchCraftTypes
  });

  const getIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('wood')) return Hammer;
    if (lowerName.includes('pottery') || lowerName.includes('ceramic')) return Palette;
    if (lowerName.includes('textile') || lowerName.includes('weaving')) return Scissors;
    if (lowerName.includes('basket')) return Package;
    if (lowerName.includes('jewelry') || lowerName.includes('bead')) return Gem;
    if (lowerName.includes('stone')) return Zap;
    return Palette;
  };

  const getColors = (index: number) => {
    const colors = [
      { bg: 'from-amber-50 to-orange-100', border: 'border-amber-200 hover:border-amber-400' },
      { bg: 'from-red-50 to-rose-100', border: 'border-red-200 hover:border-red-400' },
      { bg: 'from-blue-50 to-indigo-100', border: 'border-blue-200 hover:border-blue-400' },
      { bg: 'from-green-50 to-emerald-100', border: 'border-green-200 hover:border-green-400' },
      { bg: 'from-purple-50 to-violet-100', border: 'border-purple-200 hover:border-purple-400' },
      { bg: 'from-gray-50 to-slate-100', border: 'border-gray-200 hover:border-gray-400' }
    ];
    return colors[index % colors.length];
  };

  return (
    <AppLayout>
      <div key={lang} className="bg-[#F8F4EF]">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white py-12 overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'2\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {t('page.crafts.title')}
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-6 leading-relaxed">
                {t('page.crafts.subtitle')}
              </p>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                  {t('page.crafts.authentic')}
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  {t('page.crafts.sustainable')}
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  {t('page.crafts.heritage')}
                </span>
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          {isLoading && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4 animate-pulse">
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              </div>
              <p className="text-lg text-gray-600">{t('page.crafts.loading')}</p>
            </div>
          )}
          
          {error && (
            <div className="text-center py-8 mb-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-red-800 font-medium">{t('page.crafts.error')}</p>
                <p className="text-red-600 text-sm mt-1">{t('page.crafts.tryAgain')}</p>
              </div>
            </div>
          )}
          
          {/* Crafts Grid */}
          {!isLoading && craftTypes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {craftTypes.filter(craft => craft.isActive).map((craft, index) => {
                const colors = getColors(index);
                const IconComponent = getIcon(craft.craftTypeName);
                
                return (
                  <div 
                    key={craft.craftTypeId} 
                    className={`group relative bg-gradient-to-br ${colors.bg} rounded-2xl border-2 ${colors.border} transition-all duration-500 hover:shadow-2xl hover:scale-105 overflow-hidden`}
                  >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-4 right-4 transform rotate-12 group-hover:rotate-45 transition-transform duration-700">
                        <IconComponent className="h-16 w-16 text-gray-400" />
                      </div>
                      <div className="absolute bottom-4 left-4 w-20 h-20 bg-white/20 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                    </div>
                    
                    {/* Content */}
                    <div className="relative z-10 p-8">
                      <div className="flex items-center mb-4">
                        <div className="mr-4 group-hover:scale-110 transition-transform duration-300">
                          <IconComponent className="h-10 w-10 text-gray-700" />
                        </div>
                        <div className="w-12 h-1 bg-black/20 rounded-full group-hover:w-16 transition-all duration-300"></div>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors">
                        {craft.craftTypeName}
                      </h3>
                      
                      <p className="text-gray-700 leading-relaxed mb-6 group-hover:text-gray-800 transition-colors">
                        {craft.craftTypeDescription}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <button className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors duration-300 text-sm font-medium">
                          {t('page.crafts.explore')}
                        </button>
                        <div className="text-xs text-gray-500 bg-white/50 px-3 py-1 rounded-full">
                          {t('page.crafts.traditional')}
                        </div>
                      </div>
                    </div>
                    
                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                );
              })
              }
            </div>
           
          )}
          
          {/* Empty State */}
          {!isLoading && !error && craftTypes.length === 0 && (
            <div className="text-center py-16">
              <Palette className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('page.crafts.noCrafts')}</h3>
              <p className="text-gray-600">{t('page.crafts.checkBack')}</p>
            </div>
          )}
          
          {/* Bottom Section */}
          <div className="mt-20 text-center">
            <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-12 border border-gray-200">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {t('page.crafts.preserving')}
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
                {t('page.crafts.preservingText')}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="bg-white rounded-lg px-6 py-3 border border-gray-200 shadow-sm">
                  <span className="text-2xl font-bold text-gray-900">10+</span>
                  <p className="text-sm text-gray-600">{t('page.crafts.skilledArtisans')}</p>
                </div>
                <div className="bg-white rounded-lg px-6 py-3 border border-gray-200 shadow-sm">
                  <span className="text-2xl font-bold text-gray-900">50+</span>
                  <p className="text-sm text-gray-600">{t('page.crafts.yearsOfTradition')}</p>
                </div>
                <div className="bg-white rounded-lg px-6 py-3 border border-gray-200 shadow-sm">
                  <span className="text-2xl font-bold text-gray-900">100%</span>
                  <p className="text-sm text-gray-600">{t('page.crafts.authenticHandmade')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      
    </AppLayout>
  );
};

export default OurCrafts;