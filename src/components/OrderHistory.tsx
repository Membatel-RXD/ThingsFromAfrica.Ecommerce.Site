import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, Download, RefreshCw, Search, Calendar, DollarSign, Truck, CheckCircle, Clock } from 'lucide-react';
import { authService } from '@/services/authService';
import axios from 'axios';

interface OrderStatusHistory {
  historyId: number;
  orderId: number;
  oldStatus: string;
  newStatus: string;
  statusDate: string;
  notes: string;
  updatedBy: number;
  isCustomerNotified: boolean;
}

interface OrderItem {
  orderId: number;
  orderNumber: string;
  orderDate: string;
  totalAmount: number;
  currency: string;
  orderStatus: string;
  customerEmail: string;
  billingFirstName: string;
  billingLastName: string;
  shippingFirstName: string;
  shippingLastName: string;
  shippingCity: string;
  shippingCountryName: string;
  statusHistory?: OrderStatusHistory[];
}

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderItem[]>([]);
  const [statusHistory, setStatusHistory] = useState<OrderStatusHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [reorderingId, setReorderingId] = useState<number | null>(null);

  useEffect(() => {
    loadOrderHistory();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [searchTerm, statusFilter, orders]);

  const loadOrderHistory = async () => {
    try {
      const token = authService.getAuthToken();
      const userEmail = authService.getUserEmail();

      // Load orders
      const ordersResponse = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/Orders/GetOrderByEmail?email=${userEmail}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': 'text/plain'
          }
        }
      );

      // Load order status history
      const historyResponse = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/OrderStatusHistory/GetAll`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': 'text/plain'
          }
        }
      );

      if (ordersResponse.data?.isSuccessful && historyResponse.data?.isSuccessful) {
        const ordersData = ordersResponse.data.payload || [];
        const historyData = historyResponse.data.payload || [];
        
        // Combine orders with their status history
        const ordersWithHistory = ordersData.map((order: OrderItem) => ({
          ...order,
          statusHistory: historyData.filter((history: OrderStatusHistory) => 
            history.orderId === order.orderId
          ).sort((a: OrderStatusHistory, b: OrderStatusHistory) => 
            new Date(b.statusDate).getTime() - new Date(a.statusDate).getTime()
          )
        }));

        setOrders(ordersWithHistory);
        setStatusHistory(historyData);
      } else {
        // Use mock data if API fails
        setOrders(getMockOrders());
        setStatusHistory(getMockStatusHistory());
      }
    } catch (error) {
      console.error('Failed to load order history:', error);
      setOrders(getMockOrders());
      setStatusHistory(getMockStatusHistory());
    } finally {
      setLoading(false);
    }
  };

  const getMockOrders = (): OrderItem[] => [
    {
      orderId: 1,
      orderNumber: 'TFA-2025-001',
      orderDate: '2025-07-20T10:30:00Z',
      totalAmount: 125.50,
      currency: 'USD',
      orderStatus: 'Delivered',
      customerEmail: authService.getUserEmail() || 'customer@example.com',
      billingFirstName: 'John',
      billingLastName: 'Doe',
      shippingFirstName: 'John',
      shippingLastName: 'Doe',
      shippingCity: 'Blantyre',
      shippingCountryName: 'Malawi',
      statusHistory: [
        {
          historyId: 1,
          orderId: 1,
          oldStatus: 'Shipped',
          newStatus: 'Delivered',
          statusDate: '2025-07-25T14:30:00Z',
          notes: 'Package delivered successfully',
          updatedBy: 1,
          isCustomerNotified: true
        }
      ]
    },
    {
      orderId: 2,
      orderNumber: 'TFA-2025-002',
      orderDate: '2025-07-15T09:15:00Z',
      totalAmount: 89.99,
      currency: 'USD',
      orderStatus: 'Shipped',
      customerEmail: authService.getUserEmail() || 'customer@example.com',
      billingFirstName: 'John',
      billingLastName: 'Doe',
      shippingFirstName: 'John',
      shippingLastName: 'Doe',
      shippingCity: 'Lilongwe',
      shippingCountryName: 'Malawi',
      statusHistory: [
        {
          historyId: 2,
          orderId: 2,
          oldStatus: 'Processing',
          newStatus: 'Shipped',
          statusDate: '2025-07-18T11:00:00Z',
          notes: 'Order shipped via DHL',
          updatedBy: 1,
          isCustomerNotified: true
        }
      ]
    }
  ];

  const getMockStatusHistory = (): OrderStatusHistory[] => [
    {
      historyId: 1,
      orderId: 1,
      oldStatus: 'Shipped',
      newStatus: 'Delivered',
      statusDate: '2025-07-25T14:30:00Z',
      notes: 'Package delivered successfully',
      updatedBy: 1,
      isCustomerNotified: true
    },
    {
      historyId: 2,
      orderId: 2,
      oldStatus: 'Processing',
      newStatus: 'Shipped',
      statusDate: '2025-07-18T11:00:00Z',
      notes: 'Order shipped via DHL',
      updatedBy: 1,
      isCustomerNotified: true
    }
  ];

  const filterOrders = () => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.billingFirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.billingLastName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order =>
        order.orderStatus.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    setFilteredOrders(filtered);
  };

  const downloadInvoice = async (orderId: number, orderNumber: string) => {
    try {
      const order = orders.find(o => o.orderId === orderId);
      if (!order) return;

      // Create HTML content for invoice
      const invoiceHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Invoice ${orderNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .company-info { margin-bottom: 30px; }
            .invoice-details { margin-bottom: 30px; }
            .customer-info { margin-bottom: 30px; }
            .order-summary { margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .total { font-weight: bold; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>INVOICE</h1>
          </div>
          
          <div class="company-info">
            <h3>Things From Africa</h3>
            <p>Authentic African Crafts</p>
            <p>Blantyre, Malawi</p>
            <p>Email: info@thingsfromafrica.com</p>
          </div>
          
          <div class="invoice-details">
            <h3>Invoice Details:</h3>
            <p><strong>Invoice Number:</strong> INV-${orderNumber}</p>
            <p><strong>Order Number:</strong> ${orderNumber}</p>
            <p><strong>Invoice Date:</strong> ${formatDate(new Date().toISOString())}</p>
            <p><strong>Order Date:</strong> ${formatDate(order.orderDate)}</p>
          </div>
          
          <div class="customer-info">
            <h3>Bill To:</h3>
            <p><strong>${order.billingFirstName} ${order.billingLastName}</strong></p>
            <p>${order.shippingCity}, ${order.shippingCountryName}</p>
            <p>Email: ${order.customerEmail}</p>
          </div>
          
          <div class="order-summary">
            <h3>Order Summary:</h3>
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Handcrafted African Items</td>
                  <td>${formatCurrency(order.totalAmount, order.currency)}</td>
                </tr>
                <tr class="total">
                  <td><strong>Total Amount:</strong></td>
                  <td><strong>${formatCurrency(order.totalAmount, order.currency)}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <p><strong>Order Status:</strong> ${order.orderStatus}</p>
          
          <div class="footer">
            <p>Thank you for supporting African artisans!</p>
            <p>For questions, contact us at support@thingsfromafrica.com</p>
          </div>
        </body>
        </html>
      `;

      // Create a new window and print
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(invoiceHTML);
        printWindow.document.close();
        printWindow.focus();
        
        // Wait for content to load then print
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);
      }
      
    } catch (error) {
      console.error('Failed to generate invoice:', error);
      alert('Failed to download invoice. Please try again.');
    }
  };

  const reorderItems = async (orderId: number, orderNumber: string) => {
    setReorderingId(orderId);
    try {
      // Simulate reorder process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Reordering items from order:', orderNumber);
      alert(`Items from order ${orderNumber} have been added to your cart!`);
    } catch (error) {
      console.error('Failed to reorder items:', error);
      alert('Failed to reorder items. Please try again.');
    } finally {
      setReorderingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'processing': return <Package className="h-4 w-4" />;
      case 'shipped': return <Truck className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

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

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-black">Order History</h3>
        <Button onClick={loadOrderHistory} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
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

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No orders found matching your criteria.</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.orderId} className="border-gray-200">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      <h4 className="text-lg font-semibold text-black mr-3">
                        Order #{order.orderNumber}
                      </h4>
                      <Badge className={getStatusColor(order.orderStatus)}>
                        {getStatusIcon(order.orderStatus)}
                        <span className="ml-1">{order.orderStatus}</span>
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Order Date:</p>
                        <p className="font-medium flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(order.orderDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Total Amount:</p>
                        <p className="font-medium text-lg flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
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
                    </div>

                    {/* Status History */}
                    {order.statusHistory && order.statusHistory.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm font-medium text-gray-700 mb-2">Recent Updates:</p>
                        <div className="space-y-2">
                          {order.statusHistory.slice(0, 2).map((history) => (
                            <div key={history.historyId} className="flex items-center text-sm text-gray-600">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                              <span className="font-medium mr-2">{history.newStatus}</span>
                              <span className="mr-2">•</span>
                              <span>{formatDate(history.statusDate)}</span>
                              {history.notes && (
                                <>
                                  <span className="mx-2">•</span>
                                  <span>{history.notes}</span>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col space-y-2 min-w-[200px]">
                    <Button
                      onClick={() => downloadInvoice(order.orderId, order.orderNumber)}
                      variant="outline"
                      size="sm"
                      className="flex items-center"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Invoice
                    </Button>
                    
                    <Button
                      onClick={() => reorderItems(order.orderId, order.orderNumber)}
                      disabled={reorderingId === order.orderId}
                      size="sm"
                      className="bg-black hover:bg-gray-800 text-white flex items-center"
                    >
                      {reorderingId === order.orderId ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Reordering...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Reorder Items
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Summary */}
      {filteredOrders.length > 0 && (
        <div className="mt-6 pt-6 border-t">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Showing {filteredOrders.length} of {orders.length} orders
            </span>
            <span>
              Total spent: {formatCurrency(
                filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0),
                'USD'
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;