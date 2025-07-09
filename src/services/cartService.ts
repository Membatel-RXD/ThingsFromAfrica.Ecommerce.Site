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
    if (!token) return [];

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
    const items = await this.getCartItems();
    return items.reduce((total, item) => total + item.quantity, 0);
  }
}

export const cartService = new CartService();