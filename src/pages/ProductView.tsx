import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  ShoppingCart, 
  Star, 
  MapPin, 
  Clock, 
  Shield,
  Truck,
  Gift,
  ChevronLeft,
  ChevronRight,
  User,
  Award,
  Leaf
} from 'lucide-react';
import { Product } from '@/models/members';
import { apiService, IAPIResponse } from '@/lib/api';
import { authService } from '@/services/authService';
import { cartService } from '@/services/cartService';
import { useNavigate, useParams } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';

const ProductDetailContent = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [productData, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // Fetch product data on component mount
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiService.get<IAPIResponse<Product>>(`Product/GetBySlug/${slug}`);
        
        if (response.isSuccessful && response.payload) {
          setProduct(response.payload);
          // Reset image index when new product loads
          setCurrentImageIndex(0);
        } else {
          setError(response.remark || 'Product not found');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  // Mock function - replace with actual API call
  const handleAddToCart = async (productId: number) => {
    // Add null check for productData
    if (!productData) return;

    try {
      const hasValidSession = await authService.checkSession();
      const userId = authService.getUserId();
      if (!hasValidSession || !userId) {
        navigate('/login');
        return;
      }
      
      const addToCartItem = {
        productId: productId,
        quantity: quantity,
        unitPrice: productData.usdPrice,
        customerId: userId,
        currency: 'USD'
      };
      
      const response = await cartService.addToCart(addToCartItem);
      if (response && response.isSuccessful) {
        // showSnackbar(response.remark || `Added ${productData.productName} to cart`, 'success');
        // await updateCartCount();
      } else {
        // showSnackbar(response.remark || "Failed to add an item to cart", 'error');
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      // showSnackbar("Failed to add item to cart", 'error');
    }
  };

  // Safe image handling with null checks and fallbacks
  const getProductImages = () => {
    if (!productData) return [];
    
    const images = [];
    
    // Add main image if it exists
    if (productData.mainImageUrl) {
      images.push(productData.mainImageUrl);
    }
    
    // Add gallery images if they exist
    if (productData.galleryImages && Array.isArray(productData.galleryImages)) {
      const validGalleryImages = productData.galleryImages.filter(img => img && img.trim() !== '');
      images.push(...validGalleryImages);
    }
    
    // If no images, return placeholder
    if (images.length === 0) {
      images.push('/api/placeholder/400/400'); // Add your placeholder image path
    }
    
    return images;
  };

  const allImages = getProductImages();

  const nextImage = () => {
    if (allImages.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    }
  };

  const prevImage = () => {
    if (allImages.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    }
  };

  const formatArtisanStory = (story: string | null | undefined) => {
    if (!story) return <p className="text-gray-700">No artisan story available.</p>;
    
    return story.split('\r\n\r\n').map((paragraph, index) => (
      <p key={index} className="text-gray-700 leading-relaxed mb-4 last:mb-0">
        {paragraph}
      </p>
    ));
  };

  // Safe rating calculation
  const getRatingStars = () => {
    const rating = productData?.averageRating || 0;
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${
          i < Math.floor(rating) 
            ? 'fill-yellow-400 text-yellow-400' 
            : 'text-gray-300'
        }`} 
      />
    ));
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F4EF] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !productData) {
    return (
      <div className="min-h-screen bg-[#F8F4EF] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-black mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The product you are looking for does not exist.'}</p>
          <Button onClick={() => window.history.back()} className="bg-black hover:bg-gray-800">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F4EF]">
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <button className="hover:text-black">Home</button>
          <span>/</span>
          <button className="hover:text-black">Products</button>
          <span>/</span>
          <span className="text-black">{productData.productName || 'Product'}</span>
        </div>

        {/* Artisan Story Section - Featured at the top */}
        <Card className="border-gray-200 mb-8 bg-gradient-to-br from-amber-50 to-orange-50">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-amber-100 rounded-full">
                <User className="h-6 w-6 text-amber-700" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-black mb-1">Meet the Artisan</h2>
                <p className="text-gray-600">The Story Behind Your Craft</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-4">
                {formatArtisanStory(productData.artisanStory)}
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-48 h-48 rounded-full overflow-hidden mb-4 border-4 border-amber-200">
                  <img 
                    src={productData.artisanImage || '/api/placeholder/200/200'} 
                    alt="Artisan" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/api/placeholder/200/200';
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                    <MapPin className="h-3 w-3 mr-1" />
                    Nkhata Bay, Malawi
                  </Badge>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <Award className="h-3 w-3 mr-1" />
                    Master Craftsman
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Details Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative bg-white rounded-lg overflow-hidden border border-gray-200">
              <img 
                src={allImages[currentImageIndex]} 
                alt={productData.productName || 'Product image'}
                className="w-full h-96 object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/api/placeholder/400/400';
                }}
              />
              {allImages.length > 1 && (
                <>
                  <button 
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {allImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full ${
                          index === currentImageIndex ? 'bg-black' : 'bg-white/60'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            
            {/* Thumbnail strip */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 ${
                      index === currentImageIndex ? 'border-black' : 'border-gray-200'
                    }`}
                  >
                    <img 
                      src={image} 
                      alt={`View ${index + 1}`} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/api/placeholder/64/64';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <Shield className="h-3 w-3 mr-1" />
                  Authentic
                </Badge>
                {productData.qualityGrade && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    <Award className="h-3 w-3 mr-1" />
                    {productData.qualityGrade}
                  </Badge>
                )}
                <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                  <Leaf className="h-3 w-3 mr-1" />
                  Sustainable
                </Badge>
              </div>
              
              <h1 className="text-3xl font-bold text-black mb-2">{productData.productName || 'Product Name'}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {getRatingStars()}
                  <span className="text-sm text-gray-600">
                    ({productData.reviewCount || 0} reviews)
                  </span>
                </div>
              </div>

              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-bold text-black">
                  ${productData.usdPrice || '0.00'}
                </span>
                <span className="text-sm text-gray-500">USD</span>
              </div>

              <p className="text-gray-700 leading-relaxed mb-6">
                {productData.productDescription || 'No description available.'}
              </p>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="font-medium">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 border-x border-gray-300">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {productData.stockQuantity || 0} in stock
                </Badge>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={() => handleAddToCart(productData.productId)}
                  className="flex-1 bg-black hover:bg-gray-800"
                  disabled={!productData.stockQuantity || productData.stockQuantity === 0}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="border-gray-300"
                >
                  <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
              </div>
            </div>

            {/* Product Features */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              {productData.giftWrappingAvailable && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Gift className="h-4 w-4" />
                  Gift wrapping available
                </div>
              )}
              {productData.touristFriendlySize && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Truck className="h-4 w-4" />
                  Tourist friendly size
                </div>
              )}
              {productData.personalizationAvailable && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  Personalization available
                </div>
              )}
              {productData.craftingTime && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  {productData.craftingTime} to make
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Information Tabs */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Cultural Significance */}
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-black mb-4">Cultural Significance</h3>
              <p className="text-gray-700 leading-relaxed">
                {productData.culturalSignificance || 'No cultural significance information available.'}
              </p>
            </CardContent>
          </Card>

          {/* Cultural Story */}
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-black mb-4">Cultural Heritage</h3>
              <p className="text-gray-700 leading-relaxed">
                {productData.culturalStory || 'No cultural story available.'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Specifications and Care Instructions */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Specifications */}
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-black mb-4">Specifications</h3>
              <div className="space-y-3 text-sm">
                {(productData.length || productData.width || productData.height) && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dimensions:</span>
                    <span className="font-medium">
                      {productData.length || '?'}×{productData.width || '?'}×{productData.height || '?'}cm
                    </span>
                  </div>
                )}
                {productData.weight && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Weight:</span>
                    <span className="font-medium">{productData.weight}kg</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Material:</span>
                  <span className="font-medium">Reclaimed Teak Wood</span>
                </div>
                {productData.craftingTechnique && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Technique:</span>
                    <span className="font-medium">{productData.craftingTechnique}</span>
                  </div>
                )}
                {productData.yearMade && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Made in:</span>
                    <span className="font-medium">{productData.yearMade}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Care Instructions */}
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-black mb-4">Care Instructions</h3>
              <div className="space-y-3 text-sm text-gray-700">
                {productData.careInstructions && (
                  <div>
                    <span className="font-medium">Care:</span>
                    <p className="mt-1">{productData.careInstructions}</p>
                  </div>
                )}
                {productData.cleaningInstructions && (
                  <div>
                    <span className="font-medium">Cleaning:</span>
                    <p className="mt-1">{productData.cleaningInstructions}</p>
                  </div>
                )}
                {productData.storageInstructions && (
                  <div>
                    <span className="font-medium">Storage:</span>
                    <p className="mt-1">{productData.storageInstructions}</p>
                  </div>
                )}
                {!productData.careInstructions && !productData.cleaningInstructions && !productData.storageInstructions && (
                  <p className="text-gray-500">No care instructions available.</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Shipping & Returns */}
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-black mb-4">Shipping & Returns</h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  <span>Free worldwide shipping</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>30-day return policy</span>
                </div>
                {productData.shippingWeight && (
                  <div>
                    <span className="font-medium">Shipping weight:</span>
                    <p className="mt-1">{productData.shippingWeight}kg</p>
                  </div>
                )}
                {productData.shippingRestrictions && (
                  <div>
                    <span className="font-medium">Restrictions:</span>
                    <p className="mt-1">{productData.shippingRestrictions}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

const ProductDetail: React.FC = () => {
    return (
      <AppLayout>
        <ProductDetailContent />
      </AppLayout>
    );
  };

export default ProductDetail;