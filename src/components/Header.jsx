import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import MobileHeader from "./MobileHeader";

const Header = () => {
    const [activeSection, setActiveSection] = useState("home");
    const location = useLocation();

    // Handle scroll to update active section
    useEffect(() => {
        const handleScroll = () => {
            if (location.pathname !== "/") return;

            const sections = ["home", "how-it-works", "why-choose-us"];
            const scrollPosition = window.scrollY + 100;

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const offsetTop = element.offsetTop;
                    const offsetHeight = element.offsetHeight;

                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveSection(section);
                        return;
                    }
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [location.pathname]);

    // Reset active section when navigating away from home
    useEffect(() => {
        if (location.pathname !== "/") {
            setActiveSection("");
        } else {
            // If we're back on home page, set the active section based on scroll position
            const handleScroll = () => {
                const sections = ["home", "how-it-works", "why-choose-us"];
                const scrollPosition = window.scrollY + 100;

                for (const section of sections) {
                    const element = document.getElementById(section);
                    if (element) {
                        const offsetTop = element.offsetTop;
                        const offsetHeight = element.offsetHeight;

                        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                            setActiveSection(section);
                            return;
                        }
                    }
                }
            };
            handleScroll();
        }
    }, [location.pathname]);

    const handleClick = (sectionId) => {
        if (location.pathname !== "/") {
            // If not on home page, navigate to home page first
            window.location.href = `/#${sectionId}`;
            return;
        }

        setActiveSection(sectionId);
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <>
            {/* Mobile Header - shown only on mobile */}
            <MobileHeader activeSection={activeSection} handleClick={handleClick} />

            {/* Desktop Header - shown only on desktop */}
            <header className="w-full bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 hidden md:block">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    {/* Logo */}
                    <div className="flex flex-col text-left">
                        <p className="gradient font-bold text-sm md:text-lg">
                            XTRA-MILE NORWAY POGI FREIGHT FORWARDING-INC
                        </p>
                        <p className="text-gray-800 font-semibold text-xs md:text-sm">
                            FREIGHT MONITORING SYSTEM
                        </p>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="flex items-center gap-8">
                        <button
                            onClick={() => handleClick("home")}
                            className={`pb-1 ${
                                activeSection === "home" && location.pathname === "/"
                                    ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                                    : "text-gray-700 hover:text-blue-600"
                            }`}
                        >
                            Home
                        </button>

                        <button
                            onClick={() => handleClick("how-it-works")}
                            className={`pb-1 ${
                                activeSection === "how-it-works" && location.pathname === "/"
                                    ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                                    : "text-gray-700 hover:text-blue-600"
                            }`}
                        >
                            How It Works
                        </button>

                        <button
                            onClick={() => handleClick("why-choose-us")}
                            className={`pb-1 ${
                                activeSection === "why-choose-us" && location.pathname === "/"
                                    ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                                    : "text-gray-700 hover:text-blue-600"
                            }`}
                        >
                            Why Choose Us
                        </button>

                        <div className="flex gap-4">
                            <NavLink
                                to="/login"
                                className={({ isActive }) =>
                                    `px-4 py-2 rounded-lg font-semibold transition-colors ${
                                        isActive
                                            ? "bg-blue-600 text-white"
                                            : "bg-blue-600 text-white hover:bg-blue-700"
                                    }`
                                }
                            >
                                Sign In
                            </NavLink>
                            <NavLink
                                to="/register"
                                className={({ isActive }) =>
                                    `px-4 py-2 rounded-lg font-semibold transition-colors border ${
                                        isActive
                                            ? "bg-white text-blue-600 border-blue-600"
                                            : "bg-white text-blue-600 border-blue-600 hover:bg-blue-50"
                                    }`
                                }
                            >
                                Create Account
                            </NavLink>
                        </div>
                    </nav>
                </div>
            </header>
        </>
    );
};

export default Header;