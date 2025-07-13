import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  Plus,
  Edit,
  Trash2,
  Home,
  Building,
  Star
} from 'lucide-react';
import { apiService, IAPIResponse } from '@/lib/api';
import { AddressDTO, CreateUserAddressRequest, CustomerProfileContainerDTO } from '@/models/members';


const Addresses: React.FC = () => {
  const [addresses, setAddresses] = useState<AddressDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressDTO | null>(null);
  const [formData, setFormData] = useState({
    addressLine1: '',
    addressLine2: '',
    city: '',
    stateProvince: '',
    postalCode: '',
    country: 'United States',
    contactName: '',
    contactPhone: '',
    addressType: 'Home',
    isDefault: false
  });
  const navigate = useNavigate();

  useEffect(() => {
    const loadAddresses = async () => {
      const isAuthenticated = await authService.checkSession();
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }

      try {
        const email = authService.getUserEmail();
        const response = await apiService.get<IAPIResponse<CustomerProfileContainerDTO[]>>(`CustomerProfiles/GetCustomerProfiles?email=${email}`)
        const customerProfileData = response.payload || []
        if (customerProfileData.length > 0) {
            setAddresses(customerProfileData[0].userAddresses);
        }else{
            setAddresses([]);
        }
      } catch (error) {
        console.error('Failed to load addresses:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAddresses();
  }, [navigate]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const resetForm = () => {
    setFormData({
      addressLine1: '',
      addressLine2: '',
      city: '',
      stateProvince: '',
      postalCode: '',
      country: 'United States',
      contactName: '',
      contactPhone: '',
      addressType: 'Home',
      isDefault: false
    });
  };

  const handleAdd = async () => {
    try {
      const userId = authService.getUserId().toString();
      const newAddress: CreateUserAddressRequest = {
        userId: parseInt(userId),
        ...formData,
        isActive: true
      };
     const response = await apiService.post<IAPIResponse<AddressDTO>>('UserAddresses/Add',newAddress);
     if(response && response.isSuccessful && response.payload){
         if (formData.isDefault) {
            setAddresses(prev => prev.map(addr => ({ ...addr, isDefault: false })));
          }
          setAddresses(prev => [...prev, response.payload]);
     }
      setIsAddModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Failed to add address:', error);
    }
  };

  const handleEdit = (address: AddressDTO) => {
    setEditingAddress(address);
    setFormData({
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      city: address.city,
      stateProvince: address.stateProvince,
      postalCode: address.postalCode,
      country: address.country,
      contactName: address.contactName,
      contactPhone: address.contactPhone,
      addressType: address.addressType,
      isDefault: address.isDefault
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingAddress) return;

    try {
      const updatedAddress: AddressDTO = {
        ...editingAddress,
        ...formData,
        modifiedAt: new Date().toISOString()
      };

      const response = await apiService.post<IAPIResponse<AddressDTO>>(`UserAddresses/Update?addressid=${editingAddress.addressId}`,updatedAddress);
      if(response && response.isSuccessful && response.payload){
           // If this is set as default, make others non-default
            if (formData.isDefault) {
                setAddresses(prev => prev.map(addr => ({ 
                ...addr, 
                isDefault: addr.addressId === editingAddress.addressId ? true : false 
                })));
            }

            setAddresses(prev => prev.map(addr => 
                addr.addressId === editingAddress.addressId ? updatedAddress : addr
            ));
      }
     
      setIsEditModalOpen(false);
      setEditingAddress(null);
      resetForm();
    } catch (error) {
      console.error('Failed to update address:', error);
    }
  };

  const handleDelete = async (addressId: number) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        setAddresses(prev => prev.filter(addr => addr.addressId !== addressId));
      } catch (error) {
        console.error('Failed to delete address:', error);
      }
    }
  };

  const handleSetDefault = async (addressId: number) => {
    try {
      setAddresses(prev => prev.map(addr => ({
        ...addr,
        isDefault: addr.addressId === addressId,
        modifiedAt: addr.addressId === addressId ? new Date().toISOString() : addr.modifiedAt
      })));
    } catch (error) {
      console.error('Failed to set default address:', error);
    }
  };

  const getAddressTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'home':
        return <Home className="h-4 w-4" />;
      case 'work':
        return <Building className="h-4 w-4" />;
      default:
        return <MapPinned className="h-4 w-4" />;
    }
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

  const AddressForm = ({ onSubmit, onCancel, submitLabel }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="contactName">Contact Name</Label>
          <Input
            id="contactName"
            value={formData.contactName}
            onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
            placeholder="Enter contact name"
          />
        </div>
        <div>
          <Label htmlFor="contactPhone">Contact Phone</Label>
          <Input
            id="contactPhone"
            value={formData.contactPhone}
            onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
            placeholder="Enter phone number"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="addressLine1">Address Line 1</Label>
        <Input
          id="addressLine1"
          value={formData.addressLine1}
          onChange={(e) => setFormData(prev => ({ ...prev, addressLine1: e.target.value }))}
          placeholder="Enter street address"
        />
      </div>

      <div>
        <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
        <Input
          id="addressLine2"
          value={formData.addressLine2}
          onChange={(e) => setFormData(prev => ({ ...prev, addressLine2: e.target.value }))}
          placeholder="Apartment, suite, etc."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
            placeholder="Enter city"
          />
        </div>
        <div>
          <Label htmlFor="stateProvince">State/Province</Label>
          <Input
            id="stateProvince"
            value={formData.stateProvince}
            onChange={(e) => setFormData(prev => ({ ...prev, stateProvince: e.target.value }))}
            placeholder="Enter state/province"
          />
        </div>
        <div>
          <Label htmlFor="postalCode">Postal Code</Label>
          <Input
            id="postalCode"
            value={formData.postalCode}
            onChange={(e) => setFormData(prev => ({ ...prev, postalCode: e.target.value }))}
            placeholder="Enter postal code"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="country">Country</Label>
          <Select value={formData.country} onValueChange={(value) => setFormData(prev => ({ ...prev, country: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="United States">United States</SelectItem>
              <SelectItem value="Canada">Canada</SelectItem>
              <SelectItem value="United Kingdom">United Kingdom</SelectItem>
              <SelectItem value="Australia">Australia</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="addressType">Address Type</Label>
          <Select value={formData.addressType} onValueChange={(value) => setFormData(prev => ({ ...prev, addressType: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select address type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Home">Home</SelectItem>
              <SelectItem value="Work">Work</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isDefault"
          checked={formData.isDefault}
          onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
          className="rounded border-gray-300"
        />
        <Label htmlFor="isDefault">Set as default address</Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit} className="bg-black text-white hover:bg-gray-800">
          {submitLabel}
        </Button>
      </div>
    </div>
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
                <NavigationLink path="/profile" label="Profile" icon={User} />
                <NavigationLink path="/profile/payments" label="Payments" icon={CreditCard} />
                <NavigationLink path="/profile/addresses" label="Addresses" icon={MapPinned} isActive={true} />
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
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-black mb-2">My Addresses</h1>
                  <p className="text-gray-700">Manage your saved addresses for faster checkout</p>
                </div>
                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-black text-white hover:bg-gray-800">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Address
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add New Address</DialogTitle>
                    </DialogHeader>
                    <AddressForm
                      onSubmit={handleAdd}
                      onCancel={() => {
                        setIsAddModalOpen(false);
                        resetForm();
                      }}
                      submitLabel="Add Address"
                    />
                  </DialogContent>
                </Dialog>
              </div>

              {/* Address Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Card className="border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Addresses</p>
                        <p className="text-2xl font-bold text-black">{addresses.length}</p>
                      </div>
                      <MapPinned className="h-8 w-8 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Default Address</p>
                        <p className="text-2xl font-bold text-black">{addresses.find(a => a.isDefault)?.addressType || 'None'}</p>
                      </div>
                      <Star className="h-8 w-8 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Active Addresses</p>
                        <p className="text-2xl font-bold text-black">{addresses.filter(a => a.isActive).length}</p>
                      </div>
                      <Package className="h-8 w-8 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Addresses List */}
            <div className="space-y-4">
              {addresses.length === 0 ? (
                <Card className="border-gray-200">
                  <CardContent className="p-8 text-center">
                    <MapPinned className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No addresses saved</h3>
                    <p className="text-gray-600 mb-4">Add your first address to get started with faster checkout</p>
                    <Button 
                      onClick={() => setIsAddModalOpen(true)}
                      className="bg-black text-white hover:bg-gray-800"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Address
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                addresses.map((address) => (
                  <Card key={address.addressId} className="border-gray-200">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center mb-3">
                            <Badge variant="secondary" className="ml-2">
                              {address.addressType}
                            </Badge>
                            {address.isDefault && (
                              <Badge variant="default" className="ml-2">
                                Default
                              </Badge>
                            )}
                          </div>
                          
                          <div className="space-y-1">
                            <p className="font-semibold text-black">{address.contactName}</p>
                            <p className="text-gray-700">{address.addressLine1}</p>
                            {address.addressLine2 && (
                              <p className="text-gray-700">{address.addressLine2}</p>
                            )}
                            <p className="text-gray-700">
                              {address.city}, {address.stateProvince} {address.postalCode}
                            </p>
                            <p className="text-gray-700">{address.country}</p>
                            <p className="text-gray-600 text-sm">{address.contactPhone}</p>
                          </div>
                          
                          <div className="mt-4 text-sm text-gray-500">
                            Added on {formatDate(address.createdAt)}
                            {address.modifiedAt !== address.createdAt && (
                              <span> • Modified on {formatDate(address.modifiedAt)}</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col space-y-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(address)}
                            className="flex items-center"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          
                          {!address.isDefault && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSetDefault(address.addressId)}
                              className="flex items-center"
                            >
                              <Star className="h-4 w-4 mr-1" />
                              Set Default
                            </Button>
                          )}
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(address.addressId)}
                            className="flex items-center text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
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

      {/* Edit Address Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Address</DialogTitle>
          </DialogHeader>
          <AddressForm
            onSubmit={handleUpdate}
            onCancel={() => {
              setIsEditModalOpen(false);
              setEditingAddress(null);
              resetForm();
            }}
            submitLabel="Update Address"
          />
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default Addresses;