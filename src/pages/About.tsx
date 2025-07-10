import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Users, Award, Leaf, Home, Globe, Sprout } from 'lucide-react';

const About: React.FC = () => {
  const values = [
    {
      icon: <Award className="h-5 w-5" />,
      label: 'Authenticity',
      color: 'bg-gray-100 text-black'
    },
    {
      icon: <Heart className="h-5 w-5" />,
      label: 'Quality',
      color: 'bg-gray-100 text-black'
    },
    {
      icon: <Users className="h-5 w-5" />,
      label: 'Community',
      color: 'bg-gray-100 text-black'
    },
    {
      icon: <Leaf className="h-5 w-5" />,
      label: 'Sustainability',
      color: 'bg-gray-100 text-black'
    }
  ];

  const stats = [
    { number: '200+', label: 'Artisans' },
    { number: '15', label: 'Regions' },
    { number: '2015', label: 'Founded' },
    { number: '10K+', label: 'Happy Customers' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">About Things From Africa</h1>
          <p className="text-gray-700">Preserving traditions, empowering artisans, and sharing the beauty of Africa with the world</p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, index) => (
            <Card key={index} className="border-gray-200 text-center">
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-black mb-1">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mission Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-3xl font-bold text-black mb-6">Our Mission</h2>
            <p className="text-gray-700 mb-4">
              We are dedicated to preserving Africa's rich cultural heritage through authentic handcrafted products. Our mission is to connect skilled artisans with global markets while maintaining the integrity of traditional craftsmanship.
            </p>
            <p className="text-gray-700 mb-6">
              Every purchase supports local communities and helps preserve centuries-old techniques passed down through generations.
            </p>
            <Button className="bg-black hover:bg-gray-800">
              Meet Our Artisans
            </Button>
          </div>
          
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-black mb-4">Our Values</h3>
              <div className="grid grid-cols-2 gap-3">
                {values.map((value, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className={`${value.color} flex items-center gap-2 justify-center py-2`}
                  >
                    {value.icon}
                    {value.label}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Story Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-black text-center mb-8">Our Story</h2>
          <Card className="border-gray-200">
            <CardContent className="p-8">
              <div className="space-y-6 text-gray-700">
                <p>
                  Founded in 2015, Malawi Crafts began as a small initiative to help local artisans reach international markets. What started as a passion project has grown into a thriving platform that showcases the incredible talent and creativity of Malawian craftspeople.
                </p>
                <p>
                  Today, we work with over 200 artisans across Malawi, from wood carvers in Lilongwe to basket weavers in the northern regions. Each piece tells a story of skill, tradition, and the vibrant culture of the "Warm Heart of Africa."
                </p>
                <p>
                  We believe that by sharing these beautiful crafts with the world, we're not just selling products – we're building bridges between cultures and creating sustainable livelihoods for talented artisans.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Impact Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4 flex justify-center">
                <Home className="h-12 w-12 text-black" />
              </div>
              <h3 className="font-bold text-black text-lg mb-2">Community Impact</h3>
              <p className="text-gray-700 text-sm">Supporting families and preserving traditional skills in rural communities across Africa.</p>
            </CardContent>
          </Card>

          <Card className="border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4 flex justify-center">
                <Globe className="h-12 w-12 text-black" />
              </div>
              <h3 className="font-bold text-black text-lg mb-2">Global Reach</h3>
              <p className="text-gray-700 text-sm">Connecting African artisans with customers worldwide, sharing our culture globally.</p>
            </CardContent>
          </Card>

          <Card className="border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4 flex justify-center">
                <Sprout className="h-12 w-12 text-black" />
              </div>
              <h3 className="font-bold text-black text-lg mb-2">Sustainable Future</h3>
              <p className="text-gray-700 text-sm">Creating lasting economic opportunities while respecting our environment and traditions.</p>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <Card className="border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-black mb-4">Join Our Journey</h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Become part of our story by supporting authentic African craftsmanship. Every purchase makes a difference in preserving our cultural heritage and supporting artisan communities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-black hover:bg-gray-800">
                Shop Our Crafts
              </Button>
              <Button variant="outline" className="border-black text-black hover:bg-black hover:text-white">
                Learn More
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;