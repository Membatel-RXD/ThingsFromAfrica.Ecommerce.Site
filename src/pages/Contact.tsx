import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, CheckCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { apiService, IAPIResponse } from '@/lib/api';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const response = await apiService.post<IAPIResponse<object>>('Contact/send', formData);
      
      if (response.isSuccessful) {
        setSuccessMessage(response.remark || "Form submitted successfully, we will get back to you");
        // Reset form on success
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        setErrorMessage(response.remark || "Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error('Contact form submission error:', error);
      setErrorMessage("An error occurred while sending your message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear messages when user starts typing
    if (successMessage) setSuccessMessage('');
    if (errorMessage) setErrorMessage('');
  };

  return (
    <AppLayout>
      <div key={lang} className="bg-[#F8F4EF] min-h-screen">
        <section className="bg-gradient-to-r from-gray-900 to-black text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <MessageCircle className="h-12 w-12 text-white mr-4" />
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {t('page.contact.title')}
                </h1>
              </div>
              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
                {t('page.contact.subtitle')}
              </p>
            </div>
          </div>
        </section>

        <main className="container mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">{t('page.contact.sendMessage')}</h2>
                <p className="text-gray-600">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
              </div>

              {/* Success Message */}
              {successMessage && (
                <Alert className="mb-6 border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    {successMessage}
                  </AlertDescription>
                </Alert>
              )}

              {/* Error Message */}
              {errorMessage && (
                <Alert className="mb-6 border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    {errorMessage}
                  </AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-gray-900 font-medium mb-2 block">{t('page.contact.fullName')}</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      className="border-gray-300 focus:border-gray-900 focus:ring-gray-900 disabled:opacity-50"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-gray-900 font-medium mb-2 block">{t('page.contact.emailAddress')}</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      className="border-gray-300 focus:border-gray-900 focus:ring-gray-900 disabled:opacity-50"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="subject" className="text-gray-900 font-medium mb-2 block">{t('page.contact.subject')}</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="border-gray-300 focus:border-gray-900 focus:ring-gray-900 disabled:opacity-50"
                    placeholder="What is this about?"
                  />
                </div>
                
                <div>
                  <Label htmlFor="message" className="text-gray-900 font-medium mb-2 block">{t('page.contact.message')}</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    disabled={isSubmitting}
                    className="border-gray-300 focus:border-gray-900 focus:ring-gray-900 resize-none disabled:opacity-50"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-black hover:bg-gray-800 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className={`h-5 w-5 mr-2 ${isSubmitting ? 'animate-pulse' : ''}`} />
                  {isSubmitting ? 'Sending...' : t('page.contact.sendButton')}
                </Button>
              </form>
            </div>

            <div className="space-y-6">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">{t('page.contact.getInTouch')}</h2>
                <p className="text-gray-600">Find us through any of these channels. We're here to help with all your inquiries.</p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                <div className="space-y-8">
                  <div className="flex items-start space-x-4">
                    <div className="bg-gray-100 p-3 rounded-full">
                      <MapPin className="h-6 w-6 text-gray-900" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg mb-2">{t('page.contact.location')}</h3>
                      <p className="text-gray-600 leading-relaxed">
                        123 Craft Street<br />
                        Lilongwe, Malawi<br />
                        Central Region
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-gray-100 p-3 rounded-full">
                      <Phone className="h-6 w-6 text-gray-900" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg mb-2">{t('page.contact.phone')}</h3>
                      <p className="text-gray-600">+265 1 234 567</p>
                      <p className="text-gray-500 text-sm mt-1">Available during business hours</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-gray-100 p-3 rounded-full">
                      <Mail className="h-6 w-6 text-gray-900" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg mb-2">{t('page.contact.email')}</h3>
                      <p className="text-gray-600">info@thingsfromafrica.com</p>
                      <p className="text-gray-500 text-sm mt-1">We'll respond within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-gray-100 p-3 rounded-full">
                      <Clock className="h-6 w-6 text-gray-900" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg mb-2">{t('page.contact.hours')}</h3>
                      <div className="text-gray-600 space-y-1">
                        <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                        <p>Saturday: 9:00 AM - 4:00 PM</p>
                        <p>Sunday: Closed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200">
                <h3 className="font-bold text-gray-900 text-xl mb-4">{t('page.contact.visitWorkshop')}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Experience the artistry firsthand. Come see our skilled craftspeople at work and discover the stories behind each handcrafted piece. Workshop visits are available by appointment.
                </p>
                <Button className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300">
                  {t('page.contact.scheduleVisit')}
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AppLayout>
  );
};

export default Contact;