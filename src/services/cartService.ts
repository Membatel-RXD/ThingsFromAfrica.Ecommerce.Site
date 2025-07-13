const API_BASE_URL = 'https://thingsfromafrica-ecommerce-api.onrender.com/api/v1';

export interface CartItem {
  productId: number;
  quantity: number;
  unitPrice: number;
  cartId: number;
  customerId: number;
  sessionId: string;
  currency: string;
  specialInstructions: string;
  addedAt: string;
  modifiedAt: string;
  expiresAt: string;
}

export interface CartResponse {
  isSuccessful: boolean;
  remark: string;
  payload: CartItem[];
}

class CartService {
  private getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  async getCartItems(): Promise<CartItem[]> {
    const token = this.getAuthToken();
    if (!token) {
      // Clear any cached cart data if no token
      this.clearCartCache();
      return [];
    }

    try {
      const response = await fetch(`${API_BASE_URL}/ShoppingCart/GetAll`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'text/plain'
        }
      });

      const data: CartResponse = await response.json();
      
      if (data.isSuccessful) {
        return data.payload;
      }
      
      return [];
    } catch (error) {
      console.error('Failed to fetch cart items:', error);
      return [];
    }
  }

  clearCartCache(): void {
    // Clear any cart-related cache or local storage
    localStorage.removeItem('cartCache');
  }

  async addToCart(productId: number, quantity: number = 1, unitPrice: number): Promise<boolean> {
    const token = this.getAuthToken();
    if (!token) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/ShoppingCart/Add`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'text/plain',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId,
          quantity,
          unitPrice,
          currency: 'USD'
        })
      });

      const data = await response.json();
      return data.isSuccessful;
    } catch (error) {
      console.error('Failed to add to cart:', error);
      return false;
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

      const response = await fetch(`${API_BASE_URL}/ShoppingCart/Update?cartid=${cartId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'text/plain',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
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
        })
      });

      const data = await response.json();
      return data.isSuccessful;
    } catch (error) {
      console.error('Failed to update cart item:', error);
      return false;
    }
  }

  async removeFromCart(cartId: number): Promise<boolean> {
    const token = this.getAuthToken();
    if (!token) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/ShoppingCart/Delete?cartid=${cartId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'text/plain'
        }
      });

      const data = await response.json();
      return data.isSuccessful;
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      return false;
    }
  }

  async deleteProduct(productId: number): Promise<boolean> {
    const token = this.getAuthToken();
    if (!token) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/Products/Delete?productid=${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'text/plain'
        }
      });

      const data = await response.json();
      return data.isSuccessful;
    } catch (error) {
      console.error('Failed to delete product:', error);
      return false;
    }
  }
}

export const cartService = new CartService();