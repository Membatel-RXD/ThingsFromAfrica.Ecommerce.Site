import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Package, Truck, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface ShipmentStatus {
  status: 'processing' | 'shipped' | 'in-transit' | 'delivered' | 'not-found';
  orderNumber: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  currentLocation?: string;
  statusHistory?: {
    date: string;
    status: string;
    location: string;
  }[];
}

const ShipmentTracker: React.FC = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [shipment, setShipment] = useState<ShipmentStatus | null>(null);
  const [loading, setLoading] = useState(false);

  // Track request and response for visualization
  const [requestData, setRequestData] = useState<string>('');
  const [responseData, setResponseData] = useState<string>('');
  const [showRequestResponse, setShowRequestResponse] = useState(false);

  const trackShipment = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Create request data for visualization
    const request = {
      orderNumber: orderNumber,
      timestamp: new Date().toISOString()
    };
    
    setRequestData(JSON.stringify(request, null, 2));
    setShowRequestResponse(true);
    
    // Simulate API call with mock data
    setTimeout(() => {
      // Create response object for visualization
      let response: any;
      
      // Mock data based on order number pattern
      if (orderNumber.startsWith('TFA')) {
        if (orderNumber === 'TFA12345') {
          response = {
            status: 'delivered',
            orderNumber,
            trackingNumber: 'TRK-98765',
            estimatedDelivery: '2025-07-15',
            currentLocation: 'Blantyre, Malawi',
            statusHistory: [
              { date: '2025-07-15', status: 'Delivered', location: 'Blantyre, Malawi' },
              { date: '2025-07-14', status: 'Out for delivery', location: 'Blantyre, Malawi' },
              { date: '2025-07-12', status: 'Arrived at destination', location: 'Blantyre, Malawi' },
              { date: '2025-07-10', status: 'In transit', location: 'Johannesburg, South Africa' },
              { date: '2025-07-08', status: 'Shipped', location: 'Lilongwe, Malawi' },
              { date: '2025-07-07', status: 'Processing', location: 'Lilongwe, Malawi' }
            ],
            timestamp: new Date().toISOString(),
            success: true
          };
        } else if (orderNumber === 'TFA54321') {
          response = {
            status: 'in-transit',
            orderNumber,
            trackingNumber: 'TRK-56789',
            estimatedDelivery: '2025-07-20',
            currentLocation: 'Johannesburg, South Africa',
            statusHistory: [
              { date: '2025-07-16', status: 'In transit', location: 'Johannesburg, South Africa' },
              { date: '2025-07-15', status: 'Shipped', location: 'Lilongwe, Malawi' },
              { date: '2025-07-14', status: 'Processing', location: 'Lilongwe, Malawi' }
            ],
            timestamp: new Date().toISOString(),
            success: true
          };
        } else if (orderNumber === 'TFA67890') {
          response = {
            status: 'processing',
            orderNumber,
            estimatedDelivery: '2025-07-25',
            currentLocation: 'Lilongwe, Malawi',
            statusHistory: [
              { date: '2025-07-16', status: 'Processing', location: 'Lilongwe, Malawi' }
            ],
            timestamp: new Date().toISOString(),
            success: true
          };
        } else {
          response = {
            status: 'shipped',
            orderNumber,
            trackingNumber: `TRK-${Math.floor(Math.random() * 90000) + 10000}`,
            estimatedDelivery: '2025-07-22',
            currentLocation: 'Lilongwe, Malawi',
            statusHistory: [
              { date: '2025-07-16', status: 'Shipped', location: 'Lilongwe, Malawi' },
              { date: '2025-07-15', status: 'Processing', location: 'Lilongwe, Malawi' }
            ],
            timestamp: new Date().toISOString(),
            success: true
          };
        }
      } else {
        response = {
          status: 'not-found',
          orderNumber,
          timestamp: new Date().toISOString(),
          success: false,
          error: 'Order not found'
        };
      }
      
      // Set response data for visualization
      setResponseData(JSON.stringify(response, null, 2));
      
      // Update shipment state
      setShipment(response);
      
      setLoading(false);
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing': return 'text-yellow-500';
      case 'shipped': return 'text-blue-500';
      case 'in-transit': return 'text-blue-700';
      case 'delivered': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing': return <Package className="h-6 w-6" />;
      case 'shipped': return <Truck className="h-6 w-6" />;
      case 'in-transit': return <Truck className="h-6 w-6" />;
      case 'delivered': return <CheckCircle className="h-6 w-6" />;
      case 'not-found': return <AlertCircle className="h-6 w-6" />;
      default: return <Clock className="h-6 w-6" />;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-black">Track Your Shipment</h2>
      
      <form onSubmit={trackShipment} className="mb-6">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <Label htmlFor="orderNumber" className="mb-1 block">Order Number</Label>
            <Input
              id="orderNumber"
              placeholder="Enter your order number (e.g., TFA12345)"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              required
            />
          </div>
          <Button 
            type="submit" 
            className="bg-black hover:bg-gray-800 mt-auto"
            disabled={loading}
          >
            {loading ? 'Tracking...' : 'Track Order'}
          </Button>
        </div>
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-gray-500">
            Try sample order numbers: TFA12345, TFA54321, or TFA67890
          </p>
          <button 
            type="button" 
            onClick={() => setShowRequestResponse(!showRequestResponse)}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            {showRequestResponse ? 'Hide' : 'Show'} API Details
          </button>
        </div>
      </form>

      {showRequestResponse && (
        <div className="mb-6 border rounded-lg p-4 bg-gray-50">
          <h3 className="text-lg font-bold mb-3 text-black">API Request/Response</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-black mb-2">Request</h4>
              <pre className="bg-gray-900 text-green-400 p-3 rounded text-xs overflow-auto max-h-60">
                {requestData}
              </pre>
            </div>
            
            <div>
              <h4 className="font-medium text-black mb-2">Response</h4>
              <pre className="bg-gray-900 text-blue-400 p-3 rounded text-xs overflow-auto max-h-60">
                {responseData}
              </pre>
            </div>
          </div>
        </div>
      )}

      {shipment && (
        <div className="border rounded-lg p-4">
          {shipment.status === 'not-found' ? (
            <div className="flex items-center text-red-500">
              <AlertCircle className="h-6 w-6 mr-2" />
              <div>
                <h3 className="font-bold">Order Not Found</h3>
                <p className="text-sm">We couldn't find any shipment with the order number {shipment.orderNumber}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center mb-4">
                <div className={`mr-3 ${getStatusColor(shipment.status)}`}>
                  {getStatusIcon(shipment.status)}
                </div>
                <div>
                  <h3 className="font-bold text-black">Order #{shipment.orderNumber}</h3>
                  <p className={`font-medium ${getStatusColor(shipment.status)}`}>
                    Status: {shipment.status.charAt(0).toUpperCase() + shipment.status.slice(1).replace('-', ' ')}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {shipment.trackingNumber && (
                  <div>
                    <p className="text-sm text-gray-500">Tracking Number</p>
                    <p className="font-medium">{shipment.trackingNumber}</p>
                  </div>
                )}
                
                {shipment.estimatedDelivery && (
                  <div>
                    <p className="text-sm text-gray-500">Estimated Delivery</p>
                    <p className="font-medium">{shipment.estimatedDelivery}</p>
                  </div>
                )}
                
                {shipment.currentLocation && (
                  <div>
                    <p className="text-sm text-gray-500">Current Location</p>
                    <p className="font-medium">{shipment.currentLocation}</p>
                  </div>
                )}
              </div>
              
              {shipment.statusHistory && (
                <div className="mt-6">
                  <h4 className="font-bold mb-3 text-black">Shipment History</h4>
                  <div className="space-y-4">
                    {shipment.statusHistory.map((event, index) => (
                      <div key={index} className="flex">
                        <div className="mr-4 relative">
                          <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                          {index < shipment.statusHistory!.length - 1 && (
                            <div className="absolute top-4 bottom-0 left-2 -ml-px w-0.5 bg-gray-300"></div>
                          )}
                        </div>
                        <div className="pb-4">
                          <p className="font-medium text-black">{event.status}</p>
                          <p className="text-sm text-gray-600">{event.date} • {event.location}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ShipmentTracker;