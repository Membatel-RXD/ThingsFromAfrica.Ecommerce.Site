import React, { useState } from 'react';
import { Package, Truck, CheckCircle, Clock, AlertCircle, Search, MapPin, Calendar, Phone, Mail, Globe, Shield, ArrowRight, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AppLayout from '@/components/AppLayout';

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

const TrackOrderPage: React.FC = () => {
  const { t } = useTranslation();
  const [orderNumber, setOrderNumber] = useState('');
  const [shipment, setShipment] = useState<ShipmentStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [showRequestResponse, setShowRequestResponse] = useState(false);
  const [requestData, setRequestData] = useState<string>('');
  const [responseData, setResponseData] = useState<string>('');

  const trackShipment = () => {
    if (!orderNumber.trim()) return;
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
      let response: any;
      
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
      
      setResponseData(JSON.stringify(response, null, 2));
      setShipment(response);
      setLoading(false);
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing': return 'text-amber-500';
      case 'shipped': return 'text-blue-500';
      case 'in-transit': return 'text-indigo-500';
      case 'delivered': return 'text-emerald-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'processing': return 'bg-gradient-to-br from-amber-50 to-orange-100';
      case 'shipped': return 'bg-gradient-to-br from-blue-50 to-indigo-100';
      case 'in-transit': return 'bg-gradient-to-br from-indigo-50 to-purple-100';
      case 'delivered': return 'bg-gradient-to-br from-emerald-50 to-green-100';
      default: return 'bg-gray-50';
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
    <AppLayout>

  <div className="bg-[#F8F4EF] min-h-screen">
    {/* Header Section */}
      <section className="bg-gradient-to-r from-gray-900 to-black text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-4xl mx-auto">
              
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white">
              {t('pages.trackOrder.title')}
            </h1>
            <p className="text-xl text-white-600 max-w-2xl mx-auto">
              {t('pages.trackOrder.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Tracking Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Tracking Form */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 mb-8 shadow-lg">
              <div className="mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('pages.trackOrder.orderNumber')}
                    </label>
                    <input
                      id="orderNumber"
                      type="text"
                      placeholder={t('pages.trackOrder.placeholder')}
                      value={orderNumber}
                      onChange={(e) => setOrderNumber(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-colors text-lg"
                    />
                  </div>
                  <button 
                    onClick={trackShipment}
                    className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 mt-auto disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>{t('pages.trackOrder.tracking')}</span>
                      </>
                    ) : (
                      <>
                        <Search className="h-5 w-5" />
                        <span>{t('pages.trackOrder.trackOrder')}</span>
                      </>
                    )}
                  </button>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <p className="text-sm text-gray-500">
                    {t('pages.trackOrder.sampleNumbers')}
                  </p>
                  <button 
                    onClick={() => setShowRequestResponse(!showRequestResponse)}
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  >
                  </button>
                </div>
              </div>
            </div>

            {/* Tracking Results */}
            {shipment && (
              <div className={`rounded-2xl border-2 p-8 ${getStatusBgColor(shipment.status)} ${shipment.status === 'not-found' ? 'border-red-200' : 'border-gray-200'}`}>
                {shipment.status === 'not-found' ? (
                  <div className="text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-4 bg-red-100 rounded-full">
                        <AlertCircle className="h-12 w-12 text-red-500" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-red-600 mb-2">{t('pages.trackOrder.orderNotFound')}</h3>
                    <p className="text-red-700 mb-6">
                      {t('pages.trackOrder.orderNotFoundDesc', { orderNumber: shipment.orderNumber })}
                    </p>
                    <p className="text-sm text-red-600">
                      {t('pages.trackOrder.checkOrderNumber')}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Status Header */}
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center">
                        <div className={`mr-4 p-3 bg-black rounded-full`}>
                          <div className="text-white">
                            {getStatusIcon(shipment.status)}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-black">Order #{shipment.orderNumber}</h3>
                          <p className={`text-lg font-medium ${getStatusColor(shipment.status)}`}>
                            {shipment.status.charAt(0).toUpperCase() + shipment.status.slice(1).replace('-', ' ')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{t('pages.trackOrder.lastUpdated')}</p>
                        <p className="font-medium">{new Date().toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    {/* Tracking Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      {shipment.trackingNumber && (
                        <div className="bg-white/60 rounded-xl p-4">
                          <div className="flex items-center mb-2">
                            <Package className="h-5 w-5 text-gray-500 mr-2" />
                            <p className="text-sm text-gray-500">{t('pages.trackOrder.trackingNumber')}</p>
                          </div>
                          <p className="font-bold text-lg text-black">{shipment.trackingNumber}</p>
                        </div>
                      )}
                      
                      {shipment.estimatedDelivery && (
                        <div className="bg-white/60 rounded-xl p-4">
                          <div className="flex items-center mb-2">
                            <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                            <p className="text-sm text-gray-500">{t('pages.trackOrder.estimatedDelivery')}</p>
                          </div>
                          <p className="font-bold text-lg text-black">{shipment.estimatedDelivery}</p>
                        </div>
                      )}
                      
                      {shipment.currentLocation && (
                        <div className="bg-white/60 rounded-xl p-4">
                          <div className="flex items-center mb-2">
                            <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                            <p className="text-sm text-gray-500">{t('pages.trackOrder.currentLocation')}</p>
                          </div>
                          <p className="font-bold text-lg text-black">{shipment.currentLocation}</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Shipment History */}
                    {shipment.statusHistory && (
                      <div className="bg-white/60 rounded-xl p-6">
                        <h4 className="text-xl font-bold mb-6 text-black flex items-center">
                          <Clock className="h-5 w-5 mr-2" />
                          {t('pages.trackOrder.shipmentHistory')}
                        </h4>
                        <div className="space-y-6">
                          {shipment.statusHistory.map((event, index) => (
                            <div key={index} className="flex items-start">
                              <div className="mr-6 relative">
                                <div className={`h-4 w-4 rounded-full ${index === 0 ? 'bg-black' : 'bg-gray-400'}`}></div>
                                {index < shipment.statusHistory!.length - 1 && (
                                  <div className="absolute top-4 left-2 -ml-px w-0.5 h-12 bg-gray-300"></div>
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="font-bold text-black text-lg">{event.status}</p>
                                <p className="text-gray-600 flex items-center">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  {event.date}
                                  <MapPin className="h-4 w-4 ml-4 mr-1" />
                                  {event.location}
                                </p>
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
        </div>
      </section>

      {/* Shipping Information Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-black">{t('pages.trackOrder.shippingInfo')}</h2>
            <p className="text-xl text-gray-600">{t('pages.trackOrder.shippingInfoDesc')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 hover:shadow-lg transition-shadow">
              <div className="p-3 bg-blue-100 rounded-full w-fit mb-4">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-black mb-3">{t('pages.trackOrder.deliveryTimes')}</h3>
              <p className="text-gray-700">
                {t('pages.trackOrder.deliveryTimesDesc')}
              </p>
            </div>

            <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 hover:shadow-lg transition-shadow">
              <div className="p-3 bg-green-100 rounded-full w-fit mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-black mb-3">{t('pages.trackOrder.shippingPartners')}</h3>
              <p className="text-gray-700">
                {t('pages.trackOrder.shippingPartnersDesc')}
              </p>
            </div>

            <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 hover:shadow-lg transition-shadow">
              <div className="p-3 bg-purple-100 rounded-full w-fit mb-4">
                <Sparkles className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-black mb-3">{t('pages.trackOrder.needHelp')}</h3>
              <p className="text-gray-700 mb-4">
                {t('pages.trackOrder.needHelpDesc')}
              </p>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-gray-500 mr-2" />
                  <a href="mailto:support@thingsfromafrica.com" className="text-blue-600 hover:underline text-sm">
                    support@thingsfromafrica.com
                  </a>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-gray-500 mr-2" />
                  <a href="tel:+265888123456" className="text-blue-600 hover:underline text-sm">
                    +265 888 123 456
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    </AppLayout>
  );
};

export default TrackOrderPage;