import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';

const EmailVerificationInfo: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error' | 'expired'>('pending');
  const [message, setMessage] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [countdown, setCountdown] = useState(0);

  // Get email from localStorage (set during registration) or URL params
  const userEmail = localStorage.getItem('pendingVerificationEmail') || searchParams.get('email') || '';
  
  // Check if this is a verification callback from email link
  const token = searchParams.get('token');
  const emailFromUrl = searchParams.get('email');

  useEffect(() => {
    // If we have a token and email, this is a verification callback
    if (token && emailFromUrl) {
      verifyEmail(token, emailFromUrl);
    }
  }, [token, emailFromUrl]);

  useEffect(() => {
    // Countdown timer for resend button
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const verifyEmail = async (verificationToken: string, email: string) => {
    try {
      const response = await fetch(`/Users/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const result = await response.text();
        setVerificationStatus('success');
        setMessage(result || 'Email verified successfully! You can now log in.');
        
        // Clean up localStorage
        localStorage.removeItem('pendingVerificationEmail');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login', { 
            state: { message: 'Email verified successfully! Please log in.' }
          });
        }, 3000);
      } else {
        const errorText = await response.text();
        setVerificationStatus(errorText.includes('expired') ? 'expired' : 'error');
        setMessage(errorText || 'Verification failed. Please try again.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationStatus('error');
      setMessage('An error occurred during verification. Please try again.');
    }
  };

  const handleResendVerification = async () => {
    if (!userEmail) {
      setMessage('Email address not found. Please register again.');
      return;
    }

    setIsResending(true);
    
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail })
      });

      if (response.ok) {
        setMessage('Verification email sent successfully! Please check your inbox.');
        setCanResend(false);
        setCountdown(60); // 60 second cooldown
      } else {
        const errorText = await response.text();
        setMessage(errorText || 'Failed to resend verification email. Please try again.');
      }
    } catch (error) {
      console.error('Resend error:', error);
      setMessage('An error occurred. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const getStatusIcon = () => {
    switch (verificationStatus) {
      case 'success':
        return (
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'error':
      case 'expired':
        return (
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        );
    }
  };

  const getTitle = () => {
    switch (verificationStatus) {
      case 'success':
        return 'Email Verified!';
      case 'error':
        return 'Verification Failed';
      case 'expired':
        return 'Link Expired';
      default:
        return 'Check Your Email';
    }
  };

  const getDescription = () => {
    if (message) return message;
    
    switch (verificationStatus) {
      case 'success':
        return 'Your email has been successfully verified. You will be redirected to the login page shortly.';
      case 'error':
        return 'The verification link is invalid or has already been used.';
      case 'expired':
        return 'The verification link has expired. Please request a new one.';
      default:
        return userEmail 
          ? `We've sent a verification link to ${userEmail}. Please check your email and click the link to verify your account.`
          : 'We\'ve sent a verification link to your email address. Please check your email and click the link to verify your account.';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {getStatusIcon()}
          
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {getTitle()}
          </h2>
          
          <p className="mt-2 text-sm text-gray-600">
            {getDescription()}
          </p>

          <div className="mt-8 space-y-4">
            {verificationStatus === 'pending' && (
              <>
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-800">
                        <strong>Didn't receive the email?</strong> Check your spam folder or click the resend button below.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleResendVerification}
                  disabled={!canResend || isResending}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                    !canResend || isResending
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black'
                  }`}
                >
                  {isResending 
                    ? 'Sending...' 
                    : canResend 
                      ? 'Resend Verification Email'
                      : `Resend in ${countdown}s`
                  }
                </button>
              </>
            )}

            {(verificationStatus === 'error' || verificationStatus === 'expired') && (
              <button
                onClick={handleResendVerification}
                disabled={!canResend || isResending}
                className={`w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                  !canResend || isResending
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                }`}
              >
                {isResending ? 'Sending...' : 'Send New Verification Email'}
              </button>
            )}

            {verificationStatus === 'success' && (
              <Link
                to="/login"
                className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Continue to Login
              </Link>
            )}

            <Link
              to="/login"
              className="block text-center text-sm text-gray-600 hover:text-black"
            >
              Back to Login
            </Link>

            {verificationStatus === 'pending' && (
              <Link
                to="/register"
                className="block text-center text-sm text-gray-600 hover:text-black"
              >
                Need to register again?
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationInfo;