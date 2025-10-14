// pages/dashboard/cmDashboard.jsx
import React from "react";
import { ArrowRight, Search, CreditCard } from "lucide-react";

// Import images directly
import poster1 from "../../assets/images/cards/poster1.png";
import poster2 from "../../assets/images/cards/poster2.png";
import poster3 from "../../assets/images/cards/poster3.png";

const CmDashboard = () => {
  const posters = [
    {
      image: poster1,
      title: "Ship Your Cargo With Us",
      description: "Reliable freight solutions for all your shipping needs",
      icon: <ArrowRight className="w-4 h-4" />
    },
    {
      image: poster2,
      title: "Track Your Orders",
      description: "Search HWB# or Booking# to monitor your shipments",
      icon: <Search className="w-4 h-4" />
    },
    {
      image: poster3,
      title: "Pay with PayMongo",
      description: "Secure and convenient online payments",
      icon: <CreditCard className="w-4 h-4" />
    }
  ];

  return (
    <div className="space-y-8">
      {/* Exciting News Section */}
      <div>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Services & Features
          </h2>
          <p className="text-gray-600">
            Everything you need for seamless freight management
          </p>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="max-w-6xl mx-auto">
          <div className="flex overflow-x-auto pb-6 gap-6 px-4 scrollbar-hide">
            {posters.map((poster, index) => (
              <div 
                key={index}
                className="flex-none w-80 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 hover:border-blue-300"
              >
                <div className="aspect-square bg-gray-50">
                  <img
                    src={poster.image}
                    alt={poster.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-800 text-lg">
                      {poster.title}
                    </h3>
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                      {poster.icon}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {poster.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Scroll Hint */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-500">
              Scroll horizontally to see more ›
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats - Simplified */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 text-center border border-blue-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Why Choose Us?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-1">Easy Payments</h4>
              <p className="text-sm text-gray-600">Multiple payment options</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-1">Real-time Tracking</h4>
              <p className="text-sm text-gray-600">Monitor your shipments</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <ArrowRight className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-1">Fast Delivery</h4>
              <p className="text-sm text-gray-600">Reliable shipping times</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CmDashboard;