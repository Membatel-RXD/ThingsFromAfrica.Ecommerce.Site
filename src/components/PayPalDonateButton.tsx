import React, { useState, useEffect, useRef } from 'react';
import { Heart, DollarSign, Users, Target, X, Check, CreditCard, AlertCircle } from 'lucide-react';
import { apiService, IAPIResponse } from '@/lib/api';
import { useTranslation } from 'react-i18next';

// Types
interface DonorInfo {
  email: string;
  name: string;
  phone: string;
}

interface FormErrors {
  [key: string]: string;
}

interface CreatePaymentIntentResponse {
  donationId: string;
  orderId: string; // This should now be the PayPal order ID
  approvalUrl: string;
  clientToken?: string;
}

interface ExecutePaymentResponse {
  message: string;
  donationId: string;
  transactionId: string;
}

// PayPal configuration
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;

// PayPal types for client SDK
declare global {
  interface Window {
    paypal?: {
      Buttons: (config: any) => {
        render: (selector: string) => Promise<void>;
      };
    };
  }
}

interface DonationFormProps {
  onSuccess: () => void;
  onError: (error: string) => void;
  donorInfo: DonorInfo;
  selectedAmount: number;
  donationType: 'one-time' | 'monthly';
}

const DonationForm: React.FC<DonationFormProps> = ({
  onSuccess,
  onError,
  donorInfo,
  selectedAmount,
  donationType,
}) => {
  const { t } = useTranslation();
  const paypalRef = useRef<HTMLDivElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [currentDonationId, setCurrentDonationId] = useState<string>('');
  const [currentPaymentId, setCurrentPaymentId] = useState<string>('');

  useEffect(() => {
    loadPayPalScript();
  }, []);

  useEffect(() => {
    if (paypalLoaded && paypalRef.current && window.paypal) {
      renderPayPalButtons();
    }
  }, [paypalLoaded, donorInfo, selectedAmount, donationType]);

  const loadPayPalScript = () => {
    // Check if PayPal script is already loaded
    if (window.paypal) {
      setPaypalLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD&intent=capture`;
    script.addEventListener('load', () => setPaypalLoaded(true));
    script.addEventListener('error', () => onError('Failed to load PayPal SDK'));
    document.body.appendChild(script);
  };

  const createPaymentIntent = async (): Promise<CreatePaymentIntentResponse> => {
    const response = await apiService.post<IAPIResponse<CreatePaymentIntentResponse>>('Donations/create-payment-intent', {
      amount: selectedAmount,
      currency: 'USD',
      donationType: donationType === 'one-time' ? 1 : 2, // Assuming 1 = one-time, 2 = monthly
      donorEmail: donorInfo.email,
      donorName: donorInfo.name,
      donorPhone: donorInfo.phone,
    });

    if (!response.isSuccessful || !response.payload) {
      throw new Error(response.remark || 'Failed to create payment intent');
    }

    return response.payload;
  };



  const renderPayPalButtons = () => {
    if (!window.paypal || !paypalRef.current) return;
  
    // Clear previous buttons
    paypalRef.current.innerHTML = '';
  
    window.paypal.Buttons({
      createOrder: async () => {
        try {
          setIsProcessing(true);
          
          
          const paymentIntent = await createPaymentIntent();
          
          
          setCurrentDonationId(paymentIntent.donationId);
          // Store the order ID instead of payment ID
          setCurrentPaymentId(paymentIntent.orderId); // This should now be the order ID from PayPal
          
          setIsProcessing(false);
          
          // Return the order ID directly
          return paymentIntent.orderId;
        } catch (error) {
          console.error('PayPal createOrder error:', error);
          onError(error.message || 'Failed to create payment intent');
          setIsProcessing(false);
          return Promise.reject(error);
        }
      },
      
      onApprove: async (data) => {
        try {
          setIsProcessing(true);
          
          
          // Execute the payment via your backend
          // Use data.orderID which is the same as the order ID we returned from createOrder
          const response = await apiService.post<IAPIResponse<ExecutePaymentResponse>>('Donations/capture-order', {
            orderId: data.orderID // This is the PayPal order ID
          });
           
          if (!response || !response.isSuccessful) {
            throw new Error(response?.remark || 'Failed to capture payment');
          }
           
          
          setIsProcessing(false);
          onSuccess();
        } catch (error) {
          console.error('Payment capture error:', error);
          onError(error.message || 'Payment capture failed');
          setIsProcessing(false);
        }
      },
      
      onError: (err) => {
        console.error('PayPal error:', err);
        onError('PayPal payment failed. Please try again.');
        setIsProcessing(false);
      },
      
      onCancel: () => {
        
        onError('Payment was cancelled');
        setIsProcessing(false);
      }
    }).render(paypalRef.current);
  };

  return (
    <div className="space-y-4">
      {/* PayPal Payment Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <CreditCard className="w-4 h-4 inline mr-2" />
          {t('common.paymentInformation')}
        </label>
        
        {isProcessing && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">{t('common.processingPayment')}</span>
          </div>
        )}
        
        <div 
          ref={paypalRef}
          className={`min-h-[50px] ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
        ></div>
        
        {!paypalLoaded && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading PayPal...</p>
          </div>
        )}
        
        <div className="mt-4 flex items-center text-sm text-gray-600">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          Your donation is secure and protected by PayPal
        </div>
      </div>
    </div>
  );
};

