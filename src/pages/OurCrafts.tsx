import React from 'react';
import AppLayout from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const OurCrafts: React.FC = () => {
  const craftCategories = [
    {
      title: "Wood Carvings",
      description: "Intricate sculptures and functional items carved from indigenous Malawian hardwoods like mahogany and ebony.",
      techniques: ["Hand carving", "Traditional tools", "Natural finishing"],
      origins: "Central and Northern Malawi",
      image: "/placeholder.svg"
    },
    {
      title: "Basket Weaving",
      description: "Beautiful baskets woven from local grasses and palm leaves, each with unique patterns passed down through generations.",
      techniques: ["Coil weaving", "Natural dyes", "Traditional patterns"],
      origins: "Lake Malawi regions",
      image: "/placeholder.svg"
    },
    {
      title: "Pottery",
      description: "Handcrafted ceramics using traditional clay from the Shire Valley, shaped and fired using ancient techniques.",
      techniques: ["Hand throwing", "Natural glazes", "Wood firing"],
      origins: "Southern Malawi",
      image: "/placeholder.svg"
    },
    {
      title: "Textiles",
      description: "Vibrant fabrics and clothing featuring traditional Malawian patterns and colors, woven on traditional looms.",
      techniques: ["Hand weaving", "Natural dyes", "Block printing"],
      origins: "Throughout Malawi",
      image: "/placeholder.svg"
    },
    {
      title: "Jewelry",
      description: "Unique jewelry pieces incorporating local materials like seeds, stones, and metals with traditional designs.",
      techniques: ["Wire wrapping", "Bead work", "Metal smithing"],
      origins: "Urban centers",
      image: "/placeholder.svg"
    },
    {
      title: "Musical Instruments",
      description: "Traditional instruments like drums, thumb pianos (kalimba), and flutes crafted by skilled instrument makers.",
      techniques: ["Skin stretching", "Wood shaping", "Metal tuning"],
      origins: "Cultural centers",
      image: "/placeholder.svg"
    }
  ];

  return (
    <AppLayout>
      <div className="bg-linen min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-indigo-accent to-olive-green text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Our Crafts</h1>
            <p className="text-xl max-w-3xl mx-auto">Discover the rich tradition of Malawian craftsmanship through our diverse collection of handmade treasures</p>
          </div>
        </section>

        {/* Crafts Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {craftCategories.map((craft, index) => (
                <Card key={index} className="h-full hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-olive-green/10 rounded-t-lg flex items-center justify-center">
                    <img 
                      src={craft.image} 
                      alt={craft.title}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl text-charcoal">{craft.title}</CardTitle>
                    <Badge variant="secondary" className="w-fit bg-burnt-sienna/10 text-burnt-sienna">
                      {craft.origins}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-charcoal/80 mb-4">{craft.description}</p>
                    <div>
                      <h4 className="font-semibold text-charcoal mb-2">Traditional Techniques:</h4>
                      <div className="flex flex-wrap gap-2">
                        {craft.techniques.map((technique, techIndex) => (
                          <Badge key={techIndex} variant="outline" className="text-xs">
                            {technique}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Heritage Section */}
        <section className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-charcoal mb-8">Preserving Cultural Heritage</h2>
              <p className="text-lg text-charcoal/80 mb-6">
                Each craft represents centuries of cultural heritage, with techniques and patterns passed down through generations of skilled artisans. Our craftspeople are the guardians of these traditions, ensuring that the beauty and wisdom of Malawian culture continues to thrive.
              </p>
              <p className="text-lg text-charcoal/80">
                When you purchase our crafts, you're not just buying a product – you're supporting the preservation of these invaluable cultural traditions and helping artisans maintain their livelihoods while sharing their heritage with the world.
              </p>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
};

export default OurCrafts;