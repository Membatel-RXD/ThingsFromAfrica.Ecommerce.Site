import { Product } from "@/models/members";


// Search products by name, description, artisan, etc.
export const searchProducts = (products: Product[], searchTerm: string): Product[] => {
  if (!searchTerm.trim()) return products;
  
  const term = searchTerm.toLowerCase();
  return products.filter(product => 
    product.productName.toLowerCase().includes(term) ||
    product.artisanName.toLowerCase().includes(term) ||
    product.artisanVillage.toLowerCase().includes(term) ||
    (product.productDescription && product.productDescription.toLowerCase().includes(term))
  );
};

// Filter products by category - THIS IS THE KEY FILTERING FUNCTION
export const filterByCategory = (products: Product[], selectedCategory: string): Product[] => {
  if (selectedCategory === 'all') {
    return products;
  }
  
  return products.filter(product => {
    // Case-insensitive matching with the product's category
    const productCategory = product.ca.toLowerCase();
    const filterCategory = selectedCategory.toLowerCase();
    
    // Direct match
    if (productCategory === filterCategory) {
      return true;
    }
    
    // Handle common category variations and mappings
    const categoryMappings = {
      'wood-carvings': ['wood carving', 'wood carvings', 'carving', 'sculpture'],
      'baskets': ['basket', 'basketry', 'weaving'],
      'textiles': ['textile', 'fabric', 'cloth', 'weaving'],
      'pottery': ['ceramic', 'clay', 'pot'],
      'jewelry': ['jewellery', 'accessories', 'beads'],
      'art': ['painting', 'artwork', 'drawing'],
      'home-decor': ['home decor', 'decoration', 'ornament'],
      'musical-instruments': ['music', 'instrument', 'drum'],
      'masks': ['mask', 'ceremonial'],
      'tools': ['tool', 'utensil', 'implement']
    };
    
    // Check if the selected category has alternative names
    const alternatives = categoryMappings[filterCategory] || [];
    return alternatives.some(alt => productCategory.includes(alt));
  });
};

// Sort products based on different criteria
export const sortProducts = (products: Product[], sortBy: string): Product[] => {
  const sorted = [...products];
  
  switch (sortBy) {
    case 'price-low':
      return sorted.sort((a, b) => a.usdPrice - b.usdPrice);
    case 'price-high':
      return sorted.sort((a, b) => b.usdPrice - a.usdPrice);
    case 'rating':
      return sorted.sort((a, b) => b.averageRating - a.averageRating);
    case 'name':
      return sorted.sort((a, b) => a.productName.localeCompare(b.productName));
    case 'featured':
    default:
      // Featured items first, then by rating
      return sorted.sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return b.averageRating - a.averageRating;
      });
  }
};

// Additional filtering functions for advanced filters
export const filterByPriceRange = (products: Product[], minPrice: number, maxPrice: number): Product[] => {
  return products.filter(product => product.usdPrice >= minPrice && product.usdPrice <= maxPrice);
};

export const filterByRating = (products: Product[], minRating: number): Product[] => {
  if (minRating === 0) return products;
  return products.filter(product => product.averageRating >= minRating);
};

export const filterByStock = (products: Product[], inStockOnly: boolean): Product[] => {
  if (!inStockOnly) return products;
  return products.filter(product => product.stockQuantity>0);
};

export const filterByFeatured = (products: Product[], featuredOnly: boolean): Product[] => {
  if (!featuredOnly) return products;
  return products.filter(product => product.isFeatured);
};