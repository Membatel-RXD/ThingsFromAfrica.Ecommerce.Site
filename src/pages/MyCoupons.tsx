import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { authService } from '../services/authService';
import { 
  Gift, 
  Search, 
  Filter, 
  Copy, 
  Check, 
  Calendar, 
  Tag,
  Clock,
  ShoppingCart,
  Star,
  AlertCircle,
  Zap,
  TrendingUp,
  Users,
} from 'lucide-react';
import AccountSidebar from '@/components/LeftSidebarNav';
import { apiService, IAPIResponse } from '@/lib/api';
import { DiscountType, Promotion } from '@/models/members';

const MyCoupons: React.FC = () => {
  const { t } = useTranslation();
  const [coupons, setCoupons] = useState<Promotion[]>([]);
  const [discountTypes, setDiscountTypes] = useState<DiscountType[]>([]);
  const [filteredCoupons, setFilteredCoupons] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedCoupon, setSelectedCoupon] = useState<Promotion | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);
  const [redeemCode, setRedeemCode] = useState('');
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const LoadDiscountTypes = async () => {
      try {
        const response = await apiService.get<IAPIResponse<DiscountType[]>>('DiscountTypes/GetAll');
        if (response && response.isSuccessful && response.payload) {
          setDiscountTypes(response.payload);
        }
      } catch (error) {
        console.error('Failed to load discount types:', error);
        setDiscountTypes([]);
      }
    };

    const loadCoupons = async () => {
      const isAuthenticated = await authService.checkSession();
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }

      try {
        const response = await apiService.get<IAPIResponse<Promotion[]>>('Promotions/GetAll');
        if (response && response.isSuccessful && response.payload) {
          setCoupons(response.payload);
          setFilteredCoupons(response.payload);
        }
      } catch (error) {
        console.error('Failed to load coupons:', error);
        setCoupons([]);
        setFilteredCoupons([]);
      } finally {
        setLoading(false);
      }
    };

    LoadDiscountTypes();
    loadCoupons();
  }, [navigate]);

  useEffect(() => {
    let filtered = coupons;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(coupon => 
        coupon.promotionCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coupon.promotionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coupon.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter === 'active') {
      filtered = filtered.filter(coupon => {
        const now = new Date();
        const endDate = new Date(coupon.endDate);
        return coupon.isActive && coupon.currentUsageCount < coupon.maxUsageCount && now <= endDate;
      });
    } else if (statusFilter === 'used') {
      filtered = filtered.filter(coupon => coupon.currentUsageCount >= coupon.maxUsageCount);
    } else if (statusFilter === 'expired') {
      filtered = filtered.filter(coupon => {
        const now = new Date();
        const endDate = new Date(coupon.endDate);
        return !coupon.isActive || now > endDate;
      });
    }

    // Filter by type
    if (typeFilter !== 'all') {
      const selectedTypeId = parseInt(typeFilter);
      filtered = filtered.filter(coupon => coupon.discountTypeId === selectedTypeId);
    }

    setFilteredCoupons(filtered);
  }, [searchTerm, statusFilter, typeFilter, coupons]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDiscount = (coupon: Promotion): string => {
    const discountType = discountTypes.find(dt => dt.discountTypeId === coupon.discountTypeId);
  
    if (!discountType) return `$${coupon.discountValue} OFF`; // fallback
  
    if (discountType.typeCode.toLowerCase() === 'percentage') {
      return `${coupon.discountValue}% OFF`;
    } else if (discountType.typeCode.toLowerCase() === 'fixed') {
      return `$${coupon.discountValue} OFF`;
    } else {
      return 'FREE SHIPPING';
    }
  };

  const getCouponStatusColor = (coupon: Promotion): string => {
    const now = new Date();
    const endDate = new Date(coupon.endDate);
    const remainingDays = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
    if (coupon.currentUsageCount >= coupon.maxUsageCount) {
      return 'bg-gray-100 text-gray-800'; // Used up
    } else if (!coupon.isActive || remainingDays < 0) {
      return 'bg-red-100 text-red-800'; // Expired
    } else if (remainingDays <= 7) {
      return 'bg-yellow-100 text-yellow-800'; // Expiring soon
    } else {
      return 'bg-green-100 text-green-800'; // Active
    }
  };

  const getCouponStatus = (coupon: Promotion): string => {
    const now = new Date();
    const endDate = new Date(coupon.endDate);
    const remainingDays = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
    if (coupon.currentUsageCount >= coupon.maxUsageCount) {
      return 'Used';
    } else if (!coupon.isActive || remainingDays < 0) {
      return 'Expired';
    } else if (remainingDays <= 7) {
      return 'Expiring Soon';
    } else {
      return 'Active';
    }
  };

  const getCouponTypeIcon = (discountTypeId: number) => {
    const discountType = discountTypes.find(dt => dt.discountTypeId === discountTypeId);
    const typeCode = discountType?.typeCode?.toLowerCase() || 'default';
    
    switch (typeCode) {
      case 'welcome':
        return <Star className="h-4 w-4" />;
      case 'birthday':
        return <Gift className="h-4 w-4" />;
      case 'seasonal':
        return <Calendar className="h-4 w-4" />;
      case 'loyalty':
        return <Users className="h-4 w-4" />;
      case 'referral':
        return <TrendingUp className="h-4 w-4" />;
      case 'flash':
        return <Zap className="h-4 w-4" />;
      case 'percentage':
        return <Tag className="h-4 w-4" />;
      case 'fixed':
        return <Gift className="h-4 w-4" />;
      default:
        return <Tag className="h-4 w-4" />;
    }
  };

  const getCouponTypeColor = (discountTypeId: number) => {
    const discountType = discountTypes.find(dt => dt.discountTypeId === discountTypeId);
    const typeCode = discountType?.typeCode?.toLowerCase() || 'default';
    
    switch (typeCode) {
      case 'welcome':
        return 'bg-blue-100 text-blue-800';
      case 'birthday':
        return 'bg-pink-100 text-pink-800';
      case 'seasonal':
        return 'bg-orange-100 text-orange-800';
      case 'loyalty':
        return 'bg-purple-100 text-purple-800';
      case 'referral':
        return 'bg-green-100 text-green-800';
      case 'flash':
        return 'bg-red-100 text-red-800';
      case 'percentage':
        return 'bg-blue-100 text-blue-800';
      case 'fixed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDiscountTypeName = (discountTypeId: number): string => {
    const discountType = discountTypes.find(dt => dt.discountTypeId === discountTypeId);
    return discountType?.typeName || 'Unknown';
  };

  const handleCopyCoupon = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCoupon(code);
      setTimeout(() => setCopiedCoupon(null), 2000);
    } catch (error) {
      console.error('Failed to copy coupon code:', error);
    }
  };

  const handleViewDetails = (coupon: Promotion) => {
    setSelectedCoupon(coupon);
    setIsDetailModalOpen(true);
  };

  const handleRedeemCoupon = () => {
    if (!redeemCode.trim()) return;
  
    const now = new Date();
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 3); // expires in 3 months
  
    // Mock redemption logic
    const newCoupon: Promotion = {
      promotionId: Date.now(), // mock ID
      promotionName: 'Redeemed Coupon',
      promotionCode: redeemCode,
      description: 'Successfully redeemed coupon',
      discountTypeId: 1, // assuming 1 exists in your discountTypes
      discountValue: 10,
      minimumOrderAmount: 50,
      maximumDiscountAmount: 100,
      startDate: now.toISOString(),
      endDate: futureDate.toISOString(),
      isActive: true,
      createdAt: now.toISOString(),
      createdBy: 1, // mock user ID
      isPercentage: true,
      maxUsageCount: 1,
      currentUsageCount: 0,
      maxUsagePerCustomer: 1,
      isTouristOnly: false,
      applicableCountries: ['All']
    };
  
    setCoupons(prev => [newCoupon, ...prev]);
    setRedeemCode('');
    setIsRedeemModalOpen(false);
  };

  const now = new Date();

  const activeCoupons = coupons.filter(c => {
    const endDate = new Date(c.endDate);
    const remainingDays = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return c.isActive && c.currentUsageCount < c.maxUsageCount && remainingDays >= 0;
  });
  
  const usedCoupons = coupons.filter(c => c.currentUsageCount >= c.maxUsageCount);
  
  const expiredCoupons = coupons.filter(c => {
    const endDate = new Date(c.endDate);
    const remainingDays = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return !c.isActive || remainingDays < 0;
  });
  
  const expiringSoon = coupons.filter(c => {
    const endDate = new Date(c.endDate);
    const remainingDays = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return c.isActive && c.currentUsageCount < c.maxUsageCount && remainingDays > 0 && remainingDays <= 7;
  });

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
          <AccountSidebar activePath="/coupons" />

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-black mb-2">{t('pages.coupons.title')}</h1>
                  <p className="text-gray-700">{t('pages.coupons.subtitle')}</p>
                </div>
                <Button 
                  onClick={() => setIsRedeemModalOpen(true)}
                  className="bg-black text-white hover:bg-gray-800"
                >
                  <Gift className="h-4 w-4 mr-2" />
                  {t('pages.coupons.redeemCoupon')}
                </Button>
              </div>

              {/* Coupon Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card className="border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">{t('pages.coupons.activeCoupons')}</p>
                        <p className="text-2xl font-bold text-black">{activeCoupons.length}</p>
                      </div>
                      <Gift className="h-8 w-8 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">{t('pages.coupons.usedCoupons')}</p>
                        <p className="text-2xl font-bold text-black">{usedCoupons.length}</p>
                      </div>
                      <Check className="h-8 w-8 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">{t('pages.coupons.expiringSoon')}</p>
                        <p className="text-2xl font-bold text-black">{expiringSoon.length}</p>
                      </div>
                      <AlertCircle className="h-8 w-8 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">{t('pages.coupons.expired')}</p>
                        <p className="text-2xl font-bold text-black">{expiredCoupons.length}</p>
                      </div>
                      <Clock className="h-8 w-8 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder={t('pages.coupons.searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder={t('pages.coupons.filterByStatus')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('pages.coupons.allCoupons')}</SelectItem>
                      <SelectItem value="active">{t('pages.coupons.active')}</SelectItem>
                      <SelectItem value="used">{t('pages.coupons.used')}</SelectItem>
                      <SelectItem value="expired">{t('pages.coupons.expired')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder={t('pages.coupons.filterByType')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('pages.coupons.allTypes')}</SelectItem>
                      {discountTypes.map(type => (
                        <SelectItem key={type.discountTypeId} value={type.discountTypeId.toString()}>
                          {type.typeName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Coupons Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCoupons.length === 0 ? (
                <Card className="border-gray-200 col-span-full">
                  <CardContent className="p-8 text-center">
                    <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('pages.coupons.noCouponsFound')}</h3>
                    <p className="text-gray-600 mb-4">
                      {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                        ? t('pages.coupons.adjustFilters')
                        : t('pages.coupons.noCouponsYet')}
                    </p>
                    <Button
                      onClick={() => setIsRedeemModalOpen(true)}
                      className="bg-black text-white hover:bg-gray-800"
                    >
                      <Gift className="h-4 w-4 mr-2" />
                      {t('pages.coupons.redeemCoupon')}
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                filteredCoupons.map((coupon) => {
                  const now = new Date();
                  const endDate = new Date(coupon.endDate);
                  const remainingDays = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                  const isUsed = coupon.currentUsageCount >= coupon.maxUsageCount;

                  return (
                    <Card
                      key={coupon.promotionId}
                      className={`border-gray-200 relative overflow-hidden ${
                        isUsed || !coupon.isActive || remainingDays < 0
                          ? 'opacity-60'
                          : 'hover:shadow-lg transition-shadow'
                      }`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2">
                            <Badge className={getCouponTypeColor(coupon.discountTypeId)}>
                              {getCouponTypeIcon(coupon.discountTypeId)}
                              <span className="ml-1 capitalize">
                                {getDiscountTypeName(coupon.discountTypeId)}
                              </span>
                            </Badge>
                            <Badge className={getCouponStatusColor(coupon)}>
                              {getCouponStatus(coupon)}
                            </Badge>
                          </div>
                          {remainingDays <= 7 && remainingDays > 0 && (
                            <div className="text-right">
                              <p className="text-xs text-red-600 font-medium">
                                {remainingDays} {t('pages.coupons.daysLeft')}
                              </p>
                            </div>
                          )}
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-black mb-2">
                            {formatDiscount(coupon)}
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {coupon.promotionName}
                          </h3>
                          <p className="text-sm text-gray-600 mb-4">
                            {coupon.description}
                          </p>
                        </div>

                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">{t('pages.coupons.enterCode')}:</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopyCoupon(coupon.promotionCode)}
                              className="text-xs"
                            >
                              {copiedCoupon === coupon.promotionCode ? (
                                <>
                                  <Check className="h-3 w-3 mr-1" />
                                  {t('pages.coupons.copied')}
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3 w-3 mr-1" />
                                  {t('pages.coupons.copy')}
                                </>
                              )}
                            </Button>
                          </div>
                          <div className="font-mono text-lg font-bold text-center bg-white p-2 rounded border-2 border-dashed border-gray-300">
                            {coupon.promotionCode}
                          </div>
                        </div>

                        <div className="text-xs text-gray-500 space-y-1">
                          <div className="flex justify-between">
                            <span>{t('pages.coupons.minOrder')}:</span>
                            <span>${coupon.minimumOrderAmount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>{t('pages.coupons.validUntil')}:</span>
                            <span>{formatDate(coupon.endDate)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>{t('pages.coupons.usage')}:</span>
                            <span>{coupon.currentUsageCount}/{coupon.maxUsageCount}</span>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(coupon)}
                            className="flex-1"
                          >
                            {t('pages.coupons.viewDetails')}
                          </Button>
                          {coupon.isActive && !isUsed && remainingDays > 0 && (
                            <Button
                              size="sm"
                              onClick={() => navigate('/shop')}
                              className="flex-1 bg-black text-white hover:bg-gray-800"
                            >
                              <ShoppingCart className="h-4 w-4 mr-1" />
                              {t('pages.coupons.shopNow')}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Coupon Details Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <span>{selectedCoupon?.promotionName}</span>
              <Badge className={getCouponTypeColor(selectedCoupon?.discountTypeId || 1)}>
                {getCouponTypeIcon(selectedCoupon?.discountTypeId || 1)}
                <span className="ml-1 capitalize">
                  {getDiscountTypeName(selectedCoupon?.discountTypeId || 1)}
                </span>
              </Badge>
            </DialogTitle>
          </DialogHeader>
          
          {selectedCoupon && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-black mb-2">
                  {formatDiscount(selectedCoupon)}
                </div>
                <p className="text-gray-600">{selectedCoupon.description}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Coupon Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Code:</span>
                    <span className="font-mono font-bold">{selectedCoupon.promotionCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Minimum Order:</span>
                    <span>${selectedCoupon.minimumOrderAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Maximum Discount:</span>
                    <span>${selectedCoupon.maximumDiscountAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Valid Until:</span>
                    <span>{formatDate(selectedCoupon.endDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Usage Limit:</span>
                    <span>{selectedCoupon.currentUsageCount}/{selectedCoupon.maxUsageCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Per Customer Limit:</span>
                    <span>{selectedCoupon.maxUsagePerCustomer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tourist Only:</span>
                    <span>{selectedCoupon.isTouristOnly ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Applicable Countries:</span>
                    <span>{selectedCoupon.applicableCountries.join(', ')}</span>
                  </div>
                </div>
              </div>
              
              {selectedCoupon.currentUsageCount >= selectedCoupon.maxUsageCount && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-800">
                    <Check className="h-4 w-4 inline mr-1" />
                    This coupon has been fully used
                  </p>
                </div>
              )}
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
                  {t('pages.coupons.close')}
                </Button>
                {selectedCoupon.isActive && selectedCoupon.currentUsageCount < selectedCoupon.maxUsageCount && (
                  <Button
                    onClick={() => {
                      handleCopyCoupon(selectedCoupon.promotionCode);
                      navigate('/shop');
                    }}
                    className="bg-black text-white hover:bg-gray-800"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    {t('pages.coupons.copyAndShop')}
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Redeem Coupon Modal */}
      <Dialog open={isRedeemModalOpen} onOpenChange={setIsRedeemModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t('pages.coupons.redeemCode')}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('pages.coupons.enterCode')}
              </label>
              <Input
                value={redeemCode}
                onChange={(e) => setRedeemCode(e.target.value.toUpperCase())}
                placeholder={t('pages.coupons.enterCodePlaceholder')}
                className="font-mono"
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsRedeemModalOpen(false)}>
                {t('pages.coupons.cancel')}
              </Button>
              <Button 
                onClick={handleRedeemCoupon}
                disabled={!redeemCode.trim()}
                className="bg-black text-white hover:bg-gray-800"
              >
                <Gift className="h-4 w-4 mr-2" />
                {t('pages.coupons.redeem')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default MyCoupons;