import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
import { AddressDTO, CustomerOrderRequest, OrderDetails, CartItem, PayPalOrder } from '@/models/members';

// PayPal configuration
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID; 

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

// PayPal response types
interface PayPalOrderResult {
  orderId: string;
  status: string;
  approvalUrl: string;
  links: Array<{ rel: string; href: string; method: string }>;
}

interface CaptureOrderResponse {
  transactionId: string;
  paymentStatus: string;
  paymentMethod: string;
  payerName: string;
  payerEmail: string;
  currency: string;
  amountPaid: string;
  paymentDate: string;
}

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

const CheckoutForm: React.FC<{
  cartItems: CartItem[];
  total: number;
  totalItems: number;
  useSystemAddress: boolean;
}> = ({ cartItems, total, totalItems, useSystemAddress }) => {
  const navigate = useNavigate();
  const paypalRef = useRef<HTMLDivElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [systemAddresses, setSystemAddresses] = useState<AddressDTO[]>([]);
  const [selectedBillingAddress, setSelectedBillingAddress] = useState<string>('');
  const [selectedShippingAddress, setSelectedShippingAddress] = useState<string>('');
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string>('');
  
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
    loadPayPalScript();
  }, [useSystemAddress]);

  useEffect(() => {
    if (paypalLoaded && paypalRef.current && window.paypal) {
      renderPayPalButtons();
    }
  }, [paypalLoaded, formData, selectedBillingAddress, selectedShippingAddress]);

  const loadPayPalScript = () => {
    // Check if PayPal script is already loaded
    if (window.paypal) {
      setPaypalLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD&intent=authorize`;
    script.addEventListener('load', () => setPaypalLoaded(true));
    script.addEventListener('error', () => setError('Failed to load PayPal SDK'));
    document.body.appendChild(script);
  };

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

  const validateForm = (): boolean => {
    if (!useSystemAddress) {
      const requiredFields = [
        'billingFirstName', 'billingLastName', 'billingEmail',
        'billingAddressLine1', 'billingCity', 'billingStateProvince', 'billingPostalCode'
      ];

      if (!formData.sameAsBilling) {
        requiredFields.push(
          'shippingFirstName', 'shippingLastName', 'shippingAddressLine1',
          'shippingCity', 'shippingStateProvince', 'shippingPostalCode'
        );
      }

      for (const field of requiredFields) {
        if (!formData[field as keyof CheckoutFormData]) {
          setError(`Please fill in all required fields`);
          return false;
        }
      }
    }

    if (useSystemAddress && (!selectedBillingAddress || !selectedShippingAddress)) {
      setError('Please select billing and shipping addresses');
      return false;
    }

    return true;
  };

  const createInternalOrder = async (): Promise<string> => {
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

    const orderResponse = await apiService.post<IAPIResponse<OrderDetails>>(
      'Orders/CustomerCreatesOrder', 
      orderCreation
    );

    if (!orderResponse || !orderResponse.isSuccessful || !orderResponse.payload) {
      throw new Error(orderResponse?.remark || 'Failed to create order');
    }

    setOrderNumber(orderResponse.payload.orderNumber);
    return orderResponse.payload.orderNumber;
  };

  const createPayPalOrderRequest = (orderNumber: string) => {
    return {
      orderNumber: orderNumber,
      purchaseUnits: [
        {
          amount: {
            currencyCode: 'USD',
            value: total.toFixed(2)
          },
          items: cartItems.map(item => ({
            name: item.productName || `Product ${item.productId}`,
            quantity: item.quantity.toString(),
            unitAmount: {
              currencyCode: 'USD',
              value: item.unitPrice.toFixed(2)
            }
          }))
        }
      ]
    };
  };
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.unitPrice * item.quantity), 0);
  };
  const renderPayPalButtons = () => {
    if (!window.paypal || !paypalRef.current) return;

    // Clear previous buttons
    paypalRef.current.innerHTML = '';

    window.paypal.Buttons({
      createOrder: async () => {
        console.log('PayPal createOrder called');
        try {
          setLoading(true);
          setError('');
          
          if (!validateForm()) {
            console.log('Form validation failed');
            setLoading(false);
            return Promise.reject(new Error('Form validation failed'));
          }

          console.log('Creating internal order...');
          const orderNum = await createInternalOrder();
          console.log('Internal order created:', orderNum);
          
          // Create PayPal order via your backend
          console.log('Creating PayPal order via backend...');
          const paypalOrderRequest : PayPalOrder = {
            intent: 'AUTHORIZE', 
            orderNumber: orderNum,
            purchaseUnits: [{
                reference_id: `PU-${Date.now()}`,
                description: 'Purchase from Things From Africa Store',
                custom_id: orderNum,
                soft_descriptor: 'ThingsFromAfricaStore',
                amount: {
                    currency_code: 'USD',
                    value: getTotalPrice().toFixed(2)
                },
                items: cartItems.map(item => ({
                    name: item.productName,
                    quantity: item.quantity.toString(),
                    unit_amount: {
                        currency_code: 'USD',
                        value: item.unitPrice.toFixed(2)
                    },
                    description: item.productDescription || item.productName,
                    sku: item.sku || `SKU-${item.productId}`,
                    category: 'PHYSICAL_GOODS'
                }))
            }]
        };
        
          
          const response = await apiService.post<IAPIResponse<PayPalOrderResult>>(
            'PayPal/create-order',
            paypalOrderRequest
          );

          console.log('PayPal order response:', response);

          if (!response || !response.isSuccessful || !response.payload?.orderId) {
            throw new Error(response?.remark || 'Failed to create PayPal order - no order ID returned');
          }

          setLoading(false);
          console.log('PayPal order ID:', response.payload.orderId);
          return response.payload.orderId;
        } catch (error: any) {
          console.error('PayPal createOrder error:', error);
          setError(error.message || 'Failed to create order');
          setLoading(false);
          return Promise.reject(error);
        }
      },
      
      onApprove: async (data: any) => {
        try {
          setLoading(true);
          console.log('PayPal onApprove called with data:', data);
          
          // Capture the payment via your backend
          const response = await apiService.post<IAPIResponse<CaptureOrderResponse>>(
            'PayPal/capture-order',
            {
              payPalOrderId: data.orderID,
              payerID: data.payerID
            }
          );

          if (!response || !response.isSuccessful) {
            throw new Error(response?.remark || 'Failed to capture payment');
          }

          console.log('Payment captured successfully:', response.payload);

          // Clear cart and redirect to success page
          cartService.clearCartCache();
          navigate('/order-success', {
            state: {
              orderNumber: orderNumber,
              paypalOrderId: data.orderID,
              captureDetails: response.payload
            }
          });
        } catch (error: any) {
          console.error('Payment capture error:', error);
          setError(error.message || 'Payment capture failed');
          setLoading(false);
        }
      },
      
      onError: (err: any) => {
        console.error('PayPal error:', err);
        setError('PayPal payment failed. Please try again.');
        setLoading(false);
      },
      
      onCancel: () => {
        console.log('PayPal payment cancelled');
        setError('Payment was cancelled');
        setLoading(false);
      }
    }).render(paypalRef.current);
  };

  return (
    <div className="space-y-6">
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

      {/* PayPal Payment Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Payment Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2">Processing...</span>
            </div>
          )}
          
          <div 
            ref={paypalRef}
            className={loading ? 'opacity-50 pointer-events-none' : ''}
          ></div>
          
          {!paypalLoaded && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Loading PayPal...</p>
            </div>
          )}
          
          <div className="mt-4 flex items-center text-sm text-gray-600">
            <Lock className="h-4 w-4 mr-2" />
            Your payment is secure and protected by PayPal
          </div>
        </CardContent>
      </Card>
    </div>
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
          <p className="text-gray-700">Complete your purchase with PayPal</p>
        </div>

        <CheckoutForm
          cartItems={cartItems}
          total={total}
          totalItems={totalItems}
          useSystemAddress={useSystemAddress}
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default Checkout;