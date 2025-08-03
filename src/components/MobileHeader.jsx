import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const MobileHeader = ({ activeSection, handleClick }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="w-full bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 md:hidden">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                {/* Logo */}
                <div className="flex flex-col text-left">
                    <p className="gradient font-bold text-sm md:text-lg">
                        XTRA-MILE FREIGHT FORWARDING-INC
                    </p>
                    <p className="text-gray-800 font-semibold text-xs md:text-sm">
                        FREIGHT MONITORING SYSTEM
                    </p>
                </div>

                {/* Mobile menu button */}
                <button
                    className="p-2 rounded-lg hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? (
                        <XMarkIcon className="h-6 w-6 text-gray-700" />
                    ) : (
                        <Bars3Icon className="h-6 w-6 text-gray-700" />
                    )}
                </button>
            </div>

            {/* Mobile menu - shown when isMenuOpen is true */}
            {isMenuOpen && (
                <div className="bg-white border-t border-gray-200 px-4 py-6 shadow-lg">
                    <div className="flex flex-col space-y-4 items-center">
                        <button
                            onClick={() => {
                                handleClick("home");
                                setIsMenuOpen(false);
                            }}
                            className={`w-full text-center p-2 ${
                                activeSection === "home"
                                    ? "text-blue-600 font-semibold bg-blue-50 rounded-lg"
                                    : "text-gray-700"
                            }`}
                        >
                            Home
                        </button>

                        <button
                            onClick={() => {
                                handleClick("how-it-works");
                                setIsMenuOpen(false);
                            }}
                            className={`w-full text-center p-2 ${
                                activeSection === "how-it-works"
                                    ? "text-blue-600 font-semibold bg-blue-50 rounded-lg"
                                    : "text-gray-700"
                            }`}
                        >
                            How It Works
                        </button>

                        <button
                            onClick={() => {
                                handleClick("why-choose-us");
                                setIsMenuOpen(false);
                            }}
                            className={`w-full text-center p-2 ${
                                activeSection === "why-choose-us"
                                    ? "text-blue-600 font-semibold bg-blue-50 rounded-lg"
                                    : "text-gray-700"
                            }`}
                        >
                            Why Choose Us
                        </button>

                        <div className="flex flex-col gap-3 mt-4 w-full max-w-xs">
                            <NavLink
                                to="/login"
                                className={({ isActive }) =>
                                    `py-3 px-6 rounded-lg text-center font-semibold transition-colors ${
                                        isActive
                                            ? "bg-blue-600 text-white"
                                            : "bg-blue-600 text-white hover:bg-blue-700"
                                    }`
                                }
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Sign In
                            </NavLink>
                            <NavLink
                                to="/register"
                                className={({ isActive }) =>
                                    `py-3 px-6 rounded-lg text-center font-semibold transition-colors border ${
                                        isActive
                                            ? "bg-white text-blue-600 border-blue-600"
                                            : "bg-white text-blue-600 border-blue-600 hover:bg-blue-50"
                                    }`
                                }
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Create Account
                            </NavLink>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default MobileHeader;