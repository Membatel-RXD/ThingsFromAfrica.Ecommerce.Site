import React from 'react';
import { Search, ShoppingCart, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppContext } from '@/contexts/AppContext';

const Header: React.FC = () => {
  const { cartItems } = useAppContext();
  
  return (
    <header className="bg-linen border-b border-olive-green/20">
      {/* Top bar */}
      <div className="bg-burnt-sienna text-white py-2">
        <div className="container mx-auto px-4 text-sm text-center">
          Free shipping on orders over $50 | Authentic Malawi Crafts
        </div>
      </div>
      
      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-burnt-sienna rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-charcoal">Malawi Crafts</h1>
              <p className="text-xs text-olive-green">Authentic Handmade</p>
            </div>
          </div>
          
          {/* Search bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Input 
                placeholder="Search for authentic Malawi crafts..."
                className="pl-4 pr-12 py-3 border-olive-green/30 focus:border-burnt-sienna"
              />
              <Button 
                size="sm" 
                className="absolute right-1 top-1 bg-burnt-sienna hover:bg-burnt-sienna/90"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Right actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-charcoal hover:text-burnt-sienna">
              <User className="h-5 w-5 mr-1" />
              Account
            </Button>
            <Button variant="ghost" size="sm" className="text-charcoal hover:text-burnt-sienna relative">
              <ShoppingCart className="h-5 w-5 mr-1" />
              Cart
              {cartItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-indigo-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="bg-olive-green text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-8 py-3">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
              <Menu className="h-4 w-4 mr-2" />
              Categories
            </Button>
            <a href="/" className="hover:text-burnt-sienna transition-colors">Home</a>
            <a href="/shop" className="hover:text-burnt-sienna transition-colors">Shop</a>
            <a href="/crafts" className="hover:text-burnt-sienna transition-colors">Our Crafts</a>
            <a href="/stories" className="hover:text-burnt-sienna transition-colors">Stories</a>
            <a href="/about" className="hover:text-burnt-sienna transition-colors">About</a>
            <a href="/contact" className="hover:text-burnt-sienna transition-colors">Contact</a>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;