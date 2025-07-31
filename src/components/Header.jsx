import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
        <header className="w-full bg-white/90 backdrop-blur-sm border-b border-gray-200 font-[Poppins] sticky top-0 z-50">
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

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-8">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            isActive
                                ? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-1 transition-all duration-200"
                                : "text-gray-700 font-medium hover:text-blue-600 transition-colors duration-200"
                        }
                    >
                        Home
                    </NavLink>
                    
                    <a 
                        href="#services" 
                        className="text-gray-700 font-medium hover:text-blue-600 transition-colors duration-200"
                    >
                        Partner Network
                    </a>
                    
                    <a 
                        href="#how-to-use" 
                        className="text-gray-700 font-medium hover:text-blue-600 transition-colors duration-200"
                    >
                        How We Work
                    </a>
                    
                    <a 
                        href="#contact" 
                        className="text-gray-700 font-medium hover:text-blue-600 transition-colors duration-200"
                    >
                        Contact
                    </a>
                    
                    <NavLink
                        to="/login"
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-md"
                    >
                        Get Quote
                    </NavLink>
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    {isOpen ? (
                        <XMarkIcon className="h-6 w-6 text-gray-700" />
                    ) : (
                        <Bars3Icon className="h-6 w-6 text-gray-700" />
                    )}
                </button>
            </div>

            {/* Mobile Navigation Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-200 px-4 py-6 shadow-lg">
                    <div className="flex flex-col space-y-4">
                        <NavLink 
                            to="/" 
                            className={({ isActive }) =>
                                isActive
                                    ? "text-blue-600 font-semibold py-2 px-4 rounded-lg bg-blue-50"
                                    : "text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                            }
                            onClick={() => setIsOpen(false)}
                        >
                            Home
                        </NavLink>
                        
                        <a 
                            href="#services" 
                            className="text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                            onClick={() => setIsOpen(false)}
                        >
                            Partner Network
                        </a>
                        
                        <a 
                            href="#how-to-use" 
                            className="text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                            onClick={() => setIsOpen(false)}
                        >
                            How We Work
                        </a>
                        
                        <a 
                            href="#contact" 
                            className="text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                        >
                            Contact
                        </a>
                        
                        <NavLink
                            to="/login"
                            className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg text-center hover:bg-blue-700 transition-colors duration-200 shadow-md"
                            onClick={() => setIsOpen(false)}
                        >
                            Get Quote
                        </NavLink>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;