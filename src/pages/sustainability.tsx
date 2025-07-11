import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TreePine, 
  Recycle, 
  Leaf, 
  Award, 
  Users, 
  Heart, 
  Sprout, 
  Globe,
  CheckCircle,
  ArrowRight,
  Target,
  Shield
} from 'lucide-react';

const Sustainability: React.FC = () => {
  const commitments = [
    {
      icon: <TreePine className="h-6 w-6" />,
      title: 'Responsible Sourcing',
      description: 'We source wood only from sustainably managed forests and fallen trees, never contributing to deforestation.',
      color: 'bg-green-100 text-green-800'
    },
    {
      icon: <Recycle className="h-6 w-6" />,
      title: 'Zero Waste Crafting',
      description: 'Every piece of wood is utilized - from large sculptures to small decorative items, minimizing waste.',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      icon: <Sprout className="h-6 w-6" />,
      title: 'Reforestation Projects',
      description: 'For every tree used, we plant three new ones in partnership with local environmental organizations.',
      color: 'bg-amber-100 text-amber-800'
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Community Education',
      description: 'We train artisans in sustainable practices and forest conservation techniques.',
      color: 'bg-purple-100 text-purple-800'
    }
  ];

  const stats = [
    { number: '5,000+', label: 'Trees Planted', icon: <TreePine className="h-8 w-8" /> },
    { number: '15', label: 'Forest Reserves Protected', icon: <Shield className="h-8 w-8" /> },
    { number: '95%', label: 'Waste Reduction', icon: <Recycle className="h-8 w-8" /> },
    { number: '200+', label: 'Certified Artisans', icon: <Award className="h-8 w-8" /> }
  ];

  const practices = [
    {
      title: 'Selective Harvesting',
      description: 'We only harvest mature trees that are naturally dying or have fallen due to natural causes.',
      icon: <CheckCircle className="h-5 w-5 text-green-600" />
    },
    {
      title: 'Traditional Techniques',
      description: 'Hand-carving methods that require no electricity, reducing our carbon footprint.',
      icon: <CheckCircle className="h-5 w-5 text-green-600" />
    },
    {
      title: 'Natural Finishes',
      description: 'Using traditional oils and waxes instead of chemical treatments.',
      icon: <CheckCircle className="h-5 w-5 text-green-600" />
    },
    {
      title: 'Local Materials',
      description: 'Sourcing all materials within 50km radius to minimize transportation impact.',
      icon: <CheckCircle className="h-5 w-5 text-green-600" />
    }
  ];

  const goals = [
    {
      year: '2025',
      target: 'Plant 10,000 trees',
      status: 'In Progress',
      progress: '50%'
    },
    {
      year: '2026',
      target: 'Achieve carbon neutrality',
      status: 'Planning',
      progress: '25%'
    },
    {
      year: '2027',
      target: 'Zero waste production',
      status: 'Planning',
      progress: '15%'
    }
  ];

  return (
    <div className="min-h-screen bg-linen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full mb-4">
            <Leaf className="h-4 w-4" />
            <span className="text-sm font-medium">Our Environmental Commitment</span>
          </div>
          <h1 className="text-5xl font-bold text-black mb-4">
            Crafting for a 
            <span className="text-green-700"> Sustainable Future</span>
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Every piece we create honors both our cultural heritage and our responsibility to protect 
            the African forests that provide our materials.
          </p>
        </div>

        {/* Impact Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="border-gray-200 text-center bg-gradient-to-br from-white to-gray-50 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="text-green-600 mb-3 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-black mb-1">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Our Commitments */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-black text-center mb-8">Our Environmental Commitments</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {commitments.map((commitment, index) => (
              <Card key={index} className="border-gray-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${commitment.color.replace('text-', 'bg-').replace('-800', '-100')} flex-shrink-0`}>
                      {commitment.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-black mb-2">{commitment.title}</h3>
                      <p className="text-gray-700">{commitment.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sustainable Practices */}
        <div className="mb-16">
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-3xl font-bold text-black mb-6">Our Sustainable Practices</h2>
              <p className="text-gray-700 mb-6">
                We've developed a comprehensive approach to sustainable crafting that respects both our environment 
                and our traditions. Every step of our process is designed to minimize environmental impact while 
                maximizing the beauty and quality of our products.
              </p>
              <div className="space-y-4">
                {practices.map((practice, index) => (
                  <div key={index} className="flex items-start gap-3">
                    {practice.icon}
                    <div>
                      <h4 className="font-semibold text-black">{practice.title}</h4>
                      <p className="text-gray-600 text-sm">{practice.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <Card className="border-gray-200 bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-8">
                <div className="text-center">
                  <TreePine className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-black mb-4">Forest Partnership Program</h3>
                  <p className="text-gray-700 mb-6">
                    We work directly with forest communities to ensure sustainable harvesting practices 
                    and provide alternative income sources through our reforestation initiatives.
                  </p>
                  <Badge className="bg-green-600 hover:bg-green-700 text-white">
                    Certified Sustainable
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sustainability Goals */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-black text-center mb-8">Our Sustainability Goals</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {goals.map((goal, index) => (
              <Card key={index} className="border-gray-200">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="text-2xl font-bold text-black mb-1">{goal.year}</div>
                    <Badge variant="outline" className="border-green-600 text-green-600">
                      {goal.status}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-black text-lg mb-3">{goal.target}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">{goal.progress}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: goal.progress }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Impact Story */}
        <Card className="border-gray-200 mb-16 bg-gradient-to-r from-gray-50 to-green-50">
          <CardContent className="p-8">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-black mb-4">The Story Behind Each Piece</h2>
                <p className="text-gray-700 mb-4">
                  When you purchase one of our wooden crafts, you're not just buying a beautiful piece of art. 
                  You're supporting a cycle of sustainability that begins with responsible forest management 
                  and ends with new trees growing in African soil.
                </p>
                <p className="text-gray-700 mb-6">
                  Each artisan is trained in sustainable practices and becomes an ambassador for forest 
                  conservation in their community. Together, we're building a future where traditional 
                  craftsmanship and environmental stewardship go hand in hand.
                </p>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  Learn About Our Artisans
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
              <div className="text-center">
                <div className="bg-white rounded-lg p-6 shadow-lg">
                  <Globe className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-black mb-2">3:1 Ratio</div>
                  <p className="text-gray-700">
                    For every tree we use, we plant three new ones
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="border-gray-200 bg-gradient-to-r from-green-600 to-green-700 text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Join Our Sustainability Mission</h3>
            <p className="mb-6 max-w-2xl mx-auto opacity-90">
              Every purchase you make contributes to our reforestation efforts and supports 
              sustainable livelihoods for African artisans. Together, we can preserve our forests 
              and cultural heritage for future generations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-green-600 hover:bg-gray-100">
                Shop Sustainable Crafts
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                Download Our Impact Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default Sustainability;