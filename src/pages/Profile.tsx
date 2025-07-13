import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { authService } from '../services/authService';
import { useAppContext } from '../contexts/AppContext';
import { 
  User, 
  LogOut, 
  CreditCard, 
  Gift, 
  MapPinned, 
  Heart, 
  Bell, 
  Package, 
  TrendingUp, 
  Award, 
  DollarSign,
  Truck,
  Star,
  Shield,
  Activity
} from 'lucide-react';

const Profile: React.FC = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loginHistory, setLoginHistory] = useState<any[]>([]);
  const [customerProfile, setCustomerProfile] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [promotionUsage, setPromotionUsage] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [wishList, setWishList] = useState<any[]>([]);
  const [shipments, setShipments] = useState<any[]>([]);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    promotions: true
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserData = async () => {
      const isAuthenticated = await authService.checkSession();
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }

      try {
        // Simulate API calls - replace with actual service calls
        const mockCustomerProfile = {
          userId: 12345,
          customerType: "Premium",
          companyName: "Tech Solutions Inc.",
          taxId: "TAX123456789",
          marketingOptIn: true,
          newsletterOptIn: true,
          smsOptIn: false,
          totalOrders: 24,
          totalSpent: 2450.75,
          averageOrderValue: 102.11,
          lastOrderDate: "2025-07-10T10:30:00.000Z",
          customerLifetimeValue: 3200.50,
          loyaltyPoints: 1250,
          loyaltyTier: "Gold",
          createdAt: "2024-01-15T08:00:00.000Z",
          modifiedAt: "2025-07-13T13:35:10.205Z"
        };

        const mockPayments = [
          {
            paymentId: 1,
            orderId: 101,
            paymentMethodId: 1,
            paymentAmount: 149.99,
            currency: "USD",
            paymentStatus: "Completed",
            transactionId: "TXN123456789",
            paymentReference: "REF001",
            paymentGateway: "Stripe",
            processorResponse: "Success",
            paymentDate: "2025-07-12T14:30:00.000Z",
            processedDate: "2025-07-12T14:30:15.000Z",
            createdAt: "2025-07-12T14:30:00.000Z",
            createdBy: 12345
          },
          {
            paymentId: 2,
            orderId: 102,
            paymentMethodId: 2,
            paymentAmount: 89.50,
            currency: "USD",
            paymentStatus: "Pending",
            transactionId: "TXN123456790",
            paymentReference: "REF002",
            paymentGateway: "PayPal",
            processorResponse: "Processing",
            paymentDate: "2025-07-11T16:45:00.000Z",
            processedDate: "2025-07-11T16:45:30.000Z",
            createdAt: "2025-07-11T16:45:00.000Z",
            createdBy: 12345
          }
        ];

        const mockPromotionUsage = [
          {
            usageId: 1,
            promotionId: 501,
            orderId: 101,
            discountAmount: 15.00,
            usedAt: "2025-07-12T14:30:00.000Z",
            customerId: 12345
          },
          {
            usageId: 2,
            promotionId: 502,
            orderId: 100,
            discountAmount: 25.00,
            usedAt: "2025-07-10T10:30:00.000Z",
            customerId: 12345
          }
        ];

        const mockAddresses = [
          {
            id: 1,
            type: "Home",
            street: "123 Main Street",
            city: "New York",
            state: "NY",
            zipCode: "10001",
            country: "USA",
            isDefault: true
          },
          {
            id: 2,
            type: "Work",
            street: "456 Business Ave",
            city: "New York",
            state: "NY",
            zipCode: "10002",
            country: "USA",
            isDefault: false
          }
        ];

        const mockShipments = [
          {
            id: 1,
            orderId: 101,
            trackingNumber: "TRK123456789",
            status: "In Transit",
            estimatedDelivery: "2025-07-15T18:00:00.000Z",
            carrier: "FedEx"
          },
          {
            id: 2,
            orderId: 100,
            trackingNumber: "TRK123456788",
            status: "Delivered",
            estimatedDelivery: "2025-07-11T16:00:00.000Z",
            carrier: "UPS"
          }
        ];

        const [historyResponse] = await Promise.all([
          authService.getLoginHistory()
        ]);

        if (historyResponse.isSuccessful) {
          setLoginHistory(historyResponse.payload);
        }

        // Set mock data
        setCustomerProfile(mockCustomerProfile);
        setPayments(mockPayments);
        setPromotionUsage(mockPromotionUsage);
        setAddresses(mockAddresses);
        setShipments(mockShipments);
        
      } catch (error) {
        console.error('Failed to load user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [navigate]);

  const { clearCart } = useAppContext();
  


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    let varianter = 'default';
    
    if (statusLower === 'success' || statusLower === 'completed' || statusLower === 'delivered') {
      varianter = 'default';
    } else if (statusLower === 'pending' || statusLower === 'processing' || statusLower === 'in transit') {
      varianter = 'secondary';
    } else if (statusLower === 'failed' || statusLower === 'error') {
      varianter = 'destructive';
    }
    
    return (
      <Badge variant={varianter}>
        {status}
      </Badge>
    );
  };

  const NavigationLink = ({ path, label, icon: Icon, isActive = false }) => (
    <button
      onClick={() => navigate(path)}
      className={`flex items-center w-full px-4 py-3 text-left rounded-lg transition-colors ${
        isActive
          ? 'bg-black text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      <Icon className="h-5 w-5 mr-3" />
      {label}
    </button>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Left Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-black">Account Menu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <NavigationLink path="/profile" label="Profile" icon={User} isActive={true} />
                <NavigationLink path="/profile/payments" label="Payments" icon={CreditCard} />
                <NavigationLink path="/profile/addresses" label="Addresses" icon={MapPinned} />
                <NavigationLink path="/profile/promotions" label="Promotions" icon={Gift} />
                <NavigationLink path="/profile/shipments" label="Shipments" icon={Truck} />
                <NavigationLink path="/profile/wishlist" label="Wishlist" icon={Heart} />
                <NavigationLink path="/profile/notifications" label="Notifications" icon={Bell} />
                <NavigationLink path="/profile/security" label="Security" icon={Shield} />
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Profile Header */}
            <div className="mb-8">
              <div className="mb-6">
                <h1 className="text-4xl font-bold text-black mb-2">My Profile</h1>
                <p className="text-gray-700">Welcome back! Manage your account and view your activity</p>
              </div>

              {/* Quick Stats */}
              {customerProfile && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  <Card className="border-gray-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Total Orders</p>
                          <p className="text-2xl font-bold text-black">{customerProfile.totalOrders}</p>
                        </div>
                        <Package className="h-8 w-8 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-gray-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Total Spent</p>
                          <p className="text-2xl font-bold text-black">{formatCurrency(customerProfile.totalSpent)}</p>
                        </div>
                        <DollarSign className="h-8 w-8 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-gray-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Loyalty Points</p>
                          <p className="text-2xl font-bold text-black">{customerProfile.loyaltyPoints}</p>
                        </div>
                        <Award className="h-8 w-8 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-gray-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Loyalty Tier</p>
                          <p className="text-2xl font-bold text-black">{customerProfile.loyaltyTier}</p>
                        </div>
                        <Star className="h-8 w-8 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>

            {/* Profile Content */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Account Information */}
                <Card className="border-gray-200">
                  <CardHeader>
                    <CardTitle className="flex items-center text-black">
                      <User className="h-5 w-5 mr-2" />
                      Account Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium">{authService.getUserEmail()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">User ID</p>
                        <p className="font-medium">{authService.getUserId()}</p>
                      </div>
                      {customerProfile && (
                        <>
                          <div>
                            <p className="text-sm text-gray-600">Customer Type</p>
                            <Badge variant="secondary">{customerProfile.customerType}</Badge>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Member Since</p>
                            <p className="font-medium">{formatDate(customerProfile.createdAt)}</p>
                          </div>
                          {customerProfile.companyName && (
                            <div>
                              <p className="text-sm text-gray-600">Company</p>
                              <p className="font-medium">{customerProfile.companyName}</p>
                            </div>
                          )}
                          <div>
                            <p className="text-sm text-gray-600">Average Order Value</p>
                            <p className="font-medium">{formatCurrency(customerProfile.averageOrderValue)}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="border-gray-200">
                  <CardHeader>
                    <CardTitle className="flex items-center text-black">
                      <Activity className="h-5 w-5 mr-2" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {customerProfile && (
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <Package className="h-4 w-4 text-gray-400 mr-3" />
                            <span className="text-sm">Last Order</span>
                          </div>
                          <span className="text-sm text-gray-600">{formatDate(customerProfile.lastOrderDate)}</span>
                        </div>
                      )}
                      {payments.slice(0, 3).map((payment) => (
                        <div key={payment.paymentId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <CreditCard className="h-4 w-4 text-gray-400 mr-3" />
                            <span className="text-sm">Payment #{payment.paymentId}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm">{formatCurrency(payment.paymentAmount)}</span>
                            {getStatusBadge(payment.paymentStatus)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Customer Insights */}
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-black">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Customer Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {customerProfile && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-black">{formatCurrency(customerProfile.customerLifetimeValue)}</p>
                        <p className="text-sm text-gray-600">Lifetime Value</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-black">{formatCurrency(customerProfile.averageOrderValue)}</p>
                        <p className="text-sm text-gray-600">Average Order Value</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-black">{customerProfile.totalOrders}</p>
                        <p className="text-sm text-gray-600">Total Orders</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;