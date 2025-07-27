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
   convertToShopProduct = (apiProduct: Product): Partial<Product> => {
    // Map API category to shop category format
    const mapCategoryToShopFormat = (apiCategory: any) => {
      if (!apiCategory) return 'other';
      
      // If apiCategory is an object with categorySlug or categoryName
      if (typeof apiCategory === 'object') {
        return apiCategory.categorySlug || apiCategory.categoryName?.toLowerCase() || 'other';
      }
      
      // If apiCategory is just a string
      if (typeof apiCategory === 'string') {
        return apiCategory.toLowerCase().replace(/\s+/g, '-');
      }
      
      return 'other';
    };
  
    return {
      productId: apiProduct.productId,
      productName: apiProduct.productName,
      usdPrice: apiProduct.usdPrice || 0,
      basePrice: apiProduct.basePrice,
      mainImageUrl: apiProduct.mainImageUrl  || '/placeholder-image.jpg',
      averageRating: apiProduct.averageRating || apiProduct.averageRating || 4.0,
      reviewCount: apiProduct.reviewCount || apiProduct.reviewCount || 0,
      productSlug:apiProduct.productSlug,
      // 🎯 THIS IS THE KEY - Map the category correctly
      category: mapCategoryToShopFormat(apiProduct.categoryId),
      categoryId: apiProduct.categoryId ,
      artisanName: apiProduct.artisanName  || 'Unknown Artisan',
      artisanId:apiProduct.artisanId,
      artisanVillage: apiProduct.artisanVillage  || 'Unknown Region',
      stockQuantity: apiProduct.stockQuantity ,
      isFeatured: apiProduct.isFeatured ,
      productDescription: apiProduct.productDescription || apiProduct.shortDescription,
      
      // Additional properties for advanced filtering
      woodType: apiProduct.woodType || apiProduct.woodType,
      woodTypeId: apiProduct.woodTypeId ,

      craftingTechnique: apiProduct.craftingTechnique,
      weight:apiProduct.weight,
      traditionalUse:apiProduct.traditionalUse,
      tribalOrigin:apiProduct.tribalOrigin,
      width:apiProduct.width,
      height:apiProduct.height,
      isAntique:apiProduct.isAntique,
      isCertified:apiProduct.isCertified,
      isUnique:apiProduct.isUnique,
      isDeleted:apiProduct.isDeleted,
      isPopularWithTourists:apiProduct.isPopularWithTourists,
      isVisible:apiProduct.isVisible,
      isSouvenir:apiProduct.isSouvenir,
      stockStatus:apiProduct.stockStatus,
      storageInstructions:apiProduct.storageInstructions,
      culturalSignificance:apiProduct.culturalSignificance,
      culturalStory:apiProduct.culturalStory,
      cleaningInstructions:apiProduct.cleaningInstructions,
 
      // Add other properties as needed
    };
  };
  
}

export const productService = new ProductService();