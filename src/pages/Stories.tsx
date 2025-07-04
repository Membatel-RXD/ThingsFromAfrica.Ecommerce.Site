import React from 'react';
import AppLayout from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, User } from 'lucide-react';

const Stories: React.FC = () => {
  const stories = [
    {
      title: "The Master Carver of Lilongwe",
      author: "James Banda",
      date: "March 15, 2024",
      location: "Lilongwe",
      category: "Wood Carving",
      excerpt: "Meet Chisomo, a third-generation wood carver whose intricate sculptures tell the stories of Malawi's wildlife and culture.",
      content: "In the bustling markets of Lilongwe, Chisomo's workshop stands as a testament to generations of craftsmanship. His grandfather taught him to see the spirit within each piece of wood, and today, his carvings of elephants, lions, and traditional masks capture the essence of Malawi's rich heritage.",
      image: "/placeholder.svg"
    },
    {
      title: "Weaving Dreams by Lake Malawi",
      author: "Grace Phiri",
      date: "March 10, 2024",
      location: "Mangochi",
      category: "Basket Weaving",
      excerpt: "The women of Mangochi create stunning baskets that reflect the colors and patterns of Lake Malawi's shores.",
      content: "Every morning, as the sun rises over Lake Malawi, the women of Mangochi gather to weave baskets using grasses that grow along the shoreline. Each basket tells a story of community, tradition, and the natural beauty that surrounds their daily lives.",
      image: "/placeholder.svg"
    },
    {
      title: "Clay and Fire: Ancient Pottery Traditions",
      author: "Peter Mwale",
      date: "March 5, 2024",
      location: "Blantyre",
      category: "Pottery",
      excerpt: "In the Shire Valley, potters continue to use techniques that have remained unchanged for centuries.",
      content: "The clay from the Shire Valley has been shaped by skilled hands for over 500 years. Today's potters honor their ancestors by maintaining traditional firing methods and creating vessels that are both functional and beautiful, each one unique in its imperfections.",
      image: "/placeholder.svg"
    },
    {
      title: "Threads of Tradition",
      author: "Mary Tembo",
      date: "February 28, 2024",
      location: "Mzuzu",
      category: "Textiles",
      excerpt: "Traditional Malawian textiles come alive through the skilled hands of weavers who preserve ancient patterns.",
      content: "In the northern city of Mzuzu, textile artists work on traditional looms, creating fabrics that have adorned Malawian people for generations. Each pattern has meaning, telling stories of harvests, celebrations, and the changing seasons.",
      image: "/placeholder.svg"
    },
    {
      title: "Music in Wood and Metal",
      author: "Samuel Kachingwe",
      date: "February 20, 2024",
      location: "Zomba",
      category: "Musical Instruments",
      excerpt: "The ancient art of instrument making keeps Malawi's musical heritage alive through skilled craftsmen.",
      content: "In Zomba, instrument makers craft traditional drums, kalimbas, and flutes that have provided the soundtrack to Malawian life for centuries. Each instrument is tuned not just for sound, but for the soul of Malawian music.",
      image: "/placeholder.svg"
    },
    {
      title: "Beads of Heritage",
      author: "Esther Nyirenda",
      date: "February 15, 2024",
      location: "Kasungu",
      category: "Jewelry",
      excerpt: "Traditional jewelry makers incorporate local materials to create pieces that celebrate Malawian identity.",
      content: "Using seeds from the baobab tree, stones from Lake Malawi's shores, and metals traded for generations, jewelry makers in Kasungu create pieces that connect the wearer to the land and its people. Each necklace, bracelet, and earring carries the spirit of Malawi.",
      image: "/placeholder.svg"
    }
  ];

  return (
    <AppLayout>
      <div className="bg-linen min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-burnt-sienna to-indigo-accent text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Stories</h1>
            <p className="text-xl max-w-3xl mx-auto">Discover the people, traditions, and heritage behind every handcrafted piece</p>
          </div>
        </section>

        {/* Stories Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {stories.map((story, index) => (
                <Card key={index} className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="aspect-video bg-olive-green/10 rounded-t-lg flex items-center justify-center">
                    <img 
                      src={story.image} 
                      alt={story.title}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="bg-burnt-sienna/10 text-burnt-sienna">
                        {story.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl text-charcoal line-clamp-2">{story.title}</CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-charcoal/60">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{story.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{story.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-olive-green">
                      <MapPin className="h-3 w-3" />
                      <span>{story.location}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-charcoal/80 mb-4">{story.excerpt}</p>
                    <p className="text-sm text-charcoal/70 line-clamp-3">{story.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-charcoal mb-6">Share Your Story</h2>
            <p className="text-lg text-charcoal/80 max-w-2xl mx-auto mb-8">
              Do you have a story about Malawian crafts or culture? We'd love to hear from you and share your experiences with our community.
            </p>
            <a 
              href="/contact" 
              className="inline-block bg-burnt-sienna text-white px-8 py-3 rounded-lg hover:bg-burnt-sienna/90 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </section>
      </div>
    </AppLayout>
  );
};

export default Stories;