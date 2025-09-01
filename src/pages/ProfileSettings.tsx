import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { authService } from '../services/authService';
import { useAppContext } from '../contexts/AppContext';
import { User, Edit, Save, Mail, Phone, Globe, Bell, Shield, MapPin, LogOut, Loader2, Trash2, Eye, Key, Lock } from 'lucide-react';
import { apiService, IAPIResponse } from '@/lib/api';
import SuccessPopup from '@/components/SuccessPopup';
import { useToast } from '../hooks/use-toast';
import ToastContainer from '@/components/ToastContainer';
import ErrorPopup from '@/components/ErrorPopup';
import { QRCodeCanvas } from 'qrcode.react';
import QrModal from '@/components/QRModal';

interface UserData {
  userId: number;
  username: string;
  email: string;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  displayName: string;
  dateOfBirth: string;
  gender: string;
  profileImageUrl: string;
  phoneNumber: string;
  phoneVerified: boolean;
  preferredLanguage: string;
  preferredCurrency: string;
  timeZone: string;
  notificationPreferences: string;
  createdAt: string;
  modifiedAt: string;
  lastActiveAt: string;
}

interface UserDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  dateOfBirth: string;
  gender: string;
  bio: string;
}

interface NotificationPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  promotionalSms: boolean;
  newsletter: boolean;
  orderUpdates: boolean;
  securityAlerts: boolean;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  lastPasswordChange: string;
  activeSessions: number;
}



