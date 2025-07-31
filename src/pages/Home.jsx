import React from "react";
import { NavLink } from "react-router-dom";
import {
    TruckIcon,
    UserPlusIcon,
    ClipboardDocumentListIcon,
    EyeIcon,
    PhoneIcon,
    EnvelopeIcon,
    MapPinIcon,
    CubeIcon
} from "@heroicons/react/24/outline";

const Home = () => {
    return (
        <div className="font-[Poppins]">
            {/* Background Grid */}
            <div className="fixed inset-0 -z-10 bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"></div>

            {/* HERO SECTION */}
            <section className="min-h-screen flex items-center justify-center px-4 py-16">
                <div className="container mx-auto text-center max-w-4xl">
                    <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                        Specialized in <span className="gradient">LCL</span> and{" "}
                        <span className="gradient">Multi-Container</span>{" "}
                        Shipments
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        We consolidate Less-than-Container Loads (LCL) and
                        manage multi-container shipments (2x20, 4x20) with
                        trusted shipping lines and trucking partners across the
                        Philippines.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <NavLink
                            to="/login"
                            className="bg-blue-600 text-white px-8 py-4 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 font-semibold text-lg"
                        >
                            Request LCL Quote
                        </NavLink>
                        <button className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 transition duration-300 font-semibold text-lg">
                            How Consolidation Works
                        </button>
                    </div>
                </div>
            </section>

            {/* HOW TO USE SECTION */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Our LCL Process
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Efficient consolidation for cost-effective shipping
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Step 1 */}
                        <div className="text-center">
                            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <UserPlusIcon className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">
                                Submit Your Cargo
                            </h3>
                            <p className="text-gray-600">
                                Provide details of your shipment volume and
                                destination.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="text-center">
                            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ClipboardDocumentListIcon className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">
                                We Consolidate
                            </h3>
                            <p className="text-gray-600">
                                We combine your cargo with others to optimize
                                container space.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="text-center">
                            <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <EyeIcon className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">
                                Track & Deliver
                            </h3>
                            <p className="text-gray-600">
                                Monitor your consolidated shipment until final
                                delivery.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SERVICES SECTION */}
            <section className="py-16">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Our Specialized Services
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Tailored solutions for LCL and multi-container needs
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* LCL Service */}
                        <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                                <CubeIcon className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-4">
                                LCL Consolidation
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Cost-effective solutions for smaller shipments
                                that don't require a full container.
                            </p>
                            <ul className="text-sm text-gray-600 space-y-2">
                                <li>• Weekly consolidations to major ports</li>
                                <li>• Shared container space = lower costs</li>
                                <li>• Professional cargo handling</li>
                                <li>• Documentation management</li>
                            </ul>
                        </div>

                        {/* Multi-Container Service */}
                        <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                <CubeIcon className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-4">
                                Multi-Container Solutions
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Efficient management of multiple container
                                shipments (2x20, 4x20 configurations).
                            </p>
                            <ul className="text-sm text-gray-600 space-y-2">
                                <li>• Coordinated loading/unloading</li>
                                <li>• Synchronized documentation</li>
                                <li>• Volume discount advantages</li>
                                <li>• Single-point management</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="py-16 bg-blue-600">
                <div className="container mx-auto px-4 text-center max-w-4xl">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Need LCL or Multi-Container Solutions?
                    </h2>
                    <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
                        Get competitive rates for consolidated shipments and
                        multi-container arrangements.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <NavLink
                            to="/login"
                            className="bg-white text-blue-600 px-8 py-4 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300 font-semibold text-lg"
                        >
                            Get LCL Quote
                        </NavLink>
                        <button className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-blue-600 transition duration-300 font-semibold text-lg">
                            Multi-Container Inquiry
                        </button>
                    </div>

                    <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-3xl font-bold text-white">
                                200+
                            </div>
                            <div className="text-blue-200">
                                Weekly LCL Consolidations
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white">
                                98%
                            </div>
                            <div className="text-blue-200">
                                On-Time Delivery
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white">
                                15+
                            </div>
                            <div className="text-blue-200">
                                Shipping Line Partners
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white">
                                50+
                            </div>
                            <div className="text-blue-200">
                                Trucking Partners
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Company Info */}
                        <div className="md:col-span-2">
                            <div className="mb-4">
                                <p className="font-bold text-lg">
                                    XTRA-MILE FREIGHT FORWARDING-INC
                                </p>
                                <p className="text-gray-300">
                                    SPECIALIZED LCL & MULTI-CONTAINER SERVICES
                                </p>
                            </div>
                            <p className="text-gray-400 mb-4">
                                Your trusted partner for consolidated shipments
                                and multi-container logistics in the
                                Philippines.
                            </p>
                        </div>

                        {/* Contact */}
                        <div>
                            <h3 className="font-semibold text-lg mb-4">
                                Contact
                            </h3>
                            <ul className="space-y-2 text-gray-400">
                                <li className="flex items-center">
                                    <PhoneIcon className="w-5 h-5 mr-2" />
                                    +63 (XXX) XXX-XXXX
                                </li>
                                <li className="flex items-center">
                                    <EnvelopeIcon className="w-5 h-5 mr-2" />
                                    lcl@xtramilefreight.com
                                </li>
                                <li className="flex items-center">
                                    <MapPinIcon className="w-5 h-5 mr-2" />
                                    Manila & Cagayan de Oro Offices
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
