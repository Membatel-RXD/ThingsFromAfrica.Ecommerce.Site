import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../services/cartService';

interface AppContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  cartItems: number;
  addToCart: () => void;
  menuOpen: boolean;
  toggleMenu: () => void;
  updateCartCount: () => Promise<void>;
  clearCart: () => void;
}

const defaultAppContext: AppContextType = {
  sidebarOpen: false,
  toggleSidebar: () => {},
  cartItems: 0,
  addToCart: () => {},
  menuOpen: false,
  toggleMenu: () => {},
  updateCartCount: async () => {},
  clearCart: () => {},
};

const AppContext = createContext<AppContextType>(defaultAppContext);

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartItems, setCartItems] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const addToCart = () => {
    setCartItems(prev => prev + 1);
  };

  const updateCartCount = async () => {
    try {
      const count = await cartService.getCartCount();
      setCartItems(count);
    } catch (error) {
      console.error('Failed to update cart count:', error);
      setCartItems(0);
    }
  };

  const clearCart = () => {
    setCartItems(0);
    cartService.clearCartCache();
  };

  useEffect(() => {
    updateCartCount();
  }, []);

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };

  return (
    <AppContext.Provider
      value={{
        sidebarOpen,
        toggleSidebar,
        cartItems,
        addToCart,
        menuOpen,
        toggleMenu,
        updateCartCount,
        clearCart,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};