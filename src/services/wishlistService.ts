import { apiService, IAPIResponse } from "@/lib/api";
import { authService } from "./authService";
import { WishlistItem } from "@/models/members";


class WishlistService {
  private getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  async getWishlistItems(): Promise<WishlistItem[]> {
  
    try {
      const response = await apiService.get<IAPIResponse<WishlistItem[]>>(`Wishlist/GetWishlistByCustomerEmail?email=${authService.getUserEmail()}`);

      if (response && response.isSuccessful && response.payload) {
        return response.payload || [];
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
      const response = await apiService.post<IAPIResponse<WishlistItem>>(`Wishlist/Add`, {
        customerId: userId ? parseInt(userId) : 0,
        productId: productId,
        notes: 'string',
        priority: 0,
        createdAt: new Date().toISOString()
      });

      return response.isSuccessful;
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
      return false;
    }
  }

  async removeFromWishlist(wishlistId: number): Promise<boolean> {
    const token = this.getAuthToken();
    if (!token) return false;

    try {
      const response = await apiService.delete<IAPIResponse<object>>(`Wishlist/Delete?wishlistid=${wishlistId}`);
      return response.isSuccessful;
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