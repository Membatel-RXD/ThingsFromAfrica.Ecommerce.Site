import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-br from-linen via-linen to-burnt-sienna/10 py-16">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="flex text-burnt-sienna">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <span className="text-olive-green font-medium">Trusted by 10,000+ customers</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-charcoal leading-tight">
                Authentic
                <span className="text-burnt-sienna block">Malawi Crafts</span>
              </h1>
              
              <p className="text-xl text-charcoal/80 leading-relaxed">
                Discover the rich heritage of Malawian craftsmanship. Each piece tells a story 
                of tradition, skill, and cultural pride passed down through generations.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-burnt-sienna hover:bg-burnt-sienna/90 text-white px-8 py-4 text-lg"
              >
                Explore Our Crafts
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="border-olive-green text-olive-green hover:bg-olive-green hover:text-white px-8 py-4 text-lg"
              >
                Read Their Stories
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-burnt-sienna">500+</div>
                <div className="text-olive-green">Unique Crafts</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-burnt-sienna">50+</div>
                <div className="text-olive-green">Master Artisans</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-burnt-sienna">25+</div>
                <div className="text-olive-green">Years Heritage</div>
              </div>
            </div>
          </div>
          
          {/* Right content - Image placeholder */}
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-olive-green/20 to-burnt-sienna/20 rounded-2xl overflow-hidden">
              <div className="w-full h-full flex items-center justify-center text-charcoal/40">
                <div className="text-center">
                  <div className="text-6xl mb-4">🏺</div>
                  <p className="text-lg">Beautiful Malawi Pottery</p>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-indigo-accent text-white p-4 rounded-full shadow-lg">
              <span className="text-sm font-bold">NEW</span>
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-lg shadow-lg border border-olive-green/20">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-burnt-sienna rounded-full"></div>
                <div>
                  <div className="text-sm font-medium text-charcoal">Master Artisan</div>
                  <div className="text-xs text-olive-green">Handcrafted with love</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;