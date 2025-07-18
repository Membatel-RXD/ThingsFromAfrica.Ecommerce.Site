import { AddCartItem, CartItem } from "@/models/members";
import { authService } from "./authService";
import { apiService, IAPIResponse } from "@/lib/api";
import axios from "axios";



class CartService {
  private getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  async getCartItems(): Promise<CartItem[]> {
    const token = this.getAuthToken();
    if (!token) {
      this.clearCartCache();
      return [];
    }

    const userId = authService.getUserId();
    try {
      // Use direct axios call to the correct API endpoint
      const response = await axios.get(
        `https://thingsfromafrica-ecommerce-api.onrender.com/api/v1/ShoppingCart/GetByCustomerId/${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': 'text/plain'
          }
        }
      );
      return response.data.payload || [];
    } catch (error) {
      console.error('Failed to fetch cart items:', error);
      return [];
    }
  }

  clearCartCache(): void {
    // Clear any cart-related cache or local storage
    localStorage.removeItem('cartCache');
  }

  async addToCart(cart:AddCartItem): Promise<IAPIResponse<CartItem>> {
    const token = this.getAuthToken();
    if (!token) throw new Error("User not authenticated") ;
    try {
      return await apiService.post<IAPIResponse<CartItem>>(`/ShoppingCart/Add`,cart);

    } catch (error) {
      console.error('Failed to add to cart:', error);
       throw new Error("User not authenticated") ;
    }
  }

  async getCartCount(): Promise<number> {
    try {
      const items = await this.getCartItems();
      return items.reduce((total, item) => total + item.quantity, 0);
    } catch (error) {
      console.error('Failed to get cart count:', error);
      return 0;
    }
  }

  async updateCartItem(cartId: number, quantity: number, existingItem?: CartItem): Promise<boolean> {
    const token = this.getAuthToken();
    if (!token) return false;

    try {
      // If no existing item provided, fetch current cart items to get the item data
      let itemData = existingItem;
      if (!itemData) {
        const cartItems = await this.getCartItems();
        itemData = cartItems.find(item => item.cartId === cartId);
        if (!itemData) {
          console.error('Cart item not found');
          return false;
        }
      }
      const response = await apiService.put<IAPIResponse<object>>(`/ShoppingCart/Update?cartid=${cartId}`, {
        productId: itemData.productId,
        quantity: quantity,
        unitPrice: itemData.unitPrice,
        customerId: itemData.customerId,
        sessionId: itemData.sessionId,
        currency: itemData.currency || 'USD',
        specialInstructions: itemData.specialInstructions || '',
        addedAt: itemData.addedAt,
        modifiedAt: new Date().toISOString(),
        expiresAt: itemData.expiresAt,
        cartId: cartId
      });
      return response.isSuccessful;
    } catch (error) {
      console.error('Failed to update cart item:', error);
      return false;
    }
  }

  async removeFromCart(cartId: number): Promise<boolean> {
    const token = this.getAuthToken();
    if (!token) return false;
    try {
      const response = await apiService.delete<IAPIResponse<object>>(`/ShoppingCart/Delete?cartid=${cartId}`);
      return response.isSuccessful;
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      return false;
    }
  }

  async deleteProduct(productId: number): Promise<boolean> {
    const token = this.getAuthToken();
    if (!token) return false;

    try {
      const response = await apiService.delete<IAPIResponse<object>>(`/Products/Delete?productid=${productId}`);
      return response.isSuccessful;
    } catch (error) {
      console.error('Failed to delete product:', error);
      return false;
    }
  }
}

export const cartService = new CartService();