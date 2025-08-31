import React, { useState } from 'react';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { WEBSITE_DETAILS } from '@/constants/website_details';
import { apiService, IAPIResponse } from '@/lib/api';

interface NewsletterSubscription {
  email: string;
}

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setSubscriptionStatus('error');
      setMessage('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setSubscriptionStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setIsSubscribing(true);
    setSubscriptionStatus('idle');
    setMessage('');

    try {
      const subscriptionData: NewsletterSubscription = { email: email.trim() };
      const response = await apiService.post<IAPIResponse<object>>('Newsletter/subscribe', subscriptionData);
      
      if (response.isSuccessful) {
        setSubscriptionStatus('success');
        setMessage(response.remark || 'Successfully subscribed to our newsletter!');
        setEmail(''); // Clear the email field on success
      } else {
        setSubscriptionStatus('error');
        setMessage(response.remark || 'Failed to subscribe. Please try again.');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setSubscriptionStatus('error');
      setMessage('An error occurred. Please try again later.');
    } finally {
      setIsSubscribing(false);
      
      // Clear the message after 5 seconds
      setTimeout(() => {
        setSubscriptionStatus('idle');
        setMessage('');
      }, 5000);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Clear any existing messages when user starts typing
    if (subscriptionStatus !== 'idle') {
      setSubscriptionStatus('idle');
      setMessage('');
    }
  };
  
  return (
    <footer className="bg-white text-black">
      {/* Newsletter section */}
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4 text-black">{t('footer.stayConnected')}</h3>
          <p className="mb-6 text-gray-700">{t('footer.newsletterDesc', { siteName: WEBSITE_DETAILS.name })}</p>
          
          <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
            <div className="join w-full">
              <input 
                type="email"
                value={email}
                onChange={handleEmailChange}
                disabled={isSubscribing}
                className="input input-bordered join-item bg-white text-black placeholder:text-gray-500 flex-1 disabled:opacity-50" 
                placeholder={t('footer.enterEmail')}
                aria-label="Email address for newsletter subscription"
              />
              <button 
                type="submit"
                disabled={isSubscribing || !email.trim()}
                className="btn join-item bg-black text-white border-none hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubscribing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  t('footer.subscribe')
                )}
              </button>
            </div>
          </form>

          {/* Status Messages */}
          {message && (
            <div className={`mt-4 p-3 rounded-lg flex items-center justify-center space-x-2 max-w-md mx-auto ${
              subscriptionStatus === 'success' 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              {subscriptionStatus === 'success' ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <span className="text-sm">{message}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Main footer */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-black">
          {/* Company info */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>
              <span className="text-lg font-bold">{WEBSITE_DETAILS.name}</span>
            </div>
            <p className="text-gray-600 text-sm mb-3">
              {t('footer.tagline')}
            </p>
            <div className="flex space-x-2">
              <button className="btn btn-ghost btn-sm btn-circle text-black hover:bg-black hover:text-white">
                <Facebook className="h-4 w-4" />
              </button>
              <button className="btn btn-ghost btn-sm btn-circle text-black hover:bg-black hover:text-white">
                <Instagram className="h-4 w-4" />
              </button>
              <button className="btn btn-ghost btn-sm btn-circle text-black hover:bg-black hover:text-white">
                <Twitter className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {/* Quick links */}
          <div>
            <h6 className="font-bold text-black uppercase mb-3">{t('footer.quickLinks')}</h6>
            <div className="space-y-1">
              <Link to="/" className="block text-gray-600 hover:text-black text-sm">{t('nav.home')}</Link>
              <Link to="/shop" className="block text-gray-600 hover:text-black text-sm">{t('nav.shop')}</Link>
              <Link to="/crafts" className="block text-gray-600 hover:text-black text-sm">{t('nav.crafts')}</Link>
              <Link to="/stories" className="block text-gray-600 hover:text-black text-sm">{t('nav.stories')}</Link>
              <Link to="/about" className="block text-gray-600 hover:text-black text-sm">{t('nav.about')}</Link>
            </div>
          </div>
          
          {/* Customer service */}
          <div>
            <h6 className="font-bold text-black uppercase mb-3">{t('footer.customerCare')}</h6>
            <div className="space-y-1">
              <a className="block text-gray-600 hover:text-black text-sm">{t('footer.shippingInfo')}</a>
              <Link to="/track-order" className="block text-gray-600 hover:text-black text-sm">{t('footer.trackOrder')}</Link>
              <a className="block text-gray-600 hover:text-black text-sm">{t('footer.returns')}</a>
              <a className="block text-gray-600 hover:text-black text-sm">{t('footer.faq')}</a>
              <Link to="/contact" className="block text-gray-600 hover:text-black text-sm">{t('nav.contact')}</Link>
            </div>
          </div>
          
          {/* Contact info */}
          <div>
            <h6 className="font-bold text-black uppercase mb-3">{t('footer.contactInfo')}</h6>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-600 text-sm">
                <MapPin className="h-3 w-3" />
                <span>{WEBSITE_DETAILS.address}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 text-sm">
                <Phone className="h-3 w-3" />
                <span>{WEBSITE_DETAILS.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 text-sm">
                <Mail className="h-3 w-3" />
                <span>{WEBSITE_DETAILS.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom bar */}
      <div className="border-t border-gray-200 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
            <p>&copy; {new Date().getFullYear()} {WEBSITE_DETAILS.name}. {t('footer.allRightsReserved')}</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="/privacy" className="hover:text-black transition-colors">{t('footer.privacyPolicy')}</a>
              <a href="/terms" className="hover:text-black transition-colors">{t('footer.termsOfService')}</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;