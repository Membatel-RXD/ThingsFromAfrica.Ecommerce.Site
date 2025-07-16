import { apiService, IAPIResponse } from "@/lib/api";
import { Product } from "@/models/members";

class ProductService {
  async getAllProducts(): Promise<Product[]> {
    try {
      const response = await apiService.get<IAPIResponse<Product[]>>(`/Products/GetAll`);
      
      if (response.isSuccessful) {
        return response.payload.filter(product => 
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
    return {
      id: apiProduct.productId,
      name: apiProduct.productName || 'Handcrafted Item',
      price: apiProduct.touristPrice || apiProduct.localPrice || 0,
      originalPrice: apiProduct.touristPrice > apiProduct.localPrice ? apiProduct.touristPrice : undefined,
      artisan: apiProduct.artisanName || 'African Artisan',
      region: apiProduct.artisanVillage || 'Africa',
      rating: apiProduct.averageRating || 4.5,
      reviews: apiProduct.reviewCount || 0,
      image: apiProduct.mainImageUrl || '/placeholder.svg',
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