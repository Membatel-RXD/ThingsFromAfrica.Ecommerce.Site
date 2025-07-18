import React, { useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';

interface SuccessPopupProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
}

const SuccessPopup: React.FC<SuccessPopupProps> = ({ message, isOpen, onClose }) => {
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
          <CheckCircle2 className="h-8 w-8 text-green-500 mr-4" />
          <div>
            <h3 className="text-lg font-semibold text-black">Success!</h3>
            <p className="text-gray-700">{message}</p>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPopup;