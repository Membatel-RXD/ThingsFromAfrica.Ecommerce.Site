export interface Artisan {
    artisanId: number
    artisanName: string
    artisanSlug: string
    village: string
    region: string
    biography: string
    yearsOfExperience: number
    specialization: string
    contactPhone: string
    contactEmail: string
    profileImageUrl: string
    isActive: boolean
    createdAt: string // ISO 8601 date string
    modifiedAt: string // ISO 8601 date string
  }
  export interface CraftType {
    craftTypeId: number;
    craftTypeName: string;
    craftTypeDescription: string;
    isActive: boolean;
    createdAt: string;
  }
  export interface Product {
    weight: number
    length: number
    width: number
    height: number
    basePrice: number
    productId: number
    productName: string
    productSlug: string
    sku: string
    itemCode: string
    categoryId: number
    craftTypeId: number
    woodTypeId: number
    productDescription: string
    shortDescription: string
    touristPrice: number
    localPrice: number
    costPrice: number
    currency: string
    usdPrice: number
    woodType: string
    woodOrigin: string
    craftingTechnique: string
    craftingTime: string
    difficultyLevel: string
    artisanId: number
    artisanName: string
    artisanVillage: string
    artisanStory: string
    culturalSignificance: string
    tribalOrigin: string
    culturalStory: string
    traditionalUse: string
    woodGrain: string
    woodColor: string
    woodHardness: string
    woodFinish: string
    condition: string
    qualityGrade: string
    handmadeLevel: string
    stockQuantity: number
    isUnique: boolean
    lowStockThreshold: number
    stockStatus: string
    productStatus: string
    isVisible: boolean
    isFeatured: boolean
    isAuthentic: boolean
    isCertified: boolean
    mainImageUrl: string
    galleryImages: string
    processImages: string
    artisanImage: string
    videoUrl: string
    isPopularWithTourists: boolean
    touristFriendlySize: boolean
    packingFriendly: boolean
    shippingFragile: boolean
    isSouvenir: boolean
    souvenirType: string
    giftWrappingAvailable: boolean
    personalizationAvailable: boolean
    careInstructions: string
    cleaningInstructions: string
    storageInstructions: string
    shippingWeight: number
    packagingRequired: string
    shippingRestrictions: string
    customsCode: string
    requiresPhytosanitaryCertificate: boolean
    averageRating: number
    reviewCount: number
    metaTitle: string
    metaDescription: string
    metaKeywords: string
    yearMade: number
    isAntique: boolean
    ageCategory: string
    customAttributes: string
    createdAt: string // ISO 8601 date string
    modifiedAt: string // ISO 8601 date string
    createdBy: number
    modifiedBy: number
    isDeleted: boolean
    deletedAt: string // ISO 8601 date string
    deletedBy: number
  }
  