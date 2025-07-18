import { apiService, IAPIResponse } from "@/lib/api";
import { Product } from "@/models/members";
import axios from "axios";
import { authService } from "./authService";

class ProductService {
  async getAllProducts(): Promise<Product[]> {
    try {
      // Get auth token
      const token = authService.getAuthToken();
      
      // Use direct axios call with the API URL from environment variables
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/Products/GetAll`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': 'text/plain',
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data && response.data.isSuccessful && response.data.payload) {
        return response.data.payload.filter((product: Product) => 
          product.isVisible && !product.isDeleted && product.stockQuantity > 0
        );
      }
      
      return [];
    } catch (error) {
      console.error('Failed to fetch products:', error);
      return [];
    }
  }

  // Convert API product to shop product format
  convertToShopProduct(apiProduct: Product) {
    // Use placeholder images instead of API images that return 404
    const placeholderImages = [
      '/placeholder.svg',
      '/product1.jpg',
      '/product2.jpg',
      '/product3.jpg',
      '/product4.jpg'
    ];
    
    // Get a consistent placeholder based on product ID
    const placeholderIndex = apiProduct.productId % placeholderImages.length;
    const placeholderImage = placeholderImages[placeholderIndex];
    
    return {
      id: apiProduct.productId,
      name: apiProduct.productName || 'Handcrafted Item',
      price: apiProduct.touristPrice || apiProduct.localPrice || 0,
      originalPrice: apiProduct.touristPrice > apiProduct.localPrice ? apiProduct.touristPrice : undefined,
      artisan: apiProduct.artisanName || 'African Artisan',
      region: apiProduct.artisanVillage || 'Africa',
      rating: apiProduct.averageRating || 4.5,
      reviews: apiProduct.reviewCount || 0,
      image: placeholderImage, // Use placeholder instead of API image
      category: this.getCategoryFromId(apiProduct.categoryId),
      inStock: apiProduct.stockQuantity > 0,
      badge: this.getBadge(apiProduct)
    };
  }

  private getCategoryFromId(categoryId: number): string {
    const categories: { [key: number]: string } = {
      1: 'Wood Carvings',
      2: 'Baskets',
      3: 'Textiles',
      4: 'Pottery',
      5: 'Jewelry',
      6: 'Sculptures'
    };
    return categories[categoryId] || 'Crafts';
  }

  private getBadge(product: Product): string {
    if (product.isFeatured) return 'Featured';
    if (product.isPopularWithTourists) return 'Popular';
    if (product.isUnique) return 'Unique';
    if (product.isCertified) return 'Certified';
    return 'Authentic';
  }
}

export const productService = new ProductService();