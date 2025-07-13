const API_BASE_URL = 'https://thingsfromafrica-ecommerce-api.onrender.com/api/v1';

export interface ApiProduct {
  productId: number;
  productName: string;
  productSlug: string;
  sku: string;
  itemCode: string;
  categoryId: number;
  craftTypeId: number;
  woodTypeId: number;
  productDescription: string;
  shortDescription: string;
  touristPrice: number;
  localPrice: number;
  costPrice: number;
  currency: string;
  usdPrice: number;
  woodType: string;
  woodOrigin: string;
  craftingTechnique: string;
  craftingTime: string;
  difficultyLevel: string;
  artisanId: number;
  artisanName: string;
  artisanVillage: string;
  artisanStory: string;
  culturalSignificance: string;
  tribalOrigin: string;
  culturalStory: string;
  traditionalUse: string;
  woodGrain: string;
  woodColor: string;
  woodHardness: string;
  woodFinish: string;
  condition: string;
  qualityGrade: string;
  handmadeLevel: string;
  stockQuantity: number;
  isUnique: boolean;
  lowStockThreshold: number;
  stockStatus: string;
  productStatus: string;
  isVisible: boolean;
  isFeatured: boolean;
  isAuthentic: boolean;
  isCertified: boolean;
  mainImageUrl: string;
  galleryImages: string;
  processImages: string;
  artisanImage: string;
  videoUrl: string;
  isPopularWithTourists: boolean;
  touristFriendlySize: boolean;
  packingFriendly: boolean;
  shippingFragile: boolean;
  isSouvenir: boolean;
  souvenirType: string;
  giftWrappingAvailable: boolean;
  personalizationAvailable: boolean;
  careInstructions: string;
  cleaningInstructions: string;
  storageInstructions: string;
  shippingWeight: number;
  packagingRequired: string;
  shippingRestrictions: string;
  customsCode: string;
  requiresPhytosanitaryCertificate: boolean;
  averageRating: number;
  reviewCount: number;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  yearMade: number;
  isAntique: boolean;
  ageCategory: string;
  customAttributes: string;
  createdAt: string;
  modifiedAt: string;
  createdBy: number;
  modifiedBy: number;
  isDeleted: boolean;
  deletedAt: string;
  deletedBy: number;
}

export interface ProductsResponse {
  isSuccessful: boolean;
  remark: string;
  payload: ApiProduct[];
}

class ProductService {
  async getAllProducts(): Promise<ApiProduct[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/Products/GetAll`, {
        headers: {
          'accept': 'text/plain'
        }
      });

      const data: ProductsResponse = await response.json();
      
      if (data.isSuccessful) {
        return data.payload.filter(product => 
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
  convertToShopProduct(apiProduct: ApiProduct) {
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

  private getBadge(product: ApiProduct): string {
    if (product.isFeatured) return 'Featured';
    if (product.isPopularWithTourists) return 'Popular';
    if (product.isUnique) return 'Unique';
    if (product.isCertified) return 'Certified';
    return 'Authentic';
  }
}

export const productService = new ProductService();