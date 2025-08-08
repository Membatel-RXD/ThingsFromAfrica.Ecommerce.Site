
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { CreditCard, Lock, AlertCircle } from 'lucide-react';
import { authService } from '../services/authService';
import { cartService } from '../services/cartService';
import { apiService, IAPIResponse } from '@/lib/api';
import { AddressDTO, CustomerOrderRequest, OrderDetails, CartItem } from '@/models/members';

const stripePromise = loadStripe('pk_test_51Rs04G6RY5uQXuiJ081BEKW9xs4WBNHi2qODCCNsQJ5WCH38hwbI4vXanKKCotJSmqsRekMnJUSa8krYolN404cA00IqeBR3Oj');

interface CheckoutFormData {
  // Billing Address
  billingFirstName: string;
  billingLastName: string;
  billingEmail: string;
  billingPhone: string;
  billingCompany: string;
  billingAddressLine1: string;
  billingAddressLine2: string;
  billingCity: string;
  billingStateProvince: string;
  billingPostalCode: string;
  billingCountryCode: string;
  
  // Shipping Address
  shippingFirstName: string;
  shippingLastName: string;
  shippingCompany: string;
  shippingAddressLine1: string;
  shippingAddressLine2: string;
  shippingCity: string;
  shippingStateProvince: string;
  shippingPostalCode: string;
  shippingCountryCode: string;
  
  // Options
  sameAsBilling: boolean;
}

