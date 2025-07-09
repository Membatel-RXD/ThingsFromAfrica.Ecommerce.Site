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
}

const defaultAppContext: AppContextType = {
  sidebarOpen: false,
  toggleSidebar: () => {},
  cartItems: 0,
  addToCart: () => {},
  menuOpen: false,
  toggleMenu: () => {},
  updateCartCount: async () => {},
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
    const count = await cartService.getCartCount();
    setCartItems(count);
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};