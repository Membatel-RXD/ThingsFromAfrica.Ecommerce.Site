import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Heart, 
  GraduationCap, 
  Home, 
  Shield, 
  HandHeart,
  BookOpen,
  Building,
  Stethoscope,
  Globe,
  Award,
  Target,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  DollarSign,
  Briefcase,
  Baby
} from 'lucide-react';

const CSR: React.FC = () => {
  const initiatives = [
    {
      icon: <GraduationCap className="h-6 w-6" />,
      title: 'Education & Skills Development',
      description: 'Providing vocational training, literacy programs, and apprenticeships to empower local communities.',
      impact: '500+ people trained',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      icon: <Stethoscope className="h-6 w-6" />,
      title: 'Healthcare Support',
      description: 'Supporting community health centers and providing medical assistance to artisan families.',
      impact: '1,200+ lives improved',
      color: 'bg-red-100 text-red-800'
    },
    {
      icon: <Baby className="h-6 w-6" />,
      title: 'Child Welfare Programs',
      description: 'Supporting orphanages, school feeding programs, and educational scholarships for children.',
      impact: '300+ children supported',
      color: 'bg-purple-100 text-purple-800'
    },
    {
      icon: <Home className="h-6 w-6" />,
      title: 'Community Infrastructure',
      description: 'Building wells, improving roads, and supporting community centers in artisan villages.',
      impact: '25+ projects completed',
      color: 'bg-green-100 text-green-800'
    }
  ];

  const stats = [
    { number: '200+', label: 'Artisan Families Supported', icon: <Users className="h-8 w-8" /> },
    { number: '15', label: 'Communities Reached', icon: <Globe className="h-8 w-8" /> },
    { number: '$500K+', label: 'Community Investment', icon: <DollarSign className="h-8 w-8" /> },
    { number: '95%', label: 'Fair Trade Practices', icon: <Shield className="h-8 w-8" /> }
  ];

  const programs = [
    {
      title: 'Artisan Empowerment Program',
      description: 'Providing fair wages, skills training, and business development support to local craftspeople.',
      beneficiaries: '200+ artisans',
      established: '2015',
      features: [
        'Fair wage guarantee (150% above local minimum)',
        'Health insurance coverage',
        'Skills development workshops',
        'Business mentorship'
      ]
    },
    {
      title: 'Women\'s Economic Empowerment',
      description: 'Supporting female artisans through leadership training, microfinance, and cooperative formation.',
      beneficiaries: '120+ women',
      established: '2017',
      features: [
        'Leadership development programs',
        'Microfinance access',
        'Childcare support',
        'Market access facilitation'
      ]
    },
    {
      title: 'Youth Development Initiative',
      description: 'Engaging young people in traditional crafts while providing modern business skills.',
      beneficiaries: '80+ youth',
      established: '2019',
      features: [
        'Apprenticeship programs',
        'Digital literacy training',
        'Entrepreneurship workshops',
        'Cultural preservation education'
      ]
    }
  ];

  const partnerships = [
    {
      name: 'Local NGOs',
      description: 'Collaborating with grassroots organizations for community development',
      icon: <HandHeart className="h-6 w-6" />
    },
    {
      name: 'Educational Institutions',
      description: 'Supporting schools and vocational training centers',
      icon: <BookOpen className="h-6 w-6" />
    },
    {
      name: 'Government Agencies',
      description: 'Working with local authorities on infrastructure projects',
      icon: <Building className="h-6 w-6" />
    },
    {
      name: 'International Organizations',
      description: 'Partnering with global NGOs for sustainable development',
      icon: <Globe className="h-6 w-6" />
    }
  ];

  const goals = [
    {
      year: '2025',
      target: 'Support 300 artisan families',
      progress: '67%',
      status: 'On Track'
    },
    {
      year: '2026',
      target: 'Establish 5 new training centers',
      progress: '40%',
      status: 'In Progress'
    },
    {
      year: '2027',
      target: 'Achieve 100% fair trade certification',
      progress: '85%',
      status: 'Nearly Complete'
    }
  ];

  return (
    <div className="min-h-screen bg-linen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full mb-4">
            <Heart className="h-4 w-4" />
            <span className="text-sm font-medium">Corporate Social Responsibility</span>
          </div>
          <h1 className="text-5xl font-bold text-black mb-4">
            Empowering Communities,
            <span className="text-blue-700"> Transforming Lives</span>
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Our commitment goes beyond creating beautiful crafts. We're building stronger communities, 
            empowering artisans, and creating lasting positive change across Africa.
          </p>
        </div>

        {/* Impact Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="border-gray-200 text-center bg-gradient-to-br from-white to-blue-50 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="text-blue-600 mb-3 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-black mb-1">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Our Initiatives */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-black text-center mb-8">Our Social Impact Initiatives</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {initiatives.map((initiative, index) => (
              <Card key={index} className="border-gray-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${initiative.color.replace('text-', 'bg-').replace('-800', '-100')} flex-shrink-0`}>
                      {initiative.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-black mb-2">{initiative.title}</h3>
                      <p className="text-gray-700 mb-3">{initiative.description}</p>
                      <Badge className={`${initiative.color} text-xs`}>
                        {initiative.impact}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Main Programs */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-black text-center mb-8">Our Flagship Programs</h2>
          <div className="space-y-6">
            {programs.map((program, index) => (
              <Card key={index} className="border-gray-200">
                <CardContent className="p-8">
                  <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <div className="flex items-center gap-3 mb-4">
                        <h3 className="text-2xl font-bold text-black">{program.title}</h3>
                        <Badge variant="outline" className="border-blue-600 text-blue-600">
                          Est. {program.established}
                        </Badge>
                      </div>
                      <p className="text-gray-700 mb-4">{program.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-blue-600" />
                          <span className="font-medium">{program.beneficiaries}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <span className="text-green-600 font-medium">Growing Impact</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-black mb-3">Key Features:</h4>
                      <ul className="space-y-2">
                        {program.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Partnerships */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-black text-center mb-8">Our Strategic Partnerships</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {partnerships.map((partner, index) => (
              <Card key={index} className="border-gray-200 text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="text-blue-600 mb-4 flex justify-center">
                    {partner.icon}
                  </div>
                  <h3 className="font-bold text-black mb-2">{partner.name}</h3>
                  <p className="text-gray-700 text-sm">{partner.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Fair Trade Commitment */}
        <Card className="border-gray-200 mb-16 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-8">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-black mb-4">Fair Trade & Ethical Practices</h2>
                <p className="text-gray-700 mb-4">
                  We believe in fair compensation and ethical treatment of all our artisans. Our commitment 
                  to fair trade principles ensures that traditional craftspeople receive fair wages and work 
                  in safe, respectful conditions.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Wages 150% above local minimum</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Healthcare coverage for artisan families</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Safe working conditions guaranteed</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Transparent pricing and profit sharing</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white rounded-lg p-6 shadow-lg">
                  <Shield className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-black mb-2">95%</div>
                  <p className="text-gray-700 mb-4">Fair Trade Certified Products</p>
                  <Badge className="bg-blue-600 hover:bg-blue-700 text-white">
                    Verified Ethical Sourcing
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CSR Goals */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-black text-center mb-8">Our Social Impact Goals</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {goals.map((goal, index) => (
              <Card key={index} className="border-gray-200">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="text-2xl font-bold text-black mb-1">{goal.year}</div>
                    <Badge variant="outline" className="border-blue-600 text-blue-600">
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
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: goal.progress }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Success Story */}
        <Card className="border-gray-200 mb-16 bg-gradient-to-r from-gray-50 to-blue-50">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <Award className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-black mb-4">Success Story: Mary's Cooperative</h2>
              <p className="text-gray-700 max-w-3xl mx-auto">
                In 2018, we supported Mary Banda in forming a women's basketry cooperative in rural Malawi. 
                Starting with just 5 women, the cooperative now employs 25 female artisans, has built a community 
                workshop, and provides healthcare benefits to all members' families. Mary's story represents the 
                transformative power of ethical business practices and community-centered development.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="bg-white rounded-lg p-4">
                <div className="text-2xl font-bold text-black mb-1">25</div>
                <div className="text-sm text-gray-600">Women Employed</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-2xl font-bold text-black mb-1">$15K</div>
                <div className="text-sm text-gray-600">Annual Income Increase</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-2xl font-bold text-black mb-1">80+</div>
                <div className="text-sm text-gray-600">Family Members Benefited</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Partner with Us for Social Impact</h3>
            <p className="mb-6 max-w-2xl mx-auto opacity-90">
              Every purchase you make contributes to our social impact programs. Join us in creating 
              sustainable livelihoods, empowering communities, and preserving African cultural heritage 
              for future generations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-blue-600 hover:bg-gray-100">
                Support Our Mission
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Download CSR Report
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default CSR;