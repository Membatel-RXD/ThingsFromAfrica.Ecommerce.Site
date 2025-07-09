import React from 'react';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { WEBSITE_DETAILS } from '@/constants/website_details';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white text-black">
      {/* Newsletter section */}
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4 text-black">Stay Connected</h3>
          <p className="mb-6 text-gray-700">Get stories from our artisans and exclusive offers from {WEBSITE_DETAILS.name}</p>
          <div className="join max-w-md mx-auto">
            <input 
              className="input input-bordered join-item bg-white text-black placeholder:text-gray-500 flex-1" 
              placeholder="Enter your email"
            />
            <button className="btn join-item bg-black text-white hover:bg-gray-800 border-none">
              Subscribe
            </button>
          </div>
        </div>
      </div>
      
      {/* Main footer */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-black">
          {/* Company info */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>
              <span className="text-lg font-bold">{WEBSITE_DETAILS.name}</span>
            </div>
            <p className="text-gray-600 text-sm mb-3">
              Authentic African craftsmanship. Supporting local artisans.
            </p>
            <div className="flex space-x-2">
              <button className="btn btn-ghost btn-sm btn-circle text-black hover:bg-black hover:text-white">
                <Facebook className="h-4 w-4" />
              </button>
              <button className="btn btn-ghost btn-sm btn-circle text-black hover:bg-black hover:text-white">
                <Instagram className="h-4 w-4" />
              </button>
              <button className="btn btn-ghost btn-sm btn-circle text-black hover:bg-black hover:text-white">
                <Twitter className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {/* Quick links */}
          <div>
            <h6 className="font-bold text-black mb-3">Quick Links</h6>
            <div className="space-y-1">
              <Link to="/" className="block text-gray-600 hover:text-black text-sm">Home</Link>
              <Link to="/shop" className="block text-gray-600 hover:text-black text-sm">Shop</Link>
              <Link to="/crafts" className="block text-gray-600 hover:text-black text-sm">Our Crafts</Link>
              <Link to="/stories" className="block text-gray-600 hover:text-black text-sm">Stories</Link>
              <Link to="/about" className="block text-gray-600 hover:text-black text-sm">About</Link>
            </div>
          </div>
          
          {/* Customer service */}
          <div>
            <h6 className="font-bold text-black mb-3">Customer Care</h6>
            <div className="space-y-1">
              <a className="block text-gray-600 hover:text-black text-sm">Shipping Info</a>
              <a className="block text-gray-600 hover:text-black text-sm">Returns</a>
              <a className="block text-gray-600 hover:text-black text-sm">FAQ</a>
              <Link to="/contact" className="block text-gray-600 hover:text-black text-sm">Contact Us</Link>
            </div>
          </div>
          
          {/* Contact info */}
          <div>
            <h6 className="font-bold text-black mb-3">Contact Info</h6>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-600 text-sm">
                <MapPin className="h-3 w-3" />
                <span>{WEBSITE_DETAILS.address}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 text-sm">
                <Phone className="h-3 w-3" />
                <span>{WEBSITE_DETAILS.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 text-sm">
                <Mail className="h-3 w-3" />
                <span>{WEBSITE_DETAILS.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom bar */}
      <div className="border-t border-gray-200 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
            <p>&copy; {new Date().getFullYear()} {WEBSITE_DETAILS.name}. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="/privacy" className="hover:text-black transition-colors">Privacy Policy</a>
              <a href="/terms" className="hover:text-black transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;