import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';

const Header: React.FC = () => {
  const { cartItems, menuOpen, toggleMenu } = useAppContext();
  
  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-black text-white py-2 relative z-[9999]">
        <div className="container mx-auto px-4 text-sm text-center">
          Free shipping on orders over $50 | Authentic African Crafts
        </div>
      </div>
      
      {/* Main header */}
      <div className="navbar bg-white border-b border-gray-300">
        <div className="navbar-start">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="avatar">
              <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
            </div>
            <div>
              <h1 className="font-bold text-black text-xs sm:text-sm md:text-lg lg:text-2xl">African Crafts</h1>
              <p className="text-gray-600 text-xs sm:text-xs md:text-sm">Authentic Handmade</p>
            </div>
          </div>
        </div>
        
        <div className="navbar-center hidden lg:flex">
          {/* Search bar */}
          <div className="form-control">
            <div className="input-group">
              <input 
                type="text" 
                placeholder="Search crafts..." 
                className="input input-bordered w-96 border-gray-300 focus:border-black" 
              />
              <button className="btn bg-black text-white hover:bg-gray-800 border-none">
                <Search className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="navbar-end">
          {/* Right actions */}
          <div className="flex items-center space-x-2">
            <button className="btn btn-ghost text-black hover:bg-gray-100">
              <User className="h-5 w-5" />
              <span className="hidden sm:inline ml-1">Account</span>
            </button>
            
            <div className="indicator">
              {cartItems > 0 && (
                <span className="indicator-item badge badge-sm bg-black text-white border-none">
                  {cartItems}
                </span>
              )}
              <button className="btn btn-ghost text-black hover:bg-gray-100">
                <ShoppingCart className="h-5 w-5" />
                <span className="hidden sm:inline ml-1">Cart</span>
              </button>
            </div>
            
            <button 
              className="btn btn-ghost text-black hover:bg-gray-100"
              onClick={toggleMenu}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
      

      
      {/* Full Screen Menu Overlay */}
      {menuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            style={{top: '0'}}
            onClick={toggleMenu}
          ></div>
          <div className="fixed right-0 w-4/5 bg-white shadow-2xl z-50 transform transition-transform duration-300" style={{top: '0', height: '100vh'}}>
            <div className="pt-16 p-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-black">Menu</h2>
                <button 
                  className="btn btn-ghost btn-circle text-black"
                  onClick={toggleMenu}
                >
                  ✕
                </button>
              </div>
              
              <ul className="menu text-lg space-y-2">
                <li><Link to="/" className="text-black hover:bg-gray-100 p-4 rounded-lg" onClick={toggleMenu}>Home</Link></li>
                <li><Link to="/shop" className="text-black hover:bg-gray-100 p-4 rounded-lg" onClick={toggleMenu}>Shop</Link></li>
                <li><Link to="/crafts" className="text-black hover:bg-gray-100 p-4 rounded-lg" onClick={toggleMenu}>Our Crafts</Link></li>
                <li><Link to="/stories" className="text-black hover:bg-gray-100 p-4 rounded-lg" onClick={toggleMenu}>Stories</Link></li>
                <li><Link to="/about" className="text-black hover:bg-gray-100 p-4 rounded-lg" onClick={toggleMenu}>About</Link></li>
                <li><Link to="/contact" className="text-black hover:bg-gray-100 p-4 rounded-lg" onClick={toggleMenu}>Contact</Link></li>
              </ul>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;