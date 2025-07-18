import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search, X, Home, Store, Palette, BookOpen, Info, Phone, MapPin, ChevronDown, Menu, Globe, User, HeartHandshake, Leaf, Gift, LogOut, Settings, MessageCircle, Coins, Heart, CreditCard, HelpCircle, Shield, AlertTriangle } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { WEBSITE_DETAILS } from '../constants/website_details';
import { authService } from '../services/authService';
import LocationWidget from './Location';

const Header: React.FC = () => {
  const { cartItems, menuOpen, toggleMenu } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [languageOpen, setLanguageOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('EN');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  const categories = [
    'All Categories',
    'Pottery & Ceramics',
    'Textiles & Fabrics',
    'Wood Crafts',
    'Jewelry & Accessories',
    'Home Decor',
    'Art & Paintings'
  ];

  const languages = [
    { code: 'EN', name: 'English' },
    { code: 'SW', name: 'Swahili' },
    { code: 'FR', name: 'French' }
  ];

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await authService.checkSession();
      setIsAuthenticated(isAuth);
      
      if (isAuth) {
        const email = authService.getUserEmail();
        setUserEmail(email);
        // Extract first name from email or use a default
        if (email) {
          const firstName = email.split('@')[0];
          setUserName(firstName.charAt(0).toUpperCase() + firstName.slice(1));
        }
      }
    };
    
    checkAuth();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search query:', searchQuery);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setCategoryOpen(false);
  };

  const handleLanguageSelect = (language: { code: string; name: string }) => {
    setSelectedLanguage(language.code);
    setLanguageOpen(false);
  };

  const handleMenuLinkClick = () => {
    toggleMenu();
  };

  const handleSignOut = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUserEmail(null);
    setUserName(null);
    setUserMenuOpen(false);
    // Optionally redirect to home page
    window.location.href = '/';
  };

  // Define the menu item type
  type MenuItem = {
    label: string;
    href: string;
    icon: React.ComponentType<any>;
    onClick?: () => void;
  };

  const unauthenticatedMenuItems: MenuItem[] = [
    { label: 'Sign in', href: '/login', icon: User },
    { label: 'Register', href: '/register', icon: User },
    { label: 'My Orders', href: '/profile/user/my-orders', icon: ShoppingCart },
    { label: 'My Coins', href: '/coins', icon: Coins },
    { label: 'Message Center', href: '/messages', icon: MessageCircle },
    { label: 'Payment', href: '/payment', icon: CreditCard },
    { label: 'Wish List', href: '/profile/wishlist', icon: Heart },
    { label: 'My Coupons', href: '/coupons', icon: Gift },
    { label: 'Settings', href: '/settings', icon: Settings },
    { label: 'Seller Log In', href: '/seller-login', icon: User },
    { label: 'Return & Refund Policy', href: '/return-policy', icon: Shield },
    { label: 'Help Center', href: '/help', icon: HelpCircle },
    { label: 'Disputes & Reports', href: '/disputes', icon: AlertTriangle },
  ];

  const authenticatedMenuItems: MenuItem[] = [
    { label: 'Profile', href: '/profile', icon: User },
    { label: 'Sign Out', href: '#', icon: LogOut, onClick: handleSignOut },
    { label: 'My Orders', href: '/profile/user/my-orders', icon: ShoppingCart },
    { label: 'My Coins', href: '/profile/user/my-coins', icon: Coins },
    { label: 'Message Center', href: '/messages', icon: MessageCircle },
    { label: 'Payment', href: '/payment', icon: CreditCard },
    { label: 'Wish List', href: '/profile/wishlist', icon: Heart },
    { label: 'My Coupons', href: '/coupons', icon: Gift },
    { label: 'Settings', href: '/settings', icon: Settings },
    { label: 'Seller Log In', href: '/seller-login', icon: User },
    { label: 'Return & Refund Policy', href: '/return-policy', icon: Shield },
    { label: 'Help Center', href: '/help', icon: HelpCircle },
    { label: 'Disputes & Reports', href: '/disputes', icon: AlertTriangle },
  ];

  const menuItems = isAuthenticated ? authenticatedMenuItems : unauthenticatedMenuItems;

  return (
    <>
      {/* Top Bar - Amazon Style */}
      <header className="bg-gray-900 text-white sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            
           {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="avatar">
              <div className="w-20 h-20 rounded-full flex items-center justify-center">
              <img 
                width={32} 
                height={32} 
                src="/TFTLogo.png" 
                alt="TFT Logo" 
              />
              </div>
            </div>
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <h1 className="font-bold text-white text-lg hidden sm:block">
                {WEBSITE_DETAILS.name}
              </h1>
            </Link>
          </div>

            {/* Deliver To - Hidden on mobile */}
            <LocationWidget/>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-4">
              <form onSubmit={handleSearchSubmit} className="flex">
                {/* Search Input */}
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for crafts, artisans..."
                    className="w-full px-4 py-2 text-white-900 focus:outline-none rounded-l-md"
                  />
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-r-md transition-colors duration-200"
                >
                  <Search className="h-5 w-5 text-gray-900" />
                </button>
              </form>
            </div>

            {/* Language Selector */}
            <div className="hidden md:block relative">
              <button
                onClick={() => setLanguageOpen(!languageOpen)}
                className="flex items-center space-x-1 hover:bg-gray-800 px-2 py-1 rounded transition-colors duration-200"
              >
                <Globe className="h-4 w-4" />
                <span className="text-sm font-medium">{selectedLanguage}</span>
                <ChevronDown className="h-3 w-3" />
              </button>
              
              {languageOpen && (
                <div className="absolute top-full right-0 w-32 bg-white border border-gray-300 rounded-b-md shadow-lg z-10">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => handleLanguageSelect(language)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    >
                      {language.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Welcome / Sign In - AliExpress Style */}
            <div className="hidden md:block relative">
              <div 
                className="flex items-center space-x-1 hover:bg-gray-800 px-2 py-1 rounded cursor-pointer"
                onMouseEnter={() => setUserMenuOpen(true)}
                onMouseLeave={() => setUserMenuOpen(false)}
              >
                <User className="h-4 w-4" />
                <div className="text-xs">
                  <div className="text-gray-300">
                    {isAuthenticated ? `Hi, ${userName || 'User'}` : 'Welcome'}
                  </div>
                  <div className="font-medium flex items-center">
                    {isAuthenticated ? 'Account' : 'Sign in / Register'}
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </div>
                </div>
              </div>

              {/* User Menu Dropdown */}
              {userMenuOpen && (
                <div 
                  className="absolute top-full right-0 w-60 bg-white border border-gray-300 rounded-b-md shadow-lg z-20"
                  onMouseEnter={() => setUserMenuOpen(true)}
                  onMouseLeave={() => setUserMenuOpen(false)}
                >
                  <div className="py-2">
                    {menuItems.map((item, index) => {
                      const Icon = item.icon;
                      
                      if (item.onClick) {
                        return (
                          <button
                            key={index}
                            onClick={item.onClick}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                          >
                            <Icon className="h-4 w-4 mr-3" />
                            {item.label}
                          </button>
                        );
                      }
                      
                      return (
                        <Link
                          key={index}
                          to={item.href}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                        >
                          <Icon className="h-4 w-4 mr-3" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

       

            {/* Cart */}
            <div className="flex items-center space-x-4">
              <div className="indicator">
                <Link to="/cart" className="flex items-center space-x-1 hover:bg-gray-800 px-2 py-1 rounded transition-colors duration-200">
                  <ShoppingCart className="h-6 w-6" />
                  <div className="text-xs hidden sm:block">
                    <div className="text-gray-300">Cart</div>
                    <div className="font-medium">{cartItems}</div>
                  </div>
                </Link>
                {cartItems > 0 && (
                  <span className="badge badge-sm indicator-item bg-yellow-500 text-gray-900 border-none font-bold">
                    {cartItems}
                  </span>
                )}
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button
                  onClick={toggleMenu}
                  className="p-2 hover:bg-gray-800 rounded transition-colors duration-200"
                  aria-label="Toggle menu"
                >
                  <Menu className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Bar - Below Top Bar */}
      <nav className="bg-gray-800 text-white border-t border-gray-700 z-[99999]">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-8 h-12 overflow-x-auto">
            {/* Category Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setCategoryOpen(!categoryOpen)}
                className="whitespace-nowrap text-sm font-medium hover:text-yellow-500 transition-colors duration-200 flex items-center space-x-1"
              >
                <span>{selectedCategory}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              
              {categoryOpen && (
                <div className="absolute top-full left-0 w-48 bg-white border border-gray-300 rounded-b-md shadow-lg z-100">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategorySelect(category)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link 
              to="/" 
              className="whitespace-nowrap text-sm font-medium hover:text-yellow-500 transition-colors duration-200 flex items-center space-x-1"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link 
              to="/shop" 
              className="whitespace-nowrap text-sm font-medium hover:text-yellow-500 transition-colors duration-200 flex items-center space-x-1"
            >
              <Store className="h-4 w-4" />
              <span>Shop</span>
            </Link>
            <Link 
              to="/crafts" 
              className="whitespace-nowrap text-sm font-medium hover:text-yellow-500 transition-colors duration-200 flex items-center space-x-1"
            >
              <Palette className="h-4 w-4" />
              <span>Our Crafts</span>
            </Link>
            <Link 
              to="/stories" 
              className="whitespace-nowrap text-sm font-medium hover:text-yellow-500 transition-colors duration-200 flex items-center space-x-1"
            >
              <BookOpen className="h-4 w-4" />
              <span>Stories</span>
            </Link>
            <Link 
              to="/gifts"
              className="whitespace-nowrap text-sm font-medium hover:text-yellow-500 transition-colors duration-200 flex items-center space-x-1"
            >
              <Gift className="h-4 w-4" />
              <span>Gift Ideas</span>
            </Link>

            <Link 
              to="/sustainability"
              className="whitespace-nowrap text-sm font-medium hover:text-yellow-500 transition-colors duration-200 flex items-center space-x-1"
            >
              <Leaf className="h-4 w-4" />
              <span>Sustainability</span>
            </Link>
            <Link 
              to="/corporate-social-responsibility" 
              className="whitespace-nowrap text-sm font-medium hover:text-yellow-500 transition-colors duration-200 flex items-center space-x-1"
            >
              <HeartHandshake className="h-4 w-4" />
              <span>CSR</span>
            </Link>
            <Link 
              to="/about" 
              className="whitespace-nowrap text-sm font-medium hover:text-yellow-500 transition-colors duration-200 flex items-center space-x-1"
            >
              <Info className="h-4 w-4" />
              <span>About</span>
            </Link>
            <Link 
              to="/contact" 
              className="whitespace-nowrap text-sm font-medium hover:text-yellow-500 transition-colors duration-200 flex items-center space-x-1"
            >
              <Phone className="h-4 w-4" />
              <span>Contact</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 md:hidden transition-all duration-300 ${
          menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
        onClick={toggleMenu}
      />

      {/* Mobile Navigation Menu */}
      <div className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-[45] md:hidden transform transition-all duration-300 ease-in-out ${
        menuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Menu Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gray-900 text-white">
            <div className="flex items-center space-x-3">
              <User className="h-8 w-8" />
              <span className="text-lg font-medium">
                {isAuthenticated ? `Hi, ${userName || 'User'}` : 'Hello, Sign in'}
              </span>
            </div>
            <button 
              onClick={toggleMenu}
              className="p-2 rounded-full hover:bg-gray-800 transition-colors duration-200"
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
                  className="flex items-center px-4 py-4 text-lg font-medium text-gray-900 hover:bg-gray-50 transition-colors duration-200"
                  onClick={handleMenuLinkClick}
                >
                  <Home className="h-5 w-5 text-gray-600 mr-4" />
                  <span>Home</span>
                </Link>
                <Link 
                  to="/shop" 
                  className="flex items-center px-4 py-4 text-lg font-medium text-gray-900 hover:bg-gray-50 transition-colors duration-200"
                  onClick={handleMenuLinkClick}
                >
                  <Store className="h-5 w-5 text-gray-600 mr-4" />
                  <span>Shop</span>
                </Link>
                <Link 
                  to="/crafts" 
                  className="flex items-center px-4 py-4 text-lg font-medium text-gray-900 hover:bg-gray-50 transition-colors duration-200"
                  onClick={handleMenuLinkClick}
                >
                  <Palette className="h-5 w-5 text-gray-600 mr-4" />
                  <span>Our Crafts</span>
                </Link>
                <Link 
                  to="/stories" 
                  className="flex items-center px-4 py-4 text-lg font-medium text-gray-900 hover:bg-gray-50 transition-colors duration-200"
                  onClick={handleMenuLinkClick}
                >
                  <BookOpen className="h-5 w-5 text-gray-600 mr-4" />
                  <span>Stories</span>
                </Link>
                <Link 
                  to="/about" 
                  className="flex items-center px-4 py-4 text-lg font-medium text-gray-900 hover:bg-gray-50 transition-colors duration-200"
                  onClick={handleMenuLinkClick}
                >
                  <Info className="h-5 w-5 text-gray-600 mr-4" />
                  <span>About</span>
                </Link>
                <Link 
                  to="/contact" 
                  className="flex items-center px-4 py-4 text-lg font-medium text-gray-900 hover:bg-gray-50 transition-colors duration-200"
                  onClick={handleMenuLinkClick}
                >
                  <Phone className="h-5 w-5 text-gray-600 mr-4" />
                  <span>Contact</span>
                </Link>
                <Link 
                  to="/profile" 
                  className="flex items-center px-6 py-4 text-lg font-medium text-black border-b border-gray-100"
                  onClick={handleMenuLinkClick}
                >
                  <User className="h-5 w-5 text-gray-600 mr-4" />
                  <span>Profile</span>
                </Link>
                <Link 
                  to="/corporate-social-responsibility" 
                  className="flex items-center px-4 py-4 text-lg font-medium text-gray-900 hover:bg-gray-50 transition-colors duration-200"
                  onClick={handleMenuLinkClick}
                >
                  <HeartHandshake className="h-4 w-4" />
                  <span>CSR</span>
                </Link>

                {/* Mobile-only sections */}
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="px-4 py-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Language</span>
                      <span className="text-sm text-gray-500">{selectedLanguage}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Deliver to</span>
                      <span className="text-sm text-gray-500">Blantyre</span>
                    </div>
                  </div>
                </div>
              </div>
            </nav>
          </div>

          {/* Menu Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center">
                  <span className="text-white font-bold text-xs">A</span>
                </div>
                <span className="font-bold text-gray-900 text-sm">{WEBSITE_DETAILS.name}</span>
              </div>
              <p className="text-xs text-gray-500">Authentic Handmade Crafts</p>
              <p className="text-xs text-gray-400 mt-1">Free shipping on orders over $50</p>
            </div>
          </div>
        </div>
      </div>

      {/* Click outside handlers for dropdowns */}
      {(categoryOpen || languageOpen) && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => {
            setCategoryOpen(false);
            setLanguageOpen(false);
          }}
        />
      )}
    </>
  );
};

export default Header;