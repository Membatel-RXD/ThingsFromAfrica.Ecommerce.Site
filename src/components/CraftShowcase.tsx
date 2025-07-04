import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Eye } from 'lucide-react';

const CraftShowcase: React.FC = () => {
  const crafts = [
    {
      id: 1,
      name: 'Traditional Malawi Basket',
      price: '$45',
      artisan: 'Grace Mwale',
      region: 'Lilongwe',
      story: 'Woven from locally sourced palm leaves, this basket represents generations of Malawian weaving tradition.',
      emoji: '🧺',
      badge: 'Bestseller'
    },
    {
      id: 2,
      name: 'Hand-carved Wooden Mask',
      price: '$85',
      artisan: 'Joseph Banda',
      region: 'Blantyre',
      story: 'Each mask tells the story of Malawian ancestors, carved with traditional tools passed down through families.',
      emoji: '🎭',
      badge: 'Heritage'
    },
    {
      id: 3,
      name: 'Chitenge Fabric Art',
      price: '$35',
      artisan: 'Mary Phiri',
      region: 'Mzuzu',
      story: 'Vibrant chitenge patterns that celebrate Malawian culture and the beauty of African textile art.',
      emoji: '🎨',
      badge: 'New'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-charcoal mb-4">
            Featured <span className="text-burnt-sienna">Crafts</span>
          </h2>
          <p className="text-xl text-charcoal/70 max-w-2xl mx-auto">
            Each piece comes with the story of its creator, connecting you to the heart of Malawian culture
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {crafts.map((craft) => (
            <Card key={craft.id} className="group hover:shadow-xl transition-all duration-300 border-olive-green/20 overflow-hidden">
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-linen to-olive-green/10 flex items-center justify-center">
                  <span className="text-8xl">{craft.emoji}</span>
                </div>
                
                <Badge className="absolute top-4 left-4 bg-burnt-sienna text-white">
                  {craft.badge}
                </Badge>
                
                <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="sm" variant="secondary" className="p-2">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="secondary" className="p-2">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-charcoal mb-2">{craft.name}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-burnt-sienna">{craft.price}</span>
                      <div className="text-right text-sm text-olive-green">
                        <div>by {craft.artisan}</div>
                        <div>{craft.region}</div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-charcoal/70 text-sm leading-relaxed">
                    {craft.story}
                  </p>
                  
                  <div className="flex space-x-2">
                    <Button className="flex-1 bg-burnt-sienna hover:bg-burnt-sienna/90">
                      Add to Cart
                    </Button>
                    <Button variant="outline" className="border-olive-green text-olive-green hover:bg-olive-green hover:text-white">
                      Learn More
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button 
            size="lg" 
            variant="outline" 
            className="border-burnt-sienna text-burnt-sienna hover:bg-burnt-sienna hover:text-white px-8"
          >
            View All Crafts
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CraftShowcase;