const CheckoutForm: React.FC<{
  cartItems: CartItem[];
  total: number;
  totalItems: number;
  useSystemAddress: boolean;
}> = ({ cartItems, total, totalItems, useSystemAddress }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [systemAddresses, setSystemAddresses] = useState<AddressDTO[]>([]);
  const [selectedBillingAddress, setSelectedBillingAddress] = useState<string>('');
  const [selectedShippingAddress, setSelectedShippingAddress] = useState<string>('');
  
  const [formData, setFormData] = useState<CheckoutFormData>({
    billingFirstName: '',
    billingLastName: '',
    billingEmail: authService.getUserEmail() || '',
    billingPhone: '',
    billingCompany: '',
    billingAddressLine1: '',
    billingAddressLine2: '',
    billingCity: '',
    billingStateProvince: '',
    billingPostalCode: '',
    billingCountryCode: 'US',
    shippingFirstName: '',
    shippingLastName: '',
    shippingCompany: '',
    shippingAddressLine1: '',
    shippingAddressLine2: '',
    shippingCity: '',
    shippingStateProvince: '',
    shippingPostalCode: '',
    shippingCountryCode: 'US',
    sameAsBilling: true
  });

  useEffect(() => {
    if (useSystemAddress) {
      loadSystemAddresses();
    }
  }, [useSystemAddress]);

  const loadSystemAddresses = async () => {
    const userId = authService.getUserId();
    try {
      const response = await apiService.get<IAPIResponse<AddressDTO[]>>(
        `UserAddresses/GetByCustomerId/${userId}`
      );
      if (response && response.isSuccessful && response.payload) {
        setSystemAddresses(response.payload);
        // Auto-select first addresses if available
        if (response.payload.length > 0) {
          setSelectedBillingAddress(response.payload[0].addressId?.toString() || '');
          setSelectedShippingAddress(response.payload[0].addressId?.toString() || '');
        }
      }
    } catch (error) {
      console.error('Failed to load addresses:', error);
    }
  };

  const handleInputChange = (field: keyof CheckoutFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getSelectedAddress = (addressId: string): AddressDTO | null => {
    return systemAddresses.find(addr => addr.addressId?.toString() === addressId) || null;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      setError('Stripe has not loaded yet. Please try again.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create order first
      const orderCreation: CustomerOrderRequest = {
        orderItems: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          specialInstructions: '',
          giftMessage: '',
          giftWrapRequired: false
        })),
        totalAmount: total,
        customerEmail: formData.billingEmail,
        useSystemAddress: useSystemAddress,
        orderNumber: '',
        customerId: authService.getUserId(),
        customerPhone: useSystemAddress ? '' : formData.billingPhone,
        
        // Billing address
        billingFirstName: useSystemAddress ? 
          getSelectedAddress(selectedBillingAddress)?.contactName || '' : 
          formData.billingFirstName,
        billingLastName: useSystemAddress ? 
          getSelectedAddress(selectedBillingAddress)?.contactName || '' : 
          formData.billingLastName,
        billingCompany: useSystemAddress ? 
          getSelectedAddress(selectedBillingAddress)?.contactName || '' : 
          formData.billingCompany,
        billingAddressLine1: useSystemAddress ? 
          getSelectedAddress(selectedBillingAddress)?.addressLine1 || '' : 
          formData.billingAddressLine1,
        billingAddressLine2: useSystemAddress ? 
          getSelectedAddress(selectedBillingAddress)?.addressLine2 || '' : 
          formData.billingAddressLine2,
        billingCity: useSystemAddress ? 
          getSelectedAddress(selectedBillingAddress)?.city || '' : 
          formData.billingCity,
        billingStateProvince: useSystemAddress ? 
          getSelectedAddress(selectedBillingAddress)?.stateProvince || '' : 
          formData.billingStateProvince,
        billingPostalCode: useSystemAddress ? 
          getSelectedAddress(selectedBillingAddress)?.postalCode || '' : 
          formData.billingPostalCode,
        billingCountryCode: useSystemAddress ? 
          getSelectedAddress(selectedBillingAddress)?.country || 'US' : 
          formData.billingCountryCode,
        
        // Shipping address
        shippingFirstName: useSystemAddress ? 
          getSelectedAddress(selectedShippingAddress)?.contactName || '' : 
          (formData.sameAsBilling ? formData.billingFirstName : formData.shippingFirstName),
        shippingLastName: useSystemAddress ? 
          getSelectedAddress(selectedShippingAddress)?.contactName || '' : 
          (formData.sameAsBilling ? formData.billingLastName : formData.shippingLastName),
        shippingCompany: useSystemAddress ? 
          getSelectedAddress(selectedShippingAddress)?.contactName || '' : 
          (formData.sameAsBilling ? formData.billingCompany : formData.shippingCompany),
        shippingAddressLine1: useSystemAddress ? 
          getSelectedAddress(selectedShippingAddress)?.addressLine1 || '' : 
          (formData.sameAsBilling ? formData.billingAddressLine1 : formData.shippingAddressLine1),
        shippingAddressLine2: useSystemAddress ? 
          getSelectedAddress(selectedShippingAddress)?.addressLine2 || '' : 
          (formData.sameAsBilling ? formData.billingAddressLine2 : formData.shippingAddressLine2),
        shippingCity: useSystemAddress ? 
          getSelectedAddress(selectedShippingAddress)?.city || '' : 
          (formData.sameAsBilling ? formData.billingCity : formData.shippingCity),
        shippingStateProvince: useSystemAddress ? 
          getSelectedAddress(selectedShippingAddress)?.stateProvince || '' : 
          (formData.sameAsBilling ? formData.billingStateProvince : formData.shippingStateProvince),
        shippingPostalCode: useSystemAddress ? 
          getSelectedAddress(selectedShippingAddress)?.postalCode || '' : 
          (formData.sameAsBilling ? formData.billingPostalCode : formData.shippingPostalCode),
        shippingCountryCode: useSystemAddress ? 
          getSelectedAddress(selectedShippingAddress)?.country || 'US' : 
          (formData.sameAsBilling ? formData.billingCountryCode : formData.shippingCountryCode),
        
        subTotal: total,
        taxAmount: 0,
        shippingAmount: 0,
        discountAmount: 0,
        currency: 'USD',
        isTouristOrder: false,
        touristCountry: '',
        requiresPhytosanitaryCertificate: false,
        customerNotes: '',
        adminNotes: '',
        requiredDate: null
      };

      // Create order
      const orderResponse = await apiService.post<IAPIResponse<OrderDetails>>(
        'Orders/CustomerCreatesOrder', 
        orderCreation
      );

      if (!orderResponse || !orderResponse.isSuccessful || !orderResponse.payload) {
        throw new Error(orderResponse?.remark || 'Failed to create order');
      }

      // Create payment intent
      const paymentIntentResponse = await apiService.post<IAPIResponse<{ clientSecret: string }>>(
        'Payments/create-payment-intent',
        {
          amount: Math.round(total * 100),
          currency: 'usd',
          orderNumber: orderResponse.payload.orderNumber,
          customerEmail: formData.billingEmail
        }
      );

      if (!paymentIntentResponse || !paymentIntentResponse.isSuccessful || !paymentIntentResponse.payload) {
        throw new Error('Failed to create payment intent');
      }

      // Confirm payment with Stripe
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        paymentIntentResponse.payload.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: `${formData.billingFirstName} ${formData.billingLastName}`,
              email: formData.billingEmail,
              phone: formData.billingPhone,
              address: {
                line1: formData.billingAddressLine1,
                line2: formData.billingAddressLine2,
                city: formData.billingCity,
                state: formData.billingStateProvince,
                postal_code: formData.billingPostalCode,
                country: formData.billingCountryCode,
              },
            },
          },
        }
      );

      if (stripeError) {
        throw new Error(stripeError.message || 'Payment failed');
      }

      if (paymentIntent?.status === 'succeeded') {
        // Clear cart and redirect to success page
        cartService.clearCartCache();
        navigate('/order-success', {
          state: {
            orderNumber: orderResponse.payload.orderNumber,
            paymentIntentId: paymentIntent.id
          }
        });
      } else {
        throw new Error('Payment was not completed successfully');
      }

    } catch (error: any) {
      console.error('Payment error:', error);
      setError(error.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {/* Billing Address Section */}
      <Card>
        <CardHeader>
          <CardTitle>Billing Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {useSystemAddress && systemAddresses.length > 0 ? (
            <div>
              <Label>Select Billing Address</Label>
              <select
                value={selectedBillingAddress}
                onChange={(e) => setSelectedBillingAddress(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {systemAddresses.map((address) => (
                  <option key={address.addressId} value={address.addressId?.toString()}>
                    {address.contactName} - {address.addressLine1}, {address.city}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="billingFirstName">First Name *</Label>
                  <Input
                    id="billingFirstName"
                    value={formData.billingFirstName}
                    onChange={(e) => handleInputChange('billingFirstName', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="billingLastName">Last Name *</Label>
                  <Input
                    id="billingLastName"
                    value={formData.billingLastName}
                    onChange={(e) => handleInputChange('billingLastName', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="billingEmail">Email *</Label>
                <Input
                  id="billingEmail"
                  type="email"
                  value={formData.billingEmail}
                  onChange={(e) => handleInputChange('billingEmail', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="billingPhone">Phone</Label>
                <Input
                  id="billingPhone"
                  value={formData.billingPhone}
                  onChange={(e) => handleInputChange('billingPhone', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="billingAddressLine1">Address Line 1 *</Label>
                <Input
                  id="billingAddressLine1"
                  value={formData.billingAddressLine1}
                  onChange={(e) => handleInputChange('billingAddressLine1', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="billingAddressLine2">Address Line 2</Label>
                <Input
                  id="billingAddressLine2"
                  value={formData.billingAddressLine2}
                  onChange={(e) => handleInputChange('billingAddressLine2', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="billingCity">City *</Label>
                  <Input
                    id="billingCity"
                    value={formData.billingCity}
                    onChange={(e) => handleInputChange('billingCity', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="billingStateProvince">State/Province *</Label>
                  <Input
                    id="billingStateProvince"
                    value={formData.billingStateProvince}
                    onChange={(e) => handleInputChange('billingStateProvince', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="billingPostalCode">Postal Code *</Label>
                  <Input
                    id="billingPostalCode"
                    value={formData.billingPostalCode}
                    onChange={(e) => handleInputChange('billingPostalCode', e.target.value)}
                    required
                  />
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Shipping Address Section */}
      <Card>
        <CardHeader>
          <CardTitle>Shipping Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!useSystemAddress && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sameAsBilling"
                checked={formData.sameAsBilling}
                onCheckedChange={(checked) => handleInputChange('sameAsBilling', checked as boolean)}
              />
              <Label htmlFor="sameAsBilling">Same as billing address</Label>
            </div>
          )}

          {useSystemAddress && systemAddresses.length > 0 ? (
            <div>
              <Label>Select Shipping Address</Label>
              <select
                value={selectedShippingAddress}
                onChange={(e) => setSelectedShippingAddress(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {systemAddresses.map((address) => (
                  <option key={address.addressId} value={address.addressId?.toString()}>
                    {address.contactName} - {address.addressLine1}, {address.city}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            !formData.sameAsBilling && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="shippingFirstName">First Name *</Label>
                    <Input
                      id="shippingFirstName"
                      value={formData.shippingFirstName}
                      onChange={(e) => handleInputChange('shippingFirstName', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="shippingLastName">Last Name *</Label>
                    <Input
                      id="shippingLastName"
                      value={formData.shippingLastName}
                      onChange={(e) => handleInputChange('shippingLastName', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="shippingAddressLine1">Address Line 1 *</Label>
                  <Input
                    id="shippingAddressLine1"
                    value={formData.shippingAddressLine1}
                    onChange={(e) => handleInputChange('shippingAddressLine1', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="shippingAddressLine2">Address Line 2</Label>
                  <Input
                    id="shippingAddressLine2"
                    value={formData.shippingAddressLine2}
                    onChange={(e) => handleInputChange('shippingAddressLine2', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="shippingCity">City *</Label>
                    <Input
                      id="shippingCity"
                      value={formData.shippingCity}
                      onChange={(e) => handleInputChange('shippingCity', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="shippingStateProvince">State/Province *</Label>
                    <Input
                      id="shippingStateProvince"
                      value={formData.shippingStateProvince}
                      onChange={(e) => handleInputChange('shippingStateProvince', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="shippingPostalCode">Postal Code *</Label>
                    <Input
                      id="shippingPostalCode"
                      value={formData.shippingPostalCode}
                      onChange={(e) => handleInputChange('shippingPostalCode', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </>
            )
          )}
        </CardContent>
      </Card>

      {/* Payment Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Payment Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 border border-gray-300 rounded-md">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                },
              }}
            />
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-600">
            <Lock className="h-4 w-4 mr-2" />
            Your payment information is secure and encrypted
          </div>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal ({totalItems} items)</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>$0.00</span>
            </div>
            <hr />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-black hover:bg-gray-800"
        disabled={!stripe || loading}
      >
        {loading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
        ) : (
          <CreditCard className="h-4 w-4 mr-2" />
        )}
        {loading ? 'Processing Payment...' : `Pay $${total.toFixed(2)}`}
      </Button>
    </form>
  );
};

const Checkout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, total, totalItems, useSystemAddress } = location.state || {};

  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  if (!cartItems || cartItems.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">Checkout</h1>
          <p className="text-gray-700">Complete your purchase</p>
        </div>

        <Elements stripe={stripePromise}>
          <CheckoutForm
            cartItems={cartItems}
            total={total}
            totalItems={totalItems}
            useSystemAddress={useSystemAddress}
          />
        </Elements>
      </main>
      
      <Footer />
    </div>
  );
};

export default Checkout;