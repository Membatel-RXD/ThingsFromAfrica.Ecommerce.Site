import React from 'react';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer: React.FC = () => {
  return (
    <footer className="bg-charcoal text-white">
      {/* Newsletter section */}
      <div className="bg-olive-green py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Stay Connected with Malawi Crafts</h3>
          <p className="mb-6 text-white/90">Get stories from our artisans and exclusive offers</p>
          <div className="flex max-w-md mx-auto">
            <Input 
              placeholder="Enter your email" 
              className="rounded-r-none border-white/20 bg-white/10 text-white placeholder:text-white/70"
            />
            <Button className="rounded-l-none bg-burnt-sienna hover:bg-burnt-sienna/90">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-burnt-sienna rounded-full flex items-center justify-center">
                <span className="text-white font-bold">M</span>
              </div>
              <span className="text-xl font-bold">Malawi Crafts</span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Connecting the world to authentic Malawian craftsmanship. Every purchase supports local artisans and preserves cultural heritage.
            </p>
            <div className="flex space-x-3">
              <Button size="sm" variant="ghost" className="p-2 text-white hover:text-burnt-sienna">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="p-2 text-white hover:text-burnt-sienna">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="p-2 text-white hover:text-burnt-sienna">
                <Twitter className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Quick links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-burnt-sienna">Quick Links</h4>
            <div className="space-y-2 text-sm">
              <a href="/" className="block text-white/70 hover:text-white transition-colors">Home</a>
              <a href="/shop" className="block text-white/70 hover:text-white transition-colors">Shop</a>
              <a href="/crafts" className="block text-white/70 hover:text-white transition-colors">Our Crafts</a>
              <a href="/stories" className="block text-white/70 hover:text-white transition-colors">Artisan Stories</a>
              <a href="/about" className="block text-white/70 hover:text-white transition-colors">About Us</a>
            </div>
          </div>
          
          {/* Customer service */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-burnt-sienna">Customer Care</h4>
            <div className="space-y-2 text-sm">
              <a href="/shipping" className="block text-white/70 hover:text-white transition-colors">Shipping Info</a>
              <a href="/returns" className="block text-white/70 hover:text-white transition-colors">Returns</a>
              <a href="/faq" className="block text-white/70 hover:text-white transition-colors">FAQ</a>
              <a href="/contact" className="block text-white/70 hover:text-white transition-colors">Contact Us</a>
              <a href="/size-guide" className="block text-white/70 hover:text-white transition-colors">Size Guide</a>
            </div>
          </div>
          
          {/* Contact info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-burnt-sienna">Contact Info</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-burnt-sienna" />
                <span className="text-white/70">Lilongwe, Malawi</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-burnt-sienna" />
                <span className="text-white/70">+265 123 456 789</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-burnt-sienna" />
                <span className="text-white/70">hello@malawicrafts.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom bar */}
      <div className="border-t border-white/10 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-white/70">
            <p>&copy; 2024 Malawi Crafts. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;