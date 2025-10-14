import React from "react";
import { Link } from "react-router-dom";
import {
    Truck,
    UserPlus,
    ClipboardList,
    Eye,
    ArrowRight,
    ShieldCheck,
    Clock,
    DollarSign,
    MessageSquare,
    CheckCircle
} from "lucide-react";

// Import images directly
import poster1 from "../../assets/images/cards/poster1.png";
import poster2 from "../../assets/images/cards/poster2.png";
import poster3 from "../../assets/images/cards/poster3.png";

const Home = () => {
    const posters = [
        {
            image: poster1,
            title: "Ship Your Cargo With Us",
            description: "Reliable freight solutions for all your shipping needs"
        },
        {
            image: poster2,
            title: "Track Your Orders",
            description: "Search HWB# or Booking# to monitor your shipments"
        },
        {
            image: poster3,
            title: "Pay with PayMongo",
            description: "Secure and convenient online payments"
        }
    ];

    return (
        <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center text-center px-4 font-[Poppins]">
            {/* ✅ Fixed Background Grid */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"></div>

            <div className="flex flex-col h-auto">
                {/* Hero Section */}
                <section
                    id="home"
                    className="min-h-screen flex flex-col justify-center items-center py-12 md:py-24"
                >
                    <div className="container mx-auto px-8 md:px-8">
                        <h1 className="heading">
                            Need Help with Your{" "}
                            <span className="gradient">Freight Forwarding</span>{" "}
                            Needs?
                        </h1>
                        <p className="subheading">
                            We've got your freight forwarding needs covered.
                            Create an account to experience our reliable and
                            efficient logistics services.
                        </p>
                        <Link to="/register" className="btn-primary font-bold">
                            Get Started{" "}
                            <ArrowRight className="h-6 w-6 text-white" />
                        </Link>
                    </div>
                </section>

                {/* Posters Section - Replacing How It Works */}
                <section
                    id="services"
                    className="min-h-screen w-screen flex flex-col items-center justify-center gradient-bg px-12 py-20"
                >
                    <div className="container text-white mx-auto px-8 md:px-8">
                        <div className="text-center mb-16">
                            <h1 className="heading text-white mb-6">
                                Our Services
                            </h1>
                            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
                                Discover our comprehensive freight solutions designed to simplify your shipping experience
                            </p>
                        </div>

                        {/* Posters Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {posters.map((poster, index) => (
                                <div 
                                    key={index}
                                    className="bg-white rounded-xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300"
                                >
                                    <div className="aspect-square bg-gray-50">
                                        <img
                                            src={poster.image}
                                            alt={poster.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-black text-xl font-bold mb-3">
                                            {poster.title}
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            {poster.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Why Choose Us Section */}
                <section
                    id="why-choose-us"
                    className="min-h-screen w-screen flex flex-col items-center justify-center px-12 py-20"
                >
                    <div className="container mx-auto px-8 md:px-8">
                        <div className="text-center mb-16">
                            <h1 className="heading mb-6">Why Choose Us?</h1>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                We deliver excellence in freight forwarding with
                                unmatched reliability, competitive rates, and
                                world-class customer service.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            <div className="bg-white text-center p-6 rounded-lg hover:shadow-lg transition-all duration-300">
                                <div className="flex justify-center mb-4">
                                    <ShieldCheck className="h-12 w-12 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-4">
                                    Reliable & Secure
                                </h3>
                                <p className="text-gray-600">
                                    Our logistics services are designed to be
                                    reliable and secure, ensuring that your
                                    shipments arrive safely and on time, every
                                    time.
                                </p>
                            </div>

                            <div className="bg-white text-center p-6 rounded-lg hover:shadow-lg transition-all duration-300">
                                <div className="flex justify-center mb-4">
                                    <DollarSign className="h-12 w-12 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-4">
                                    Competitive Pricing
                                </h3>
                                <p className="text-gray-600">
                                    We offer transparent, competitive pricing
                                    for our logistics services, ensuring you get
                                    the best value without hidden fees or
                                    surprises.
                                </p>
                            </div>

                            <div className="bg-white text-center p-6 rounded-lg hover:shadow-lg transition-all duration-300">
                                <div className="flex justify-center mb-4">
                                    <MessageSquare className="h-12 w-12 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-4">
                                    24/7 Customer Support
                                </h3>
                                <p className="text-gray-600">
                                    Our dedicated customer support team is
                                    available around the clock to assist you
                                    with any questions, concerns, or urgent
                                    requests.
                                </p>
                            </div>

                            <div className="bg-white text-center p-6 rounded-lg hover:shadow-lg transition-all duration-300">
                                <div className="flex justify-center mb-4">
                                    <Clock className="h-12 w-12 text-orange-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-4">
                                    Fast Processing
                                </h3>
                                <p className="text-gray-600">
                                    Quick turnaround times for quotes, bookings,
                                    and documentation. We prioritize efficiency
                                    to keep your supply chain moving smoothly.
                                </p>
                            </div>

                            <div className="bg-white text-center p-6 rounded-lg hover:shadow-lg transition-all duration-300">
                                <div className="flex justify-center mb-4">
                                    <Truck className="h-12 w-12 text-red-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-4">
                                    Global Network
                                </h3>
                                <p className="text-gray-600">
                                    Extensive worldwide network of trusted
                                    partners and agents providing comprehensive
                                    coverage for all your international shipping
                                    needs.
                                </p>
                            </div>

                            <div className="bg-white text-center p-6 rounded-lg hover:shadow-lg transition-all duration-300">
                                <div className="flex justify-center mb-4">
                                    <CheckCircle className="h-12 w-12 text-teal-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-4">
                                    Proven Track Record
                                </h3>
                                <p className="text-gray-600">
                                    Years of experience handling diverse cargo
                                    types with a 99.5% on-time delivery rate and
                                    thousands of satisfied customers worldwide.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-800 text-white py-6">
                    <div className="container mx-auto px-4 text-center">
                        {/* Company Info */}
                        <p className="gradient font-medium">
                            XTRA-MILE FREIGHT FORWARDING INC
                        </p>
                        <p className="text-gray-300 text-sm mt-1">
                            FREIGHT MONITORING SYSTEM
                        </p>

                        {/* Contact */}
                        <div className="mt-4 text-sm text-gray-300">
                            <p>+63 123 456 7890</p>
                            <p>info@xtramilefreight.com</p>
                        </div>
                        <div className="mt-4 flex justify-center space-x-6 text-sm">
                            <Link
                                to="/terms-conditions"
                                className="text-gray-300 hover:text-white transition-colors"
                            >
                                Terms & Conditions
                            </Link>
                        </div>
                        {/* Copyright */}
                        <div className="mt-4 pt-4 border-t border-gray-700">
                            <p className="text-xs text-gray-400">
                                © 2025 Xtra-Mile Freight Forwarding Inc. All
                                rights reserved.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default Home;