const ProfileSettings: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const navigate = useNavigate();
  const { clearCart } = useAppContext();

  const { showSnackbar, snackbar } = useToast();

  const [userId, setUserId] = useState<number | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setShowErrorMessage] = useState('');


  const [qrCodeUri, setQrCodeUri] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [showQrModal, setShowQrModal] = useState(false);

  // Profile form state
  const [profileData, setProfileData] = useState<UserDetails>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'Malawi',
    postalCode: '',
    dateOfBirth: '',
    gender: '',
    bio: ''
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Preferences state
  const [preferences, setPreferences] = useState({
    language: 'en',
    currency: 'USD',
    timezone: 'Africa/Blantyre',
    theme: 'light'
  });

  // Notification preferences state
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences>({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    promotionalSms: false,
    newsletter: false,
    orderUpdates: true,
    securityAlerts: true
  });

  // Security settings state
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    lastPasswordChange: '',
    activeSessions: 1
  });

  useEffect(() => {
    const loadUserData = async () => {
      const isAuthenticated = await authService.checkSession();
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }

      try {
        // Load user profile data from API
        const userEmail = authService.getUserEmail();
        const userId = authService.getUserId();
        
        // Set basic info from auth
        setProfileData(prev => ({
          ...prev,
          email: userEmail || '',
          firstName: '',
          lastName: ''
        }));
          
        // Get user data from API
        const response = await apiService.get<IAPIResponse<UserData[]>>('/Users/GetAll');
        
        if (response.isSuccessful && response.payload) {
          const user = response.payload.find((u: UserData) => u.email === userEmail);
          
          if (user) {
            setUserId(user.userId);
            
            // Load profile data
            await loadProfileData(user);
            
            // Load preferences
            await loadPreferences(user);
            
            // Load notification preferences
            await loadNotificationPreferences(user);
            
            // Load security settings
            await loadSecuritySettings(user.userId);
          }
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
        showSnackbar('Failed to load user data', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [navigate]);

  const loadProfileData = async (user: UserData) => {
    try {
      // Try to parse address data from displayName if available
      let addressData = {
        address: '',
        city: '',
        country: 'Malawi',
        postalCode: '',
        bio: ''
      };
      
      if (user.displayName) {
        try {
          addressData = JSON.parse(user.displayName);
        } catch (e) {
          console.log('Could not parse address data from displayName');
        }
      }
      
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email,
        phone: user.phoneNumber || '',
        address: addressData.address || '',
        city: addressData.city || '',
        country: addressData.country || 'Malawi',
        postalCode: addressData.postalCode || '',
        dateOfBirth: user.dateOfBirth || '',
        gender: user.gender || '',
        bio: addressData.bio || ''
      });
    } catch (error) {
      console.error('Failed to load profile data:', error);
    }
  };

  const loadPreferences = async (user: UserData) => {
    try {
      setPreferences({
        language: user.preferredLanguage || 'en',
        currency: user.preferredCurrency || 'USD',
        timezone: user.timeZone || 'Africa/Blantyre',
        theme: 'light' // Default theme, could be stored in user preferences
      });
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }
  };

  const loadNotificationPreferences = async (user: UserData) => {
    try {
      if (user.notificationPreferences) {
        const prefs = JSON.parse(user.notificationPreferences);
        setNotificationPrefs({
          emailNotifications: prefs.emailNotifications ?? true,
          smsNotifications: prefs.smsNotifications ?? false,
          marketingEmails: prefs.marketingEmails ?? true,
          promotionalSms: prefs.promotionalSms ?? false,
          newsletter: prefs.newsletter ?? false,
          orderUpdates: prefs.orderUpdates ?? true,
          securityAlerts: prefs.securityAlerts ?? true
        });
      }
    } catch (error) {
      console.error('Failed to load notification preferences:', error);
    }
  };

  const loadSecuritySettings = async (userId: number) => {
    try {
     
      const response = await apiService.get<IAPIResponse<SecuritySettings>>(`/Users/SecuritySettings/${userId}`);
      
      if (response.isSuccessful && response.payload) {
        setSecuritySettings(response.payload);
      }
    } catch (error) {
      console.error('Failed to load security settings:', error);
      // Use default values if API call fails
    }
  };

  const handleLogout = async () => {
    try {
      // Call logout API if available
      await apiService.post('/Auth/Logout', {});
      
      authService.logout();
      clearCart();
      navigate('/');
      setSuccessMessage('Logged out successfully');
      setShowSuccessPopup(true)
    } catch (error) {
      console.error('Logout error:', error);
      // Still logout locally even if API call fails
      authService.logout();
      clearCart();
      navigate('/');
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      if (!userId) {
        throw new Error('User ID not found');
      }

      // Get current user data first
      const userResponse = await apiService.get<IAPIResponse<UserData[]>>('/Users/GetAll');

      if (userResponse.isSuccessful && userResponse.payload) {
        const currentUser = userResponse.payload.find((u: UserData) => u.userId === userId);
        
        if (currentUser) {
          // Create complete user update payload with all required fields
          const userUpdateData = {
            ...currentUser,
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            phoneNumber: profileData.phone,
            dateOfBirth: profileData.dateOfBirth || currentUser.dateOfBirth,
            gender: profileData.gender || currentUser.gender,
            // Store address info in displayName as a workaround
            displayName: JSON.stringify({
              address: profileData.address,
              city: profileData.city,
              country: profileData.country,
              postalCode: profileData.postalCode,
              bio: profileData.bio
            })
          };
          
          const response = await apiService.put<IAPIResponse<object>>(
            `/Users/Update?userId=${userId}`,
            userUpdateData
          );
          
          if (response && response.isSuccessful) {
            showSnackbar(response.remark || 'Profile updated successfully!', 'success');
            setSuccessMessage('Your profile has been updated successfully!');
            setShowSuccessPopup(true);
            setEditing(false);
          } else {
            setShowErrorMessage(response.remark ||'Failed to update profile');
            setShowErrorPopup(true);
          }
        }
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      setShowErrorMessage('Failed to update profile');
      setShowErrorPopup(true);
    } finally {
      setSaving(false);
    }
  };

  const handlePreferenceChange = async (key: string, value: string | boolean) => {
    const oldValue = preferences[key as keyof typeof preferences];
    
    // Update local state immediately for better UX
    setPreferences(prev => ({ ...prev, [key]: value }));
    
    // If language is being changed, update i18n immediately
    if (key === 'language') {
      i18n.changeLanguage(value as string);
    }
    
    try {
      if (!userId) {
        throw new Error('User ID not found');
      }

      // Get current user data
      const userResponse = await apiService.get<IAPIResponse<UserData[]>>('/Users/GetAll');
      
      if (userResponse.isSuccessful && userResponse.payload) {
        const currentUser = userResponse.payload.find((u: UserData) => u.userId === userId);
        
        if (currentUser) {
          const updateData = { ...currentUser };
          
          // Update only the specific preference being changed
          if (key === 'language') updateData.preferredLanguage = value as string;
          if (key === 'currency') updateData.preferredCurrency = value as string;
          if (key === 'timezone') updateData.timeZone = value as string;
          
          const response = await apiService.put<IAPIResponse<object>>(
            `/Users/Update?userId=${userId}`,
            updateData
          );
          
          if (response && response.isSuccessful) {
            setSuccessMessage(response.remark || 'Preferences updated successfully!');
            setShowSuccessPopup(true);
          } else {
            throw new Error(response.remark || 'Failed to update preferences');
          }
        }
      }
    } catch (error) {
      console.error('Failed to update preference:', error);
      // Revert the local state change
      setPreferences(prev => ({ ...prev, [key]: oldValue }));
      setShowErrorMessage('Failed to update preferences');
      setShowErrorPopup(true);

    }
  };

  const handleNotificationPreferenceChange = async (key: keyof NotificationPreferences, value: boolean) => {
    const oldValue = notificationPrefs[key];
    
    // Update local state immediately
    setNotificationPrefs(prev => ({ ...prev, [key]: value }));
    
    try {
      if (!userId) {
        throw new Error('User ID not found');
      }

      // Get current user data
      const userResponse = await apiService.get<IAPIResponse<UserData[]>>('/Users/GetAll');
      
      if (userResponse.isSuccessful && userResponse.payload) {
        const currentUser = userResponse.payload.find((u: UserData) => u.userId === userId);
        
        if (currentUser) {
          const updatedPrefs = { ...notificationPrefs, [key]: value };
          const updateData = {
            ...currentUser,
            notificationPreferences: JSON.stringify(updatedPrefs)
          };
          
          const response = await apiService.put<IAPIResponse<object>>(
            `/Users/Update?userId=${userId}`,
            updateData
          );
          
          if (response && response.isSuccessful) {
            showSnackbar('Notification preferences updated!', 'success');
          } else {
            throw new Error(response.remark || 'Failed to update notification preferences');
          }
        }
      }
    } catch (error) {
      console.error('Failed to update notification preferences:', error);
      // Revert the local state change
      setNotificationPrefs(prev => ({ ...prev, [key]: oldValue }));
      setShowErrorMessage('Failed to update notification preferences');
      setShowErrorPopup(true);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setShowErrorMessage('Please fill in all password fields');
      setShowErrorPopup(true);

      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setShowErrorMessage('New passwords do not match');
      setShowErrorPopup(true);

      return;
    }

    if (passwordData.newPassword.length < 6) {
      setShowErrorMessage('Password must be at least 6 characters long');
      setShowErrorPopup(true);

      return;
    }

    setChangingPassword(true);
    try {
      const response = await apiService.post<IAPIResponse<object>>('/Auth/ChangePassword', {
        userId: userId,
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      if (response && response.isSuccessful) {
        setSuccessMessage('Your password has been changed successfully!');
        setShowSuccessPopup(true);
        
        // Clear password fields
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setShowErrorMessage(response.remark || 'Password changed successfully!');
        setShowErrorPopup(true);
      }
    } catch (error) {
      console.error('Failed to change password:', error);
    } finally {
      setChangingPassword(false);
    }
  };

  const handleToggle2FA = async () => {
    try {
      if (!userId) {
        throw new Error('User ID not found');
      }

      const endpoint = securitySettings.twoFactorEnabled ? '/Auth/Disable2FA' : '/Auth/Enable2FA';
      const response = await apiService.post<IAPIResponse<object>>(endpoint, { userId });

      if (response && response.isSuccessful) {
        setSecuritySettings(prev => ({ 
          ...prev, 
          twoFactorEnabled: !prev.twoFactorEnabled 
        }));
        
        const message = securitySettings.twoFactorEnabled 
          ? 'Two-factor authentication disabled' 
          : 'Two-factor authentication enabled';
        
       // showSnackbar(message, 'success');
        setSuccessMessage(message + ' successfully!');
        setShowSuccessPopup(true);


        // ✅ If 2FA was just enabled, display QR code or secret
        if (!securitySettings.twoFactorEnabled && response.payload) {
          const { qrCodeUri, secret } = response.payload as { qrCodeUri: string, secret: string };

          // e.g., open a modal or component to show the QR and/or secret
          setQrCodeUri(qrCodeUri);
          setSecretKey(secret);
          setShowQrModal(true);
        }

      } else {
        setShowErrorMessage(response.remark || 'Failed to toggle 2FA!');
        setShowErrorPopup(true);
      }
    } catch (error) {
      console.error('Failed to toggle 2FA:', error);
    }
  };

  const handleViewActiveSessions = async () => {
    try {
      if (!userId) {
        throw new Error('User ID not found');
      }

      const response = await apiService.get<IAPIResponse<unknown[]>>(`/Auth/ActiveSessions/${userId}`);
      
      if (response && response.isSuccessful) {
        setSuccessMessage(`You have ${response.payload?.length || 0} active sessions`);
        setShowSuccessPopup(true)
      } else {
        setShowErrorMessage(response.remark || 'Failed to fetch active sessions');
        setShowErrorPopup(true)
      }
    } catch (error) {
      console.error('Failed to fetch active sessions:', error);
      showSnackbar('Failed to fetch active sessions', 'error');
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you absolutely sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.'
    );

    if (!confirmed) return;

    const doubleConfirmed = window.confirm(
      'This is your final warning. Are you completely sure you want to permanently delete your account?'
    );

    if (!doubleConfirmed) return;

    setDeletingAccount(true);
    try {
      if (!userId) {
        throw new Error('User ID not found');
      }

      const response = await apiService.delete<IAPIResponse<object>>(`/Users/Delete/${userId}`);

      if (response && response.isSuccessful) {
        setSuccessMessage( response.remark || `Account deleted successfully`);
        setShowSuccessPopup(true)
        // Log out and redirect
        authService.logout();
        clearCart();
        navigate('/');
      } else {
        setShowErrorMessage(response.remark || 'Failed to delete account');
        setShowErrorPopup(true)
      }
    } catch (error) {
      console.error('Failed to delete account:', error);
      showSnackbar('Failed to delete account', 'error');
    } finally {
      setDeletingAccount(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ToastContainer /> {/* ADD THIS LINE */}
        <Header />
        <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
       <ToastContainer /> {/* ADD THIS LINE */}


      <SuccessPopup 
        message={successMessage}
        isOpen={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
      />

    <ErrorPopup 
        message={errorMessage}
        isOpen={showErrorPopup}
        onClose={() => setShowErrorPopup(false)}
      />
      <Header />
      
      {showQrModal && (
        <QrModal 
          qrCodeUri={qrCodeUri}
          secret={secretKey}
          isOpen={showQrModal}
          onClose={() => setShowQrModal(false)}
      />
      )}

      <main className="container mx-auto px-4 py-8">
        {/* Page header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-black mb-2">{t('pages.profile.settings.title')}</h1>
              <p className="text-gray-700">{t('pages.profile.settings.subtitle')}</p>
            </div>
          </div>
        </div>

        {/* Profile Tabs */}
        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">{t('pages.profile.settings.personalInfo')}</TabsTrigger>
            <TabsTrigger value="preferences">{t('pages.profile.settings.preferences')}</TabsTrigger>
            <TabsTrigger value="notifications">{t('pages.profile.settings.notifications')}</TabsTrigger>
            <TabsTrigger value="security">{t('pages.profile.settings.security')}</TabsTrigger>
          </TabsList>

          {/* Personal Information Tab */}
          <TabsContent value="personal">
            <Card className="border-gray-200">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center text-black">
                    <User className="h-5 w-5 mr-2" />
                    {t('pages.profile.settings.personalInfo')}
                  </CardTitle>
                  <Button
                    onClick={() => editing ? handleSaveProfile() : setEditing(true)}
                    disabled={saving}
                    className="bg-black hover:bg-gray-800"
                  >
                    {editing ? (
                      saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />{t('pages.profile.settings.saving')}</> : <><Save className="h-4 w-4 mr-2" />{t('pages.profile.settings.save')}</>
                    ) : (
                      <><Edit className="h-4 w-4 mr-2" />{t('pages.profile.settings.edit')}</>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">{t('pages.profile.settings.firstName')}</Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                      disabled={!editing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">{t('pages.profile.settings.lastName')}</Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                      disabled={!editing}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">{t('pages.profile.email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!editing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">{t('pages.profile.settings.phoneNumber')}</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!editing}
                      placeholder="+265 123 456 789"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">{t('pages.profile.settings.address')}</Label>
                  <Input
                    id="address"
                    value={profileData.address}
                    onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                    disabled={!editing}
                    placeholder="Street address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">{t('pages.profile.settings.city')}</Label>
                    <Input
                      id="city"
                      value={profileData.city}
                      onChange={(e) => setProfileData(prev => ({ ...prev, city: e.target.value }))}
                      disabled={!editing}
                      placeholder="Blantyre"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">{t('pages.profile.settings.country')}</Label>
                    <Select value={profileData.country} onValueChange={(value) => setProfileData(prev => ({ ...prev, country: value }))} disabled={!editing}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Malawi">Malawi</SelectItem>
                        <SelectItem value="Zambia">Zambia</SelectItem>
                        <SelectItem value="Tanzania">Tanzania</SelectItem>
                        <SelectItem value="Kenya">Kenya</SelectItem>
                        <SelectItem value="South Africa">South Africa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="postalCode">{t('pages.profile.settings.postalCode')}</Label>
                    <Input
                      id="postalCode"
                      value={profileData.postalCode}
                      onChange={(e) => setProfileData(prev => ({ ...prev, postalCode: e.target.value }))}
                      disabled={!editing}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dateOfBirth">{t('pages.profile.settings.dateOfBirth')}</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={profileData.dateOfBirth}
                      onChange={(e) => setProfileData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                      disabled={!editing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">{t('pages.profile.settings.gender')}</Label>
                    <Select value={profileData.gender} onValueChange={(value) => setProfileData(prev => ({ ...prev, gender: value }))} disabled={!editing}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">{t('pages.profile.settings.bio')}</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    disabled={!editing}
                    placeholder={t('pages.profile.settings.bioPlaceholder')}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <div className="grid gap-6">
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-black">
                    <Globe className="h-5 w-5 mr-2" />
                    {t('pages.profile.settings.regionalPrefs')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>{t('pages.profile.settings.timezone')}</Label>
                      <Select value={preferences.timezone} onValueChange={(value) => handlePreferenceChange('timezone', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Africa/Blantyre">Africa/Blantyre</SelectItem>
                          <SelectItem value="Africa/Nairobi">Africa/Nairobi</SelectItem>
                          <SelectItem value="Africa/Johannesburg">Africa/Johannesburg</SelectItem>
                          <SelectItem value="UTC">UTC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-black">
                    <User className="h-5 w-5 mr-2" />
                    {t('pages.profile.settings.displayPrefs')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label>{t('pages.profile.settings.theme')}</Label>
                    <Select value={preferences.theme} onValueChange={(value) => handlePreferenceChange('theme', value)}>
                      <SelectTrigger className="w-full md:w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <div className="grid gap-6">
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-black">
                    <Bell className="h-5 w-5 mr-2" />
                    {t('pages.profile.settings.commPrefs')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">{t('pages.profile.settings.emailNotifications')}</Label>
                        <p className="text-sm text-gray-600">{t('pages.profile.settings.emailNotificationsDesc')}</p>
                      </div>
                      <Switch
                        checked={notificationPrefs.emailNotifications}
                        onCheckedChange={(checked) => handleNotificationPreferenceChange('emailNotifications', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">{t('pages.profile.settings.smsNotifications')}</Label>
                        <p className="text-sm text-gray-600">{t('pages.profile.settings.smsNotificationsDesc')}</p>
                      </div>
                      <Switch
                        checked={notificationPrefs.smsNotifications}
                        onCheckedChange={(checked) => handleNotificationPreferenceChange('smsNotifications', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-black">
                    <Mail className="h-5 w-5 mr-2" />
                    {t('pages.profile.settings.marketingPromos')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">{t('pages.profile.settings.marketingEmails')}</Label>
                      <p className="text-sm text-gray-600">{t('pages.profile.settings.marketingEmailsDesc')}</p>
                    </div>
                    <Switch
                      checked={notificationPrefs.marketingEmails}
                      onCheckedChange={(checked) => handleNotificationPreferenceChange('marketingEmails', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">{t('pages.profile.settings.promotionalSms')}</Label>
                      <p className="text-sm text-gray-600">{t('pages.profile.settings.promotionalSmsDesc')}</p>
                    </div>
                    <Switch
                      checked={notificationPrefs.promotionalSms}
                      onCheckedChange={(checked) => handleNotificationPreferenceChange('promotionalSms', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">{t('pages.profile.settings.newsletter')}</Label>
                      <p className="text-sm text-gray-600">{t('pages.profile.settings.newsletterDesc')}</p>
                    </div>
                    <Switch
                      checked={notificationPrefs.newsletter}
                      onCheckedChange={(checked) => handleNotificationPreferenceChange('newsletter', checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-black">
                    <Shield className="h-5 w-5 mr-2" />
                    {t('pages.profile.settings.importantNotifications')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">{t('pages.profile.settings.orderUpdates')}</Label>
                      <p className="text-sm text-gray-600">{t('pages.profile.settings.orderUpdatesDesc')}</p>
                    </div>
                    <Switch
                      checked={notificationPrefs.orderUpdates}
                      onCheckedChange={(checked) => handleNotificationPreferenceChange('orderUpdates', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">{t('pages.profile.settings.securityAlerts')}</Label>
                      <p className="text-sm text-gray-600">{t('pages.profile.settings.securityAlertsDesc')}</p>
                    </div>
                    <Switch
                      checked={notificationPrefs.securityAlerts}
                      onCheckedChange={(checked) => handleNotificationPreferenceChange('securityAlerts', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <div className="grid gap-6">
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-black">
                    <Key className="h-5 w-5 mr-2" />
                    {t('pages.profile.settings.changePassword')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        placeholder="Enter current password"
                      />
                    </div>
                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        placeholder="Enter new password"
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={handleChangePassword} 
                    disabled={changingPassword}
                    className="bg-black hover:bg-gray-800"
                  >
                    {changingPassword ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Changing Password...</>
                    ) : (
                      <><Lock className="h-4 w-4 mr-2" />Change Password</>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-black">
                    <Shield className="h-5 w-5 mr-2" />
                    {t('pages.profile.settings.securitySettings')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">{t('pages.profile.settings.twoFactor')}</Label>
                        <p className="text-sm text-gray-600">{t('pages.profile.settings.twoFactorDesc')}</p>
                        {securitySettings.twoFactorEnabled && (
                          <p className="text-sm text-green-600 font-medium">✓ Enabled</p>
                        )}
                      </div>
                      <Button 
                        variant="outline" 
                        className="border-black text-black hover:bg-black hover:text-white"
                        onClick={handleToggle2FA}
                      >
                        {securitySettings.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">{t('pages.profile.settings.activeSessions')}</Label>
                        <p className="text-sm text-gray-600">{t('pages.profile.settings.activeSessionsDesc')}</p>
                        <p className="text-sm text-gray-500">Currently: {securitySettings.activeSessions} active session(s)</p>
                      </div>
                      <Button 
                        variant="outline" 
                        className="border-black text-black hover:bg-black hover:text-white"
                        onClick={handleViewActiveSessions}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Sessions
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Account Security</Label>
                        <p className="text-sm text-gray-600">Logout from all devices and sessions</p>
                      </div>
                      <Button 
                        variant="outline" 
                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout Everywhere
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="flex items-center text-red-700">
                    <Trash2 className="h-5 w-5 mr-2" />
                    Danger Zone
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label className="text-base font-medium text-red-700">{t('pages.profile.settings.deleteAccount')}</Label>
                    <p className="text-sm text-red-600 mb-3">{t('pages.profile.settings.deleteAccountDesc')}</p>
                    <Button 
                      variant="destructive"
                      onClick={handleDeleteAccount}
                      disabled={deletingAccount}
                    >
                      {deletingAccount ? (
                        <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Deleting Account...</>
                      ) : (
                        <><Trash2 className="h-4 w-4 mr-2" />Delete Account</>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProfileSettings;