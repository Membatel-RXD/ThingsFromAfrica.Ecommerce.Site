import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { wishlistService, WishlistItem } from '../services/wishlistService';
import { productService } from '../services/productService';
import { cartService } from '../services/cartService';
import { authService } from '../services/authService';
import { useAppContext } from '../contexts/AppContext';
import { Product } from '../utils/shopUtils';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';

const Wishlist: React.FC = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { updateCartCount } = useAppContext();

  useEffect(() => {
    const loadWishlist = async () => {
      const isAuthenticated = await authService.checkSession();
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }

      try {
        const [wishlist, allProducts] = await Promise.all([
          wishlistService.getWishlistItems(),
          productService.getAllProducts()
        ]);

        setWishlistItems(wishlist);
        
        // Get product details for wishlist items
        const wishlistProducts = wishlist.map(item => {
          const product = allProducts.find(p => p.productId === item.productId);
          return product ? productService.convertToShopProduct(product) : null;
        }).filter(Boolean);
        
        setProducts(wishlistProducts);
      } catch (error) {
        console.error('Failed to load wishlist:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, [navigate]);

  const handleRemoveFromWishlist = async (productId: number) => {
    try {
      const wishlistItem = wishlistItems.find(item => item.productId === productId);
      if (!wishlistItem) return;
      
      const success = await wishlistService.removeFromWishlist(wishlistItem.wishlistId);
      if (success) {
        setWishlistItems(prev => prev.filter(item => item.productId !== productId));
        setProducts(prev => prev.filter(product => product.id !== productId));
      }
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    }
  };

  const handleAddToCart = async (productId: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const success = await cartService.addToCart(productId, 1, product.price);
    
    if (success) {
      await updateCartCount();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">My Wishlist</h1>
          <p className="text-gray-700">
            {products.length === 0 ? 'Your wishlist is empty' : `${products.length} items in your wishlist`}
          </p>
        </div>

        {products.length === 0 ? (
          <Card className="border-gray-200 text-center py-12">
            <CardContent>
              <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-black mb-2">Your wishlist is empty</h3>
              <p className="text-gray-600 mb-6">Start browsing and add items you love to your wishlist</p>
              <Button 
                onClick={() => navigate('/shop')}
                className="bg-black hover:bg-gray-800"
              >
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 border-gray-200">
                <div className="relative">
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-white flex items-center justify-center overflow-hidden">
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
                  
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-white"
                    onClick={() => handleRemoveFromWishlist(product.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
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
                    
                    <div className="flex space-x-2">
                      <Button 
                        className="flex-1 bg-black text-white hover:bg-gray-800 rounded-md" 
                        disabled={!product.inStock}
                        onClick={() => handleAddToCart(product.id)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-red-300 text-red-600 hover:bg-red-50"
                        onClick={() => handleRemoveFromWishlist(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Wishlist;