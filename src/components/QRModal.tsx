import React, { useEffect } from 'react';
import { X, Copy } from 'lucide-react';

import { QRCodeCanvas } from 'qrcode.react';

interface QrModalProps {
  qrCodeUri: string;
  secret: string;
  isOpen: boolean;
  onClose: () => void;
}

const QrModal: React.FC<QrModalProps> = ({ qrCodeUri, secret, isOpen, onClose }) => {
  // Close modal on Escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const copySecret = async () => {
    try {
      await navigator.clipboard.writeText(secret);
      // You could show a toast here: showToast('Secret copied to clipboard!', 'success');
    } catch (err) {
      console.error('Failed to copy secret:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 z-10 animate-in fade-in slide-in-from-bottom-5 duration-300">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-black">Setup Two-Factor Authentication</h3>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* QR Code Section */}
        <div className="text-center mb-6">
          <h4 className="text-lg font-medium mb-4 text-black">Scan this QR Code</h4>
          <div className="flex justify-center mb-4 p-4 bg-gray-50 rounded-lg">
            <QRCodeCanvas value={qrCodeUri} size={192} />
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
          </p>
        </div>

        {/* Secret Key Section */}
        <div className="mb-6">
          <h4 className="text-sm font-medium mb-2 text-black">Or manually enter this secret:</h4>
          <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border">
            <code className="flex-1 text-sm font-mono text-gray-800 break-all">
              {secret}
            </code>
            <button
              onClick={copySecret}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Copy secret"
            >
              <Copy className="h-4 w-4 text-gray-600" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Enter this secret key manually in your authenticator app if you can't scan the QR code.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            I've Added the Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default QrModal;