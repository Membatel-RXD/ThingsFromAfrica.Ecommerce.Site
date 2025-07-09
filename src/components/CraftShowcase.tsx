import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Eye, X } from 'lucide-react';
import { authService } from '../services/authService';
import { cartService } from '../services/cartService';
import { useAppContext } from '../contexts/AppContext';

const CraftShowcase: React.FC = () => {
  const [selectedCraft, setSelectedCraft] = useState<any>(null);
  const navigate = useNavigate();
  const { updateCartCount } = useAppContext();

  const handleAddToCart = async (craftId: number) => {
    const hasValidSession = await authService.checkSession();
    
    if (!hasValidSession) {
      navigate('/login');
      return;
    }
    
    const craft = crafts.find(c => c.id === craftId);
    if (!craft) return;
    
    const unitPrice = parseFloat(craft.price.replace('$', ''));
    const success = await cartService.addToCart(craftId, 1, unitPrice);
    
    if (success) {
      await updateCartCount();
    }
  };
  
  const crafts = [
    {
      id: 1,
      name: 'Traditional African Basket',
      price: '$45',
      artisan: 'Grace Mwale',
      region: 'Lilongwe',
      story: 'Woven from locally sourced palm leaves, this basket represents generations of African weaving tradition.',
      image: '/traditional-wicker-basket.webp',
      badge: 'Bestseller'
    },
    {
      id: 2,
      name: 'Hand-carved Wooden Mask',
      price: '$85',
      artisan: 'Joseph Banda',
      region: 'Blantyre',
      story: 'Each mask tells the story of African ancestors, carved with traditional tools passed down through families.',
      image: '/mask.png',
      badge: 'Heritage'
    },
    {
      id: 3,
      name: 'Traditional Fabric Art',
      price: '$35',
      artisan: 'Mary Phiri',
      region: 'Mzuzu',
      story: 'Vibrant patterns that celebrate African culture and the beauty of traditional textile art.',
      image: '/africafabricart.jpg',
      badge: 'New'
    },
    {
      id: 4,
      name: 'Ceramic Pottery',
      price: '$65',
      artisan: 'Sarah Tembo',
      region: 'Zomba',
      story: 'Handcrafted pottery using traditional clay techniques passed down through generations.',
      image: '/Ceramic Pottery.jpg',
      badge: 'Popular'
    },
    {
      id: 5,
      name: 'Beaded Jewelry',
      price: '$25',
      artisan: 'Ruth Kachale',
      region: 'Karonga',
      story: 'Beautiful beadwork jewelry featuring traditional African patterns and colors.',
      image: '/Beaded Jewelry.jpg',
      badge: 'Trending'
    },
    {
      id: 6,
      name: 'Wooden Sculpture',
      price: '$120',
      artisan: 'Peter Nyirenda',
      region: 'Dedza',
      story: 'Intricate wood sculptures carved from indigenous hardwood using ancestral techniques.',
      image: '/Wooden Sculpture.jpg',
      badge: 'Premium'
    }
  ];

  return (
    <section className=" bg-gray-50">
      <div className="container mx-auto ">
        <div className="text-center mb-4">
          <h2 className="text-5xl font-bold mb-1 text-black">
            Featured Crafts
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Each piece comes with the story of its creator, connecting you to the heart of African culture
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-8">
          {crafts.map((craft) => (
            <div key={craft.id} className="card bg-gradient-to-br from-white to-gray-50 shadow-2xl hover:shadow-3xl transition-all duration-300 border border-gray-200">
              <figure className="relative">
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-white flex items-center justify-center w-full overflow-hidden">
                  <img 
                    src={craft.image} 
                    alt={craft.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="absolute top-2 left-2 bg-black text-white px-3 py-1 rounded-full text-sm font-medium">
                  {craft.badge}
                </div>
                
                <div className="absolute top-4 right-4 flex space-x-2 opacity-0 hover:opacity-100 transition-opacity">
                  <button className="btn btn-sm btn-circle bg-white/80 border-none hover:bg-white">
                    <Heart className="h-4 w-4 text-black" />
                  </button>
                  <button className="btn btn-sm btn-circle bg-white/80 border-none hover:bg-white">
                    <Eye className="h-4 w-4 text-black" />
                  </button>
                </div>
              </figure>
              
              <div className="card-body">
                <h3 className="card-title text-black text-xl">{craft.name}</h3>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-3xl font-bold text-black">{craft.price}</span>
                  <div className="text-right text-sm text-gray-600">
                    <div>by {craft.artisan}</div>
                    <div>{craft.region}</div>
                  </div>
                </div>
                
                <div className="card-actions flex-col">
                  <button 
                    className="btn bg-black text-white hover:bg-gray-800 border-none w-full"
                    onClick={() => handleAddToCart(craft.id)}
                  >
                    Add to Cart
                  </button>
                  <button 
                    className="btn btn-outline border-black text-black hover:bg-black hover:text-white w-full"
                    onClick={() => setSelectedCraft(craft)}
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link to="/crafts" className="btn btn-lg btn-outline border-black text-black hover:bg-black hover:text-white px-8">
            View All Crafts
          </Link>
        </div>
      </div>
      
      {/* Modal */}
      {selectedCraft && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setSelectedCraft(null)}
          ></div>
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden">
                    <img 
                      src={selectedCraft.image} 
                      alt={selectedCraft.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button 
                    className="btn btn-ghost btn-circle"
                    onClick={() => setSelectedCraft(null)}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="mb-4">
                  <div className="badge bg-black text-white mb-2">{selectedCraft.badge}</div>
                  <h3 className="text-2xl font-bold text-black mb-2">{selectedCraft.name}</h3>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-3xl font-bold text-black">{selectedCraft.price}</span>
                    <div className="text-right text-sm text-gray-600">
                      <div>by {selectedCraft.artisan}</div>
                      <div>{selectedCraft.region}</div>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 leading-relaxed mb-6">
                  {selectedCraft.story}
                </p>
                
                <div className="flex space-x-3">
                  <button 
                    className="btn bg-black text-white hover:bg-gray-800 border-none flex-1"
                    onClick={() => handleAddToCart(selectedCraft.id)}
                  >
                    Add to Cart
                  </button>
                  <button className="btn btn-ghost btn-circle">
                    <Heart className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default CraftShowcase;