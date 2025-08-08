import AppLayout from '@/components/AppLayout';
import Footer from '@/components/Footer';
import { Shield, RotateCcw, CreditCard, AlertTriangle, Clock, Package, CheckCircle, Mail } from 'lucide-react';

const ReturnRefundPolicy = () => {
  const policies = [
    {
      icon: RotateCcw,
      title: "Returns",
      color: "from-blue-50 to-indigo-100",
      border: "border-blue-200 hover:border-blue-400",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            You may return an item within <strong>14 days of delivery</strong> for a full refund or exchange, provided the item:
          </p>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              Is in its original condition (unused and undamaged)
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              Is returned in its original packaging
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              Is not a custom or personalized item (unless damaged or defective)
            </li>
          </ul>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <div className="flex items-start">
              <Mail className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-blue-800 font-medium">To start a return:</p>
                <p className="text-blue-700 text-sm mt-1">
                  Email us at <span className="font-medium">[your email]</span> with your order number and reason for return. 
                  We'll provide instructions for shipping the item back to us.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: CreditCard,
      title: "Refunds",
      color: "from-green-50 to-emerald-100",
      border: "border-green-200 hover:border-green-400",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            Once we receive and inspect your returned item, we'll notify you and process your refund to your 
            original payment method within <strong>5–7 business days</strong>.
          </p>
          <div className="flex items-center space-x-4 text-sm text-gray-600 bg-green-50 rounded-lg p-4">
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-green-600 mr-2" />
              Fast Processing
            </div>
            <div className="flex items-center">
              <Shield className="h-4 w-4 text-green-600 mr-2" />
              Secure Refunds
            </div>
          </div>
        </div>
      )
    },
    {
      icon: AlertTriangle,
      title: "Exceptions",
      color: "from-amber-50 to-orange-100",
      border: "border-amber-200 hover:border-amber-400",
      content: (
        <div className="space-y-4">
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Custom-made or personalized items</strong> cannot be returned or refunded, 
                unless they arrive damaged or with a manufacturing fault.
              </div>
            </li>
            <li className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Return shipping costs</strong> are the buyer's responsibility unless 
                the item is incorrect or arrives damaged.
              </div>
            </li>
          </ul>
        </div>
      )
    },
    {
      icon: Package,
      title: "Damaged or Incorrect Items",
      color: "from-red-50 to-rose-100",
      border: "border-red-200 hover:border-red-400",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            If your item arrives damaged or is not what you ordered, please contact us within 
            <strong> 48 hours of delivery</strong>, with clear photos. We'll arrange a replacement 
            or refund at no extra cost to you.
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-red-800 font-medium">Quick Action Required</p>
                <p className="text-red-700 text-sm mt-1">
                  Report issues within 48 hours with photos for fastest resolution
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
                <Shield className="h-12 w-12 text-blue-400 mr-4" />
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Return & Refund Policy
                </h1>
              </div>
              <p className="text-lg md:text-xl text-gray-300 mb-6 leading-relaxed">
                We want you to be completely happy with your purchase. If for any reason you're not satisfied, we're here to help.
              </p>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  14-Day Returns
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  Fast Refunds
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                  Customer First
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          {/* Policy Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {policies.map((policy, index) => {
              const IconComponent = policy.icon;
              
              return (
                <div 
                  key={index}
                  className={`group relative bg-gradient-to-br ${policy.color} rounded-2xl border-2 ${policy.border} transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] overflow-hidden`}
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
                          {policy.title}
                        </h3>
                        <div className="w-12 h-1 bg-black/20 rounded-full group-hover:w-16 transition-all duration-300 mt-2"></div>
                      </div>
                    </div>
                    
                    <div className="group-hover:text-gray-800 transition-colors">
                      {policy.content}
                    </div>
                  </div>
                  
                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              );
            })}
          </div>

          {/* Contact Section */}
          <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-12 border border-gray-200 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Need Help with Your Order?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our customer service team is here to assist you with returns, refunds, or any questions about your purchase.
              </p>
              
              <div className="flex flex-wrap justify-center gap-6 mb-8">
                <div className="bg-white rounded-lg px-6 py-4 border border-gray-200 shadow-sm flex items-center">
                  <Mail className="h-6 w-6 text-blue-600 mr-3" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Email Us</p>
                    <p className="text-sm text-gray-600">[your email]</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg px-6 py-4 border border-gray-200 shadow-sm flex items-center">
                  <Clock className="h-6 w-6 text-green-600 mr-3" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Response Time</p>
                    <p className="text-sm text-gray-600">Within 24 hours</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg px-6 py-4 border border-gray-200 shadow-sm flex items-center">
                  <Shield className="h-6 w-6 text-purple-600 mr-3" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Satisfaction</p>
                    <p className="text-sm text-gray-600">100% Guaranteed</p>
                  </div>
                </div>
              </div>

              <button className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-colors duration-300 font-medium">
                Contact Support
              </button>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
              <h3 className="font-bold text-blue-900 mb-2">Important Notice</h3>
              <p className="text-blue-800 text-sm">
                This policy applies to all orders placed through our website. For orders placed through third-party 
                platforms, please refer to their respective return policies. We reserve the right to update this 
                policy at any time, with changes taking effect immediately upon posting.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ReturnRefundPolicy;