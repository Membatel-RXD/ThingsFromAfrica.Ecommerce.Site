import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Globe, Loader2, ArrowLeft, Home } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [languageOpen, setLanguageOpen] = useState(false);
  
  // 2FA related state
  const [show2FAVerification, setShow2FAVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [tempAuthData, setTempAuthData] = useState<any>(null);
  
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'it', name: 'Italiano' },
    { code: 'sw', name: 'Kiswahili' },
    { code: 'zh', name: '中文' },
    { code: 'de', name: 'Deutsch' },
    { code: 'pt', name: 'Português' },
    { code: 'nl', name: 'Nederlands' }
  ];
  
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setLang(lng);
    };
    
    i18n.on('languageChanged', handleLanguageChange);
    
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  const handleLanguageSelect = (language: { code: string; name: string }) => {
    i18n.changeLanguage(language.code);
    setLanguageOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.authenticate(email, password);
      
      if (response.isSuccessful) {
        const twoFactorEnabled = response.payload.requiresTwoFactor;
        
        if (twoFactorEnabled) {
          // Store temporary auth data and show 2FA verification
          setTempAuthData(response.payload);
          setShow2FAVerification(true);
          setLoading(false); // Stop loading, we're not done yet
        } else {
          // No 2FA, proceed with normal login
          navigate('/');
        }
      } else {
        setError(response.remark || t('pages.login.loginFailed'));
      }
    } catch (error) {
      setError(t('pages.login.errorOccurred'));
    } finally {
      if (!show2FAVerification) {
        setLoading(false);
      }
    }
  };

  // New function to handle 2FA verification
  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Call your 2FA verification API
      const response = await authService.verify2FA({
        userId: tempAuthData?.userId,
        verificationCode: verificationCode.trim(),
      });
      
      if (response.isSuccessful) {
        navigate('/');
      } else {
        setError(response.remark || 'Invalid verification code');
      }
    } catch (error) {
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to go back to login form
  const handleBack = () => {
    setShow2FAVerification(false);
    setVerificationCode('');
    setTempAuthData(null);
    setError('');
  };

  // Function to resend 2FA code (if your API supports it)
  const handleResend2FA = async () => {
    try {
      await authService.resend2FA(tempAuthData?.userId);
      // You could show a success message here
      setError(''); // Clear any previous errors
      // Show success message - you could use a toast here
    } catch (error) {
      setError('Failed to resend code. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Home Button */}
      <div className="absolute top-4 left-4">
        <Link
          to="/"
          className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors"
        >
          <Home className="h-4 w-4 text-gray-600" />
          <span className="text-sm text-gray-700">Home</span>
        </Link>
      </div>

      {/* Language Selector */}
      <div className="absolute top-4 right-4">
        <div className="relative">
          <button
            onClick={() => setLanguageOpen(!languageOpen)}
            className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
          >
            <Globe className="h-4 w-4 text-gray-600" />
            <span className="text-sm text-gray-700">
              {languages.find(l => l.code === i18n.language)?.name || 'English'}
            </span>
            <ChevronDown className="h-4 w-4 text-gray-600" />
          </button>
          
          {languageOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-lg z-10">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageSelect(language)}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 first:rounded-t-md last:rounded-b-md"
                >
                  {language.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="max-w-md w-full space-y-8">
        {!show2FAVerification ? (
          // Regular login form
          <>
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                {t('pages.login.title')}
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                {t('pages.login.subtitle')}
              </p>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    {t('pages.login.emailAddress')}
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                    placeholder={t('pages.login.emailPlaceholder')}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    {t('pages.login.password')}
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                    placeholder={t('pages.login.passwordPlaceholder')}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      {t('pages.login.signingIn')}
                    </>
                  ) : (
                    t('pages.login.signIn')
                  )}
                </button>
              </div>

              <div className="text-center">
                <span className="text-sm text-gray-600">
                  {t('pages.login.noAccount')}{' '}
                  <Link to="/signup" className="font-medium text-black hover:underline">
                    {t('pages.login.signUp')}
                  </Link>
                </span>
              </div>
            </form>
          </>
        ) : (
          // 2FA Verification form
          <>
            <div>
              <button
                onClick={handleBack}
                className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to login
              </button>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Two-Factor Authentication
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Enter the 6-digit code from your authenticator app
              </p>
            </div>
            
            <form className="mt-8 space-y-6" onSubmit={handleVerify2FA}>
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              
              <div>
                <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Code
                </label>
                <input
                  id="verificationCode"
                  name="verificationCode"
                  type="text"
                  required
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  className="relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-black focus:border-black text-center text-2xl tracking-widest"
                  placeholder="000000"
                  autoComplete="one-time-code"
                />
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={loading || verificationCode.length !== 6}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      Verifying...
                    </>
                  ) : (
                    'Verify Code'
                  )}
                </button>
              </div>
              
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResend2FA}
                  className="text-sm text-black hover:underline"
                >
                  Didn't receive a code? Resend
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;