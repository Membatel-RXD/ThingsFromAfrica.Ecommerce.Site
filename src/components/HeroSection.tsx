import React from 'react';
import { ArrowRight, Star } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <div className="min-h-[70vh] bg-white flex items-start justify-center pt-4">
      <div className="text-center">
        <div className="max-w-6xl">
          <h1 className="text-6xl lg:text-8 font-bold mb-5 text-black">
            Authentic
            <br />
            <span className="bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">
              African Crafts
            </span>
          </h1>
          
          <p className="text-xl lg:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
            Discover the rich heritage of African craftsmanship. Each piece tells a story 
            of tradition, skill, and cultural pride passed down through generations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4 px-5">
            <button className="btn btn-lg bg-black text-white border-none hover:bg-gray-800">
              Explore Our Crafts
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            
            <button className="btn btn-lg btn-outline border-black text-black hover:bg-black hover:text-white">
              Read Their Stories
            </button>
          </div>
          
          <div className="stats stats-horizontal shadow-2xl bg-white border border-gray-200">
            <div className="stat">
              <div className="stat-value text-black">500+</div>
              <div className="stat-title text-gray-600">Unique Crafts</div>
            </div>
            <div className="stat">
              <div className="stat-value text-black">50+</div>
              <div className="stat-title text-gray-600">Master Artisans</div>
            </div>
            <div className="stat">
              <div className="stat-value text-black">25+</div>
              <div className="stat-title text-gray-600">Years Heritage</div>
            </div>
          </div>
          


        </div>
      </div>
    </div>
  );
};

export default HeroSection;