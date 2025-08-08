import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <AppLayout>
      <div className="bg-[#F8F4EF] min-h-screen">
        <section className="bg-gradient-to-r from-gray-900 to-black text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <MessageCircle className="h-12 w-12 text-white mr-4" />
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {t('pages.contact.title')}
                </h1>
              </div>
              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
                {t('pages.contact.subtitle')}
              </p>
            </div>
          </div>
        </section>

        <main className="container mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">{t('pages.contact.sendMessage')}</h2>
                <p className="text-gray-600">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-gray-900 font-medium mb-2 block">{t('pages.contact.fullName')}</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                      placeholder={t('pages.contact.namePlaceholder')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-gray-900 font-medium mb-2 block">{t('pages.contact.emailAddress')}</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                      placeholder={t('pages.contact.emailPlaceholder')}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="subject" className="text-gray-900 font-medium mb-2 block">{t('pages.contact.subject')}</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                    placeholder={t('pages.contact.subjectPlaceholder')}
                  />
                </div>
                
                <div>
                  <Label htmlFor="message" className="text-gray-900 font-medium mb-2 block">{t('pages.contact.message')}</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="border-gray-300 focus:border-gray-900 focus:ring-gray-900 resize-none"
                    placeholder={t('pages.contact.messagePlaceholder')}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-black hover:bg-gray-800 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center"
                >
                  <Send className="h-5 w-5 mr-2" />
                  {t('pages.contact.sendButton')}
                </Button>
              </form>
            </div>

            <div className="space-y-6">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">{t('pages.contact.getInTouch')}</h2>
                <p className="text-gray-600">Find us through any of these channels. We're here to help with all your inquiries.</p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                <div className="space-y-8">
                  <div className="flex items-start space-x-4">
                    <div className="bg-gray-100 p-3 rounded-full">
                      <MapPin className="h-6 w-6 text-gray-900" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg mb-2">{t('pages.contact.location')}</h3>
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
                      <h3 className="font-bold text-gray-900 text-lg mb-2">{t('pages.contact.phone')}</h3>
                      <p className="text-gray-600">+265 1 234 567</p>
                      <p className="text-gray-500 text-sm mt-1">Available during business hours</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-gray-100 p-3 rounded-full">
                      <Mail className="h-6 w-6 text-gray-900" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg mb-2">{t('pages.contact.email')}</h3>
                      <p className="text-gray-600">info@thingsfromafrica.com</p>
                      <p className="text-gray-500 text-sm mt-1">We'll respond within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-gray-100 p-3 rounded-full">
                      <Clock className="h-6 w-6 text-gray-900" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg mb-2">{t('pages.contact.hours')}</h3>
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
                <h3 className="font-bold text-gray-900 text-xl mb-4">{t('pages.contact.visitWorkshop')}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Experience the artistry firsthand. Come see our skilled craftspeople at work and discover the stories behind each handcrafted piece. Workshop visits are available by appointment.
                </p>
                <Button className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300">
                  {t('pages.contact.scheduleVisit')}
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