// Subscription Form Component for Monthly Donations
interface SubscriptionFormProps {
  onSuccess: () => void;
  onError: (error: string) => void;
  donorInfo: DonorInfo;
  selectedAmount: number;
}

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({
  onSuccess,
  onError,
  donorInfo,
  selectedAmount,
}) => {
  const { t } = useTranslation();
  const [isProcessing, setIsProcessing] = useState(false);

  const createSubscription = async () => {
    try {
      setIsProcessing(true);
      
      const response = await apiService.post<IAPIResponse<{ subscriptionId: string; approvalUrl: string; donationId: string }>>(
        'Donations/create-subscription',
        {
          amount: selectedAmount,
          currency: 'USD',
          donorEmail: donorInfo.email,
          donorName: donorInfo.name,
          donorPhone: donorInfo.phone,
        }
      );

      if (!response.isSuccessful || !response.payload) {
        throw new Error(response.remark || 'Failed to create subscription');
      }

      // Redirect to PayPal approval URL
      window.location.href = response.payload.approvalUrl;
      
    } catch (error: any) {
      console.error('Subscription creation error:', error);
      onError(error.message || 'Failed to create monthly donation subscription');
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <CreditCard className="w-4 h-4 inline mr-2" />
          Monthly Subscription Setup
        </label>
        
        <button
          onClick={createSubscription}
          disabled={isProcessing}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
            isProcessing
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Setting up subscription...
            </div>
          ) : (
            `Set up $${selectedAmount}/month donation`
          )}
        </button>
        
        <div className="mt-4 flex items-center text-sm text-gray-600">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          Monthly donations can be cancelled at any time
        </div>
      </div>
    </div>
  );
};

