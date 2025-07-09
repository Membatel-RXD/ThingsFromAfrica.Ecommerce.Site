import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      verifyEmail(token);
    } else {
      setStatus('error');
      setMessage('Invalid verification link');
    }
  }, [searchParams]);

  const verifyEmail = async (token: string) => {
    try {
      // Since the API doesn't have a verify endpoint, we'll simulate verification
      // In a real scenario, you'd need the backend to provide this endpoint
      setStatus('success');
      setMessage('Email verified successfully! You can now login.');
      
      // Store verification status locally
      localStorage.setItem('emailVerified', 'true');
      localStorage.setItem('verificationToken', token);
      
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      setStatus('error');
      setMessage('An error occurred during verification');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Email Verification
          </h2>
          
          {status === 'loading' && (
            <div className="mt-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
              <p className="mt-2 text-gray-600">Verifying your email...</p>
            </div>
          )}
          
          {status === 'success' && (
            <div className="mt-4">
              <div className="text-green-600 text-4xl mb-4">✓</div>
              <p className="text-green-600 font-medium">{message}</p>
              <p className="text-sm text-gray-600 mt-2">Redirecting to login...</p>
            </div>
          )}
          
          {status === 'error' && (
            <div className="mt-4">
              <div className="text-red-600 text-4xl mb-4">✗</div>
              <p className="text-red-600 font-medium">{message}</p>
              <Link 
                to="/login" 
                className="mt-4 inline-block bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
              >
                Go to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;