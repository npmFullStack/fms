import { useState } from "react";
import { Link } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="w-full bg-white shadow-sm">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                {/* Logo */}
                <div className="flex items-center">
                    <span className="text-xl font-bold text-blue-600">
                        YourLogo
                    </span>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex space-x-6">
                    <button className="px-4 py-2 text-gray-700 hover:text-blue-600">
                        Track Order
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        Login
                    </button>
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? (
                        <XMarkIcon className="h-6 w-6" />
                    ) : (
                        <Bars3Icon className="h-6 w-6" />
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white py-2 px-4 shadow-lg">
                    <div className="flex flex-col space-y-3">
                        <Link
                            to={"/track-order"}
                            className="py-2 text-left text-gray-700 hover:text-blue-600"
                        >
                            Track Order
                        </Link>
                        <button className="py-2 text-left bg-blue-600 text-white rounded-md px-4 hover:bg-blue-700">
                            Login
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
