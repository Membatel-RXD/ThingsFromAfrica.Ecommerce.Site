import React, { useState, useEffect } from 'react';
import { Hammer, Palette, Scissors, Zap, ArrowRight, Sparkles, Clock, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiService, IAPIResponse } from '@/lib/api';

interface CraftType {
  craftTypeId: number;
  craftTypeName: string;
  craftTypeDescription: string;
  IsActive: boolean;
  CreatedAt: string;
}

interface ShopByCraftTypeProps {
  craftTypes?: CraftType[];
  onCraftTypeClick?: (craftTypeId: number, craftTypeName: string) => void;
}

const ShopByCraftType: React.FC<ShopByCraftTypeProps> = ({ 
  craftTypes = [], 
  onCraftTypeClick 
}) => {
  const [hoveredType, setHoveredType] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchedCraftTypes, setFetchedCraftTypes] = useState<CraftType[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCraftTypes = async () => {
      try {
        const response = await apiService.get<IAPIResponse<CraftType[]>>('CraftTypes/GetAll');
        if (!response.isSuccessful) throw new Error('Failed to fetch craft types');
        const data = response.payload || [];
        setFetchedCraftTypes(data);
      } catch (error) {
        console.error('Error fetching craft types:', error);
        // Optionally set error state here
      } finally {
        setIsLoading(false);
      }
    };

    fetchCraftTypes();
  }, []);

  const displayCraftTypes =
    craftTypes.length > 0 ? craftTypes :
    fetchedCraftTypes.length > 0 ? fetchedCraftTypes :
    [];

  // Icon mapping for different craft types
  const getIcon = (craftTypeName: string) => {
    const name = craftTypeName.toLowerCase();
    if (name.includes('wood') || name.includes('carving')) return Hammer;
    if (name.includes('textile') || name.includes('weaving')) return Scissors;
    if (name.includes('pottery') || name.includes('ceramic')) return Palette;
    if (name.includes('bead')) return Sparkles;
    if (name.includes('stone')) return Target;
    return Zap;
  };

  // Background colors for different craft types
  const getBackgroundClass = (index: number) => {
    const backgrounds = [
      'bg-gradient-to-br from-amber-50 to-orange-100',
      'bg-gradient-to-br from-blue-50 to-indigo-100',
      'bg-gradient-to-br from-green-50 to-emerald-100',
      'bg-gradient-to-br from-purple-50 to-violet-100',
      'bg-gradient-to-br from-rose-50 to-pink-100',
      'bg-gradient-to-br from-teal-50 to-cyan-100'
    ];
    return backgrounds[index % backgrounds.length];
  };

  // Border colors for hover effects
  const getBorderClass = (index: number) => {
    const borders = [
      'border-amber-200 hover:border-amber-400',
      'border-blue-200 hover:border-blue-400',
      'border-green-200 hover:border-green-400',
      'border-purple-200 hover:border-purple-400',
      'border-rose-200 hover:border-rose-400',
      'border-teal-200 hover:border-teal-400'
    ];
    return borders[index % borders.length];
  };

  const handleCraftTypeClick = (craftType: CraftType) => {
    // If parent component provided a click handler, use it
    if (onCraftTypeClick) {
      onCraftTypeClick(craftType.craftTypeId, craftType.craftTypeName);
    } else {
      // Default behavior: navigate to shop page with craft type filter
      navigate(`/shop?craftType=${encodeURIComponent(craftType.craftTypeName.toLowerCase())}&craftTypeId=${craftType.craftTypeId}`);
    }
  };

  const handleMeetArtisansClick = () => {
    navigate('/stories');
  };

  const handleViewAllClick = () => {
    // Navigate to shop page showing all craft types
    navigate('/shop');
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 animate-pulse rounded-lg w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded-lg w-96 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-gray-100 rounded-2xl p-8 animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
                <div className="h-6 bg-gray-200 rounded-lg w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-full mb-4"></div>
                <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M20 20c0 11.046-8.954 20-20 20v-2c9.941 0 18-8.059 18-18s-8.059-18-18-18V0c11.046 0 20 8.954 20 20zM0 38.59l2-2L4 38.59l2-2L8 38.59l2-2L12 38.59l2-2L16 38.59l2-2L20 38.59l2-2L24 38.59l2-2L28 38.59l2-2L32 38.59l2-2L36 38.59l2-2L40 38.59V40H0v-1.41z'/%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-24"></div>
            <div className="mx-4 p-2 bg-gradient-to-r from-black to-gray-800 rounded-full">
              <Hammer className="h-6 w-6 text-white" />
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-24"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black">
            Shop by Craft Type
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore different traditional crafting techniques and discover the artistry behind each method
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayCraftTypes.map((craftType, index) => {
            const IconComponent = getIcon(craftType.craftTypeName);
            
            return (
              <div
                key={craftType.craftTypeId}
                className={`group relative ${getBackgroundClass(index)} rounded-2xl border-2 ${getBorderClass(index)} transition-all duration-500 cursor-pointer hover:shadow-2xl hover:scale-105 p-8`}
                onMouseEnter={() => setHoveredType(craftType.craftTypeId)}
                onMouseLeave={() => setHoveredType(null)}
                onClick={() => handleCraftTypeClick(craftType)}
              >
                {/* Animated Background Elements */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  <div className={`absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/20 transition-transform duration-700 ${
                    hoveredType === craftType.craftTypeId ? 'scale-150 rotate-45' : 'scale-100'
                  }`}></div>
                  <div className={`absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-white/10 transition-transform duration-700 ${
                    hoveredType === craftType.craftTypeId ? 'scale-125 -rotate-12' : 'scale-100'
                  }`}></div>
                </div>

                {/* Icon */}
                <div className={`relative z-10 w-16 h-16 bg-black rounded-full flex items-center justify-center mb-6 transition-all duration-500 ${
                  hoveredType === craftType.craftTypeId ? 'scale-110 rotate-12' : ''
                }`}>
                  <IconComponent className="h-8 w-8 text-white" />
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-3 text-black group-hover:text-gray-800 transition-colors">
                    {craftType.craftTypeName}
                  </h3>
                  
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {craftType.craftTypeDescription}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="flex items-center space-x-1 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">Traditional</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-600">
                      <Target className="h-4 w-4" />
                      <span className="text-sm">Authentic</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button 
                    className={`w-full bg-black text-white py-3 px-6 rounded-xl font-medium hover:bg-gray-800 transition-all duration-300 flex items-center justify-center space-x-2 group transform ${
                      hoveredType === craftType.craftTypeId ? 'scale-105' : ''
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCraftTypeClick(craftType);
                    }}
                  >
                    <span>Explore Crafts</span>
                    <ArrowRight className={`h-4 w-4 transition-transform duration-300 ${
                      hoveredType === craftType.craftTypeId ? 'translate-x-1' : ''
                    }`} />
                  </button>
                </div>

                {/* Hover Effect Overlay */}
                <div className={`absolute inset-0 rounded-2xl bg-white/10 backdrop-blur-sm transition-opacity duration-300 ${
                  hoveredType === craftType.craftTypeId ? 'opacity-100' : 'opacity-0'
                }`}></div>
              </div>
            );
          })}
        </div>

        {/* Featured Craft Type Banner */}
        <div className="mt-16 bg-gradient-to-r from-black via-gray-900 to-black rounded-2xl p-8 md:p-12 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-repeat opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-16.569 13.431-30 30-30v60c-16.569 0-30-13.431-30-30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-yellow-400 mr-2" />
              <h3 className="text-2xl md:text-3xl font-bold">Master Craftspeople</h3>
              <Sparkles className="h-8 w-8 text-yellow-400 ml-2" />
            </div>
            
            <p className="text-lg md:text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
              Each craft type represents centuries of knowledge and skill, passed down through generations of African artisans
            </p>
            
            <button
              onClick={handleMeetArtisansClick}
              className="bg-white text-black px-8 py-3 rounded-xl font-medium hover:bg-gray-100 transition-all duration-300 flex items-center space-x-2 mx-auto"
            >
              <span>Meet Our Artisans</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button 
            onClick={handleViewAllClick}
            className="bg-gray-100 border-2 border-gray-200 text-black px-8 py-4 rounded-xl font-medium hover:bg-gray-200 hover:border-gray-300 transition-all duration-300 flex items-center space-x-2 mx-auto group"
          >
            <span>View All Craft Types</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ShopByCraftType;