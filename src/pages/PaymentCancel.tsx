import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft, CreditCard, HelpCircle } from 'lucide-react';

const PaymentCancel: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      console.log('Payment cancelled for PayPal order:', token);
    }
  }, [searchParams]);

  const handleReturnToCart = () => {
    navigate('/cart');
  };

  const handleContinueShopping = () => {
    navigate('/shop');
  };

  const handleTryAgain = () => {
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="min-h-screen container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Cancel Header */}
          <div className="text-center mb-8">
            <XCircle className="h-20 w-20 text-orange-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-black mb-2">Payment Cancelled</h1>
            <p className="text-gray-600">Your payment was cancelled. No charges were made to your account.</p>
          </div>

          {/* Information Card */}
          <Card className="border-gray-200 mb-6">
            <CardHeader>
              <CardTitle className="text-black">What Happened?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-orange-600">!</span>
                  </div>
                  <div>
                    <p className="font-semibold">Payment Cancelled</p>
                    <p className="text-sm text-gray-600">You cancelled the payment process on PayPal's checkout page</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-green-600">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold">No Charges Made</p>
                    <p className="text-sm text-gray-600">Your payment method was not charged</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-blue-600">i</span>
                  </div>
                  <div>
                    <p className="font-semibold">Cart Saved</p>
                    <p className="text-sm text-gray-600">Your items are still in your cart and ready for checkout</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Options Card */}
          <Card className="border-gray-200 mb-6">
            <CardHeader>
              <CardTitle className="text-black">What Would You Like to Do?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                    <div className="flex items-center space-x-3 mb-2">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold">Try Different Payment</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Return to cart and try with a different payment method
                    </p>
                    <Button 
                      onClick={handleReturnToCart}
                      className="w-full bg-black hover:bg-gray-800"
                    >
                      Return to Cart
                    </Button>
                  </div>
                  
                  <div className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                    <div className="flex items-center space-x-3 mb-2">
                      <ArrowLeft className="h-5 w-5 text-green-600" />
                      <h3 className="font-semibold">Continue Shopping</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Browse more products and come back later
                    </p>
                    <Button 
                      onClick={handleContinueShopping}
                      variant="outline"
                      className="w-full border-black text-black hover:bg-black hover:text-white"
                    >
                      Browse Products
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Help Card */}
          <Card className="border-gray-200 mb-6">
            <CardHeader>
              <CardTitle className="text-black flex items-center">
                <HelpCircle className="h-5 w-5 mr-2" />
                Need Help?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-gray-600">
                  If you're having trouble with the payment process, here are some common solutions:
                </p>
                
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Make sure your PayPal account has sufficient funds or a valid payment method</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Try using a different browser or clearing your browser cache</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Contact PayPal support if you're having account issues</span>
                  </li>
                </ul>
                
                <div className="pt-4 border-t border-gray-200">
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/contact')}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Contact Our Support
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={handleTryAgain}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Try Payment Again
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/')}
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Go to Homepage
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PaymentCancel;