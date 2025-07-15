import axios from 'axios';

const API_BASE_URL = 'https://thingsfromafrica-ecommerce-api.onrender.com/api/v1';

export interface WishlistItem {
  wishlistId: number;
  customerId: number;
  productId: number;
  notes: string;
  priority: number;
  createdAt: string;
}

export interface WishlistResponse {
  isSuccessful: boolean;
  remark: string;
  payload: WishlistItem[];
}

class WishlistService {
  private getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private getAuthHeaders() {
    const token = this.getAuthToken();
    return {
      'Authorization': `Bearer ${token}`,
      'accept': 'text/plain',
      'Content-Type': 'application/json'
    };
  }

  async getWishlistItems(): Promise<WishlistItem[]> {
    const token = this.getAuthToken();
    if (!token) return [];

    try {
      const response = await axios.get(`${API_BASE_URL}/Wishlist/GetAll`, {
        headers: this.getAuthHeaders()
      });

      if (response.data.isSuccessful) {
        return response.data.payload;
      }
      
      return [];
    } catch (error) {
      console.error('Failed to fetch wishlist items:', error);
      return [];
    }
  }

  async addToWishlist(productId: number): Promise<boolean> {
    const token = this.getAuthToken();
    if (!token) return false;

    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.post(`${API_BASE_URL}/Wishlist/Add`, {
        customerId: userId ? parseInt(userId) : 0,
        productId: productId,
        notes: 'string',
        priority: 0,
        createdAt: new Date().toISOString()
      }, {
        headers: this.getAuthHeaders()
      });

      return response.data.isSuccessful;
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
      return false;
    }
  }

  async removeFromWishlist(wishlistId: number): Promise<boolean> {
    const token = this.getAuthToken();
    if (!token) return false;

    try {
      const response = await axios.delete(`${API_BASE_URL}/Wishlist/Delete?wishlistid=${wishlistId}`, {
        headers: this.getAuthHeaders()
      });

      return response.data.isSuccessful;
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
      return false;
    }
  }

  async removeFromWishlistByProductId(productId: number): Promise<boolean> {
    const wishlistItems = await this.getWishlistItems();
    const item = wishlistItems.find(item => item.productId === productId);
    
    if (item) {
      return await this.removeFromWishlist(item.wishlistId);
    }
    
    return false;
  }

  async isInWishlist(productId: number): Promise<boolean> {
    const wishlistItems = await this.getWishlistItems();
    return wishlistItems.some(item => item.productId === productId);
  }
}

export const wishlistService = new WishlistService();