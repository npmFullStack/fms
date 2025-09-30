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


const Home = () => {
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

                {/* How It Works Section */}
                <section
                    id="how-it-works"
                    className="min-h-screen w-screen flex flex-col items-center justify-center gradient-bg px-12 py-20"
                >
                    <div className="container text-white mx-auto px-8 md:px-8">
                        <div className="text-center mb-16">
                            <h1 className="heading text-white mb-6">
                                How It Works
                            </h1>
                            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
                                Our streamlined process makes freight forwarding
                                simple and efficient. Follow these easy steps to
                                get your cargo moving worldwide.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            <div className="bg-white p-8 rounded-xl shadow-xl text-center transform hover:scale-105 transition-all duration-300">
                                <div className="flex justify-center mb-6">
                                    <div className="bg-blue-100 p-4 rounded-full">
                                        <UserPlus className="h-12 w-12 text-blue-600" />
                                    </div>
                                </div>
                                <div className="bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full inline-block mb-4">
                                    STEP 1
                                </div>
                                <h3 className="text-black text-xl font-bold mb-4">
                                    Create Your Account
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Sign up for free and gain access to our
                                    comprehensive freight forwarding platform.
                                    Complete your profile and verify your
                                    business details to get started.
                                </p>
                            </div>

                            <div className="bg-white p-8 rounded-xl shadow-xl text-center transform hover:scale-105 transition-all duration-300">
                                <div className="flex justify-center mb-6">
                                    <div className="bg-green-100 p-4 rounded-full">
                                        <ClipboardList className="h-12 w-12 text-green-600" />
                                    </div>
                                </div>
                                <div className="bg-green-600 text-white text-sm font-bold px-3 py-1 rounded-full inline-block mb-4">
                                    STEP 2
                                </div>
                                <h3 className="text-black text-xl font-bold mb-4">
                                    Book Your Shipment
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Enter your shipment details, select
                                    services, and get instant quotes. Upload
                                    documents, choose pickup dates, and confirm
                                    your booking with just a few clicks.
                                </p>
                            </div>

                            <div className="bg-white p-8 rounded-xl shadow-xl text-center transform hover:scale-105 transition-all duration-300">
                                <div className="flex justify-center mb-6">
                                    <div className="bg-purple-100 p-4 rounded-full">
                                        <Eye className="h-12 w-12 text-purple-600" />
                                    </div>
                                </div>
                                <div className="bg-purple-600 text-white text-sm font-bold px-3 py-1 rounded-full inline-block mb-4">
                                    STEP 3
                                </div>
                                <h3 className="text-black text-xl font-bold mb-4">
                                    Track & Monitor
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Monitor your shipment in real-time with our
                                    advanced tracking system. Receive updates,
                                    manage documentation, and stay informed
                                    throughout the journey.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why Choose Us Section */}
                <section
                    id="why-choose-us"
                    className="min-h-screen w-screen flex flex-col items-center justify-center bg-white px-12 py-20"
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
                            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-all duration-300">
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

                            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-all duration-300">
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

                            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-all duration-300">
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

                            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-all duration-300">
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

                            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-all duration-300">
                                <div className="flex justify-center mb-4">
                                    <Truck className="h-12 w-12 text-red-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-4">
                                    Global Network
                                </h3>
                                <p className="text-gray-600">
                                    Extensive worldwide network oftrusted
                                    partners and agents providing comprehensive
                                    coverage for all your international shipping
                                    needs.
                                </p>
                            </div>

                            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-all duration-300">
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
