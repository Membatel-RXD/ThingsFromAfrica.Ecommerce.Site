import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, ShoppingCart, Filter, Grid, List } from 'lucide-react';

const Shop: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const products = [
    {
      id: 1,
      name: 'Traditional Malawi Basket',
      price: 45,
      originalPrice: 60,
      artisan: 'Grace Mwale',
      region: 'Lilongwe',
      rating: 4.8,
      reviews: 124,
      emoji: '🧺',
      category: 'Baskets',
      inStock: true
    },
    {
      id: 2,
      name: 'Hand-carved Wooden Mask',
      price: 85,
      artisan: 'Joseph Banda',
      region: 'Blantyre',
      rating: 4.9,
      reviews: 89,
      emoji: '🎭',
      category: 'Wood Carvings',
      inStock: true
    },
    {
      id: 3,
      name: 'Chitenge Fabric Art',
      price: 35,
      artisan: 'Mary Phiri',
      region: 'Mzuzu',
      rating: 4.7,
      reviews: 156,
      emoji: '🎨',
      category: 'Textiles',
      inStock: false
    },
    {
      id: 4,
      name: 'Clay Pottery Set',
      price: 65,
      artisan: 'Peter Mbewe',
      region: 'Zomba',
      rating: 4.6,
      reviews: 78,
      emoji: '🏺',
      category: 'Pottery',
      inStock: true
    },
    {
      id: 5,
      name: 'Beaded Jewelry',
      price: 25,
      originalPrice: 35,
      artisan: 'Sarah Chisale',
      region: 'Kasungu',
      rating: 4.8,
      reviews: 203,
      emoji: '📿',
      category: 'Jewelry',
      inStock: true
    },
    {
      id: 6,
      name: 'Wooden Sculpture',
      price: 120,
      artisan: 'Daniel Kachale',
      region: 'Mangochi',
      rating: 4.9,
      reviews: 45,
      emoji: '🗿',
      category: 'Wood Carvings',
      inStock: true
    }
  ];

  return (
    <div className="min-h-screen bg-linen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-charcoal mb-2">Shop Authentic Malawi Crafts</h1>
          <p className="text-charcoal/70">Discover unique handmade treasures from talented Malawian artisans</p>
        </div>
        
        {/* Filters and controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8 p-4 bg-white rounded-lg border border-olive-green/20">
          <div className="flex-1 flex flex-col sm:flex-row gap-4">
            <Input placeholder="Search products..." className="sm:max-w-xs" />
            <Select>
              <SelectTrigger className="sm:max-w-xs">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="baskets">Baskets</SelectItem>
                <SelectItem value="wood">Wood Carvings</SelectItem>
                <SelectItem value="textiles">Textiles</SelectItem>
                <SelectItem value="pottery">Pottery</SelectItem>
                <SelectItem value="jewelry">Jewelry</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="sm:max-w-xs">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <div className="flex border rounded-md">
              <Button 
                variant={viewMode === 'grid' ? 'default' : 'ghost'} 
                size="sm" 
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'default' : 'ghost'} 
                size="sm" 
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Products grid */}
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {products.map((product) => (
            <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 border-olive-green/20">
              <div className="relative">
                <div className={`${viewMode === 'grid' ? 'aspect-square' : 'aspect-video lg:aspect-square'} bg-gradient-to-br from-linen to-olive-green/10 flex items-center justify-center`}>
                  <span className="text-6xl">{product.emoji}</span>
                </div>
                
                {product.originalPrice && (
                  <Badge className="absolute top-4 left-4 bg-burnt-sienna text-white">
                    Sale
                  </Badge>
                )}
                
                {!product.inStock && (
                  <Badge variant="secondary" className="absolute top-4 left-4">
                    Out of Stock
                  </Badge>
                )}
                
                <Button 
                  size="sm" 
                  variant="secondary" 
                  className="absolute top-4 right-4 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
              
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-bold text-charcoal text-lg">{product.name}</h3>
                    <p className="text-sm text-olive-green">by {product.artisan} • {product.region}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-burnt-sienna">${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-charcoal/50 line-through">${product.originalPrice}</span>
                      )}
                    </div>
                    <div className="text-sm text-charcoal/70">
                      ⭐ {product.rating} ({product.reviews})
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-burnt-sienna hover:bg-burnt-sienna/90" 
                    disabled={!product.inStock}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Load more */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="border-burnt-sienna text-burnt-sienna hover:bg-burnt-sienna hover:text-white">
            Load More Products
          </Button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Shop;