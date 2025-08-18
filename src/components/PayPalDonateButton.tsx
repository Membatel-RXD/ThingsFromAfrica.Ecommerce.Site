import React, { useState, useEffect } from 'react';
import { Heart, DollarSign, Users, Target, X, Check, CreditCard, AlertCircle } from 'lucide-react';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
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

interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51Rs04G6RY5uQXuiJ081BEKW9xs4WBNHi2qODCCNsQJ5WCH38hwbI4vXanKKCotJSmqsRekMnJUSa8krYolN404cA00IqeBR3Oj');

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
      padding: '16px',
    },
    invalid: {
      color: '#9e2146',
    },
  },
  hidePostalCode: false,
};

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
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const [cardError, setCardError] = useState<string>('');

  const handleCardChange = (event: any) => {
    setCardComplete(event.complete);
    setCardError(event.error ? event.error.message : '');
  };

  const createPaymentIntent = async (): Promise<PaymentIntentResponse> => {
    const response = await apiService.post<IAPIResponse<PaymentIntentResponse>>('Donations/create-payment-intent', {
      amount: Math.round(selectedAmount * 100), // Convert to cents
      currency: 'usd',
      donationType: donationType === 'one-time' ? 1 : 2,
      donorEmail: donorInfo.email,
      donorName: donorInfo.name,
      donorPhone: donorInfo.phone,
      paymentMethod: 1 // Stripe
    });

    if (!response.isSuccessful) {
      throw new Error(response.remark || 'Failed to create payment intent');
    }

    return response.payload;
  };

  const confirmPayment = async (paymentIntentId: string): Promise<void> => {
    const response = await apiService.post<IAPIResponse<object>>('Donations/confirm-payment', {
      paymentIntentId,
      donorInfo
    });

    if (!response.isSuccessful) {
      throw new Error(response.remark || 'Payment confirmation failed');
    }
  };

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      onError('Stripe has not loaded yet. Please try again.');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      onError('Card element not found');
      return;
    }

    if (!cardComplete) {
      onError('Please complete your card information');
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Create payment intent on backend
      const { clientSecret, paymentIntentId } = await createPaymentIntent();

      console.log("Client secret is this: "+clientSecret);

      // Step 2: Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: donorInfo.name,
            email: donorInfo.email,
            phone: donorInfo.phone,
          },
        },
      });

      if (error) {
        onError(error.message || 'Payment failed. Please try again.');
        setIsProcessing(false);
        return;
      }

      if (paymentIntent?.status === 'succeeded') {
        // Step 3: Confirm payment on backend (optional - webhooks are better)
        try {
          await confirmPayment(paymentIntent.id);
        } catch (confirmError) {
          // Payment succeeded with Stripe, but backend confirmation failed
          // This is not critical as webhooks will handle it
          console.warn('Backend confirmation failed:', confirmError);
        }

        setIsProcessing(false);
        onSuccess();
      } else {
        onError('Payment was not successful. Please try again.');
        setIsProcessing(false);
      }
    } catch (error) {
      setIsProcessing(false);
      onError(error instanceof Error ? error.message : 'Payment failed. Please try again.');
    }
  };

  return (
    <div onSubmit={handleSubmit}>
      {/* Card Element */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <CreditCard className="w-4 h-4 inline mr-2" />
          {t('common.paymentInformation')}
        </label>
        <div className={`p-4 border-2 rounded-lg transition-colors ${
          cardError ? 'border-red-300' : cardComplete ? 'border-green-300' : 'border-gray-200 focus-within:border-pink-500'
        }`}>
          <CardElement
            options={CARD_ELEMENT_OPTIONS}
            onChange={handleCardChange}
          />
        </div>
        {cardError && (
          <p className="mt-2 text-sm text-red-600 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {cardError}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={!stripe || !cardComplete || isProcessing}
        className="w-full bg-gradient-to-r from-pink-500 to-violet-600 text-white font-semibold py-4 px-6 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            {t('common.processingPayment')}
          </div>
        ) : (
          `${t('common.donate')} $${selectedAmount} ${donationType === 'monthly' ? t('common.monthly') : t('common.now')}`
        )}
      </button>
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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!donorInfo.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(donorInfo.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!donorInfo.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (selectedAmount <= 0) {
      newErrors.amount = 'Please select a valid amount';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  const elementsOptions: StripeElementsOptions = {
    appearance: {
      theme: 'stripe',
    },
  };

  return (
    <div className="relative">
      {/* Main Donation Button */}
      <button
        onClick={openModal}
        className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white transition-all duration-300 bg-gradient-to-r from-pink-500 to-violet-600 rounded-full shadow-lg hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-pink-300"
      >
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

                  {/* Stripe Payment Form - Only show when form is valid */}
                  {isFormValid && (
                    <Elements stripe={stripePromise} options={elementsOptions}>
                      <DonationForm
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                        donorInfo={donorInfo}
                        selectedAmount={selectedAmount}
                        donationType={donationType}
                      />
                    </Elements>
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
                    <Check className="w-8 h-8 text-green-600" />
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