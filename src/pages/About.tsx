import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Users, Award, Leaf, Home, Globe, Sprout } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const AboutContent: React.FC = () => {
  const { t } = useLanguage();
  const [lang, setLang] = useState(localStorage.getItem('selectedLanguage') || 'en');
  
  useEffect(() => {
    const handleStorageChange = () => {
      setLang(localStorage.getItem('selectedLanguage') || 'en');
    };
    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(() => {
      const currentLang = localStorage.getItem('selectedLanguage') || 'en';
      if (currentLang !== lang) {
        setLang(currentLang);
      }
    }, 100);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [lang]);
  
  const values = [
    {
      icon: <Award className="h-5 w-5" />,
      label: t('page.about.authenticity'),
      color: 'bg-gray-100 text-black'
    },
    {
      icon: <Heart className="h-5 w-5" />,
      label: t('page.about.quality'),
      color: 'bg-gray-100 text-black'
    },
    {
      icon: <Users className="h-5 w-5" />,
      label: t('page.about.community'),
      color: 'bg-gray-100 text-black'
    },
    {
      icon: <Leaf className="h-5 w-5" />,
      label: t('page.about.sustainability'),
      color: 'bg-gray-100 text-black'
    }
  ];

  const stats = [
    { number: '10+', label: t('page.about.artisans') },
    { number: '15', label: t('page.about.regions') },
    { number: '2015', label: t('page.about.founded') },
    { number: '20+', label: t('page.about.customers') }
  ];

  return (
    <div key={lang} className="min-h-screen bg-[#F8F4EF]">
      
      <main className="container mx-auto px-4 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">{t('page.about.title')}</h1>
          <p className="text-gray-700">{t('page.about.subtitle')}</p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, index) => (
            <Card key={index} className="border-gray-200 text-center">
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-black mb-1">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mission Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-3xl font-bold text-black mb-6">{t('page.about.mission')}</h2>
            <p className="text-gray-700 mb-4">
              {t('page.about.missionText1')}
            </p>
            <p className="text-gray-700 mb-6">
              {t('page.about.missionText2')}
            </p>
            <Button className="bg-black hover:bg-gray-800">
              {t('page.about.meetArtisans')}
            </Button>
          </div>
          
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-black mb-4">{t('page.about.values')}</h3>
              <div className="grid grid-cols-2 gap-3">
                {values.map((value, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className={`${value.color} flex items-center gap-2 justify-center py-2`}
                  >
                    {value.icon}
                    {value.label}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Story Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-black text-center mb-8">{t('page.about.story')}</h2>
          <Card className="border-gray-200">
            <CardContent className="p-8">
              <div className="space-y-6 text-gray-700">
                <p>
                  {t('page.about.storyText1')}
                </p>
                <p>
                  {t('page.about.storyText2')}
                </p>
                <p>
                  {t('page.about.storyText3')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Impact Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4 flex justify-center">
                <Home className="h-12 w-12 text-black" />
              </div>
              <h3 className="font-bold text-black text-lg mb-2">{t('page.about.communityImpact')}</h3>
              <p className="text-gray-700 text-sm">{t('page.about.communityText')}</p>
            </CardContent>
          </Card>

          <Card className="border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4 flex justify-center">
                <Globe className="h-12 w-12 text-black" />
              </div>
              <h3 className="font-bold text-black text-lg mb-2">{t('page.about.globalReach')}</h3>
              <p className="text-gray-700 text-sm">{t('page.about.globalText')}</p>
            </CardContent>
          </Card>

          <Card className="border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4 flex justify-center">
                <Sprout className="h-12 w-12 text-black" />
              </div>
              <h3 className="font-bold text-black text-lg mb-2">{t('page.about.sustainableFuture')}</h3>
              <p className="text-gray-700 text-sm">{t('page.about.sustainableText')}</p>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <Card className="border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-black mb-4">{t('page.about.joinJourney')}</h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              {t('page.about.joinText')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-black hover:bg-gray-800">
                {t('page.about.shopCrafts')}
              </Button>
              <Button variant="outline" className="border-black text-black hover:bg-black hover:text-white">
                {t('page.about.learnMore')}
              </Button>
            </div>
          </CardContent>
        </Card>
        </main>
        </div>
  );
};

const About: React.FC = () => {
  return (
    <AppLayout>
      <AboutContent />
    </AppLayout>
  );
};

export default About;