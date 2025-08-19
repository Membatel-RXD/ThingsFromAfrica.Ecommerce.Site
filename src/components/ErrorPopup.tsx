import React, { useEffect } from 'react';
import { XCircle } from 'lucide-react';

interface ErrorPopupProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
}

const ErrorPopup: React.FC<ErrorPopupProps> = ({ message, isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black/20" onClick={onClose}></div>
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4 z-10 animate-in fade-in slide-in-from-bottom-5 duration-300">
        <div className="flex items-center">
          <XCircle className="h-8 w-8 text-red-500 mr-4" />
          <div>
            <h3 className="text-lg font-semibold text-black">Error!</h3>
            <p className="text-gray-700">{message}</p>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPopup;