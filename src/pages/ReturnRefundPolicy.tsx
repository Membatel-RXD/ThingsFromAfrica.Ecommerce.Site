import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import Footer from '@/components/Footer';
import { Shield, RotateCcw, CreditCard, AlertTriangle, Clock, Package, CheckCircle, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ReturnRefundPolicy = () => {
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
  const policies = [
    {
      icon: RotateCcw,
      title: t('pages.returnPolicy.returns'),
      color: "from-blue-50 to-indigo-100",
      border: "border-blue-200 hover:border-blue-400",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            {t('pages.returnPolicy.returnDescription')}
          </p>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              {t('pages.returnPolicy.originalCondition')}
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              {t('pages.returnPolicy.originalPackaging')}
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              {t('pages.returnPolicy.notCustomItem')}
            </li>
          </ul>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <div className="flex items-start">
              <Mail className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-blue-800 font-medium">{t('pages.returnPolicy.toStartReturn')}</p>
                <p className="text-blue-700 text-sm mt-1">
                  {t('pages.returnPolicy.emailInstructions')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: CreditCard,
      title: t('pages.returnPolicy.refunds'),
      color: "from-green-50 to-emerald-100",
      border: "border-green-200 hover:border-green-400",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            {t('pages.returnPolicy.refundDescription')}
          </p>
          <div className="flex items-center space-x-4 text-sm text-gray-600 bg-green-50 rounded-lg p-4">
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-green-600 mr-2" />
              {t('pages.returnPolicy.fastProcessing')}
            </div>
            <div className="flex items-center">
              <Shield className="h-4 w-4 text-green-600 mr-2" />
              {t('pages.returnPolicy.secureRefunds')}
            </div>
          </div>
        </div>
      )
    },
    {
      icon: AlertTriangle,
      title: t('pages.returnPolicy.exceptions'),
      color: "from-amber-50 to-orange-100",
      border: "border-amber-200 hover:border-amber-400",
      content: (
        <div className="space-y-4">
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                {t('pages.returnPolicy.customItemException')}
              </div>
            </li>
            <li className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                {t('pages.returnPolicy.shippingCostException')}
              </div>
            </li>
          </ul>
        </div>
      )
    },
    {
      icon: Package,
      title: t('pages.returnPolicy.damagedItems'),
      color: "from-red-50 to-rose-100",
      border: "border-red-200 hover:border-red-400",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            {t('pages.returnPolicy.damagedDescription')}
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-red-800 font-medium">{t('pages.returnPolicy.quickAction')}</p>
                <p className="text-red-700 text-sm mt-1">
                  {t('pages.returnPolicy.reportWithPhotos')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <AppLayout>
      <div className="bg-[#F8F4EF] min-h-screen">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white py-12 overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'2\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-4">
                <Shield className="h-12 w-12 text-blue-400 mr-4" />
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {t('pages.returnPolicy.title')}
                </h1>
              </div>
              <p className="text-lg md:text-xl text-gray-300 mb-6 leading-relaxed">
                {t('pages.returnPolicy.subtitle')}
              </p>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  {t('pages.returnPolicy.fourteenDayReturns')}
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  {t('pages.returnPolicy.fastRefunds')}
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                  {t('pages.returnPolicy.customerFirst')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          {/* Policy Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {policies.map((policy, index) => {
              const IconComponent = policy.icon;
              
              return (
                <div 
                  key={index}
                  className={`group relative bg-gradient-to-br ${policy.color} rounded-2xl border-2 ${policy.border} transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] overflow-hidden`}
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
                    <div className="flex items-center mb-6">
                      <div className="mr-4 group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="h-10 w-10 text-gray-700" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors">
                          {policy.title}
                        </h3>
                        <div className="w-12 h-1 bg-black/20 rounded-full group-hover:w-16 transition-all duration-300 mt-2"></div>
                      </div>
                    </div>
                    
                    <div className="group-hover:text-gray-800 transition-colors">
                      {policy.content}
                    </div>
                  </div>
                  
                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              );
            })}
          </div>

          {/* Contact Section */}
          <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-12 border border-gray-200 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {t('pages.returnPolicy.needHelp')}
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                {t('pages.returnPolicy.customerServiceDesc')}
              </p>
              
              <div className="flex flex-wrap justify-center gap-6 mb-8">
                <div className="bg-white rounded-lg px-6 py-4 border border-gray-200 shadow-sm flex items-center">
                  <Mail className="h-6 w-6 text-blue-600 mr-3" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{t('pages.returnPolicy.emailUs')}</p>
                    <p className="text-sm text-gray-600">[your email]</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg px-6 py-4 border border-gray-200 shadow-sm flex items-center">
                  <Clock className="h-6 w-6 text-green-600 mr-3" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{t('pages.returnPolicy.responseTime')}</p>
                    <p className="text-sm text-gray-600">{t('pages.returnPolicy.within24Hours')}</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg px-6 py-4 border border-gray-200 shadow-sm flex items-center">
                  <Shield className="h-6 w-6 text-purple-600 mr-3" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{t('pages.returnPolicy.satisfaction')}</p>
                    <p className="text-sm text-gray-600">{t('pages.returnPolicy.guaranteed')}</p>
                  </div>
                </div>
              </div>

              <button className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-colors duration-300 font-medium">
                {t('pages.returnPolicy.contactSupport')}
              </button>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
              <h3 className="font-bold text-blue-900 mb-2">{t('pages.returnPolicy.importantNotice')}</h3>
              <p className="text-blue-800 text-sm">
                {t('pages.returnPolicy.policyNotice')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ReturnRefundPolicy;