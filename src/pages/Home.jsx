import React from "react";
import { NavLink } from "react-router-dom";

const Home = () => {
    return (
        <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center text-center px-4 font-[Poppins]">
            {/* ✅ Fixed Background Grid */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"></div>

            {/* ✅ Content */}
            <div className="container mx-auto px-4 text-center">
                <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                    <span className="gradient">Freight Monitoring System</span>
                </h1>
                <p className="mt-4 text-gray-600 text-xl md:text-base">
                    Get real-time updates on shipment status, automate tasks,
                    and make data-driven decisions to optimize your logistics
                    operations.
                </p>

                <div className="mt-6">
                    <NavLink
                        to="/login"
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                    >
                        Get Started
                    </NavLink>
                </div>
            </div>
        </div>
    );
};

export default Home;
