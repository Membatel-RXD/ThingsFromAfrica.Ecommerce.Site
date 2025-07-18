import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { authService } from '../services/authService';
import { 
  User, 
  CreditCard, 
  Gift, 
  MapPinned, 
  Heart, 
  Bell, 
  Package, 
  Truck,
  Shield,
  Search,
  Filter,
  Calendar,
  ShoppingBag,
  DollarSign,
  Eye,
  Download,
  Clock
} from 'lucide-react';
import { apiService, IAPIResponse } from '@/lib/api';
import { OrderDTO } from '@/models/members';
import AccountSidebar from '@/components/LeftSidebarNav';


const Orders: React.FC = () => {
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<OrderDTO | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadOrders = async () => {
      const isAuthenticated = await authService.checkSession();
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }

      try {
        const email = authService.getUserEmail();
        const response = await apiService.get<IAPIResponse<OrderDTO[]>>(`Orders/GetOrderByEmail?email=${email}`);
        const ordersData = response.payload || [];
        setOrders(ordersData);
        setFilteredOrders(ordersData);
      } catch (error) {
        console.error('Failed to load orders:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [navigate]);

  useEffect(() => {
    let filtered = orders;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.billingFirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.billingLastName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.orderStatus.toLowerCase() === statusFilter.toLowerCase());
    }

    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, orders]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'processing':
        return <Package className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <Package className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const handleViewDetails = (order: OrderDTO) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
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

  const OrderDetailsModal = () => {
    if (!selectedOrder) return null;

    return (
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder.orderNumber}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Order Total</p>
                      <p className="text-xl font-bold text-black">
                        {formatCurrency(selectedOrder.totalAmount, selectedOrder.currency)}
                      </p>
                    </div>
                    <DollarSign className="h-6 w-6 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <Badge className={`${getStatusColor(selectedOrder.orderStatus)} mt-1`}>
                        {getStatusIcon(selectedOrder.orderStatus)}
                        <span className="ml-1">{selectedOrder.orderStatus}</span>
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Order Date</p>
                      <p className="text-sm font-medium text-black">
                        {formatDate(selectedOrder.orderDate)}
                      </p>
                    </div>
                    <Calendar className="h-6 w-6 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Billing Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Billing Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <p className="font-medium">
                      {selectedOrder.billingFirstName} {selectedOrder.billingLastName}
                    </p>
                    {selectedOrder.billingCompany && (
                      <p className="text-gray-600">{selectedOrder.billingCompany}</p>
                    )}
                    <p className="text-gray-600">{selectedOrder.billingAddressLine1}</p>
                    {selectedOrder.billingAddressLine2 && (
                      <p className="text-gray-600">{selectedOrder.billingAddressLine2}</p>
                    )}
                    <p className="text-gray-600">
                      {selectedOrder.billingCity}, {selectedOrder.billingStateProvince} {selectedOrder.billingPostalCode}
                    </p>
                    <p className="text-gray-600">{selectedOrder.billingCountryName}</p>
                    {selectedOrder.customerPhone && (
                      <p className="text-gray-600">{selectedOrder.customerPhone}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Shipping Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <p className="font-medium">
                      {selectedOrder.shippingFirstName} {selectedOrder.shippingLastName}
                    </p>
                    {selectedOrder.shippingCompany && (
                      <p className="text-gray-600">{selectedOrder.shippingCompany}</p>
                    )}
                    <p className="text-gray-600">{selectedOrder.shippingAddressLine1}</p>
                    {selectedOrder.shippingAddressLine2 && (
                      <p className="text-gray-600">{selectedOrder.shippingAddressLine2}</p>
                    )}
                    <p className="text-gray-600">
                      {selectedOrder.shippingCity}, {selectedOrder.shippingStateProvince} {selectedOrder.shippingPostalCode}
                    </p>
                    <p className="text-gray-600">{selectedOrder.shippingCountryName}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Order Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span>{formatCurrency(selectedOrder.subTotal, selectedOrder.currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax Amount:</span>
                    <span>{formatCurrency(selectedOrder.taxAmount, selectedOrder.currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping:</span>
                    <span>{formatCurrency(selectedOrder.shippingAmount, selectedOrder.currency)}</span>
                  </div>
                  {selectedOrder.discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount:</span>
                      <span>-{formatCurrency(selectedOrder.discountAmount, selectedOrder.currency)}</span>
                    </div>
                  )}
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>{formatCurrency(selectedOrder.totalAmount, selectedOrder.currency)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            {(selectedOrder.customerNotes || selectedOrder.isTouristOrder || selectedOrder.requiresPhytosanitaryCertificate) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Additional Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedOrder.customerNotes && (
                    <div>
                      <p className="font-medium text-gray-700">Customer Notes:</p>
                      <p className="text-gray-600">{selectedOrder.customerNotes}</p>
                    </div>
                  )}
                  {selectedOrder.isTouristOrder && (
                    <div>
                      <p className="font-medium text-gray-700">Tourist Order:</p>
                      <p className="text-gray-600">Yes - {selectedOrder.touristCountry}</p>
                    </div>
                  )}
                  {selectedOrder.requiresPhytosanitaryCertificate && (
                    <div>
                      <p className="font-medium text-gray-700">Phytosanitary Certificate:</p>
                      <p className="text-gray-600">Required</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Order Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Order placed on {formatDate(selectedOrder.orderDate)}</span>
                  </div>
                  {selectedOrder.shippedDate && (
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Shipped on {formatDate(selectedOrder.shippedDate)}</span>
                    </div>
                  )}
                  {selectedOrder.deliveredDate && (
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm">Delivered on {formatDate(selectedOrder.deliveredDate)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
              Close
            </Button>
            <Button className="bg-black text-white hover:bg-gray-800">
              <Download className="h-4 w-4 mr-2" />
              Download Receipt
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

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

          <AccountSidebar activePath="/profile/user/my-orders" />

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-black mb-2">My Orders</h1>
                  <p className="text-gray-700">Track and manage your order history</p>
                </div>
              </div>

              {/* Order Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card className="border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Orders</p>
                        <p className="text-2xl font-bold text-black">{orders.length}</p>
                      </div>
                      <ShoppingBag className="h-8 w-8 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Pending</p>
                        <p className="text-2xl font-bold text-black">
                          {orders.filter(o => o.orderStatus.toLowerCase() === 'pending').length}
                        </p>
                      </div>
                      <Clock className="h-8 w-8 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Shipped</p>
                        <p className="text-2xl font-bold text-black">
                          {orders.filter(o => o.orderStatus.toLowerCase() === 'shipped').length}
                        </p>
                      </div>
                      <Truck className="h-8 w-8 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Delivered</p>
                        <p className="text-2xl font-bold text-black">
                          {orders.filter(o => o.orderStatus.toLowerCase() === 'delivered').length}
                        </p>
                      </div>
                      <Package className="h-8 w-8 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search orders by number or name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Orders</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {filteredOrders.length === 0 ? (
                <Card className="border-gray-200">
                  <CardContent className="p-8 text-center">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
                    <p className="text-gray-600 mb-4">
                      {searchTerm || statusFilter !== 'all' 
                        ? 'Try adjusting your search or filter criteria'
                        : 'You haven\'t placed any orders yet'
                      }
                    </p>
                    <Button 
                      onClick={() => navigate('/shop')}
                      className="bg-black text-white hover:bg-gray-800"
                    >
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Start Shopping
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                filteredOrders.map((order) => (
                  <Card key={order.orderId} className="border-gray-200">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center mb-3">
                            <h3 className="text-lg font-semibold text-black mr-3">
                              Order #{order.orderNumber}
                            </h3>
                            <Badge className={getStatusColor(order.orderStatus)}>
                              {getStatusIcon(order.orderStatus)}
                              <span className="ml-1">{order.orderStatus}</span>
                            </Badge>
                            {order.isTouristOrder && (
                              <Badge variant="outline" className="ml-2">
                                Tourist Order
                              </Badge>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Order Date:</p>
                              <p className="font-medium">{formatDate(order.orderDate)}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Total Amount:</p>
                              <p className="font-medium text-lg">
                                {formatCurrency(order.totalAmount, order.currency)}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Shipping To:</p>
                              <p className="font-medium">
                                {order.shippingFirstName} {order.shippingLastName}
                              </p>
                              <p className="text-gray-500">
                                {order.shippingCity}, {order.shippingCountryName}
                              </p>
                            </div>
                            {order.shippedDate && (
                              <div>
                                <p className="text-gray-600">Shipped Date:</p>
                                <p className="font-medium">{formatDate(order.shippedDate)}</p>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col space-y-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(order)}
                            className="flex items-center"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download Receipt
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Order Details Modal */}
      <OrderDetailsModal />
      
      <Footer />
    </div>
  );
};

export default Orders;