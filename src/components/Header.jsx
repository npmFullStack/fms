import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <header className="w-full bg-red-800 shadow-lg">
            <div className="container mx-auto px-2 py-2 flex justify-between items-center">
                <div className="flex flex-col space-x-0 items-start">
                    <p className="font-bold text-yellow-300">
                        XTRA-MILE FREIGHT FORWARDING-INC
                    </p>
                    <p className="font-bold text-white">
                        FREIGHT MONITORING SYSTEM
                    </p>
                </div>
                <nav className="hidden md:flex items-center space-x-2">
                    <NavLink
                        to={"/"}
                        className={({ isActive }) =>
                            isActive
                                ? "text-xs font-bold text-white underline underline-offset-2 decoration-white"
                                : "text-xs text-white font-bold hover:underline-offset-2"
                        }
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to={"/login"}
                        className={({ isActive }) =>
                            isActive
                                ? "border-2 border-white bg-blue-900 px-4 py-2 rounded-xl text-xs font-bold text-white"
                                : "bg-blue-800 px-4 py-2 rounded-xl text-xs font-bold text-white hover:bg-blue-700"
                        }
                    >
                        Login
                    </NavLink>
                    <NavLink
                        to={"/track-order"}
                        className={({ isActive }) =>
                            isActive
                                ? "border-2 border-white bg-blue-900 px-4 py-2 rounded-xl text-xs font-bold text-white"
                                : "bg-blue-800 px-4 py-2 rounded-xl text-xs font-bold text-white hover:bg-blue-800"
                        }
                    >
                        Track Order
                    </NavLink>
                </nav>

                <button
                    className="md:hidden p-2"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? (
                        <XMarkIcon className="h-8 w-8 text-white" />
                    ) : (
                        <Bars3Icon className="h-8 w-8 text-white" />
                    )}
                </button>
            </div>
            {isOpen && (
                <div className="md:hidden bg-white px-8 py-2 shadow-lg">
                    <div className="flex flex-col items-center justify-between gap-1.5">
                        <NavLink
                            to={"/"}
                            className={({ isActive }) =>
                                isActive
                                    ? "font-bold text-blue-900"
                                    : "font-bold text-black"
                            }
                        >
                            Home
                        </NavLink>
                        <NavLink
                            to={"/login"}
                            className={({ isActive }) =>
                                isActive
                                    ? "w-full bg-blue-900 text-white font-bold py-2 px-4 rounded-xl text-center"
                                    : "w-full bg-blue-800 text-white font-bold py-2 px-4 rounded-xl text-center hover:bg-blue-800"
                            }
                        >
                            Login
                        </NavLink>
                        <NavLink
                            to={"/track-order"}
                            className={({ isActive }) =>
                                isActive
                                    ? "w-full bg-blue-900 text-white font-bold py-2 px-4 rounded-xl text-center"
                                    : "w-full bg-blue-800 text-white font-bold py-2 px-4 rounded-xl text-center hover:bg-blue-800"
                            }
                        >
                            Track Order
                        </NavLink>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