const DonationButton: React.FC = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(25);
  const [customAmount, setCustomAmount] = useState('');
  const [donationType, setDonationType] = useState<'one-time' | 'monthly'>('one-time');
  const [isDonated, setIsDonated] = useState(false);
  const [donorInfo, setDonorInfo] = useState<DonorInfo>({
    email: '',
    name: '',
    phone: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isFormValid, setIsFormValid] = useState(false);

  const predefinedAmounts = [10, 25, 50, 100, 250];

  // Validate form whenever relevant fields change
  useEffect(() => {
    const isEmailValid = donorInfo.email && /\S+@\S+\.\S+/.test(donorInfo.email);
    const isNameValid = donorInfo.name.trim();
    const isAmountValid = selectedAmount > 0;
    
    setIsFormValid(Boolean(isEmailValid && isNameValid && isAmountValid));
  }, [donorInfo.email, donorInfo.name, selectedAmount]);

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
    setErrors(prev => {
      const { amount: _, ...rest } = prev;
      return rest;
    });
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomAmount(value);
    setSelectedAmount(parseFloat(value) || 0);
    setErrors(prev => {
      const { amount: _, ...rest } = prev;
      return rest;
    });
  };

  const handleDonorInfoChange = (field: keyof DonorInfo, value: string) => {
    setDonorInfo(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const { [field]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handlePaymentSuccess = () => {
    setIsDonated(true);
    
    // Reset after 3 seconds
    setTimeout(() => {
      setIsDonated(false);
      setIsModalOpen(false);
      resetForm();
    }, 3000);
  };

  const handlePaymentError = (error: string) => {
    setErrors({ general: error });
  };

  const resetForm = () => {
    setSelectedAmount(25);
    setCustomAmount('');
    setDonationType('one-time');
    setDonorInfo({ email: '', name: '', phone: '' });
    setErrors({});
  };

  const openModal = () => setIsModalOpen(true);
  
  const closeModal = () => {
    setIsModalOpen(false);
    setIsDonated(false);
    setErrors({});
  };

  return (
    <div className="relative">
      {/* Main Donation Button */}
      <button
        onClick={openModal}
        className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white transition-all duration-300 bg-gradient-to-r from-amber-800 via-amber-700 to-amber-600 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-amber-300 border border-amber-700"      >
        <Heart className="w-5 h-5 mr-2 transition-transform group-hover:scale-110" />
        <span>{t('common.donateNow')}</span>
        <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
      </button>

      {/* Donation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="relative p-6 border-b border-gray-200">
              <button
                onClick={closeModal}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('common.makeADifference')}</h2>
                <p className="text-gray-600">{t('common.donationHelps')}</p>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {!isDonated ? (
                <>
                  {/* Error Messages */}
                  {errors.general && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
                      <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-red-700 text-sm">{errors.general}</span>
                    </div>
                  )}

                  {/* Donor Information */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">{t('common.donorInformation')}</label>
                    <div className="space-y-3">
                      <div>
                        <input
                          type="email"
                          placeholder={t('common.emailRequired')}
                          value={donorInfo.email}
                          onChange={(e) => handleDonorInfoChange('email', e.target.value)}
                          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                            errors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-pink-500'
                          }`}
                        />
                        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder={t('common.fullNameRequired')}
                          value={donorInfo.name}
                          onChange={(e) => handleDonorInfoChange('name', e.target.value)}
                          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                            errors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-pink-500'
                          }`}
                        />
                        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                      </div>
                      <div>
                        <input
                          type="tel"
                          placeholder={t('common.phoneOptional')}
                          value={donorInfo.phone}
                          onChange={(e) => handleDonorInfoChange('phone', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Donation Type */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">{t('common.donationType')}</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setDonationType('one-time')}
                        className={`p-3 rounded-lg border-2 font-medium transition-all ${
                          donationType === 'one-time'
                            ? 'border-pink-500 bg-pink-50 text-pink-700'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {t('common.oneTime')}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDonationType('monthly')}
                        className={`p-3 rounded-lg border-2 font-medium transition-all ${
                          donationType === 'monthly'
                            ? 'border-pink-500 bg-pink-50 text-pink-700'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {t('common.monthly')}
                      </button>
                    </div>
                  </div>

                  {/* Amount Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      {t('common.chooseAmount')} {donationType === 'monthly' && `(${t('common.perMonth')})`}
                    </label>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {predefinedAmounts.map((amount) => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => handleAmountSelect(amount)}
                          className={`p-3 rounded-lg border-2 font-medium transition-all ${
                            selectedAmount === amount && !customAmount
                              ? 'border-pink-500 bg-pink-50 text-pink-700'
                              : 'border-gray-200 text-gray-600 hover:border-gray-300'
                          }`}
                        >
                          ${amount}
                        </button>
                      ))}
                    </div>
                    
                    {/* Custom Amount */}
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="number"
                        placeholder={t('common.enterCustomAmount')}
                        value={customAmount}
                        onChange={handleCustomAmountChange}
                        min="1"
                        step="0.01"
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                          errors.amount ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-pink-500'
                        }`}
                      />
                      {errors.amount && <p className="mt-1 text-xs text-red-600">{errors.amount}</p>}
                    </div>
                  </div>

                  {/* Impact Message */}
                  <div className="mb-6 p-4 bg-gradient-to-r from-pink-50 to-violet-50 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Target className="w-5 h-5 text-pink-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{t('common.yourImpact')}</h4>
                        <p className="text-sm text-gray-700">
                          {t('common.impactMessage', { amount: selectedAmount })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Form - Show appropriate form based on donation type */}
                  {isFormValid && (
                    <>
                      {donationType === 'one-time' ? (
                        <DonationForm
                          onSuccess={handlePaymentSuccess}
                          onError={handlePaymentError}
                          donorInfo={donorInfo}
                          selectedAmount={selectedAmount}
                          donationType={donationType}
                        />
                      ) : (
                        <SubscriptionForm
                          onSuccess={handlePaymentSuccess}
                          onError={handlePaymentError}
                          donorInfo={donorInfo}
                          selectedAmount={selectedAmount}
                        />
                      )}
                    </>
                  )}

                  {/* Trust Indicators */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-center text-xs text-gray-500">
                      <div className="flex items-center mr-4">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                        {t('common.securePayment')}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-3 h-3 mr-1" />
                        {t('common.taxDeductible')}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                /* Success State */
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('common.thankYou')}</h3>
                  <p className="text-gray-600 mb-4">
                    {t('common.donationSuccess', { 
                      type: donationType === 'monthly' ? t('common.monthly').toLowerCase() + ' ' : '',
                      amount: selectedAmount 
                    })}
                  </p>
                  <p className="text-sm text-gray-500">
                    {t('common.confirmationEmail')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationButton;