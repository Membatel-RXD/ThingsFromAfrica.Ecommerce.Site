import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { WEBSITE_DETAILS } from '@/constants/website_details';

const Header: React.FC = () => {
  const { cartItems, menuOpen, toggleMenu } = useAppContext();
  
  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-black text-white py-2 relative z-[9999]">
        <div className="container mx-auto px-4 text-sm text-center">
          Free shipping on orders over $50 | {WEBSITE_DETAILS.name}
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
              <h1 className="font-bold text-black text-xs sm:text-sm md:text-lg lg:text-2xl">{WEBSITE_DETAILS.name}</h1>
              <p className="text-gray-600 text-xs sm:text-xs md:text-sm">Authentic Handmade</p>
            </div>
          </div>
        </div>
        
        <div className="navbar-center hidden lg:flex">
          {/* Navigation Links */}
          <div className="flex space-x-6">
            <Link to="/" className="text-black hover:text-gray-500 font-medium transition-colors">Home</Link>
            <Link to="/shop" className="text-black hover:text-gray-500 font-medium transition-colors">Shop</Link>
            <Link to="/crafts" className="text-black hover:text-gray-500 font-medium transition-colors">Our Crafts</Link>
            <Link to="/stories" className="text-black hover:text-gray-500 font-medium transition-colors">Stories</Link>
            <Link to="/about" className="text-black hover:text-gray-500 font-medium transition-colors">About</Link>
            <Link to="/contact" className="text-black hover:text-gray-500 font-medium transition-colors">Contact</Link>
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
              className="btn btn-ghost text-black hover:bg-gray-100 lg:hidden"
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
                <h2 className="text-xl font-bold text-black">{WEBSITE_DETAILS.name}</h2>
                <button 
                  className="btn btn-ghost btn-circle text-black"
                  onClick={toggleMenu}
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <Link to="/" className="block text-xl font-medium text-black hover:text-gray-600 py-3 border-b border-gray-200 transition-colors" onClick={toggleMenu}>Home</Link>
                <Link to="/shop" className="block text-xl font-medium text-black hover:text-gray-600 py-3 border-b border-gray-200 transition-colors" onClick={toggleMenu}>Shop</Link>
                <Link to="/crafts" className="block text-xl font-medium text-black hover:text-gray-600 py-3 border-b border-gray-200 transition-colors" onClick={toggleMenu}>Our Crafts</Link>
                <Link to="/stories" className="block text-xl font-medium text-black hover:text-gray-600 py-3 border-b border-gray-200 transition-colors" onClick={toggleMenu}>Stories</Link>
                <Link to="/about" className="block text-xl font-medium text-black hover:text-gray-600 py-3 border-b border-gray-200 transition-colors" onClick={toggleMenu}>About</Link>
                <Link to="/contact" className="block text-xl font-medium text-black hover:text-gray-600 py-3 border-b border-gray-200 transition-colors" onClick={toggleMenu}>Contact</Link>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;