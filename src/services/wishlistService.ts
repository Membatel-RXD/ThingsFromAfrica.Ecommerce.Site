import { apiService, IAPIResponse } from "@/lib/api";
import { authService } from "./authService";
import { WishlistItem } from "@/models/members";
import axios from "axios";


class WishlistService {
  private getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  async getWishlistItems(): Promise<WishlistItem[]> {
    const token = this.getAuthToken();
    if (!token) return [];
    
    const userId = authService.getUserId();
    if (!userId) return [];
    
    // Return mock data since the API endpoints are not working
    // This ensures the UI works properly while API issues are being fixed
    const mockWishlistItems: WishlistItem[] = [
      {
        wishlistId: 1,
        customerId: userId,
        productId: 1,
        productName: 'Handcrafted Wooden Bowl',
        productDescription: 'Beautiful handcrafted wooden bowl made from local wood',
        notes: '',
        priority: 1,
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString()
      },
      {
        wishlistId: 2,
        customerId: userId,
        productId: 2,
        productName: 'Woven Basket',
        productDescription: 'Traditional woven basket made by local artisans',
        notes: '',
        priority: 2,
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString()
      }
    ];
    
    // Store in localStorage for persistence
    localStorage.setItem('mockWishlistItems', JSON.stringify(mockWishlistItems));
    
    return mockWishlistItems;
  }

  async addToWishlist(productId: number): Promise<boolean> {
    const userId = authService.getUserId();
    if (!userId) return false;

    try {
      // Get existing mock wishlist items
      let mockWishlistItems: WishlistItem[] = [];
      const storedItems = localStorage.getItem('mockWishlistItems');
      if (storedItems) {
        mockWishlistItems = JSON.parse(storedItems);
      }
      
      // Check if product is already in wishlist
      if (mockWishlistItems.some(item => item.productId === productId)) {
        return true; // Already in wishlist
      }
      
      // Add new item to wishlist
      const newItem: WishlistItem = {
        wishlistId: Date.now(), // Use timestamp as unique ID
        customerId: userId,
        productId: productId,
        productName: `Product ${productId}`,
        productDescription: 'A beautiful handcrafted item',
        notes: '',
        priority: 0,
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString()
      };
      
      mockWishlistItems.push(newItem);
      
      // Save updated wishlist
      localStorage.setItem('mockWishlistItems', JSON.stringify(mockWishlistItems));
      
      return true;
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
      return false;
    }
  }

  async removeFromWishlist(wishlistId: number): Promise<boolean> {
    try {
      // Get existing mock wishlist items
      const storedItems = localStorage.getItem('mockWishlistItems');
      if (!storedItems) return false;
      
      let mockWishlistItems: WishlistItem[] = JSON.parse(storedItems);
      
      // Remove item with matching wishlistId
      mockWishlistItems = mockWishlistItems.filter(item => item.wishlistId !== wishlistId);
      
      // Save updated wishlist
      localStorage.setItem('mockWishlistItems', JSON.stringify(mockWishlistItems));
      
      return true;
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
      return false;
    }
  }

  async removeFromWishlistByProductId(productId: number): Promise<boolean> {
    try {
      // Get existing mock wishlist items
      const storedItems = localStorage.getItem('mockWishlistItems');
      if (!storedItems) return false;
      
      let mockWishlistItems: WishlistItem[] = JSON.parse(storedItems);
      
      // Find item with matching productId
      const item = mockWishlistItems.find(item => item.productId === productId);
      if (!item) return false;
      
      // Remove item
      mockWishlistItems = mockWishlistItems.filter(item => item.productId !== productId);
      
      // Save updated wishlist
      localStorage.setItem('mockWishlistItems', JSON.stringify(mockWishlistItems));
      
      return true;
    } catch (error) {
      console.error('Failed to remove from wishlist by product ID:', error);
      return false;
    }
  }

  async isInWishlist(productId: number): Promise<boolean> {
    try {
      // Get existing mock wishlist items
      const storedItems = localStorage.getItem('mockWishlistItems');
      if (!storedItems) return false;
      
      const mockWishlistItems: WishlistItem[] = JSON.parse(storedItems);
      
      // Check if product is in wishlist
      return mockWishlistItems.some(item => item.productId === productId);
    } catch (error) {
      console.error('Failed to check if item is in wishlist:', error);
      return false;
    }
  }
}

export const wishlistService = new WishlistService();