import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package, CreditCard, Clock, AlertCircle } from 'lucide-react';
import { apiService, IAPIResponse } from '@/lib/api';
import { useAppContext } from '../contexts/AppContext';
import { CaptureOrderResponse } from '@/models/members';

function formatToReadableDate(isoDate: string, locale: string = 'en-US'): string {
  if (!isoDate) return 'N/A';
  const date = new Date(isoDate);
  return date.toLocaleString(locale, {
      dateStyle: 'long',  // "July 17, 2025"
      timeStyle: 'short', // "9:13 PM"
  });
}


const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { updateCartCount } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [captureResult, setCaptureResult] = useState<CaptureOrderResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const captureCalled = useRef(false); // 👈 Lock to prevent multiple calls

  const paypalOrderIdErr = sessionStorage.getItem('paypalOrderId');
  const orderNumber = sessionStorage.getItem('orderNumber');
  

  useEffect(() => {
    const capturePayment = async () => {
      if (captureCalled.current) {
        console.log('Capture already called, skipping...');
        return;
      }
      captureCalled.current = true; // 👈 Set lock
  
      const token = searchParams.get('token'); 
      const payerId = searchParams.get('PayerID');
  
      if (!token || !payerId) {
        setError('Missing payment parameters');
        setLoading(false);
        return;
      }
  
      try {
        const response = await apiService.post<IAPIResponse<CaptureOrderResponse>>(
          'PayPal/capture-order',
          { 
            paypalOrderId: token,
            payerId: payerId
          }
        );
  
        if (response && response.isSuccessful && response.payload) {
          console.log('✅ Payment capture successful');
          console.log(JSON.stringify(response.payload));
  
          setCaptureResult(response.payload);
          await updateCartCount();
        } else {
          setError(response?.remark || 'Failed to capture payment');
        }
      } catch (error) {
        console.error('Payment capture failed:', error);
        setError('An error occurred while processing your payment');
      } finally {
        setLoading(false);
      }
    };
  
    capturePayment();
  }, [searchParams, updateCartCount]);
  

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="min-h-screen container mx-auto px-4 py-8 flex justify-center items-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-lg font-semibold">Processing your payment...</p>
            <p className="text-gray-600">Please wait while we confirm your order</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="min-h-screen container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-8 text-center">
                <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-red-800 mb-2">Payment Processing Error</h1>
                <p className="text-red-700 mb-6">{error}</p>
                <div className="space-y-3">
                  <Button 
                    onClick={() => navigate('/cart')}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Return to Cart
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/contact')}
                    className="border-red-300 text-red-700 hover:bg-red-50"
                  >
                    Contact Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!captureResult) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="min-h-screen container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-8 text-center">
                <Clock className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-yellow-800 mb-2">Payment Status Unknown</h1>
                <p className="text-yellow-700 mb-6">We couldn't retrieve your payment information</p>
                <Button 
                  onClick={() => navigate('/orders')}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  Check My Orders
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="min-h-screen container mx-auto px-4 py-8">
  <div className="max-w-2xl mx-auto">
    {/* Success Header */}
    <div className="text-center mb-8">
      <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
      <h1 className="text-4xl font-bold text-black mb-2">Payment Successful!</h1>
      <p className="text-gray-600">Thank you for your purchase. Your order has been confirmed.</p>
    </div>

    {/* Order Summary Card */}
    <Card className="border-gray-200 mb-6">
      <CardHeader>
        <CardTitle className="text-black flex items-center">
          <Package className="h-5 w-5 mr-2" />
          Order Confirmation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Order Number</p>
            <p className="font-semibold">{orderNumber || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">PayPal Transaction ID</p>
            <p className="font-semibold text-sm">{paypalOrderIdErr || 'N/A'}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Payment Status</p>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {captureResult?.paymentStatus || 'Unknown'}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-600">Date</p>
            <p className="font-semibold">
              {formatToReadableDate(captureResult?.paymentDate)}
            </p>
          </div>
        </div>
        
        <hr className="border-gray-200" />
        
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">Total Paid</span>
          <span className="text-2xl font-bold text-green-600">
            ${captureResult?.amountPaid}{' '}
            {captureResult?.currency || ''}
          </span>
        </div>
      </CardContent>
    </Card>

    {/* Payment Details Card */}
    <Card className="border-gray-200 mb-6">
      <CardHeader>
        <CardTitle className="text-black flex items-center">
          <CreditCard className="h-5 w-5 mr-2" />
          Payment Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-gray-600">Payment Method</p>
          <p className="font-semibold">PayPal</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Payer Name</p>
          <p className="font-semibold">
            {captureResult?.payerName}
          </p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Payer Email</p>
          <p className="font-semibold">{captureResult?.payerEmail}</p>
        </div>
      </CardContent>
    </Card>

    {/* Next Steps Card */}
    <Card className="border-gray-200 mb-6">
      <CardHeader>
        <CardTitle className="text-black">What's Next?</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-blue-600">1</span>
            </div>
            <div>
              <p className="font-semibold">Order Processing</p>
              <p className="text-sm text-gray-600">We're preparing your order for shipment</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-blue-600">2</span>
            </div>
            <div>
              <p className="font-semibold">Email Confirmation</p>
              <p className="text-sm text-gray-600">You'll receive an email with your order details</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-blue-600">3</span>
            </div>
            <div>
              <p className="font-semibold">Shipping Updates</p>
              <p className="text-sm text-gray-600">Track your package once it ships</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Action Buttons */}
    <div className="flex flex-col sm:flex-row gap-4">
      <Button 
        onClick={() => navigate('/orders')}
        className="flex-1 bg-black hover:bg-gray-800"
      >
        View My Orders
      </Button>
      <Button 
        variant="outline"
        onClick={() => navigate('/shop')}
        className="flex-1 border-black text-black hover:bg-black hover:text-white"
      >
        Continue Shopping
      </Button>
    </div>
  </div>
</main>

      <Footer />
    </div>
  );
};

export default PaymentSuccess;