import React, { useState, useMemo, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, ShoppingCart, Filter, Grid, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { cartService } from '../services/cartService';
import { productService } from '../services/productService';
import { useAppContext } from '../contexts/AppContext';
import { Product, searchProducts, filterByCategory, sortProducts } from '../utils/shopUtils';

const Shop: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { updateCartCount } = useAppContext();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const apiProducts = await productService.getAllProducts();
        const shopProducts = apiProducts.map(product => productService.convertToShopProduct(product));
        setProducts(shopProducts);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleAddToCart = async (productId: number) => {
    const hasValidSession = await authService.checkSession();
    
    if (!hasValidSession) {
      navigate('/login');
      return;
    }
    
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const success = await cartService.addToCart(productId, 1, product.price);
    
    if (success) {
      await updateCartCount();
    }
  };

  const filteredProducts = useMemo(() => {
    let filtered = searchProducts(products, searchTerm);
    filtered = filterByCategory(filtered, selectedCategory);
    filtered = sortProducts(filtered, sortBy);
    return filtered;
  }, [products, searchTerm, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">Shop Authentic African Crafts</h1>
          <p className="text-gray-700">Discover unique handmade treasures from talented African artisans</p>
        </div>
        
        {/* Filters and controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8 p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex-1 flex flex-col sm:flex-row gap-4">
            <Input 
              placeholder="Search products..." 
              className="sm:max-w-xs" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="sm:max-w-xs">
                <SelectValue placeholder="Category" />
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
            <Button variant="outline" size="sm">
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
        
        {/* Products grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No products found matching your criteria.</p>
          </div>
        ) : (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
            {filteredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 border-gray-200">
              <div className="relative">
                <div className={`${viewMode === 'grid' ? 'aspect-square' : 'aspect-video lg:aspect-square'} bg-gradient-to-br from-gray-100 to-white flex items-center justify-center overflow-hidden`}>
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {product.badge && (
                  <div className="absolute top-2 left-2 bg-black text-white px-3 py-1 rounded-full text-sm font-medium">
                    {product.badge}
                  </div>
                )}
                
                {!product.inStock && (
                  <Badge variant="secondary" className="absolute top-4 left-4">
                    Out of Stock
                  </Badge>
                )}
                
                <Button 
                  size="sm" 
                  variant="secondary" 
                  className="absolute top-4 right-4 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
              
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-bold text-black text-lg">{product.name}</h3>
                    <p className="text-sm text-gray-600">by {product.artisan} • {product.region}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-black">${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      ⭐ {product.rating} ({product.reviews})
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-black text-white hover:bg-gray-800 rounded-md" 
                    disabled={!product.inStock}
                    onClick={() => handleAddToCart(product.id)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                </div>
              </CardContent>
            </Card>
            ))}
          </div>
        )}
        
        {/* Load more */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="border-black text-black hover:bg-black hover:text-white">
            Load More Products
          </Button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Shop;