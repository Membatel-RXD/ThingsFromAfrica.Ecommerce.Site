import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ShipmentTracker from '@/components/ShipmentTracker';
import FloatingButtons from '@/components/FloatingButtons';

const TrackOrder: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">Track Your Order</h1>
          <p className="text-gray-700">
            Enter your order number to track the status of your shipment.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <ShipmentTracker />
        </div>
        
        <div className="mt-12 bg-gray-100 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-black mb-4">Shipping Information</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-black">Delivery Times</h3>
              <p className="text-gray-700">
                Standard shipping typically takes 5-7 business days within Malawi, and 10-14 business days for international orders.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-black">Shipping Partners</h3>
              <p className="text-gray-700">
                We work with trusted shipping partners including DHL, FedEx, and local courier services to ensure your items arrive safely.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-black">Need Help?</h3>
              <p className="text-gray-700">
                If you have any questions about your shipment, please contact our customer service team at <a href="mailto:support@thingsfromafrica.com" className="text-blue-600 hover:underline">support@thingsfromafrica.com</a> or call us at +265 888 123 456.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <FloatingButtons />
      <Footer />
    </div>
  );
};

export default TrackOrder;