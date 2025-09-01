import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, ShoppingCart, Filter, Grid, List, X, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
import { authService } from '../services/authService';
import { cartService } from '../services/cartService';
import { productService } from '../services/productService';
import { wishlistService } from '../services/wishlistService';
import { useAppContext } from '../contexts/AppContext';
import { searchProducts, filterByCategory, sortProducts } from '../utils/shopUtils';
import { AddCartItem, Artisan, Product, ProductCategory } from '@/models/members';
import { apiService, IAPIResponse } from '@/lib/api';
import { useToast } from '../hooks/use-toast';
import ToastContainer from '@/components/ToastContainer';


const Checkbox = ({ id, checked, onCheckedChange, children, ...props }) => (
  <div className="flex items-center space-x-2">
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={(e) => onCheckedChange(e.target.checked)}
      className="w-4 h-4 rounded border-gray-300 text-burnt-sienna focus:ring-burnt-sienna"
      {...props}
    />
    {children}
  </div>
);

// Simple Slider component since it might not be available
const Slider = ({ value, onValueChange, min, max, step, className }) => (
  <div className={`relative ${className}`}>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value[0]}
      onChange={(e) => onValueChange([parseInt(e.target.value), value[1]])}
      className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
    />
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value[1]}
      onChange={(e) => onValueChange([value[0], parseInt(e.target.value)])}
      className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
    />
  </div>
);

