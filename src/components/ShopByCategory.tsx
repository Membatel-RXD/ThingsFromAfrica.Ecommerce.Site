import React, { useState, useEffect } from 'react';
import { ChevronRight, Star, Heart, ShoppingBag, Users, TrendingUp, Award, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiService, IAPIResponse } from '@/lib/api';
import { ProductCategory } from '@/models/members';



interface ShopByCategoryProps {
  categories?: ProductCategory[];
  onCategoryClick?: (categoryId: number, categorySlug: string) => void;
}

const ShopByCategory: React.FC<ShopByCategoryProps> = ({ 
  categories = [], 
  onCategoryClick 
}) => {
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchedCategories, setFetchedCategories] = useState<ProductCategory[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiService.get<IAPIResponse<ProductCategory[]>>('ProductCategories/GetAll');
        if (!response.isSuccessful) throw new Error('Failed to fetch');
        const data = response.payload || [];
        setFetchedCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const displayCategories =
  categories.length > 0 ? categories :
  fetchedCategories.length > 0 ? fetchedCategories :
  [];

  const handleCategoryClick = (category: ProductCategory) => {
    // If parent component provided a click handler, use it
    if (onCategoryClick) {
      onCategoryClick(category.categoryId, category.categorySlug);
    } else {
      // Default behavior: navigate to shop page with category filter
      navigate(`/shop?category=${encodeURIComponent(category.categorySlug.toLowerCase())}&categoryId=${category.categoryId}&categoryName=${encodeURIComponent(category.categoryName)}`);
    }
  };

  const handleViewAllCategories = () => {
    navigate('/shop');
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 animate-pulse rounded-lg w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded-lg w-96 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="aspect-video bg-gray-200 animate-pulse rounded-xl mb-4"></div>
                <div className="h-6 bg-gray-200 animate-pulse rounded-lg w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded-lg w-full mb-4"></div>
                <div className="h-10 bg-gray-200 animate-pulse rounded-lg w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M30 0c16.569 0 30 13.431 30 30 0 16.569-13.431 30-30 30C13.431 60 0 46.569 0 30 0 13.431 13.431 0 30 0zm0 58C45.464 58 58 45.464 58 30S45.464 2 30 2 2 14.536 2 30s12.536 28 28 28z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-24"></div>
            <div className="mx-4 p-2 bg-black rounded-full">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-24"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black">
            Shop by Category
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our curated collection of authentic African crafts, organized by traditional categories
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayCategories.map((category) => (
            <div
              key={category.categoryId}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2"
              onMouseEnter={() => setHoveredCategory(category.categoryId)}
              onMouseLeave={() => setHoveredCategory(null)}
              onClick={() => handleCategoryClick(category)}
            >
              {/* Category Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={category.categoryImageUrl}
                  alt={category.categoryName}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                
                {/* Tourist Favorite Badge */}
                {category.isTouristFavorite && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-current" />
                    <span>Tourist Favorite</span>
                  </div>
                )}

                {/* Hover Actions */}
                <div className={`absolute top-4 left-4 flex space-x-2 transition-all duration-300 ${
                  hoveredCategory === category.categoryId 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 -translate-y-2'
                }`}>
                  <button 
                    className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle wishlist functionality if needed
                    }}
                  >
                    <Heart className="h-4 w-4 text-black" />
                  </button>
                  <button 
                    className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle follow/subscribe functionality if needed
                    }}
                  >
                    <Users className="h-4 w-4 text-black" />
                  </button>
                </div>

                {/* Category Title Overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white text-xl font-bold mb-1 group-hover:text-yellow-300 transition-colors">
                    {category.categoryName}
                  </h3>
                  <div className="flex items-center space-x-2 text-white/80">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm">Trending</span>
                  </div>
                </div>
              </div>

              {/* Category Content */}
              <div className="p-6">
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {category.categoryDescription}
                </p>

                {/* Category Stats */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 text-gray-500">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">Popular</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <Award className="h-4 w-4" />
                      <span className="text-sm">Authentic</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    #{category.sortOrder}
                  </div>
                </div>

                {/* CTA Button */}
                <button 
                  className="w-full bg-gradient-to-r from-gray-900 to-black text-white py-3 px-6 rounded-xl font-medium hover:from-black hover:to-gray-900 transition-all duration-300 flex items-center justify-center space-x-2 group"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCategoryClick(category);
                  }}
                >
                  <span>Explore Category</span>
                  <ArrowRight className={`h-4 w-4 transition-transform duration-300 ${
                    hoveredCategory === category.categoryId ? 'translate-x-1' : ''
                  }`} />
                </button>
              </div>

              {/* Animated Border */}
              <div className={`absolute inset-0 rounded-2xl border-2 border-transparent transition-all duration-300 ${
                hoveredCategory === category.categoryId 
                  ? 'border-black/20 shadow-lg' 
                  : ''
              }`}></div>
            </div>
          ))}
        </div>

        {/* View All Categories Button */}
        <div className="text-center mt-12">
          <button 
            className="bg-white border-2 border-black text-black px-8 py-4 rounded-xl font-medium hover:bg-black hover:text-white transition-all duration-300 flex items-center space-x-2 mx-auto group"
            onClick={handleViewAllCategories}
          >
            <span>View All Categories</span>
            <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;