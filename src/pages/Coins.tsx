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
  LucideCoins, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Gift, 
  ShoppingCart, 
  RefreshCw,
  History,
  Wallet,
  Award,
  Star,
  ArrowUpRight,
} from 'lucide-react';
import { apiService, IAPIResponse } from '@/lib/api';
import AccountSidebar from '@/components/LeftSidebarNav';

interface CoinTransaction {
  transactionId: number;
  userId: number;
  amount: number;
  type: 'earned' | 'spent' | 'bonus' | 'refund' | 'expired';
  description: string;
  orderId?: number;
  createdAt: string;
  expiresAt?: string;
  status: 'active' | 'expired' | 'pending';
}

interface CoinBalance {
  totalCoins: number;
  availableCoins: number;
  pendingCoins: number;
  expiredCoins: number;
  lifetimeEarned: number;
  lifetimeSpent: number;
}

const Coins: React.FC = () => {
  const [coinBalance, setCoinBalance] = useState<CoinBalance>({
    totalCoins: 0,
    availableCoins: 0,
    pendingCoins: 0,
    expiredCoins: 0,
    lifetimeEarned: 0,
    lifetimeSpent: 0
  });
  const [transactions, setTransactions] = useState<CoinTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [transactionFilter, setTransactionFilter] = useState('all');
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);
  const [redeemAmount, setRedeemAmount] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadCoinData = async () => {
      const isAuthenticated = await authService.checkSession();
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }

      try {
        const userId = authService.getUserId();
        
        // Load coin balance
        const balanceResponse = await apiService.get<IAPIResponse<CoinBalance>>(`Coins/GetBalance?userId=${userId}`);
        if (balanceResponse.payload) {
          setCoinBalance(balanceResponse.payload);
        }

        // Load transaction history
        const transactionsResponse = await apiService.get<IAPIResponse<CoinTransaction[]>>(`Coins/GetTransactions?userId=${userId}`);
        if (transactionsResponse.payload) {
          setTransactions(transactionsResponse.payload);
        }
      } catch (error) {
        console.error('Failed to load coin data:', error);
        // Mock data for demonstration
        setCoinBalance({
          totalCoins: 2450,
          availableCoins: 2450,
          pendingCoins: 150,
          expiredCoins: 300,
          lifetimeEarned: 5200,
          lifetimeSpent: 2750
        });
        setTransactions([
          {
            transactionId: 1,
            userId: 1,
            amount: 100,
            type: 'earned',
            description: 'Purchase reward for Order #12345',
            orderId: 12345,
            createdAt: '2025-07-15T10:30:00Z',
            status: 'active'
          },
          {
            transactionId: 2,
            userId: 1,
            amount: -50,
            type: 'spent',
            description: 'Discount applied to Order #12346',
            orderId: 12346,
            createdAt: '2025-07-10T14:20:00Z',
            status: 'active'
          },
          {
            transactionId: 3,
            userId: 1,
            amount: 200,
            type: 'bonus',
            description: 'Welcome bonus',
            createdAt: '2025-07-05T09:15:00Z',
            status: 'active'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadCoinData();
  }, [navigate]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'earned':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'spent':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'bonus':
        return <Gift className="h-4 w-4 text-blue-600" />;
      case 'refund':
        return <RefreshCw className="h-4 w-4 text-orange-600" />;
      default:
        return <LucideCoins className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTransactionColor = (type: string, amount: number) => {
    if (amount > 0) {
      return 'text-green-600';
    } else {
      return 'text-red-600';
    }
  };

  const getTransactionBadgeColor = (type: string) => {
    switch (type) {
      case 'earned':
        return 'bg-green-100 text-green-800';
      case 'spent':
        return 'bg-red-100 text-red-800';
      case 'bonus':
        return 'bg-blue-100 text-blue-800';
      case 'refund':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (transactionFilter === 'all') return true;
    return transaction.type === transactionFilter;
  });

  const handleRedeem = async () => {
    const amount = parseInt(redeemAmount);
    if (!amount || amount <= 0 || amount > coinBalance.availableCoins) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      // API call to redeem coins
      const response = await apiService.post<IAPIResponse<any>>('Coins/Redeem', {
        userId: authService.getUserId(),
        amount: amount
      });

      if (response.isSuccessful) {
        // Update balance
        setCoinBalance(prev => ({
          ...prev,
          availableCoins: prev.availableCoins - amount,
          lifetimeSpent: prev.lifetimeSpent + amount
        }));

        // Add transaction
        const newTransaction: CoinTransaction = {
          transactionId: Date.now(),
          userId: authService.getUserId(),
          amount: -amount,
          type: 'spent',
          description: `Redeemed ${amount} coins for discount`,
          createdAt: new Date().toISOString(),
          status: 'active'
        };
        setTransactions(prev => [newTransaction, ...prev]);

        setIsRedeemModalOpen(false);
        setRedeemAmount('');
      }
    } catch (error) {
      console.error('Failed to redeem coins:', error);
    }
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
          {/* Left Sidebar Navigation */}
          <AccountSidebar activePath="/coins" />

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-black mb-2">My Coins</h1>
                  <p className="text-gray-700">Earn coins with every purchase and redeem them for discounts</p>
                </div>
                <Dialog open={isRedeemModalOpen} onOpenChange={setIsRedeemModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-black text-white hover:bg-gray-800">
                      <ArrowUpRight className="h-4 w-4 mr-2" />
                      Redeem Coins
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Redeem Coins</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-2">
                          Available Coins: <span className="font-semibold">{coinBalance.availableCoins}</span>
                        </p>
                        <p className="text-sm text-gray-600 mb-4">
                          1 Coin = $0.01 USD
                        </p>
                        <Input
                          type="number"
                          placeholder="Enter amount to redeem"
                          value={redeemAmount}
                          onChange={(e) => setRedeemAmount(e.target.value)}
                          max={coinBalance.availableCoins}
                        />
                        {redeemAmount && (
                          <p className="text-sm text-gray-600 mt-2">
                            Discount Value: ${(parseInt(redeemAmount) * 0.01).toFixed(2)}
                          </p>
                        )}
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsRedeemModalOpen(false)}>
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleRedeem}
                          className="bg-black text-white hover:bg-gray-800"
                        >
                          Redeem
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Coin Balance Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card className="border-gray-200 bg-gradient-to-br from-yellow-50 to-yellow-100">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Available Coins</p>
                        <p className="text-3xl font-bold text-yellow-600">{coinBalance.availableCoins}</p>
                        <p className="text-xs text-gray-500">≈ ${(coinBalance.availableCoins * 0.01).toFixed(2)}</p>
                      </div>
                      <LucideCoins className="h-8 w-8 text-yellow-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Pending Coins</p>
                        <p className="text-2xl font-bold text-orange-600">{coinBalance.pendingCoins}</p>
                        <p className="text-xs text-gray-500">Processing</p>
                      </div>
                      <RefreshCw className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Lifetime Earned</p>
                        <p className="text-2xl font-bold text-green-600">{coinBalance.lifetimeEarned}</p>
                        <p className="text-xs text-gray-500">Total earned</p>
                      </div>
                      <Award className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Lifetime Spent</p>
                        <p className="text-2xl font-bold text-blue-600">{coinBalance.lifetimeSpent}</p>
                        <p className="text-xs text-gray-500">Total redeemed</p>
                      </div>
                      <Wallet className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* How to Earn Coins */}
              <Card className="border-gray-200 mb-8">
                <CardHeader>
                  <CardTitle className="text-black flex items-center">
                    <Star className="h-5 w-5 mr-2" />
                    How to Earn Coins
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <ShoppingCart className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <h3 className="font-semibold text-gray-900">Make Purchases</h3>
                      <p className="text-sm text-gray-600">Earn 1 coin for every $1 spent</p>
                    </div>
                    <div className="text-center">
                      <Gift className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <h3 className="font-semibold text-gray-900">Special Promotions</h3>
                      <p className="text-sm text-gray-600">Bonus coins during sales events</p>
                    </div>
                    <div className="text-center">
                      <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <h3 className="font-semibold text-gray-900">Loyalty Rewards</h3>
                      <p className="text-sm text-gray-600">Extra coins for loyal customers</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Transaction Filter */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-black">Transaction History</h2>
                <Select value={transactionFilter} onValueChange={setTransactionFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter transactions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Transactions</SelectItem>
                    <SelectItem value="earned">Earned</SelectItem>
                    <SelectItem value="spent">Spent</SelectItem>
                    <SelectItem value="bonus">Bonus</SelectItem>
                    <SelectItem value="refund">Refund</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Transaction History */}
            <div className="space-y-4">
              {filteredTransactions.length === 0 ? (
                <Card className="border-gray-200">
                  <CardContent className="p-8 text-center">
                    <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No transactions found</h3>
                    <p className="text-gray-600 mb-4">
                      {transactionFilter !== 'all' 
                        ? 'No transactions found for the selected filter'
                        : 'Start shopping to earn your first coins!'
                      }
                    </p>
                    <Button 
                      onClick={() => navigate('/shop')}
                      className="bg-black text-white hover:bg-gray-800"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Start Shopping
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                filteredTransactions.map((transaction) => (
                  <Card key={transaction.transactionId} className="border-gray-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            {getTransactionIcon(transaction.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center mb-1">
                              <h3 className="font-semibold text-gray-900 mr-2">
                                {transaction.description}
                              </h3>
                              <Badge className={getTransactionBadgeColor(transaction.type)}>
                                {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                              </Badge>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="h-4 w-4 mr-1" />
                              {formatDate(transaction.createdAt)}
                              {transaction.orderId && (
                                <span className="ml-4">Order #{transaction.orderId}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-xl font-bold ${getTransactionColor(transaction.type, transaction.amount)}`}>
                            {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                          </p>
                          <p className="text-sm text-gray-600">coins</p>
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
      
      <Footer />
    </div>
  );
};

export default Coins;