const Shop = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [products, setProducts] = useState<Partial<Product>[]>([]);
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [productCategories, setProductCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true); // Separate loading state
  const [filterLoading, setFilterLoading] = useState(false);
  const [wishlistItems, setWishlistItems] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [activeCategoryName, setActiveCategoryName] = useState('');
  
  const { updateCartCount } = useAppContext();
  const { showSnackbar, snackbar } = useToast();

  // Filter states
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [selectedWoodTypes, setSelectedWoodTypes] = useState([]);
  const [selectedCraftingTechniques, setSelectedCraftingTechniques] = useState([]);
  const [selectedDifficultyLevels, setSelectedDifficultyLevels] = useState([]);
  const [selectedArtisanRegions, setSelectedArtisanRegions] = useState([]);
  const [selectedWoodColors, setSelectedWoodColors] = useState([]);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [selectedQualityGrades, setSelectedQualityGrades] = useState([]);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [authenticOnly, setAuthenticOnly] = useState(false);
  const [certifiedOnly, setCertifiedOnly] = useState(false);
  const [touristFriendlyOnly, setTouristFriendlyOnly] = useState(false);
  const [packingFriendlyOnly, setPackingFriendlyOnly] = useState(false);
  const [giftWrappingAvailable, setGiftWrappingAvailable] = useState(false);
  const [personalizationAvailable, setPersonalizationAvailable] = useState(false);
  const [selectedAgeCategories, setSelectedAgeCategories] = useState([]);
  const [selectedTribalOrigins, setSelectedTribalOrigins] = useState([]);
  
  // Collapsible filter sections
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    category: true,
    woodType: false,
    crafting: false,
    artisan: false,
    features: false,
    specifications: false,
    cultural: false
  });

  // Handle URL parameters for category filtering - wait for categories to load
  useEffect(() => {
    if (categoriesLoading || productCategories.length === 0) return;
    
    const urlParams = new URLSearchParams(location.search);
    const categoryParam = urlParams.get('category');
    const categoryNameParam = urlParams.get('categoryName');
    
    
    
    
    if (categoryParam && categoryParam !== 'all') {
      setSelectedCategory(categoryParam);
      if (categoryNameParam) {
        setActiveCategoryName(decodeURIComponent(categoryNameParam));
      } else {
        // Try to find category name from productCategories
        const foundCategory = productCategories.find(cat => 
          cat.categoryId.toString() === categoryParam || 
          cat.categoryName.toLowerCase() === categoryParam.toLowerCase()
        );
        if (foundCategory) {
          setActiveCategoryName(foundCategory.categoryName);
        }
      }
    }
  }, [location.search, productCategories, categoriesLoading]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setPriceRange([0, 200]);
    setSelectedWoodTypes([]);
    setSelectedCraftingTechniques([]);
    setSelectedDifficultyLevels([]);
    setSelectedArtisanRegions([]);
    setSelectedWoodColors([]);
    setSelectedConditions([]);
    setSelectedQualityGrades([]);
    setRatingFilter(0);
    setInStockOnly(false);
    setFeaturedOnly(false);
    setAuthenticOnly(false);
    setCertifiedOnly(false);
    setTouristFriendlyOnly(false);
    setPackingFriendlyOnly(false);
    setGiftWrappingAvailable(false);
    setPersonalizationAvailable(false);
    setSelectedAgeCategories([]);
    setSelectedTribalOrigins([]);
    setActiveCategoryName('');
    
    // Update URL to remove category parameters
    const urlParams = new URLSearchParams(location.search);
    urlParams.delete('category');
    urlParams.delete('categoryId');
    urlParams.delete('categoryName');
    const newSearch = urlParams.toString();
    navigate(`/shop${newSearch ? `?${newSearch}` : ''}`, { replace: true });
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    
    if (category === 'all') {
      setActiveCategoryName('');
    } else {
      // Find the category name from productCategories
      const foundCategory = productCategories.find(cat => 
        cat.categoryId.toString() === category || 
        cat.categoryName.toLowerCase() === category.toLowerCase()
      );
      if (foundCategory) {
        setActiveCategoryName(foundCategory.categoryName);
      }
    }
    
    // Update URL parameters
    const urlParams = new URLSearchParams(location.search);
    if (category === 'all') {
      urlParams.delete('category');
      urlParams.delete('categoryId');
      urlParams.delete('categoryName');
    } else {
      urlParams.set('category', category);
      if (activeCategoryName) {
        urlParams.set('categoryName', encodeURIComponent(activeCategoryName));
      }
    }
    const newSearch = urlParams.toString();
    navigate(`/shop${newSearch ? `?${newSearch}` : ''}`, { replace: true });
  };

  const handleBackToAllCategories = () => {
    setSelectedCategory('all');
    setActiveCategoryName('');
    
    // Clear category-related URL parameters
    const urlParams = new URLSearchParams(location.search);
    urlParams.delete('category');
    urlParams.delete('categoryId'); 
    urlParams.delete('categoryName');
    const newSearch = urlParams.toString();
    navigate(`/shop${newSearch ? `?${newSearch}` : ''}`, { replace: true });
  };

  const handleCheckboxChange = (value: string, currentValues: any[], setter: { (value: React.SetStateAction<any[]>): void; (value: React.SetStateAction<any[]>): void; (value: React.SetStateAction<any[]>): void; (arg0: any[]): void; }) => {
    if (currentValues.includes(value)) {
      setter(currentValues.filter(item => item !== value));
    } else {
      setter([...currentValues, value]);
    }
  };

  // Load data in parallel but track completion separately
  useEffect(() => {
    const loadAllData = async () => {
      try {
        setLoading(true);
        setCategoriesLoading(true);
        
        // Load all data in parallel
        const [productsResult, categoriesResult, artisansResult] = await Promise.allSettled([
          productService.getAllProducts(),
          apiService.get<IAPIResponse<ProductCategory[]>>('ProductCategories/GetAll'),
          apiService.get<IAPIResponse<Artisan[]>>('Artisans/GetAll')
        ]);

        // Handle products
        if (productsResult.status === 'fulfilled') {
          const shopProducts = productsResult.value.map(product => 
            productService.convertToShopProduct(product)
          );
          setProducts(shopProducts);
          
          // Load wishlist items
          try {
            const wishlist = await wishlistService.getWishlistItems();
            setWishlistItems(wishlist.map(item => item.productId));
          } catch (error) {
            console.error('Failed to load wishlist:', error);
          }
        } else {
          console.error('Failed to load products:', productsResult.reason);
        }

        // Handle categories
        if (categoriesResult.status === 'fulfilled' && 
            categoriesResult.value.isSuccessful && 
            categoriesResult.value.payload) {
          
          setProductCategories(categoriesResult.value.payload);
        } else {
          console.error('Failed to load product categories:', categoriesResult);
        }

        // Handle artisans
        if (artisansResult.status === 'fulfilled' && 
            artisansResult.value.isSuccessful && 
            artisansResult.value.payload) {
          setArtisans(artisansResult.value.payload);
        } else {
          console.error('Failed to load artisans:', artisansResult);
        }
        
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
        setCategoriesLoading(false);
      }
    };

    loadAllData();
  }, []);

  const handleAddToCart = async (productId:number) => {
    const hasValidSession = await authService.checkSession();
    const userId =  authService.getUserId();
    if (!hasValidSession || !userId) {
      navigate('/login');
      return;
    }
    
    const product = products.find(p => p.productId === productId);
    if (!product) return;
    
    const addToCartItem : AddCartItem = {
      productId: productId,
      quantity: 1,
      unitPrice: product.usdPrice,
      customerId: userId,
      currency: 'USD'
    }
    const response = await cartService.addToCart(addToCartItem);
    if (response && response.isSuccessful) {
      showSnackbar(response.remark || `Added ${product.productName} to cart`,'success')
      await updateCartCount();
    }else{
      showSnackbar(response.remark || "Failed to add an item to cart",'error');
    }
  };

  const handleWishlistToggle = async (productId: number) => {
    const hasValidSession = await authService.checkSession();
    
    if (!hasValidSession) {
      navigate('/login');
      return;
    }

    const isInWishlist = wishlistItems.includes(productId);
    
    if (isInWishlist) {
      const success = await wishlistService.removeFromWishlistByProductId(productId);
      if (success) {
        setWishlistItems(prev => prev.filter(id => id !== productId));
      }
    } else {
      const success = await wishlistService.addToWishlist(productId);
      if (success) {
        setWishlistItems(prev => [...prev, productId]);
      }
    }
  };

  // Filter options (in real app, these would come from your API)
  const filterOptions = {
    woodTypes: ['Mahogany', 'Teak', 'Ebony', 'Rosewood', 'Baobab', 'Mubvumira', 'Mukwa'],
    craftingTechniques: ['Hand Carving', 'Weaving', 'Pottery', 'Beadwork', 'Painting', 'Sculpting'],
    difficultyLevels: ['Beginner', 'Intermediate', 'Advanced', 'Master'],
    artisanRegions: ['Lilongwe', 'Blantyre', 'Mzuzu', 'Zomba', 'Kasungu', 'Mangochi', 'Karonga'],
    woodColors: ['Light Brown', 'Dark Brown', 'Reddish', 'Golden', 'Black', 'Natural'],
    conditions: ['New', 'Like New', 'Good', 'Fair', 'Vintage'],
    qualityGrades: ['Premium', 'Standard', 'Economy', 'Collector'],
    ageCategories: ['Contemporary', 'Traditional', 'Vintage', 'Antique'],
    tribalOrigins: ['Chewa', 'Tumbuka', 'Yao', 'Lomwe', 'Sena', 'Tonga', 'Ngoni']
  };

  // Helper functions for filtering (you might need to implement these)
  const filterByPriceRange = (products, minPrice, maxPrice) => {
    return products.filter(product => {
      const price = product.usdPrice || 0;
      return price >= minPrice && price <= maxPrice;
    });
  };

  const filterByRating = (products, minRating) => {
    return products.filter(product => {
      const rating = product.averageRating || 0;
      return rating >= minRating;
    });
  };

  const filterByStock = (products, inStockOnly) => {
    if (!inStockOnly) return products;
    return products.filter(product => product.stockQuantity > 0);
  };

  const filterByFeatured = (products, featuredOnly) => {
    if (!featuredOnly) return products;
    return products.filter(product => product.isFeatured);
  };

  useEffect(() => {
    if (!loading && !categoriesLoading && products.length > 0) {
      setFilterLoading(true);
      const timeout = setTimeout(() => {
        setFilterLoading(false);
      }, 300);
  
      return () => clearTimeout(timeout);
    }
  }, [
    products,
    searchTerm,
    selectedCategory,
    priceRange,
    ratingFilter,
    inStockOnly,
    featuredOnly,
    selectedWoodTypes,
    selectedCraftingTechniques,
    selectedArtisanRegions,
    selectedWoodColors,
    selectedConditions,
    selectedQualityGrades,
    authenticOnly,
    certifiedOnly,
    touristFriendlyOnly,
    packingFriendlyOnly,
    giftWrappingAvailable,
    personalizationAvailable,
    selectedAgeCategories,
    selectedTribalOrigins,
    sortBy,
    loading,
    categoriesLoading,
    productCategories
  ]);
  
  // Updated filteredProducts useMemo - only run when categories are loaded
  const filteredProducts = useMemo(() => {
    // Don't filter if still loading categories or products
    if (loading || categoriesLoading || products.length === 0) {
      return [];
    }

    
    
    

    // Step 1: Start with all products
    let filtered = [...products];

    // Step 2: Apply search filter
    if (searchTerm.trim()) {
      filtered = searchProducts(filtered, searchTerm);
    }

    // Step 3: Apply category filter
    if (selectedCategory !== 'all' && productCategories.length > 0) {
      
      filtered = filterByCategory(filtered, activeCategoryName, productCategories);
      
    }

    // Step 4: Apply price range filter
    if (priceRange[0] > 0 || priceRange[1] < 200) {
      filtered = filterByPriceRange(filtered, priceRange[0], priceRange[1]);
    }

    // Step 5: Apply rating filter
    if (ratingFilter > 0) {
      filtered = filterByRating(filtered, ratingFilter);
    }

    // Step 6: Apply stock filter
    if (inStockOnly) {
      filtered = filterByStock(filtered, inStockOnly);
    }

    // Step 7: Apply featured filter
    if (featuredOnly) {
      filtered = filterByFeatured(filtered, featuredOnly);
    }

    // Step 8: Apply additional custom filters
    filtered = filtered.filter(product => {
      if (selectedWoodTypes.length > 0 && !selectedWoodTypes.includes(product.woodType || 'Unknown')) {
        return false;
      }
      if (selectedCraftingTechniques.length > 0 && !selectedCraftingTechniques.includes(product.craftingTechnique || 'Unknown')) {
        return false;
      }
      if (selectedArtisanRegions.length > 0 && !selectedArtisanRegions.includes(product.artisanVillage)) {
        return false;
      }
      return true;
    });

    // Step 9: Apply sorting
    return sortProducts(filtered, sortBy);
  }, [
    products,
    searchTerm,
    selectedCategory,
    activeCategoryName,
    priceRange,
    ratingFilter,
    inStockOnly,
    featuredOnly,
    selectedWoodTypes,
    selectedCraftingTechniques,
    selectedArtisanRegions,
    selectedWoodColors,
    selectedConditions,
    selectedQualityGrades,
    authenticOnly,
    certifiedOnly,
    touristFriendlyOnly,
    packingFriendlyOnly,
    giftWrappingAvailable,
    personalizationAvailable,
    selectedAgeCategories,
    selectedTribalOrigins,
    sortBy,
    loading,
    categoriesLoading, // Added this dependency
    productCategories
  ]);

  function getArtisanName(artisanId: number): React.ReactNode {
    const artisan = artisans.find(a => a.artisanId === artisanId);
    return artisan ? artisan.artisanName : 'Unknown Artisan';
  }

  function getArtisanVillage(artisanId: number): React.ReactNode {
    const artisan = artisans.find(a => a.artisanId === artisanId);
    return artisan ? artisan.village : 'Unknown Village';
  }

  // Show loading state while categories are loading
  if (loading || categoriesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
              <ToastContainer/>

        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-burnt-sienna"></div>
          <p className="mt-4 text-gray-600">Loading products and categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F4EF]">
      <ToastContainer/>
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page header with category breadcrumb */}
        <div className="mb-8">
          {activeCategoryName ? (
            <div className="mb-4">
              <button 
                onClick={handleBackToAllCategories}
                className="flex items-center text-orange-600 hover:text-orange-700 transition-colors mb-2"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to All Categories
              </button>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                {activeCategoryName} Collection
              </h1>
              <p className="text-gray-600">
                Discover authentic {activeCategoryName.toLowerCase()} crafted by talented Malawian artisans
              </p>
            </div>
          ) : (
            <>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Shop Authentic Malawi Crafts</h1>
              <p className="text-gray-600">Discover unique handmade treasures from talented Malawian artisans</p>
            </>
          )}
        </div>
        
        <div className="flex gap-8">
          {/* Left Filter Panel */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-80 flex-shrink-0`}>
            <div className="bg-white rounded-lg border shadow-sm p-6 sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Filters</h2>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                    Clear All
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)} className="lg:hidden">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-6">
                {/* Price Range */}
                <div className="border-b border-gray-100 pb-6">
                  <div className="flex items-center justify-between mb-4 cursor-pointer group" onClick={() => toggleSection('price')}>
                    <h3 className="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">Price Range</h3>
                    <div className="p-1 rounded-full group-hover:bg-gray-50 transition-colors">
                      {expandedSections.price ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />}
                    </div>
                  </div>
                  {expandedSections.price && (
                    <div className="space-y-4">
                      <div className="px-2">
                        <Slider
                          value={priceRange}
                          onValueChange={setPriceRange}
                          max={200}
                          min={0}
                          step={5}
                          className="w-full"
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="bg-gray-50 px-3 py-2 rounded-lg border">
                          <span className="text-sm font-medium text-gray-700">${priceRange[0]}</span>
                        </div>
                        <div className="h-px bg-gray-300 flex-1 mx-3"></div>
                        <div className="bg-gray-50 px-3 py-2 rounded-lg border">
                          <span className="text-sm font-medium text-gray-700">${priceRange[1]}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Category */}
                <div>
                  <div className="flex items-center justify-between mb-3 cursor-pointer" onClick={() => toggleSection('category')}>
                    <h3 className="font-semibold text-gray-800">Category</h3>
                    {expandedSections.category ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                  {expandedSections.category && (
                    <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="baskets">Baskets</SelectItem>
                        <SelectItem value="wood carvings">Wood Carvings</SelectItem>
                        <SelectItem value="textiles">Textiles</SelectItem>
                        <SelectItem value="pottery">Pottery</SelectItem>
                        <SelectItem value="jewelry">Jewelry</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>

                {/* Wood Type */}
                <div>
                  <div className="flex items-center justify-between mb-3 cursor-pointer" onClick={() => toggleSection('woodType')}>
                    <h3 className="font-semibold text-gray-800">Wood Type</h3>
                    {expandedSections.woodType ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                  {expandedSections.woodType && (
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {filterOptions.woodTypes.map(type => (
                        <Checkbox
                          key={type}
                          id={`wood-${type}`}
                          checked={selectedWoodTypes.includes(type)}
                          onCheckedChange={() => handleCheckboxChange(type, selectedWoodTypes, setSelectedWoodTypes)}
                        >
                          <label htmlFor={`wood-${type}`} className="text-sm text-gray-600 cursor-pointer">
                            {type}
                          </label>
                        </Checkbox>
                      ))}
                    </div>
                  )}
                </div>

                {/* Crafting Technique */}
                <div>
                  <div className="flex items-center justify-between mb-3 cursor-pointer" onClick={() => toggleSection('crafting')}>
                    <h3 className="font-semibold text-gray-800">Crafting Technique</h3>
                    {expandedSections.crafting ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                  {expandedSections.crafting && (
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {filterOptions.craftingTechniques.map(technique => (
                        <Checkbox
                          key={technique}
                          id={`craft-${technique}`}
                          checked={selectedCraftingTechniques.includes(technique)}
                          onCheckedChange={() => handleCheckboxChange(technique, selectedCraftingTechniques, setSelectedCraftingTechniques)}
                        >
                          <label htmlFor={`craft-${technique}`} className="text-sm text-gray-600 cursor-pointer">
                            {technique}
                          </label>
                        </Checkbox>
                      ))}
                    </div>
                  )}
                </div>

                {/* Artisan Region */}
                <div>
                  <div className="flex items-center justify-between mb-3 cursor-pointer" onClick={() => toggleSection('artisan')}>
                    <h3 className="font-semibold text-gray-800">Artisan Region</h3>
                    {expandedSections.artisan ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                  {expandedSections.artisan && (
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {filterOptions.artisanRegions.map(region => (
                        <Checkbox
                          key={region}
                          id={`region-${region}`}
                          checked={selectedArtisanRegions.includes(region)}
                          onCheckedChange={() => handleCheckboxChange(region, selectedArtisanRegions, setSelectedArtisanRegions)}
                        >
                          <label htmlFor={`region-${region}`} className="text-sm text-gray-600 cursor-pointer">
                            {region}
                          </label>
                        </Checkbox>
                      ))}
                    </div>
                  )}
                </div>

                {/* Rating Filter */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Minimum Rating</h3>
                  <div className="space-y-2">
                    {[4, 3, 2, 1].map(rating => (
                      <Checkbox
                        key={rating}
                        id={`rating-${rating}`}
                        checked={ratingFilter === rating}
                        onCheckedChange={(checked) => setRatingFilter(checked ? rating : 0)}
                      >
                        <label htmlFor={`rating-${rating}`} className="text-sm text-gray-600 cursor-pointer flex items-center">
                          {'⭐'.repeat(rating)} & up
                        </label>
                      </Checkbox>
                    ))}
                  </div>
                </div>

                {/* Product Features */}
                <div>
                  <div className="flex items-center justify-between mb-3 cursor-pointer" onClick={() => toggleSection('features')}>
                    <h3 className="font-semibold text-gray-800">Product Features</h3>
                    {expandedSections.features ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                  {expandedSections.features && (
                    <div className="space-y-2">
                      <Checkbox
                        id="in-stock"
                        checked={inStockOnly}
                        onCheckedChange={setInStockOnly}
                      >
                        <label htmlFor="in-stock" className="text-sm text-gray-600 cursor-pointer">
                          In Stock Only
                        </label>
                      </Checkbox>
                      <Checkbox
                        id="featured"
                        checked={featuredOnly}
                        onCheckedChange={setFeaturedOnly}
                      >
                        <label htmlFor="featured" className="text-sm text-gray-600 cursor-pointer">
                          Featured Items
                        </label>
                      </Checkbox>
                      <Checkbox
                        id="authentic"
                        checked={authenticOnly}
                        onCheckedChange={setAuthenticOnly}
                      >
                        <label htmlFor="authentic" className="text-sm text-gray-600 cursor-pointer">
                          Authentic Only
                        </label>
                      </Checkbox>
                      <Checkbox
                        id="certified"
                        checked={certifiedOnly}
                        onCheckedChange={setCertifiedOnly}
                      >
                        <label htmlFor="certified" className="text-sm text-gray-600 cursor-pointer">
                          Certified Products
                        </label>
                      </Checkbox>
                      <Checkbox
                        id="tourist-friendly"
                        checked={touristFriendlyOnly}
                        onCheckedChange={setTouristFriendlyOnly}
                      >
                        <label htmlFor="tourist-friendly" className="text-sm text-gray-600 cursor-pointer">
                          Tourist Friendly Size
                        </label>
                      </Checkbox>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Search and controls */}
            <div className="flex flex-col lg:flex-row gap-4 mb-8 p-4 bg-white rounded-lg border shadow-sm">
              <div className="flex-1 flex flex-col sm:flex-row gap-4">
                <Input 
                  placeholder="Search products..." 
                  className="sm:max-w-xs" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="sm:max-w-xs">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                <div className="flex border rounded-md">
                  <Button 
                    variant={viewMode === 'grid' ? 'default' : 'ghost'} 
                    size="sm" 
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant={viewMode === 'list' ? 'default' : 'ghost'} 
                    size="sm" 
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Active filter indicator */}
            {(selectedCategory !== 'all' || activeCategoryName) && (
              <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-orange-800">Active Filter:</span>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                      {activeCategoryName || selectedCategory}
                    </Badge>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleBackToAllCategories}
                    className="text-orange-600 hover:text-orange-700"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                </div>
              </div>
            )}

            {/* Results count */}
            {!loading && (
              <div className="mb-6">
                <p className="text-gray-600">
                  Showing {filteredProducts.length} of {products.length} products
                  {activeCategoryName && ` in ${activeCategoryName}`}
                </p>
              </div>
            )}
            
            {/* Products grid */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
              </div>
            ) : filterLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg mb-4">
                  No products found {activeCategoryName ? `in ${activeCategoryName}` : 'matching your criteria'}.
                </p>
                <Button variant="outline" onClick={clearAllFilters}>
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {filteredProducts.map((product:Product) => (
                  <Card key={product.productId} className="group hover:shadow-xl transition-all duration-300">
                    <div className="relative">
                      <div className={`${viewMode === 'grid' ? 'aspect-square' : 'aspect-video lg:aspect-square'} bg-gradient-to-br from-gray-100 to-white flex items-center justify-center overflow-hidden`}>
                        <img 
                          src={product.mainImageUrl} 
                          alt={product.productName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {product.badge && (
                        <div className="absolute top-2 left-2 bg-black text-white px-3 py-1 rounded-full text-sm font-medium">
                          {product.badge}
                        </div>
                      )}
                      
                      {product.stockQuantity < 1  && (
                        <Badge variant="secondary" className="absolute top-4 left-4">
                          Out of Stock
                        </Badge>
                      )}
                      
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        className="absolute top-4 right-4 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleWishlistToggle(product.productId)}
                      >
                        <Heart className={`h-4 w-4 ${wishlistItems.includes(product.productId) ? 'fill-red-500 text-red-500' : ''}`} />
                      </Button>
                    </div>
                    
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-bold text-gray-800 text-lg">{product.productName}</h3>
                          <p className="text-sm text-gray-600">by {getArtisanName(product.artisanId)} • {getArtisanVillage(product.artisanId)}</p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl font-bold text-orange-600">${product.usdPrice}</span>
                            {product.basePrice && (
                              <span className="text-sm text-gray-500 line-through">${product.basePrice}</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-600">
                            ⭐ {product.averageRating} ({product.reviewCount})
                          </div>
                        </div>
                        
                        <Button 
                          className="w-full bg-black text-white hover:bg-gray-800 rounded-md" 
                          disabled={product.stockQuantity < 1}
                          onClick={() => handleAddToCart(product.productId)}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {product.stockQuantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                        </Button>
                        <Button 
                          className="btn bg-black btn-outline border-gray-300 text-white hover:bg-black hover:text-white w-full rounded-md transition-all duration-200"
                          onClick={() => navigate(`/crafts/${product.productSlug}`)}
                          >
                          Learn More
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            {/* Load more */}
            {!loading && !filterLoading && filteredProducts.length > 0 && (
              <div className="text-center mt-12">
                <Button variant="outline" size="lg" className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white">
                  Load More Products
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
      
    </div>
  );
};

export default Shop;


function filterByPriceRange(filtered: Partial<Product>[], arg1: number, arg2: number): Partial<Product>[] {
  throw new Error('Function not implemented.');
}

function filterByRating(filtered: Partial<Product>[], ratingFilter: number): Partial<Product>[] {
  throw new Error('Function not implemented.');
}

function filterByStock(filtered: Partial<Product>[], inStockOnly: boolean): Partial<Product>[] {
  throw new Error('Function not implemented.');
}

function filterByFeatured(filtered: Partial<Product>[], featuredOnly: boolean): Partial<Product>[] {
  throw new Error('Function not implemented.');
}

