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
  Activity,
  Settings
} from 'lucide-react';
import { apiService, IAPIResponse } from '@/lib/api';
import {  CustomerProfileContainerDTO } from '@/models/members';

const Profile: React.FC = () => {
  const [customerProfile, setCustomerProfile] = useState<CustomerProfileContainerDTO>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserData = async () => {
      const isAuthenticated = await authService.checkSession();
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }

      const email = authService.getUserEmail();
      try {
        const response = await apiService.get<IAPIResponse<CustomerProfileContainerDTO[]>>(`CustomerProfiles/GetCustomerProfiles?email=${email}`)

        const customerProfileData = response.payload || []
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
       

        // Set mock data
        setCustomerProfile(customerProfileData[0]);
        setPayments(mockPayments);
      
        
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
                <NavigationLink path="/user/addresses" label="Addresses" icon={MapPinned} />
                <NavigationLink path="/profile/promotions" label="Promotions" icon={Gift} />
                <NavigationLink path="/profile/shipments" label="Shipments" icon={Truck} />
                <NavigationLink path="/profile/wishlist" label="Wishlist" icon={Heart} />
                <NavigationLink path="/profile/notifications" label="Notifications" icon={Bell} />
                <NavigationLink path="/profile/security" label="Security" icon={Shield} />
                <NavigationLink path="/profile/settings" label="Settings" icon={Settings} />
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
                          <p className="text-2xl font-bold text-black">{customerProfile.customerProfile.totalOrders}</p>
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
                          <p className="text-2xl font-bold text-black">{formatCurrency(customerProfile.customerProfile.totalSpent)}</p>
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
                          <p className="text-2xl font-bold text-black">{customerProfile.customerProfile.loyaltyPoints}</p>
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
                          <p className="text-2xl font-bold text-black">{customerProfile.customerProfile.loyaltyTier}</p>
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
                            <Badge variant="secondary">{customerProfile.customerProfile.customerType}</Badge>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Member Since</p>
                            <p className="font-medium">{formatDate(customerProfile.userDetails.createdAt)}</p>
                          </div>
                          {customerProfile.customerProfile.companyName && (
                            <div>
                              <p className="text-sm text-gray-600">Company</p>
                              <p className="font-medium">{customerProfile.customerProfile.companyName}</p>
                            </div>
                          )}
                          <div>
                            <p className="text-sm text-gray-600">Average Order Value</p>
                            <p className="font-medium">{formatCurrency(customerProfile.customerProfile.averageOrderValue)}</p>
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
                          <span className="text-sm text-gray-600">{formatDate(customerProfile.customerProfile.lastOrderDate)}</span>
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
                        <p className="text-2xl font-bold text-black">{formatCurrency(customerProfile.customerProfile.customerLifetimeValue)}</p>
                        <p className="text-sm text-gray-600">Lifetime Value</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-black">{formatCurrency(customerProfile.customerProfile.averageOrderValue)}</p>
                        <p className="text-sm text-gray-600">Average Order Value</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-black">{customerProfile.customerProfile.totalOrders}</p>
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