import React from 'react';
import { Heart, Eye } from 'lucide-react';

const CraftShowcase: React.FC = () => {
  const crafts = [
    {
      id: 1,
      name: 'Traditional African Basket',
      price: '$45',
      artisan: 'Grace Mwale',
      region: 'Lilongwe',
      story: 'Woven from locally sourced palm leaves, this basket represents generations of African weaving tradition.',
      emoji: '🧺',
      badge: 'Bestseller'
    },
    {
      id: 2,
      name: 'Hand-carved Wooden Mask',
      price: '$85',
      artisan: 'Joseph Banda',
      region: 'Blantyre',
      story: 'Each mask tells the story of African ancestors, carved with traditional tools passed down through families.',
      emoji: '🎭',
      badge: 'Heritage'
    },
    {
      id: 3,
      name: 'Traditional Fabric Art',
      price: '$35',
      artisan: 'Mary Phiri',
      region: 'Mzuzu',
      story: 'Vibrant patterns that celebrate African culture and the beauty of traditional textile art.',
      emoji: '🎨',
      badge: 'New'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-4 text-black">
            Featured Crafts
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Each piece comes with the story of its creator, connecting you to the heart of African culture
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {crafts.map((craft) => (
            <div key={craft.id} className="card bg-gradient-to-br from-white to-gray-50 shadow-2xl hover:shadow-3xl transition-all duration-300 border border-gray-200">
              <figure className="relative">
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-white flex items-center justify-center w-full">
                  <span className="text-8xl">{craft.emoji}</span>
                </div>
                
                <div className="badge badge-lg absolute top-4 left-4 bg-black text-white border-none">
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
                
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  {craft.story}
                </p>
                
                <div className="card-actions justify-end">
                  <button className="btn bg-black text-white hover:bg-gray-800 border-none flex-1">
                    Add to Cart
                  </button>
                  <button className="btn btn-outline border-black text-black hover:bg-black hover:text-white">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="btn btn-lg btn-outline border-black text-black hover:bg-black hover:text-white px-8">
            View All Crafts
          </button>
        </div>
      </div>
    </section>
  );
};

export default CraftShowcase;