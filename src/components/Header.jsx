import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const Header = () => {
    // ETO YUNG BURGER ICON
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // PANG TRACK SA ANONG SECTION ANG ACTIVE
    const [activeSection, setActiveSection] = useState("home");

    // FUNCTION SA CLICKING ACTIVE MENU
    const handleClick = sectionId => {
        setActiveSection(sectionId); // UPDATE ACTIVE SECTION
        setIsMenuOpen(false);

        // Scroll to the section smoothly
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <header className="w-full bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
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

                {/* Desktop Navigation - shown on larger screens */}
                <nav className="hidden md:flex items-center gap-8">
                    <button
                        onClick={() => handleClick("home")}
                        className={`pb-1 ${
                            activeSection === "home"
                                ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                                : "text-gray-700 hover:text-blue-600"
                        }`}
                    >
                        Home
                    </button>

                    <button
                        onClick={() => handleClick("how-it-works")}
                        className={`pb-1 ${
                            activeSection === "how-it-works"
                                ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                                : "text-gray-700 hover:text-blue-600"
                        }`}
                    >
                        How It Works
                    </button>

                    <button
                        onClick={() => handleClick("why-choose-us")}
                        className={`pb-1 ${
                            activeSection === "why-choose-us"
                                ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                                : "text-gray-700 hover:text-blue-600"
                        }`}
                    >
                        Why Choose Us
                    </button>

                    <button
                        onClick={() => handleClick("testimonials")}
                        className={`pb-1 ${
                            activeSection === "testimonials"
                                ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                                : "text-gray-700 hover:text-blue-600"
                        }`}
                    >
                        Testimonials
                    </button>

                    <NavLink
                        to="/login"
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                        Get Quote
                    </NavLink>
                </nav>

                {/* Mobile menu button - shown on small screens */}
                <button
                    className="md:hidden p-2 rounded-lg hover:bg-gray-100"
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
                <div className="md:hidden bg-white border-t border-gray-200 px-4 py-6 shadow-lg">
                    <div className="flex flex-col space-y-4">
                        <button
                            onClick={() => handleClick("home")}
                            className={`text-left p-2 ${
                                activeSection === "home"
                                    ? "text-blue-600 font-semibold bg-blue-50 rounded-lg"
                                    : "text-gray-700"
                            }`}
                        >
                            Home
                        </button>

                        <button
                            onClick={() => handleClick("how-it-works")}
                            className={`text-left p-2 ${
                                activeSection === "how-it-works"
                                    ? "text-blue-600 font-semibold bg-blue-50 rounded-lg"
                                    : "text-gray-700"
                            }`}
                        >
                            How It Works
                        </button>

                        <button
                            onClick={() => handleClick("why-choose-us")}
                            className={`text-left p-2 ${
                                activeSection === "why-choose-us"
                                    ? "text-blue-600 font-semibold bg-blue-50 rounded-lg"
                                    : "text-gray-700"
                            }`}
                        >
                            Why Choose Us
                        </button>

                        <button
                            onClick={() => handleClick("testimonials")}
                            className={`text-left p-2 ${
                                activeSection === "testimonials"
                                    ? "text-blue-600 font-semibold bg-blue-50 rounded-lg"
                                    : "text-gray-700"
                            }`}
                        >
                            Testimonials
                        </button>

                        <NavLink
                            to="/login"
                            className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg text-center hover:bg-blue-700 transition-colors"
                            onClick={() => setIsMenuOpen(false)}
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
