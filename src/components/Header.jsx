import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <header className="w-full bg-transparent font-[Poppins]">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                {/* Logo */}
                <div className="flex flex-col text-left md:text-left">
                    <p className="gradient font-bold text-sm md:text-xl">
                        XTRA-MILE FREIGHT FORWARDING-INC
                    </p>
                    <p className="text-gray-800 font-bold text-sm md:text-xl">
                        FREIGHT MONITORING SYSTEM
                    </p>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center space-x-5">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            isActive
                                ? "text-sm font-bold text-blue-600 underline underline-offset-2"
                                : "text-sm text-blue-600 font-semibold hover:underline underline-offset-2"
                        }
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to="/login"
                        className={({ isActive }) =>
                            isActive
                                ? "border-2 border-blue-600 bg-white px-4 py-2 rounded-lg text-sm font-bold text-blue-600"
                                : "bg-blue-600 px-4 py-2 rounded-lg text-sm font-bold text-white hover:bg-blue-700"
                        }
                    >
                        Login
                    </NavLink>
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? (
                        <XMarkIcon className="h-8 w-8 text-black" />
                    ) : (
                        <Bars3Icon className="h-8 w-8 text-black" />
                    )}
                </button>
            </div>

            {/* Mobile Nav */}
            {isOpen && (
                <div className="md:hidden bg-transparent px-6 py-3 shadow-md">
                    <div className="flex flex-col items-center gap-3">
                        <NavLink to="/" className="text-blue-600 font-semibold">
                            Home
                        </NavLink>
                        <NavLink
                            to="/login"
                            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg text-center hover:bg-blue-700"
                        >
                            Login
                        </NavLink>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
