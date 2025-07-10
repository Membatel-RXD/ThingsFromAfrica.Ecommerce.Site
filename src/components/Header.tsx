import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search, X, Home, Store, Palette, BookOpen, Info, Phone } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { WEBSITE_DETAILS } from '../constants/website_details';

const Header: React.FC = () => {
  const { cartItems, menuOpen, toggleMenu } = useAppContext();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search functionality here
    console.log('Search query:', searchQuery);
  };

  const handleMenuLinkClick = () => {
    toggleMenu();
  };

  // Height of the top bar (py-2 ≈ 2.5rem)
  const TOP_BAR_HEIGHT = '3.0rem';

  return (
    <>
      {/* Top bar - always visible, never covered */}
      <div
        className="fixed top-0 left-0 w-full bg-black text-white py-2 z-[99999]"
        style={{ height: TOP_BAR_HEIGHT }}
      >
        <div className="container mx-auto px-4 text-sm text-center">
          Free shipping on orders over $50 | {WEBSITE_DETAILS.name}
        </div>
      </div>

      {/* Main header, blurred, sits below Top Bar */}
      <header
        className="bg-white/80 backdrop-blur-md shadow-lg sticky z-50 w-full"
        style={{ top: TOP_BAR_HEIGHT }}
      >
        {/* Main header */}
        <div className="navbar bg-transparent mt-10 border-b border-gray-300">
          <div className="navbar-start">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="avatar">
                <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center">
                  <span className="text-white font-bold text-xl">A</span>
                </div>
              </div>
              <div>
                <Link to="/" className="hover:opacity-80 transition-opacity">
                  <h1 className="font-bold text-black text-xs sm:text-sm md:text-lg lg:text-2xl">{WEBSITE_DETAILS.name}</h1>
                </Link>
                <p className="text-gray-600 text-xs sm:text-xs md:text-sm">Authentic Handmade</p>
              </div>
            </div>
          </div>
          
          <div className="navbar-center hidden lg:flex">
            {/* Navigation Links */}
            <div className="flex space-x-6 items-center">
              <Link 
                to="/" 
                className="text-black hover:text-gray-500 font-medium transition-all duration-200 hover:underline underline-offset-4"
              >
                Home
              </Link>
              <Link 
                to="/shop" 
                className="text-black hover:text-gray-500 font-medium transition-all duration-200 hover:underline underline-offset-4"
              >
                Shop
              </Link>
              <Link 
                to="/crafts" 
                className="text-black hover:text-gray-500 font-medium transition-all duration-200 hover:underline underline-offset-4"
              >
                Our Crafts
              </Link>
              <Link 
                to="/stories" 
                className="text-black hover:text-gray-500 font-medium transition-all duration-200 hover:underline underline-offset-4"
              >
                Stories
              </Link>
              <Link 
                to="/about" 
                className="text-black hover:text-gray-500 font-medium transition-all duration-200 hover:underline underline-offset-4"
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="text-black hover:text-gray-500 font-medium transition-all duration-200 hover:underline underline-offset-4"
              >
                Contact
              </Link>
              
              {/* Desktop Search Button */}
              <button
                onClick={toggleSearch}
                className="text-black hover:text-gray-500 transition-all duration-200 p-2 hover:bg-gray-100 rounded-full"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="navbar-end">
            {/* Mobile Search Button - visible only on mobile */}
            <div className="lg:hidden">
              <button
                onClick={toggleSearch}
                className="btn btn-ghost btn-circle text-black hover:bg-gray-100"
                aria-label="Search"
              >
                <Search className="h-6 w-6" />
              </button>
            </div>

            {/* Cart */}
            <div className="indicator">
              <button className="btn btn-ghost btn-circle text-black hover:bg-gray-100">
                <ShoppingCart className="h-6 w-6" />
              </button>
              {cartItems > 0 && (
                <span className="badge badge-sm indicator-item bg-black text-white border-none">
                  {cartItems}
                </span>
              )}
            </div>
            
            {/* Mobile menu toggle with hamburger animation */}
            <div className="lg:hidden ml-2">
              <button
                onClick={toggleMenu}
                className="btn btn-ghost btn-circle text-black hover:bg-gray-100 relative z-50"
                aria-label="Toggle menu"
              >
                <div className="w-7 h-7 relative">
                  {/* Top bar */}
                  <span
                    className={`absolute left-0 w-7 h-0.5 bg-black rounded transition-all duration-300 ease-in-out
                      ${menuOpen ? 'rotate-45 top-3.5' : 'top-2'}
                    `}
                  />
                  {/* Middle bar */}
                  <span
                    className={`absolute left-0 w-7 h-0.5 bg-black rounded transition-all duration-300 ease-in-out
                      ${menuOpen ? 'opacity-0' : 'top-3.5'}
                    `}
                  />
                  {/* Bottom bar */}
                  <span
                    className={`absolute left-0 w-7 h-0.5 bg-black rounded transition-all duration-300 ease-in-out
                      ${menuOpen ? '-rotate-45 top-3.5' : 'top-5'}
                    `}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar - Appears below main header when toggled */}
        <div className={`bg-white border-b border-gray-200 transition-all duration-300 ease-in-out overflow-hidden ${
          searchOpen ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="container mx-auto px-4 py-4">
            <form onSubmit={handleSearchSubmit} className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for crafts, artisans..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  autoFocus={searchOpen}
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
              >
                Search
              </button>
              <button
                type="button"
                onClick={toggleSearch}
                className="p-2 text-gray-500 hover:text-black transition-colors duration-200"
                aria-label="Close search"
              >
                <X className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay with backdrop blur */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 lg:hidden transition-all duration-300 ${
          menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
        onClick={toggleMenu}
      />

      {/* Mobile Navigation Menu - Slides from right to left */}
      <div className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-[45] lg:hidden transform transition-all duration-300 ease-in-out ${
        menuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Menu Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <Link to="/" onClick={handleMenuLinkClick}>
                <span className="font-bold text-black text-lg hover:opacity-80 transition-opacity">{WEBSITE_DETAILS.name}</span>
              </Link>
            </div>
            <button 
              onClick={toggleMenu}
              className="p-2 rounded-full bg-gray-50"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {/* Menu Content */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-4">
              <div className="space-y-2">
                <Link 
                  to="/" 
                  className="flex items-center px-6 py-4 text-lg font-medium text-black border-b border-gray-100"
                  onClick={handleMenuLinkClick}
                >
                  <Home className="h-5 w-5 text-gray-600 mr-4" />
                  <span>Home</span>
                </Link>
                <Link 
                  to="/shop" 
                  className="flex items-center px-6 py-4 text-lg font-medium text-black border-b border-gray-100"
                  onClick={handleMenuLinkClick}
                >
                  <Store className="h-5 w-5 text-gray-600 mr-4" />
                  <span>Shop</span>
                </Link>
                <Link 
                  to="/crafts" 
                  className="flex items-center px-6 py-4 text-lg font-medium text-black border-b border-gray-100"
                  onClick={handleMenuLinkClick}
                >
                  <Palette className="h-5 w-5 text-gray-600 mr-4" />
                  <span>Our Crafts</span>
                </Link>
                <Link 
                  to="/stories" 
                  className="flex items-center px-6 py-4 text-lg font-medium text-black border-b border-gray-100"
                  onClick={handleMenuLinkClick}
                >
                  <BookOpen className="h-5 w-5 text-gray-600 mr-4" />
                  <span>Stories</span>
                </Link>
                <Link 
                  to="/about" 
                  className="flex items-center px-6 py-4 text-lg font-medium text-black border-b border-gray-100"
                  onClick={handleMenuLinkClick}
                >
                  <Info className="h-5 w-5 text-gray-600 mr-4" />
                  <span>About</span>
                </Link>
                <Link 
                  to="/contact" 
                  className="flex items-center px-6 py-4 text-lg font-medium text-black border-b border-gray-100"
                  onClick={handleMenuLinkClick}
                >
                  <Phone className="h-5 w-5 text-gray-600 mr-4" />
                  <span>Contact</span>
                </Link>
              </div>
            </nav>
          </div>

          {/* Menu Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center">
                  <span className="text-white font-bold text-xs">A</span>
                </div>
                <span className="font-bold text-black text-sm">{WEBSITE_DETAILS.name}</span>
              </div>
              <p className="text-xs text-gray-500">Authentic Handmade Crafts</p>
              <p className="text-xs text-gray-400 mt-1">Preserving African Heritage</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;


//