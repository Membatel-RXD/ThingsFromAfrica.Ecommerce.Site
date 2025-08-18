import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Eye, X, Star, Package, Truck, Award, Users, MapPin, Ruler, Weight } from 'lucide-react';
import { authService } from '../services/authService';
import { cartService } from '../services/cartService';
import { useAppContext } from '../contexts/AppContext';
import { AddCartItem, Artisan, Product } from '@/models/members';
import { apiService, IAPIResponse } from '@/lib/api';
import { useTranslation } from 'react-i18next';


const CraftShowcase: React.FC = () => {
  const [selectedCraft, setSelectedCraft] = useState<Product | null>(null);
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [fetchedProducts, setFetchedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const { t } = useTranslation();

  const navigate = useNavigate();
  const { updateCartCount } = useAppContext();

  const handleAddToCart = async (craftId: number) => {
    const hasValidSession = await authService.checkSession();
    
    if (!hasValidSession) {
      navigate('/login');
      return;
    }
    
    const craft = fetchedProducts.find(c => c.productId === craftId);
    if (!craft) return;
    
    const unitPrice = craft.basePrice;
    const cart : AddCartItem={
      productId: craftId,
      quantity: 1,
      unitPrice: unitPrice,
      customerId: authService.getUserId(),
      currency: 'USD'
    }
    const success = await cartService.addToCart(cart);
    
    if (success) {
      await updateCartCount();
    }
  };

  const handlePreview = (craft: Product) => {
    setPreviewProduct(craft);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiService.get<IAPIResponse<Product[]>>('Products/GetAll');
        if (!response.isSuccessful) throw new Error('Failed to fetch');
        const data = response.payload || [];
        setFetchedProducts(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoading(false);
      }
    };
    const loadArtisans = async () => {
      try {
        setIsLoading(true);
        const apiCategories = await apiService.get<IAPIResponse<Artisan[]>>('Artisans/GetAll');
       if(apiCategories.isSuccessful && apiCategories.payload){
         setArtisans(apiCategories.payload);
       }
        
      } catch (error) {
        console.error('Failed to load product categories:', error);
      } finally {
        setIsLoading(false);
      }
    };


    loadArtisans();
    fetchCategories();
  }, []);


  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-4 w-4 fill-yellow-400/50 text-yellow-400" />);
    }
    
    while (stars.length < 5) {
      stars.push(<Star key={stars.length} className="h-4 w-4 text-gray-300" />);
    }
    
    return stars;
  };
  function getArtisanName(artisanId: number): React.ReactNode {
    return artisans?.find(a=>a.artisanId==artisanId).artisanName || " ";
  }

  function getArtisanVillage(artisanVillage: number): React.ReactNode {
    return artisans?.find(a=>a.artisanId==artisanVillage).village || " ";
  }
  return (
    <section className="bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-4">
          <h2 className="text-5xl font-bold mb-1 text-black">
            {t('pages.home.featuredCrafts')}
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            {t('pages.home.featuredDescription')}
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-8">
          {fetchedProducts.map((craft) => (
            <div 
              key={craft.productId} 
              className="card bg-gradient-to-br from-white to-gray-50 shadow-2xl hover:shadow-3xl transition-all duration-300 border border-gray-200 group relative overflow-hidden"
              onMouseEnter={() => setHoveredCard(craft.productId)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <figure className="relative">
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-white flex items-center justify-center w-full overflow-hidden">
                  <img 
                    src={craft.mainImageUrl} 
                    alt={craft.productName}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                
                <div className="absolute top-2 left-2 bg-black text-white px-3 py-1 rounded-full text-sm font-medium">
                  Best Seller
                </div>
                
                {/* Hover Actions */}
                <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <button className="btn btn-sm btn-circle bg-white/90 border-none hover:bg-white shadow-lg backdrop-blur-sm">
                    <Heart className="h-4 w-4 text-black" />
                  </button>
                  <button className="btn btn-sm btn-circle bg-white/90 border-none hover:bg-white shadow-lg backdrop-blur-sm">
                    <Eye className="h-4 w-4 text-black" />
                  </button>
                </div>

                {/* Preview Button with Animation */}
                <div className={`absolute inset-0 bg-black/20 backdrop-blur-[1px] flex items-center justify-center transition-all duration-300 ${
                  hoveredCard === craft.productId ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}>
                  <button
                    onClick={() => handlePreview(craft)}
                    className={`btn bg-white text-black hover:bg-gray-100 border-none shadow-xl transform transition-all duration-300 ${
                      hoveredCard === craft.productId 
                        ? 'scale-100 translate-y-0 opacity-100' 
                        : 'scale-75 translate-y-4 opacity-0'
                    }`}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Quick Preview
                  </button>
                </div>
              </figure>
              
              <div className="card-body flex flex-col flex-grow">
                <h3 className="card-title text-black text-xl">{craft.productName}</h3>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-3xl font-bold text-black">${craft.usdPrice}</span>
                  <div className="text-right text-sm text-gray-600">
                    <div>by {getArtisanName(craft.artisanId)}</div>
                    <div>{getArtisanVillage(craft.artisanId)}</div>
                  </div>
                </div>
                
                <div className="card-actions flex-col mt-auto">
                  <button 
                    className="btn bg-black text-white hover:bg-gray-800 border-none w-full rounded-md transition-all duration-200 hover:scale-105"
                    onClick={() => handleAddToCart(craft.productId)}
                  >
                    Add to Cart
                  </button>
                  <button 
                    className="btn btn-outline border-gray-300 text-black hover:bg-black hover:text-white w-full rounded-md transition-all duration-200"
                    onClick={() => navigate(`/crafts/${craft.productSlug}`)}
                    >
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link to="/crafts" className="btn btn-lg btn-outline border-black text-black hover:bg-black hover:text-white mb-10 px-8">
            View All Crafts
          </Link>
        </div>
      </div>
      
      {/* Legacy Modal */}
      {selectedCraft && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setSelectedCraft(null)}
          ></div>
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden">
                    <img 
                      src={selectedCraft.mainImageUrl} 
                      alt={selectedCraft.productName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button 
                    className="btn btn-ghost btn-circle"
                    onClick={() => setSelectedCraft(null)}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="mb-4">
                  <div className="badge bg-black text-white mb-2">{selectedCraft.badge}</div>
                  <h3 className="text-2xl font-bold text-black mb-2">{selectedCraft.productName}</h3>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-3xl font-bold text-black">{selectedCraft.basePrice}</span>
                    <div className="text-right text-sm text-gray-600">
                      <div>by {getArtisanName(selectedCraft.artisanId)}</div>
                      <div>{getArtisanVillage(selectedCraft.artisanId)}</div>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 leading-relaxed mb-6">
                  {selectedCraft.artisanStory}
                </p>
                
                <div className="flex space-x-3">
                  <button 
                    className="btn bg-black text-white hover:bg-gray-800 border-none flex-1 rounded-md"
                    onClick={() => handleAddToCart(selectedCraft.productId)}
                  >
                    Add to Cart
                  </button>
                  <button className="btn btn-ghost btn-circle">
                    <Heart className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Enhanced Product Preview Modal */}
      {previewProduct && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-300"
            onClick={() => setPreviewProduct(null)}
          ></div>
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 animate-in zoom-in duration-300">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="relative">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-black to-gray-700 flex items-center justify-center">
                      <Package className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-black">Product Preview</h3>
                      <p className="text-gray-600">Detailed information</p>
                    </div>
                  </div>
                  <button 
                    className="btn btn-ghost btn-circle hover:bg-gray-100"
                    onClick={() => setPreviewProduct(null)}
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 grid md:grid-cols-2 gap-8">
                  {/* Product Image */}
                  <div className="space-y-4">
                    <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                      <img 
                        src={previewProduct.mainImageUrl} 
                        alt={previewProduct.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Ruler className="h-4 w-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-600">Dimensions</span>
                        </div>
                        <p className="text-lg font-bold text-black">
                          {previewProduct.length.toFixed(1)} × {previewProduct.width.toFixed(1)} × {previewProduct.height.toFixed(1)} cm
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Weight className="h-4 w-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-600">Weight</span>
                        </div>
                        <p className="text-lg font-bold text-black">{previewProduct.weight.toFixed(1)} kg</p>
                      </div>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="space-y-6">
                    {/* Basic Info */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-3xl font-bold text-black">{previewProduct.productName}</h4>
                        <div className="badge bg-black text-white">{previewProduct.isUnique ? 'Unique' : 'Standard'}</div>
                      </div>
                      
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="flex items-center space-x-1">
                          {renderStars(previewProduct.averageRating)}
                          <span className="text-sm text-gray-600 ml-1">
                            ({previewProduct.reviewCount} reviews)
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 text-green-600">
                          <Package className="h-4 w-4" />
                          <span className="text-sm font-medium">{previewProduct.stockQuantity} in stock</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 mb-4">
                        <span className="text-4xl font-bold text-black">${previewProduct.touristPrice}</span>
                        <span className="text-lg text-gray-500 line-through">${previewProduct.localPrice}</span>
                        <span className="badge bg-green-100 text-green-800">Tourist Price</span>
                      </div>
                    </div>

                    {/* Artisan Info */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                          <Users className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h5 className="font-bold text-black">Crafted by {previewProduct.artisanName}</h5>
                          <div className="flex items-center space-x-1 text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <span className="text-sm">{previewProduct.artisanVillage}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">{previewProduct.artisanStory}</p>
                    </div>

                    {/* Product Details */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h6 className="font-bold text-black mb-2">Crafting Details</h6>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex justify-between">
                            <span>Wood Type:</span>
                            <span className="font-medium">{previewProduct.woodType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Technique:</span>
                            <span className="font-medium">{previewProduct.craftingTechnique}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Time:</span>
                            <span className="font-medium">{previewProduct.craftingTime}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Difficulty:</span>
                            <span className="font-medium">{previewProduct.difficultyLevel}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h6 className="font-bold text-black mb-2">Features</h6>
                        <div className="space-y-2">
                          {previewProduct.isAuthentic && (
                            <div className="flex items-center space-x-2">
                              <Award className="h-4 w-4 text-green-600" />
                              <span className="text-sm text-green-600">Authentic</span>
                            </div>
                          )}
                          {previewProduct.isCertified && (
                            <div className="flex items-center space-x-2">
                              <Award className="h-4 w-4 text-blue-600" />
                              <span className="text-sm text-blue-600">Certified</span>
                            </div>
                          )}
                          {previewProduct.packingFriendly && (
                            <div className="flex items-center space-x-2">
                              <Package className="h-4 w-4 text-purple-600" />
                              <span className="text-sm text-purple-600">Travel Friendly</span>
                            </div>
                          )}
                          {previewProduct.giftWrappingAvailable && (
                            <div className="flex items-center space-x-2">
                              <Package className="h-4 w-4 text-pink-600" />
                              <span className="text-sm text-pink-600">Gift Wrapping</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Cultural Significance */}
                    <div>
                      <h6 className="font-bold text-black mb-2">Cultural Significance</h6>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {previewProduct.culturalSignificance}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3 pt-4">
                      <button 
                        className="btn bg-black text-white hover:bg-gray-800 border-none flex-1 rounded-md"
                        onClick={() => handleAddToCart(previewProduct.productId)}
                      >
                        Add to Cart - ${previewProduct.touristPrice}
                      </button>
                      <button className="btn btn-outline border-gray-300 text-black hover:bg-gray-100 rounded-md">
                        <Heart className="h-5 w-5" />
                      </button>
                      <button className="btn btn-outline border-gray-300 text-black hover:bg-gray-100 rounded-md">
                        <Truck className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default CraftShowcase;