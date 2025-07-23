import React from 'react';
import { ArrowUp, ShoppingCart, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const FloatingButtons: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const openWhatsApp = () => {
    window.open('https://wa.me/265888123456?text=Hello%20Things%20From%20Africa,%20I%20have%20a%20question%20about%20your%20products.', '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
      {/* WhatsApp Button */}
      <button
        onClick={openWhatsApp}
        className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center"
        aria-label="Contact on WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
      
      {/* Buy Button */}
      <Link
        to="/shop"
        className="bg-yellow-500 hover:bg-yellow-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center"
        aria-label="Shop Now"
      >
        <ShoppingCart className="h-6 w-6" />
      </Link>
      
      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="bg-black hover:bg-gray-800 text-white p-3 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center"
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-6 w-6" />
      </button>
    </div>
  );
};

export default FloatingButtons;