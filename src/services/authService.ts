const API_BASE_URL = 'https://thingsfromafrica-ecommerce-api.onrender.com/api/v1';

export interface AuthResponse {
  isSuccessful: boolean;
  remark: string;
  payload: {
    token: string;
    tokenExpiration: string;
    userId: number;
    fullName: string;
    email: string;
    phoneNumber: string;
    userRole: {
      roleId: number;
      roleName: string;
      roleDescription: string;
      isActive: boolean;
      createdAt: string;
      modifiedAt: string;
    };
    userName: string;
  } | null;
}

export interface SessionResponse {
  isSuccessful: boolean;
  remark: string;
  payload: Array<{
    sessionId: string;
    userId: number;
    expiresAt: string;
    createdAt: string;
    lastAccessedAt: string;
    sessionData: string;
    deviceInfo: string;
    userAgent: string;
    ipAddress: string;
    isActive: boolean;
  }>;
}

export interface SingleSessionResponse {
  isSuccessful: boolean;
  remark: string;
  payload: {
    sessionId: string;
    userId: number;
    expiresAt: string;
    createdAt: string;
    lastAccessedAt: string;
    sessionData: string;
    deviceInfo: string;
    userAgent: string;
    ipAddress: string;
    isActive: boolean;
  } | null;
}

export interface LoginHistoryResponse {
  isSuccessful: boolean;
  remark: string;
  payload: Array<{
    loginHistoryId: number;
    userId: number;
    loginStatus: string;
    ipAddress: string;
    userAgent: string;
    deviceInfo: string;
    loginMethod: string;
    failureReason: string;
    loginAt: string;
  }>;
}

class AuthService {
  private getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private setAuthToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  private removeAuthToken(): void {
    localStorage.removeItem('authToken');
  }

  async checkSession(): Promise<boolean> {
    const token = this.getAuthToken();
    if (!token) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/UserSessions/GetAll`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'text/plain'
        }
      });

      // If the request is successful (not 401/403), token is valid
      if (response.ok) {
        return true;
      }
      
      // If unauthorized, remove invalid token
      if (response.status === 401 || response.status === 403) {
        this.removeAuthToken();
        localStorage.removeItem('userId');
        localStorage.removeItem('userEmail');
      }
      
      return false;
    } catch (error) {
      console.error('Session check failed:', error);
      // If network error, assume user is still authenticated if they have a token
      return true;
    }
  }

  async signUp(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
  }): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/Users/SignUp`, {
        method: 'POST',
        headers: {
          'accept': 'text/plain',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          roleId: 2,
          passwordHash: userData.password,
          username: userData.email,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phoneNumber: userData.phoneNumber,
          emailVerified: true,
          isLocked: false,
          failedLoginAttempts: 0,
          twoFactorEnabled: false,
          userStatus: 'Active',
          phoneVerified: false,
          preferredLanguage: 'en',
          preferredCurrency: 'USD',
          timeZone: 'UTC',
          createdAt: new Date().toISOString(),
          modifiedAt: new Date().toISOString(),
          lastActiveAt: new Date().toISOString()
        })
      });

      const data: AuthResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Sign up failed:', error);
      return {
        isSuccessful: false,
        remark: 'Network error occurred',
        payload: null
      };
    }
  }

  async authenticate(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/Users/Authenticate`, {
        method: 'POST',
        headers: {
          'accept': 'text/plain',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data: AuthResponse = await response.json();
      
      if (data.isSuccessful && data.payload?.token) {
        this.setAuthToken(data.payload.token);
        // Store user info for session tracking
        localStorage.setItem('userId', data.payload.userId.toString());
        localStorage.setItem('userEmail', data.payload.email);
      } else if (!data.isSuccessful && data.remark?.includes('verify')) {
        // For now, bypass email verification requirement
        return {
          isSuccessful: false,
          remark: 'Please contact support to activate your account.',
          payload: null
        };
      }
      
      return data;
    } catch (error) {
      console.error('Authentication failed:', error);
      return {
        isSuccessful: false,
        remark: 'Network error occurred',
        payload: null
      };
    }
  }

  async getSessionById(sessionId: string): Promise<SingleSessionResponse> {
    const token = this.getAuthToken();
    if (!token) {
      return { isSuccessful: false, remark: 'No auth token', payload: null };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/UserSessions/GetById?sessionid=${sessionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'text/plain'
        }
      });

      const data: SingleSessionResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Get session failed:', error);
      return { isSuccessful: false, remark: 'Network error', payload: null };
    }
  }

  async getLoginHistory(): Promise<LoginHistoryResponse> {
    const token = this.getAuthToken();
    if (!token) {
      return { isSuccessful: false, remark: 'No auth token', payload: [] };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/UserLoginHistory/GetAll`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'text/plain'
        }
      });

      const data: LoginHistoryResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Get login history failed:', error);
      return { isSuccessful: false, remark: 'Network error', payload: [] };
    }
  }

  logout(): void {
    this.removeAuthToken();
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    // Clear cart cache to prevent cart data from persisting across users
    localStorage.removeItem('cartCache');
  }

  getUserId(): number | null {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId) : null;
  }

  getUserEmail(): string | null {
    return localStorage.getItem('userEmail');
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }
}

export const authService = new AuthService();