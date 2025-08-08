import AppLayout from '@/components/AppLayout';
import { TreePine, Recycle, Users, Leaf, CheckCircle, Award, Shield, Heart } from 'lucide-react';

const Sustainability = () => {
  const commitments = [
    {
      icon: Recycle,
      title: "Waste Reduction",
      color: "from-blue-50 to-indigo-100",
      border: "border-blue-200 hover:border-blue-400",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            We minimize environmental impact by maximizing material efficiency in every step of our process.
          </p>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              Using wood offcuts and reclaimed timber whenever possible
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              Repurposing leftover materials to reduce waste
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              Training artisans in minimal waste production techniques
            </li>
          </ul>
        </div>
      )
    },
    {
      icon: TreePine,
      title: "Responsible Sourcing",
      color: "from-green-50 to-emerald-100",
      border: "border-green-200 hover:border-green-400",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            We work directly with communities to ensure ethical harvesting practices that respect both nature and tradition.
          </p>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              Partnering with communities who own trees
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              Promoting responsible harvesting methods
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              Supporting sustainable forest management
            </li>
          </ul>
        </div>
      )
    },
    {
      icon: Users,
      title: "Community Education",
      color: "from-amber-50 to-orange-100",
      border: "border-amber-200 hover:border-amber-400",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            Education is key to lasting change. We invest in training and awareness programs throughout our supply chain.
          </p>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              Training artisans in sustainable practices
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              Educating suppliers on forest conservation
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              Building awareness about sustainability importance
            </li>
          </ul>
        </div>
      )
    },
    {
      icon: Heart,
      title: "People & Planet",
      color: "from-red-50 to-rose-100",
      border: "border-red-200 hover:border-red-400",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            True sustainability means protecting both our environment and empowering the people who create our products.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start">
              <Heart className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-green-800 font-medium">Our Impact</p>
                <p className="text-green-700 text-sm mt-1">
                  Every purchase supports ethical craftsmanship, rural livelihoods, and conscious design
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <AppLayout>
    <div className="bg-[#F8F4EF] min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white py-12 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'2\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <Leaf className="h-12 w-12 text-green-400 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Our Commitment to Sustainability
              </h1>
            </div>
            <p className="text-lg md:text-xl text-gray-300 mb-6 leading-relaxed">
              We create high-quality wooden products while minimizing our environmental impact through ethical, thoughtful practices that balance tradition with responsibility.
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Waste Reduction
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                Ethical Sourcing
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                Community Support
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Sustainability Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {commitments.map((commitment, index) => {
            const IconComponent = commitment.icon;
            
            return (
              <div 
                key={index}
                className={`group relative bg-gradient-to-br ${commitment.color} rounded-2xl border-2 ${commitment.border} transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] overflow-hidden`}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-4 right-4 transform rotate-12 group-hover:rotate-45 transition-transform duration-700">
                    <IconComponent className="h-16 w-16 text-gray-400" />
                  </div>
                  <div className="absolute bottom-4 left-4 w-20 h-20 bg-white/20 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                </div>
                
                {/* Content */}
                <div className="relative z-10 p-8">
                  <div className="flex items-center mb-6">
                    <div className="mr-4 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="h-10 w-10 text-gray-700" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors">
                        {commitment.title}
                      </h3>
                      <div className="w-12 h-1 bg-black/20 rounded-full group-hover:w-16 transition-all duration-300 mt-2"></div>
                    </div>
                  </div>
                  
                  <div className="group-hover:text-gray-800 transition-colors">
                    {commitment.content}
                  </div>
                </div>
                
                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            );
          })}
        </div>

        {/* Mission Statement */}
        <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-12 border border-gray-200 text-center mb-16">
          <div className="max-w-4xl mx-auto">
            <TreePine className="h-16 w-16 text-green-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Balancing Tradition with Environmental Responsibility
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              While some of the wood we use is slow-growing hardwood, we take conscious steps to reduce harm and 
              promote long-term sustainability. Our handcrafted chessboards and wooden products are made using 
              ethical practices that honor both our craft traditions and our planet.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg px-6 py-4 border border-gray-200 shadow-sm flex items-center">
                <Recycle className="h-6 w-6 text-blue-600 mr-3" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Waste Minimization</p>
                  <p className="text-sm text-gray-600">Maximum material efficiency</p>
                </div>
              </div>
              <div className="bg-white rounded-lg px-6 py-4 border border-gray-200 shadow-sm flex items-center">
                <Users className="h-6 w-6 text-green-600 mr-3" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Community Partnership</p>
                  <p className="text-sm text-gray-600">Direct collaboration</p>
                </div>
              </div>
              <div className="bg-white rounded-lg px-6 py-4 border border-gray-200 shadow-sm flex items-center">
                <Award className="h-6 w-6 text-purple-600 mr-3" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Ethical Craftsmanship</p>
                  <p className="text-sm text-gray-600">Quality with conscience</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Impact Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl p-12 text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold mb-4">Making a Meaningful Impact</h3>
            <p className="text-lg mb-8 opacity-90 leading-relaxed">
              We believe that true sustainability is about protecting the environment and empowering people. 
              Every purchase supports ethical craftsmanship, rural livelihoods, and a growing movement 
              toward conscious, meaningful design.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <Shield className="h-8 w-8 mx-auto mb-3 text-green-200" />
                <div className="text-2xl font-bold mb-1">Ethical</div>
                <p className="text-sm opacity-90">Responsible sourcing practices</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <Heart className="h-8 w-8 mx-auto mb-3 text-green-200" />
                <div className="text-2xl font-bold mb-1">Empowering</div>
                <p className="text-sm opacity-90">Supporting rural communities</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <TreePine className="h-8 w-8 mx-auto mb-3 text-green-200" />
                <div className="text-2xl font-bold mb-1">Sustainable</div>
                <p className="text-sm opacity-90">Long-term forest conservation</p>
              </div>
            </div>

            <button className="bg-white text-green-600 px-8 py-3 rounded-full hover:bg-gray-100 transition-colors duration-300 font-medium">
              Shop Our Sustainable Collection
            </button>
          </div>
        </div>
      </div>
    </div>
    </AppLayout>

  );
};

export default Sustainability;