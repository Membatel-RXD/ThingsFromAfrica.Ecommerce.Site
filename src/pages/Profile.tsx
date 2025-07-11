import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { authService } from '../services/authService';
import { useAppContext } from '../contexts/AppContext';
import { User, Clock, Monitor, MapPin, LogOut } from 'lucide-react';

const Profile: React.FC = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loginHistory, setLoginHistory] = useState<any[]>([]);
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
        const [sessionsResponse, historyResponse] = await Promise.all([
          authService.checkSession(),
          authService.getLoginHistory()
        ]);

        if (historyResponse.isSuccessful) {
          setLoginHistory(historyResponse.payload);
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [navigate]);

  const { clearCart } = useAppContext();
  
  const handleLogout = () => {
    authService.logout();
    // Clear cart data when logging out
    clearCart();
    navigate('/');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadge = (status: string) => {
    const isSuccess = status.toLowerCase() === 'success';
    return (
      <Badge variant={isSuccess ? 'default' : 'destructive'}>
        {status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-black mb-2">My Profile</h1>
              <p className="text-gray-700">Manage your account and view your activity</p>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline" 
              className="border-black text-black hover:bg-black hover:text-white"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* User Info */}
        <Card className="border-gray-200 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-black">
              <User className="h-5 w-5 mr-2" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Email:</strong> {authService.getUserEmail()}</p>
              <p><strong>User ID:</strong> {authService.getUserId()}</p>
            </div>
          </CardContent>
        </Card>

        {/* Login History */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center text-black">
              <Clock className="h-5 w-5 mr-2" />
              Login History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loginHistory.length === 0 ? (
              <p className="text-gray-600">No login history available</p>
            ) : (
              <div className="space-y-4">
                {loginHistory.slice(0, 10).map((login, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(login.loginStatus)}
                        <span className="text-sm text-gray-600">
                          {login.loginMethod}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDate(login.loginAt)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        IP: {login.ipAddress}
                      </div>
                      <div className="flex items-center">
                        <Monitor className="h-3 w-3 mr-1" />
                        {login.deviceInfo || 'Unknown Device'}
                      </div>
                    </div>
                    
                    {login.failureReason && (
                      <div className="mt-2 text-sm text-red-600">
                        <strong>Failure Reason:</strong> {login.failureReason}
                      </div>
                    )}
                    
                    {login.userAgent && (
                      <div className="mt-2 text-xs text-gray-500 truncate">
                        {login.userAgent}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;