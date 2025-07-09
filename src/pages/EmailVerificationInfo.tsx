import React from 'react';
import { Link } from 'react-router-dom';

const EmailVerificationInfo: React.FC = () => {
  const handleManualVerification = () => {
    // For testing purposes, simulate verification
    localStorage.setItem('emailVerified', 'true');
    alert('Account activated! You can now login.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Check Your Email
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We've sent a verification link to your email address. Please check your email and click the link to verify your account.
          </p>
          
          <div className="mt-8 space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <p className="text-sm text-yellow-800">
                <strong>For testing purposes:</strong> Since email verification is not fully set up, you can activate your account manually.
              </p>
            </div>
            
            <button
              onClick={handleManualVerification}
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              Activate Account (Testing)
            </button>
            
            <Link 
              to="/login" 
              className="block text-center text-sm text-gray-600 hover:text-black"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationInfo;