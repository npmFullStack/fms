import { NavLink } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    HomeIcon,
    TruckIcon,
    ClipboardDocumentListIcon,
    CurrencyDollarIcon,
    ChartBarIcon,
    Cog6ToothIcon,
    ChevronDownIcon,
    ChevronUpIcon
} from "@heroicons/react/24/outline";
import useAuthStore from "../utils/store/useAuthStore";

const menuByRole = {
    customer: [
        { name: "Dashboard", path: "/dashboard", icon: HomeIcon },
        {
            name: "My Bookings",
            isDropdown: true,
            icon: ClipboardDocumentListIcon,
            subLinks: [
                { name: "Create Booking", path: "/booking/create" },
                { name: "Booking Logs", path: "/booking/logs" }
            ]
        },
        { name: "Track Orders", path: "/track", icon: TruckIcon }
    ],
    marketing: [
        { name: "Dashboard", path: "/dashboard", icon: HomeIcon },
        { name: "Bookings", path: "/booking", icon: TruckIcon },
        {
            name: "Shipping Line",
            path: "/shipping",
            icon: ClipboardDocumentListIcon
        }
    ],
    finance: [
        { name: "Dashboard", path: "/dashboard", icon: HomeIcon },
        { name: "Accounts Receivable", path: "/ar", icon: CurrencyDollarIcon },
        { name: "Accounts Payable", path: "/ap", icon: CurrencyDollarIcon }
    ],
    gm: [
        { name: "Dashboard", path: "/dashboard", icon: HomeIcon },
        { name: "Reports", path: "/reports", icon: ChartBarIcon }
    ]
};

const SideBar = ({ isOpen = true, user, className }) => {
    const navigate = useNavigate();
    const { logout } = useAuthStore();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showBookingSubmenu, setShowBookingSubmenu] = useState(false);
    const profileRef = useRef();

    useEffect(() => {
        const handleClickOutside = e => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setShowProfileMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const role = user?.role || "customer";
    const navLinks = menuByRole[role] || [];

    return (
        <div className={`bg-gray-900 text-white h-full p-4 flex flex-col ${className}`}>
            {/* Navigation */}
            <nav className="flex flex-col gap-1 flex-grow">
                {navLinks.map(({ name, path, icon: Icon, isDropdown, subLinks }) =>
                    isDropdown ? (
                        <div key={name}>
                            <button
                                onClick={() => setShowBookingSubmenu(!showBookingSubmenu)}
                                className="flex items-center justify-between w-full px-4 py-2 bg-blue-700 text-white font-semibold rounded-md hover:bg-blue-600 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <Icon className="w-5 h-5" />
                                    {isOpen && <span>{name}</span>}
                                </div>
                                {isOpen && (
                                    showBookingSubmenu ? (
                                        <ChevronUpIcon className="w-4 h-4" />
                                    ) : (
                                        <ChevronDownIcon className="w-4 h-4" />
                                    )
                                )}
                            </button>

                            {showBookingSubmenu && isOpen && (
                                <div className="ml-8 mt-1 flex flex-col gap-3 transition-all duration-200">
                                    {subLinks.map(sub => (
                                        <NavLink
                                            key={sub.path}
                                            to={sub.path}
                                            className={({ isActive }) => 
                                                `text-sm hover:text-blue-400 transition-colors ${
                                                    isActive ? "text-blue-400 font-medium" : ""
                                                }`
                                            }
                                        >
                                            {sub.name}
                                        </NavLink>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <NavLink
                            key={path}
                            to={path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-2 rounded-md font-medium transition-colors ${
                                    isActive
                                        ? "bg-blue-600 text-white"
                                        : "hover:bg-gray-700"
                                }`
                            }
                        >
                            <Icon className="w-5 h-5" />
                            {isOpen && <span>{name}</span>}
                        </NavLink>
                    )
                )}
            </nav>

            {/* Profile Menu */}
            <div
                ref={profileRef}
                className="mt-auto relative text-sm text-white rounded px-3 py-2 hover:bg-gray-700 cursor-pointer transition-colors"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
                <div className="flex items-center gap-2">
                    <Cog6ToothIcon className="w-6 h-6" />
                    {isOpen && <span className="truncate">{user?.email}</span>}
                </div>

                {showProfileMenu && (
                    <div className="absolute bottom-full mb-2 left-0 w-40 bg-white text-gray-800 rounded shadow-md z-50 transition-all duration-200">
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors">
                            Settings
                        </button>
                        <button
                            onClick={() => logout(navigate)}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SideBar;