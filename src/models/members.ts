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
  export interface AddressDTO {
    addressId: number
    userId: number
    addressLine1: string
    addressLine2: string
    city: string
    stateProvince: string
    postalCode: string
    country: string
    contactName: string
    contactPhone: string
    addressType: string
    isActive: boolean
    isDefault: boolean
    createdAt: string // ISO 8601 date string
    modifiedAt: string // ISO 8601 date string
  }
  
  export interface CreateUserAddressRequest extends Omit<AddressDTO,'addressId'|
   'modifiedAt'|
   'createdAt'>{};
  

  export interface Customer{
    userId: number
    customerType: string
    companyName: string
    taxId: string
    marketingOptIn: boolean
    newsletterOptIn: boolean
    smsOptIn: boolean
    totalOrders: number
    totalSpent: number
    averageOrderValue: number
    lastOrderDate: string // ISO 8601 date string
    customerLifetimeValue: number
    loyaltyPoints: number
    loyaltyTier: string
    createdAt: string // ISO 8601 date string
    modifiedAt: string // ISO 8601 date string
  }
  
  export interface User {
    roleId: number
    passwordHash: string
    username: string
    userId:number;
    email: string
    emailVerified: boolean
    emailVerificationToken: string
    emailVerificationExpiry: string // ISO date string
    passwordSalt: string
    passwordResetToken: string
    passwordResetExpiry: string // ISO date string
    lastPasswordChange: string // ISO date string
    isLocked: boolean
    lockoutEndDate: string // ISO date string
    failedLoginAttempts: number
    lastLoginAt: string // ISO date string
    lastLoginIP: string
    twoFactorEnabled: boolean
    twoFactorSecret: string
    twoFactorBackupCodes: string
    userStatus: string // or UserStatus enum
    firstName: string
    lastName: string
    displayName: string
    dateOfBirth: string // YYYY-MM-DD
    gender: string // or Gender enum
    profileImageUrl: string
    phoneNumber: string
    phoneVerified: boolean
    phoneVerificationCode: string
    phoneVerificationExpiry: string // ISO date string
    preferredLanguage: string
    preferredCurrency: string
    timeZone: string
    notificationPreferences: string
    createdAt: string // ISO date string
    modifiedAt: string // ISO date string
    lastActiveAt: string // ISO date string
  }
  
  export interface CustomerProfileContainerDTO {
    customerProfile: Customer
    userDetails: User
    userAddresses: AddressDTO[]
  }

  export interface PayPalOrderResponse {
    orderId: string;
    status: string;
    approvalUrl: string;
    links: PayPalLink[];
  }
  
  export interface PayPalLink {
    href: string;
    rel: string;
    method: string;
  }
  

  export interface PayPalOrder {
    intent: string;
    purchase_units: PurchaseUnit[];
    orderNumber: string;
  }
  
  interface PurchaseUnit {
    amount: Amount;
    items: Item[];
    reference_id: string;
    description: string;
    custom_id: string;
    soft_descriptor: string;
  }
  
  interface Amount {
    currency_code: string;
    value: string;
  }
  
  interface Item {
    name: string;
    quantity: string;
    unit_amount: Amount;
    description: string;
    sku: string;
    category: string;
  }
  export interface CartItem {
    productName: string;
    sku: string;
    productDescription: string;
    shortDescription: string;
    productId: number;
    quantity: number;
    unitPrice: number;
    cartId: number;
    customerId: number;
    sessionId: string;
    currency: string;
    specialInstructions: string;
    addedAt: string;    // ISO 8601 date-time string
    modifiedAt: string; // ISO 8601 date-time string
    expiresAt: string;  // ISO 8601 date-time string
  }
  