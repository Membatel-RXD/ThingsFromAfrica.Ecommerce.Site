import { apiService, IAPIResponse } from "@/lib/api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface AuthResponse {
  token: string;
  tokenExpiration: string; // or Date, depending on how you handle it
  userId: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  requiresTwoFactor:boolean;
  sessionId:string;
  userRole: {
    roleId: number;
    roleName: string;
    roleDescription: string;
    isActive: boolean;
    createdAt: string; // or Date
    modifiedAt: string; // or Date
  };
  userName: string;
}

export interface Verify2FARequest {
  userId: number;
  verificationCode: string;
}

export interface Verify2FAResponse {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  sessionId: string;
  token: string;
  tokenExpiration: string;
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
  public async verify2FA(request: { userId: number; verificationCode: string; }): Promise<IAPIResponse<Verify2FAResponse>> {
    try {
      const response = await apiService.post<IAPIResponse<Verify2FAResponse>>(
        `/auth/Verify2FA`,
        {
          userId: request.userId,
          verificationCode: request.verificationCode
        }
      );
      
      if (response.isSuccessful && response.payload) {
        // Store the JWT token and user info after successful 2FA verification
        this.setAuthToken(response.payload.token);
        localStorage.setItem('userId', response.payload.userId.toString());
        localStorage.setItem('userEmail', response.payload.email);
      }
      
      return response;
    } catch (error) {
      console.error('2FA verification failed:', error);
      return {
        isSuccessful: false,
        remark: 'Network error occurred during 2FA verification',
        payload: null
      };
    }
  }
  
  public async resend2FA(userId: number): Promise<IAPIResponse<any>> {
    try {
      const response = await apiService.post<IAPIResponse<any>>(
        `/auth/Resend2FA`,
        {
          userId: userId
        }
      );
      
      return response;
    } catch (error) {
      console.error('2FA resend failed:', error);
      return {
        isSuccessful: false,
        remark: 'Network error occurred while resending 2FA code',
        payload: null
      };
    }
  }
  public getAuthToken(): string | null {
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
  }): Promise<IAPIResponse<AuthResponse>> {
    try {
      const response = await apiService.post<IAPIResponse<AuthResponse>>(`${API_BASE_URL}/Users/SignUp`, 
       {
          roleId: 2,
          passwordHash: userData.password,
          username: userData.email,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phoneNumber: userData.phoneNumber,
          emailVerified: false,
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
        });

      return response;
    } catch (error) {
      return {
        isSuccessful: false,
        remark: 'Network error occurred',
        payload: null
      };
    }
  }

  async authenticate(email: string, password: string): Promise<IAPIResponse<AuthResponse>> {
    try {
      const response = await apiService.post<IAPIResponse<AuthResponse>>(
        `/Users/Authenticate`,
        {
          email: email,
          password: password,
        }
      );
      
      
      if (response.isSuccessful && response.payload) {
        this.setAuthToken(response.payload.token);
        // Store user info for session tracking
        localStorage.setItem('userId', response.payload.userId.toString());
        localStorage.setItem('userEmail', response.payload.email);


      } else if (!response.isSuccessful) {
        // For now, bypass email verification requirement
        return {
          isSuccessful: false,
          remark: response.remark || 'Please contact support to activate your account.',
          payload: null
        };
      }
      
      return response;
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
    
    const parsed = Number(userId);
    return isNaN(parsed) ? null : parsed;
  }
  

  getUserEmail(): string | null {
    return localStorage.getItem('userEmail');
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }
}

export const authService = new AuthService();