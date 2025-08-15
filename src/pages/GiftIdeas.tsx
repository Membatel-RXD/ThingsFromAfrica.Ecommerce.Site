import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Gift, Palette, Send, CheckCircle, Sparkles, Heart, Star } from 'lucide-react';
import AppLayout from '@/components/AppLayout';

interface CustomGiftRequest {
  customerName: string;
  customerEmail: string;
  craftType: string;
  colors: string[];
  woodType: string;
  size: string;
  description: string;
  budget: string;
  occasion: string;
  deliveryDate: string;
}

const GiftIdeasPage: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<CustomGiftRequest>({
    customerName: '',
    customerEmail: '',
    craftType: '',
    colors: [],
    woodType: '',
    size: '',
    description: '',
    budget: '',
    occasion: '',
    deliveryDate: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock API response structure
  const mockApiResponse = {
    isSuccessful: true,
    remark: "Custom Gift Request Submitted Successfully",
    payload: {
      requestId: Math.floor(Math.random() * 10000),
      status: "pending",
      estimatedResponse: "2-3 business days",
      ...formData
    }
  };

  const craftTypes = [
    'Wooden Sculpture',
    'Chess Board',
    'Decorative Bowl',
    'Wall Art',
    'Jewelry Box',
    'Custom Carving',
    'Traditional Mask',
    'Other'
  ];

  const woodTypes = [
    'Mahogany',
    'Teak',
    'Ebony',
    'Rosewood',
    'Baobab',
    'Marula',
    'Other'
  ];

  const colorOptions = [
    'Natural Wood',
    'Dark Brown',
    'Light Brown',
    'Black',
    'Red',
    'Gold',
    'Silver',
    'Custom Color'
  ];

  const handleColorToggle = (color: string) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log('Gift Request Submitted:', mockApiResponse);
      setSubmitted(true);
      setLoading(false);
    }, 2000);
  };

  if (submitted) {
    return (
      <AppLayout>
        <div className="bg-[#F8F4EF] min-h-screen py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="mb-6">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-black mb-4">{t('pages.gifts.requestSubmitted')}</h2>
                  <p className="text-gray-600 mb-6">{t('pages.gifts.requestSubmittedDesc')}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h3 className="font-semibold text-black mb-4">{t('pages.gifts.requestSummary')}</h3>
                  <div className="text-left space-y-2 text-sm">
                    <p><span className="font-medium">{t('pages.gifts.craftType')}:</span> {formData.craftType}</p>
                    <p><span className="font-medium">{t('pages.gifts.colors')}:</span> {formData.colors.join(', ')}</p>
                    <p><span className="font-medium">{t('pages.gifts.woodType')}:</span> {formData.woodType}</p>
                    <p><span className="font-medium">{t('pages.gifts.budget')}:</span> {formData.budget}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      customerName: '',
                      customerEmail: '',
                      craftType: '',
                      colors: [],
                      woodType: '',
                      size: '',
                      description: '',
                      budget: '',
                      occasion: '',
                      deliveryDate: ''
                    });
                  }}
                  className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors"
                >
                  {t('pages.gifts.submitAnother')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="bg-[#F8F4EF] min-h-screen">
        {/* Header Section */}
        <section className="bg-gradient-to-r from-gray-900 to-black text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <Gift className="h-16 w-16 mx-auto mb-6 text-white" />
              <h1 className="text-5xl md:text-6xl font-bold mb-4">{t('pages.gifts.title')}</h1>
              <p className="text-xl max-w-2xl mx-auto">{t('pages.gifts.subtitle')}</p>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="md:col-span-2">
                    <h3 className="text-2xl font-bold text-black mb-6 flex items-center">
                      <Heart className="h-6 w-6 mr-2" />
                      {t('pages.gifts.personalInfo')}
                    </h3>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('pages.gifts.yourName')}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.customerName}
                      onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none"
                      placeholder={t('pages.gifts.namePlaceholder')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('pages.gifts.email')}
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.customerEmail}
                      onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none"
                      placeholder={t('pages.gifts.emailPlaceholder')}
                    />
                  </div>

                  {/* Craft Details */}
                  <div className="md:col-span-2 mt-8">
                    <h3 className="text-2xl font-bold text-black mb-6 flex items-center">
                      <Sparkles className="h-6 w-6 mr-2" />
                      {t('pages.gifts.craftDetails')}
                    </h3>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('pages.gifts.craftType')}
                    </label>
                    <select
                      required
                      value={formData.craftType}
                      onChange={(e) => setFormData(prev => ({ ...prev, craftType: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none"
                    >
                      <option value="">{t('pages.gifts.selectCraftType')}</option>
                      {craftTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('pages.gifts.woodType')}
                    </label>
                    <select
                      required
                      value={formData.woodType}
                      onChange={(e) => setFormData(prev => ({ ...prev, woodType: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none"
                    >
                      <option value="">{t('pages.gifts.selectWoodType')}</option>
                      {woodTypes.map(wood => (
                        <option key={wood} value={wood}>{wood}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('pages.gifts.colors')}
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {colorOptions.map(color => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => handleColorToggle(color)}
                          className={`px-4 py-2 rounded-xl border-2 transition-colors ${
                            formData.colors.includes(color)
                              ? 'bg-black text-white border-black'
                              : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('pages.gifts.size')}
                    </label>
                    <input
                      type="text"
                      value={formData.size}
                      onChange={(e) => setFormData(prev => ({ ...prev, size: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none"
                      placeholder={t('pages.gifts.sizePlaceholder')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('pages.gifts.budget')}
                    </label>
                    <select
                      required
                      value={formData.budget}
                      onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none"
                    >
                      <option value="">{t('pages.gifts.selectBudget')}</option>
                      <option value="$50-100">$50-100</option>
                      <option value="$100-250">$100-250</option>
                      <option value="$250-500">$250-500</option>
                      <option value="$500+">$500+</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('pages.gifts.occasion')}
                    </label>
                    <input
                      type="text"
                      value={formData.occasion}
                      onChange={(e) => setFormData(prev => ({ ...prev, occasion: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none"
                      placeholder={t('pages.gifts.occasionPlaceholder')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('pages.gifts.deliveryDate')}
                    </label>
                    <input
                      type="date"
                      value={formData.deliveryDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, deliveryDate: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('pages.gifts.description')}
                    </label>
                    <textarea
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none"
                      placeholder={t('pages.gifts.descriptionPlaceholder')}
                    />
                  </div>

                  <div className="md:col-span-2 mt-6">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-black text-white py-4 rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>{t('pages.gifts.submitting')}</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5" />
                          <span>{t('pages.gifts.submitRequest')}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
};

export default GiftIdeasPage;