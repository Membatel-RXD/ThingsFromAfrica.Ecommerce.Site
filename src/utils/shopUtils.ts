export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  artisan: string;
  region: string;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  inStock: boolean;
  badge?: string;
}

export const searchProducts = (products: Product[], searchTerm: string): Product[] => {
  if (!searchTerm.trim()) return products;
  
  const term = searchTerm.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(term) ||
    product.artisan.toLowerCase().includes(term) ||
    product.region.toLowerCase().includes(term) ||
    product.category.toLowerCase().includes(term)
  );
};

export const filterByCategory = (products: Product[], category: string): Product[] => {
  if (category === 'all' || !category) return products;
  return products.filter(product => product.category.toLowerCase() === category.toLowerCase());
};

export const sortProducts = (products: Product[], sortBy: string): Product[] => {
  const sorted = [...products];
  
  switch (sortBy) {
    case 'price-low':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-high':
      return sorted.sort((a, b) => b.price - a.price);
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return sorted;
  }
};