import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {  cartService } from '../services/cartService';
import { authService } from '../services/authService';
import { useAppContext } from '../contexts/AppContext';
import { Trash2, Plus, Minus, ShoppingBag, CreditCard, Wallet } from 'lucide-react';
import { CartItem, CustomerOrderRequest, OrderDetails, PayPalOrder, PayPalOrderResponse } from '@/models/members';
import { apiService, IAPIResponse } from '@/lib/api';

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'traditional' | 'paypal'>('traditional');
  const [processingPayment, setProcessingPayment] = useState(false);
  const navigate = useNavigate();
  const { updateCartCount } = useAppContext();

  useEffect(() => {
    const loadCart = async () => {
      const isAuthenticated = await authService.checkSession();
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }
      try {
        const items = await cartService.getCartItems();
        setCartItems(items);
      } catch (error) {
        console.error('Failed to load cart:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [navigate]);

  const updateQuantity = async (cartId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeItem(cartId);
      return;
    }

    try {
      const existingItem = cartItems.find(item => item.cartId === cartId);
      const success = await cartService.updateCartItem(cartId, newQuantity, existingItem);
      if (success) {
        const items = await cartService.getCartItems();
        setCartItems(items);
        await updateCartCount();
      }
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  const removeItem = async (cartId: number) => {
    try {
      const success = await cartService.removeFromCart(cartId);
      if (success) {
        const items = await cartService.getCartItems();
        setCartItems(items);
        await updateCartCount();
      }
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.unitPrice * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleTraditionalCheckout = () => {
    // Navigate to traditional checkout flow
    navigate('/checkout', { 
      state: { 
        cartItems, 
        total: getTotalPrice(),
        totalItems: getTotalItems()
      }
    });
  };

  const handlePayPalCheckout = async () => {
    setProcessingPayment(true);
    
    try {

    const orderCreation:CustomerOrderRequest = {
      orderItems: cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        specialInstructions: '',
        giftMessage: '',
        giftWrapRequired: true
      })),
      totalAmount: getTotalPrice(),
      customerEmail: authService.getUserEmail(),
      useSystemAddress: false,
      orderNumber: '',
      customerId: '',
      customerPhone: '',
      billingFirstName: '',
      billingLastName: '',
      billingCompany: '',
      billingAddressLine1: '',
      billingAddressLine2: '',
      billingCity: '',
      billingStateProvince: '',
      billingPostalCode: '',
      billingCountryCode: '',
      shippingFirstName: '',
      shippingLastName: '',
      shippingCompany: '',
      shippingAddressLine1: '',
      shippingAddressLine2: '',
      shippingCity: '',
      shippingStateProvince: '',
      shippingPostalCode: '',
      shippingCountryCode: '',
      subTotal: 0,
      taxAmount: 0,
      shippingAmount: 0,
      discountAmount: 0,
      currency: '',
      isTouristOrder: false,
      touristCountry: '',
      requiresPhytosanitaryCertificate: false,
      customerNotes: '',
      adminNotes: '',
      requiredDate: ''
    };
    
    const orderResponse = await apiService.post<IAPIResponse<OrderDetails>>('Orders/CustomerCreatesOrder', orderCreation);
    
    if ( !orderResponse && !orderResponse.payload && !orderResponse.isSuccessful) {
      throw new Error('Failed to create order');
    }

      const orderData: PayPalOrder = {
        intent: 'CAPTURE',
        orderNumber: orderResponse.payload.orderNumber, 
        purchaseUnits: [{
          reference_id: `PU-${Date.now()}`,
          description: 'Purchase from My eCommerce Store',
          custom_id: orderResponse.payload.orderNumber, 
          soft_descriptor: 'ThingsFromAfricaStore', // 22-character max for card statements
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
            description: item.productDescription || item.productName, // fallback
            sku: item.sku || `SKU-${item.productId}`,
            category: 'PHYSICAL_GOODS'
          }))
        }]
      };
      
      // Call your backend to create PayPal order
      const response = await apiService.post<IAPIResponse<PayPalOrderResponse>>('PayPal/create-order',orderData);      
      if (response && response.isSuccessful && response.payload) {
        window.location.href = response.payload.approvalUrl;
      } else {
        throw new Error('Failed to create PayPal order');
      }
    } catch (error) {
      console.error('PayPal checkout failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="min-h-screen container mx-auto px-4 py-8 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="min-h-screen container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">Shopping Cart</h1>
          <p className="text-gray-700">
            {cartItems.length === 0 ? 'Your cart is empty' : `${getTotalItems()} items in your cart`}
          </p>
        </div>

        {cartItems.length === 0 ? (
          <Card className="border-gray-200 min-h-screen text-center py-12">
            <CardContent>
              <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-black mb-2">Your cart is empty</h3>
              <p className="text-gray-600 mb-6">Start shopping to add items to your cart</p>
              <Button 
                onClick={() => navigate('/shop')}
                className="bg-black hover:bg-gray-800"
              >
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, index) => (
                <Card key={index} className="border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">🎨</span>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-black">Product #{item.productId}</h3>
                        <p className="text-gray-600 text-sm">Added {new Date(item.addedAt).toLocaleDateString()}</p>
                        <p className="text-lg font-bold text-black">${item.unitPrice}</p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                          className="border-gray-300"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                          className="border-gray-300"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeItem(item.cartId)}
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="border-gray-200 sticky top-4">
                <CardHeader>
                  <CardTitle className="text-black">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal ({getTotalItems()} items)</span>
                    <span className="font-semibold">${getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-semibold">Free</span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                  </div>

                  {/* Payment Method Selection */}
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">Choose Payment Method</h4>
                    <div className="space-y-2">
                      <div 
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          paymentMethod === 'traditional' 
                            ? 'border-black bg-gray-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setPaymentMethod('traditional')}
                      >
                        <div className="flex items-center space-x-3">
                          <CreditCard className="h-5 w-5" />
                          <span>Traditional Checkout</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Enter shipping & payment details</p>
                      </div>
                      
                      <div 
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          paymentMethod === 'paypal' 
                            ? 'border-black bg-gray-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setPaymentMethod('paypal')}
                      >
                        <div className="flex items-center space-x-3">
                          <Wallet className="h-5 w-5" />
                          <span>PayPal Express</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Pay with your PayPal account</p>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Buttons */}
                  <div className="mt-6 space-y-3">
                    {paymentMethod === 'traditional' ? (
                      <Button 
                        className="w-full bg-black hover:bg-gray-800"
                        onClick={handleTraditionalCheckout}
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Proceed to Checkout
                      </Button>
                    ) : (
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={handlePayPalCheckout}
                        disabled={processingPayment}
                      >
                        {processingPayment ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        ) : (
                          <Wallet className="h-4 w-4 mr-2" />
                        )}
                        {processingPayment ? 'Processing...' : 'Pay with PayPal'}
                      </Button>
                    )}
                    
                    <Button 
                      variant="outline" 
                      className="w-full border-black text-black hover:bg-black hover:text-white"
                      onClick={() => navigate('/shop')}
                    >
                      Continue Shopping
                    </Button>
                  </div>

                  {/* Security Note */}
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      🔒 Your payment information is secure and encrypted
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;