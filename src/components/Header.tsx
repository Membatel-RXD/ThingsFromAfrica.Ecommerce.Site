import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { ShoppingCart, Search, X, Home, Store, Palette, BookOpen, Info, Phone, MapPin, ChevronDown, Menu, Globe, User, HeartHandshake, Leaf, Gift, LogOut, Settings, MessageCircle, Coins, Heart, CreditCard, Shield, AlertTriangle } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { WEBSITE_DETAILS } from '../constants/website_details';
import { authService } from '../services/authService';
import LocationWidget from './Location';
import { ProductCategory } from '@/models/members';
import { apiService, IAPIResponse } from '@/lib/api';
import { useTranslation } from 'react-i18next';

const Header: React.FC = () => {
  const { cartItems, menuOpen, toggleMenu } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>({
    categoryId: 0,
    categoryName: "All Categories",
    categorySlug: "",
    categoryDescription: "",
    categoryImageUrl: "",
    isTouristFavorite: false,
    isActive: true,
    sortOrder: 0,
    createdAt: new Date().toISOString()
  });
  const navigate = useNavigate();

  const [languageOpen, setLanguageOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [categories, setCategories] = useState<ProductCategory[] | null>([]);



  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'it', name: 'Italiano' },
    { code: 'sw', name: 'Kiswahili' },
    { code: 'zh', name: '中文' },
    { code: 'de', name: 'Deutsch' },
    { code: 'pt', name: 'Português' },
    { code: 'nl', name: 'Nederlands' }
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

    const fetchCategories = async () => {
      try {
        const response = await apiService.get<IAPIResponse<ProductCategory[]>>('ProductCategories/GetAll');
        if (!response.isSuccessful) throw new Error('Failed to fetch');
        const data = response.payload || [];
        setCategories(data);
        setSelectedCategory(data.length > 0 ? data[0] : {
          categoryId: 0,
          categoryName: "All Categories",
          categorySlug: "",
          categoryDescription: "",
          categoryImageUrl: "",
          isTouristFavorite: false,
          isActive: true,
          sortOrder: 0,
          createdAt: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Set default categories on error
        setCategories([]);
        setSelectedCategory({
          categoryId: 0,
          categoryName: "All Categories",
          categorySlug: "",
          categoryDescription: "",
          categoryImageUrl: "",
          isTouristFavorite: false,
          isActive: true,
          sortOrder: 0,
          createdAt: new Date().toISOString()
        });
      }
    };
    
    checkAuth();
    fetchCategories();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search query:', searchQuery);
  };

  const handleCategorySelect = (category: ProductCategory) => {
    setSelectedCategory(category);
    setCategoryOpen(false);
  };

  const handleLanguageSelect = (language: { code: string; name: string }) => {
    i18n.changeLanguage(language.code);
    setLanguageOpen(false);
  };

  const handleMenuLinkClick = () => {
    toggleMenu();
  };

  const handleCategoryClick = (category: ProductCategory) => {
    // If parent component provided a click handler, use it
    // if (onCategoryClick) {
    //   onCategoryClick(category.categoryId, category.categorySlug);
    // } else {
      // Default behavior: navigate to shop page with category filter
      navigate(`/shop?category=${encodeURIComponent(category.categorySlug.toLowerCase())}&categoryId=${category.categoryId}&categoryName=${encodeURIComponent(category.categoryName)}`);
   // }
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
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    onClick?: () => void;
  };



  const unauthenticatedMenuItems: MenuItem[] = [
    { label: t('user.signIn'), href: '/login', icon: User },
    { label: t('user.register'), href: '/signup', icon: User },
    { label: t('user.myOrders'), href: '/profile/user/my-orders', icon: ShoppingCart },
    { label: t('user.myCoins'), href: '/coins', icon: Coins },
   
    { label: t('user.payment'), href: '/payment', icon: CreditCard },
    { label: t('user.wishList'), href: '/profile/wishlist', icon: Heart },
    { label: t('user.myCoupons'), href: '/coupons', icon: Gift },
  
    { label: t('user.returnPolicy'), href: '/return-policy', icon: Shield },
   // { label: 'Help Center', href: '/help', icon: HelpCircle },
    { label: t('user.disputes'), href: '/disputes', icon: AlertTriangle },
  ];

  const authenticatedMenuItems: MenuItem[] = [
    { label: t('user.profile'), href: '/profile', icon: User },
    { label: t('user.myOrders'), href: '/profile/user/my-orders', icon: ShoppingCart },
    { label: t('user.myCoins'), href: '/profile/user/my-coins', icon: Coins },
    
    { label: t('user.payment'), href: '/payment', icon: CreditCard },
    { label: t('user.wishList'), href: '/profile/wishlist', icon: Heart },
    { label: t('user.myCoupons'), href: '/coupons', icon: Gift },
    { label: t('user.settings'), href: 'http://localhost:8080/profile/settings', icon: Settings },
  
    { label: t('user.returnPolicy'), href: '/return-policy', icon: Shield },
    //{ label: 'Help Center', href: '/help', icon: HelpCircle },
    { label: t('user.disputes'), href: '/disputes', icon: AlertTriangle },
    { label: t('user.signOut'), href: '#', icon: LogOut, onClick: handleSignOut },
  ];

  const menuItems = isAuthenticated ? authenticatedMenuItems : unauthenticatedMenuItems;

  return (
    <>

         {/* Custom Tailwind Styles */}
         <style>{`
        .bg-craft-charcoal { background-color: #1A1612; }
        .bg-craft-brown { background-color: #2C1810; }
        .bg-craft-tan { background-color: #C19A6B; }
        .bg-craft-caramel { background-color: #E5C29F; }
        .bg-craft-cream { background-color: #F8F4EF; }
        .bg-craft-beige { background-color: #D4C4B0; }
        .bg-craft-bronze { background-color: #A08B73; }
        .bg-craft-dusty { background-color: #8B7355; }
        
        .text-craft-charcoal { color: #1A1612; }
        .text-craft-brown { color: #2C1810; }
        .text-craft-tan { color: #C19A6B; }
        .text-craft-caramel { color: #E5C29F; }
        .text-craft-cream { color: #F8F4EF; }
        .text-craft-beige { color: #D4C4B0; }
        .text-craft-bronze { color: #A08B73; }
        .text-craft-dusty { color: #8B7355; }
        
        .border-craft-tan { border-color: #C19A6B; }
        .border-craft-bronze { border-color: #A08B73; }
        
        .hover\\:bg-craft-tan:hover { background-color: #C19A6B; }
        .hover\\:bg-craft-caramel:hover { background-color: #E5C29F; }
        .hover\\:text-craft-caramel:hover { color: #E5C29F; }
        .hover\\:text-craft-cream:hover { color: #F8F4EF; }
        .hover\\:border-craft-tan:hover { border-color: #C19A6B; }
        
        .bg-gradient-craft { background: linear-gradient(135deg, #1A1612 0%, #2C2419 50%, #1A1612 100%); }
        .bg-gradient-nav { background: linear-gradient(135deg, #2C1810 0%, #3D2418 100%); }
        .bg-gradient-gold { background: linear-gradient(135deg, #D4AF37 0%, #B8941F 100%); }
        .bg-gradient-golden-hover { background: linear-gradient(135deg, #E6C34A 0%, #C4A429 100%); }
        
        .shadow-craft { box-shadow: 0 8px 32px rgba(193, 154, 107, 0.15); }
        .shadow-craft-hover { box-shadow: 0 6px 30px rgba(193, 154, 107, 0.3); }
        .shadow-craft-logo { box-shadow: 0 4px 12px rgba(193, 154, 107, 0.3); }
        .shadow-craft-logo-hover { box-shadow: 0 6px 20px rgba(193, 154, 107, 0.4); }
        
        .header-glow::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, #C19A6B 50%, transparent 100%);
        }
      `}</style>

      {/* Top Bar - Amazon Style */}
      <header className="bg-gradient-craft text-craft-cream sticky top-0 z-50 shadow-craft relative header-glow">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            
           {/* Logo */}
           <div className="flex items-center space-x-3">
           <Link to="/" className="flex items-center space-x-3 group">

              <div className="w-10 h-10 bg-gradient-to-br from-craft-caramel to-craft-tan rounded-full flex items-center justify-center shadow-craft-logo hover:shadow-craft-logo-hover transition-all duration-300 hover:scale-105">
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
              </div>
              <div className="hover:opacity-80 transition-opacity cursor-pointer">
                <h1 className="font-bold text-craft-cream text-lg hidden sm:block tracking-tight">
                  {WEBSITE_DETAILS.name}
                </h1>
              </div>
            </Link>
            </div>

            {/* Deliver To - Hidden on mobile */}
            {/* <LocationWidget/> */}

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-4">
              <div className="flex rounded-lg overflow-hidden shadow-lg hover:shadow-craft-hover transition-all duration-300 hover:-translate-y-0.5">
                <div className="flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('nav.searchPlaceholder')}
                    className="w-full px-4 py-3 text-craft-brown bg-craft-cream focus:outline-none placeholder-craft-dusty text-sm"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit(e)}
                  />
                </div>
                <button
                  type="submit"
                  aria-label="Search"
                  onClick={handleSearchSubmit}
                  className="bg-gradient-gold hover:bg-gradient-golden-hover px-4 py-3 transition-all duration-300 hover:scale-105 flex items-center justify-center"
                >
                  <Search className="h-5 w-5 text-craft-charcoal" />
                </button>
              </div>
            </div>

            {/* Language Selector */}
            <div className="hidden md:block relative">
              <button
                onClick={() => setLanguageOpen(!languageOpen)}
                className="flex items-center space-x-2 hover:bg-craft-brown/10 px-3 py-2 rounded-md transition-all duration-300 border border-craft-bronze/30 hover:border-craft-tan text-craft-beige hover:text-craft-caramel"
              >
                <Globe className="h-4 w-4" />
                <span className="text-sm font-medium">{languages.find(l => l.code === i18n.language)?.name || 'English'}</span>
                <ChevronDown className="h-3 w-3" />
              </button>
              
              {languageOpen && (
                <div className="absolute top-full right-0 mt-1 w-40 bg-craft-cream border border-craft-bronze/20 rounded-lg shadow-lg z-10">
                {languages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => handleLanguageSelect(language)}
                    className="block w-full text-left px-4 py-2 text-sm text-craft-brown hover:bg-craft-tan/10 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg"
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
                className="flex items-center space-x-2 hover:bg-craft-brown/10 px-3 py-2 rounded-md cursor-pointer transition-all duration-300"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                 <User className="h-4 w-4 text-craft-beige" />
                <div className="text-xs">
                  <div className="text-craft-bronze">
                    {isAuthenticated ? `Hello, ${userName || 'User'}` : t('nav.welcome')}
                  </div>
                  <div className="font-medium flex items-center text-craft-cream">
                    {isAuthenticated ? t('nav.account') : t('nav.signin')}
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </div>
                </div>
              </div>

              {/* User Menu Dropdown */}
              {userMenuOpen && (
                <div 
                  className="absolute top-full right-0 mt-1 w-60 bg-craft-cream border border-craft-bronze/20 rounded-lg shadow-lg z-20"
                >
                  <div className="py-2">
                    {menuItems.map((item, index) => {
                      const Icon = item.icon;
                      
                      if (item.onClick) {
                        return (
                          <button
                            key={index}
                            onClick={item.onClick}
                            className={`flex items-center w-full px-4 py-3 text-sm hover:bg-craft-tan/10 transition-colors duration-200 ${
                              item.label === t('user.signOut') ? 'text-red-600 hover:text-red-700' : 'text-craft-brown'
                            }`}
                          >
                            <Icon className={`h-4 w-4 mr-3 ${
                              item.label === t('user.signOut') ? 'text-red-500' : ''
                            }`} />
                            {item.label}
                          </button>
                        );
                      }
                      
                      return (
                        <Link
                          key={index}
                          to={item.href}
                          className="flex items-center px-4 py-3 text-sm text-craft-brown hover:bg-craft-tan/10 transition-colors duration-200"
                          onClick={() => setUserMenuOpen(false)}
                          target={item.href.startsWith('http') ? '_blank' : undefined}
                          rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                          >
                            <Icon className="h-4 w-4 mr-3 text-craft-bronze" />
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
              <div className="relative">
                <Link to="/cart" className="flex items-center space-x-2 hover:bg-craft-brown/10 px-3 py-2 rounded-md transition-all duration-300">
                  <div className="relative">
                    <ShoppingCart className="h-6 w-6 text-craft-cream" />
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold">
                      {cartItems}
                    </div>
                  </div>
                  <div className="text-xs hidden sm:block">
                    <div className="text-craft-bronze">{t('nav.cart')}</div>
                    
                  </div>
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button
                  onClick={handleMenuLinkClick}
                  className="p-2 hover:bg-craft-brown/10 rounded-md transition-colors duration-300 text-craft-beige hover:text-craft-caramel"
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
      <nav className="bg-gradient-nav text-craft-cream border-t border-craft-bronze/20 z-40 relative">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-8 h-12 overflow-x-auto">
            {/* Category Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setCategoryOpen(!categoryOpen)}
                className="whitespace-nowrap text-sm font-medium hover:text-craft-caramel transition-colors duration-300 flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-craft-tan/10"
              >
                <span>{selectedCategory?.categoryName}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              
              {categoryOpen && (
                <div className="fixed z-[99999]" style={{
                  top: '120px', // Position below header
                  left: '20px', // Align with the category button
                }}>
                  <div className="absolute top-full left-0 mt-1 w-48 bg-craft-cream border border-craft-bronze/20 rounded-lg shadow-lg z-[999]">
                  {categories && categories.length > 0 ? categories.map((category) => (
                      <a
                      href="#"
                      key={category.categoryId}
                      onClick={(e) => {
                        e.preventDefault();
                        handleCategoryClick(category);
                      }}
                      className="block w-full text-left px-4 py-3 text-sm text-craft-brown hover:bg-craft-tan/10 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg"
                    >
                      {category.categoryName}
                    </a>
                    
                    )) : (
                      <div className="px-4 py-3 text-sm text-craft-bronze">
                        No categories available
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <Link to="/" className="whitespace-nowrap text-sm font-medium hover:text-craft-caramel transition-all duration-300 flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-craft-tan/10 hover:-translate-y-0.5">
              <Home className="h-4 w-4" />
              <span>{t('nav.home')}</span>
            </Link>
            <Link to="/shop" className="whitespace-nowrap text-sm font-medium hover:text-craft-caramel transition-all duration-300 flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-craft-tan/10 hover:-translate-y-0.5">
              <Store className="h-4 w-4" />
              <span>{t('nav.shop')}</span>
            </Link>
            <Link to="/crafts" className="whitespace-nowrap text-sm font-medium hover:text-craft-caramel transition-all duration-300 flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-craft-tan/10 hover:-translate-y-0.5">
              <Palette className="h-4 w-4" />
              <span>{t('nav.crafts')}</span>
            </Link>
            <Link to="/stories" className="whitespace-nowrap text-sm font-medium hover:text-craft-caramel transition-all duration-300 flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-craft-tan/10 hover:-translate-y-0.5">
              <BookOpen className="h-4 w-4" />
              <span>{t('nav.stories')}</span>
            </Link>
            <Link to="/gifts" className="whitespace-nowrap text-sm font-medium hover:text-craft-caramel transition-all duration-300 flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-craft-tan/10 hover:-translate-y-0.5">
              <Gift className="h-4 w-4" />
              <span>{t('nav.gifts')}</span>
            </Link>
            <Link to="/sustainability" className="whitespace-nowrap text-sm font-medium hover:text-craft-caramel transition-all duration-300 flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-craft-tan/10 hover:-translate-y-0.5">
              <Leaf className="h-4 w-4" />
              <span>{t('nav.sustainability')}</span>
            </Link>
            <Link to="/corporate-social-responsibility" className="whitespace-nowrap text-sm font-medium hover:text-craft-caramel transition-all duration-300 flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-craft-tan/10 hover:-translate-y-0.5">
              <HeartHandshake className="h-4 w-4" />
              <span>{t('nav.csr')}</span>
            </Link>
            <Link to="/about" className="whitespace-nowrap text-sm font-medium hover:text-craft-caramel transition-all duration-300 flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-craft-tan/10 hover:-translate-y-0.5">
              <Info className="h-4 w-4" />
              <span>{t('nav.about')}</span>
            </Link>
            <Link to="/contact" className="whitespace-nowrap text-sm font-medium hover:text-craft-caramel transition-all duration-300 flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-craft-tan/10 hover:-translate-y-0.5">
              <Phone className="h-4 w-4" />
              <span>{t('nav.contact')}</span>
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
          <div className="flex justify-between items-center p-6 border-b border-craft-bronze/20 bg-gradient-craft text-craft-cream">
            <div className="flex items-center space-x-3">
              <User className="h-8 w-8" />
              <span className="text-lg font-medium">
                {isAuthenticated ? `Hi, ${userName || 'User'}` : t('nav.welcome')}
              </span>
            </div>
            <button 
              onClick={toggleMenu}
              className="p-2 rounded-full hover:bg-craft-brown/10 transition-colors duration-300"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {/* Menu Content */}
          <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-4">
              <div className="space-y-2">
                <Link to="/" className="flex items-center px-4 py-4 text-lg font-medium text-craft-brown hover:bg-craft-tan/10 transition-colors duration-300 rounded-lg">
                  <Home className="h-5 w-5 text-craft-bronze mr-4" />
                  <span>{t('nav.home')}</span>
                </Link>
                <Link to="/shop" className="flex items-center px-4 py-4 text-lg font-medium text-craft-brown hover:bg-craft-tan/10 transition-colors duration-300 rounded-lg">
                  <Store className="h-5 w-5 text-craft-bronze mr-4" />
                  <span>{t('nav.shop')}</span>
                </Link>
                <Link to="/crafts" className="flex items-center px-4 py-4 text-lg font-medium text-craft-brown hover:bg-craft-tan/10 transition-colors duration-300 rounded-lg">
                  <Palette className="h-5 w-5 text-craft-bronze mr-4" />
                  <span>{t('nav.crafts')}</span>
                </Link>
                <Link to="/stories" className="flex items-center px-4 py-4 text-lg font-medium text-craft-brown hover:bg-craft-tan/10 transition-colors duration-300 rounded-lg">
                  <BookOpen className="h-5 w-5 text-craft-bronze mr-4" />
                  <span>{t('nav.stories')}</span>
                </Link>
                <Link to="/about" className="flex items-center px-4 py-4 text-lg font-medium text-craft-brown hover:bg-craft-tan/10 transition-colors duration-300 rounded-lg">
                  <Info className="h-5 w-5 text-craft-bronze mr-4" />
                  <span>{t('nav.about')}</span>
                </Link>
                <Link to="/contact" className="flex items-center px-4 py-4 text-lg font-medium text-craft-brown hover:bg-craft-tan/10 transition-colors duration-300 rounded-lg">
                  <Phone className="h-5 w-5 text-craft-bronze mr-4" />
                  <span>{t('nav.contact')}</span>
                </Link>

                {/* Mobile-only sections */}
                <div className="border-t border-craft-bronze/20 pt-4 mt-4">
                  <div className="px-4 py-4 bg-craft-beige/20 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-craft-brown">Language</span>
                      <span className="text-sm text-craft-bronze">{languages.find(l => l.code === i18n.language)?.name || 'English'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-craft-brown">Deliver to</span>
                      <span className="text-sm text-craft-bronze">Blantyre</span>
                    </div>
                  </div>
                </div>
              </div>
            </nav>
          </div>

          {/* Menu Footer */}
          <div className="p-6 border-t border-craft-bronze/20 bg-craft-beige/10">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-craft-caramel to-craft-tan flex items-center justify-center">
                  <span className="text-craft-charcoal font-bold text-xs">TFA</span>
                </div>
                <span className="font-bold text-craft-brown text-sm">{WEBSITE_DETAILS.name}</span>
              </div>
              <p className="text-xs text-craft-bronze">Authentic Handmade Crafts</p>
              <p className="text-xs text-craft-dusty mt-1">Free shipping on orders over $50</p>
            </div>
          </div>
        </div>
      </div>

      {/* Click outside handlers for dropdowns */}
      {(languageOpen || userMenuOpen) && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => {
            setLanguageOpen(false);
            setUserMenuOpen(false);
          }}
        />
      )}
      
      {/* Category dropdown overlay */}
      {categoryOpen && (
        <div 
          className="fixed inset-0 z-[99998]" 
          onClick={() => setCategoryOpen(false)}
        />
      )}
    </>
  );
};

export default Header;