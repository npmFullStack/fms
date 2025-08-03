import { NavLink, useNavigate } from "react-router-dom";
import {
    HomeIcon,
    TruckIcon,
    ClipboardDocumentListIcon,
    CurrencyDollarIcon,
    ChartBarIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    PlusCircleIcon,
    DocumentTextIcon
} from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import ProfileMenu from "./ProfileMenu";
import useAuthStore from "../utils/store/useAuthStore";
import MobileSidebar from "./MobileSidebar";

const menuByRole = {
    customer: [
        { name: "Dashboard", path: "/dashboard", icon: HomeIcon },
        {
            name: "My Bookings",
            isDropdown: true,
            icon: ClipboardDocumentListIcon,
            subLinks: [
                {
                    name: "Create Booking",
                    path: "/booking/create",
                    icon: PlusCircleIcon
                },
                {
                    name: "Booking Logs",
                    path: "/booking/logs",
                    icon: DocumentTextIcon
                }
            ]
        },
        { name: "Track Orders", path: "/track-order", icon: TruckIcon }
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

const SideBar = ({ isOpen = true, user, className, onClose }) => {
    const [showBooking, setShowBooking] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const navigate = useNavigate();

    const role = user?.role || "customer";
    const navLinks = menuByRole[role] || [];

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    if (isMobile) {
        return (
            <MobileSidebar
                isOpen={isOpen}
                onClose={onClose}
                user={user}
                navLinks={navLinks}
                navigate={navigate}
            />
        );
    }

    // Desktop sidebar
    return (
        <div
            className={`bg-gray-50 border-r border-gray-200 text-gray-800 p-4 flex flex-col transition-all duration-300 hidden md:flex ${className}`}
        >
            <nav
                className={`flex flex-col gap-2 flex-grow ${
                    isOpen ? "" : "items-center"
                }`}
            >
                {navLinks.map(
                    ({ name, path, icon: Icon, isDropdown, subLinks }) =>
                        isDropdown ? (
                            <div key={name} className="w-full">
                                {/* Main dropdown button */}
                                <button
                                    onClick={() => setShowBooking(!showBooking)}
                                    className={`flex items-center w-full px-4 py-3 bg-white text-gray-800 rounded-lg hover:bg-blue-50 transition-all duration-200 group border border-blue-200 shadow-sm ${
                                        !isOpen
                                            ? "justify-center"
                                            : "justify-between"
                                    } ${
                                        showBooking
                                            ? "bg-blue-50 text-blue-700"
                                            : ""
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon
                                            className={`w-5 h-5 transition-colors flex-shrink-0 ${
                                                showBooking
                                                    ? "text-blue-700"
                                                    : "text-blue-600 group-hover:text-blue-700"
                                            }`}
                                        />
                                        {isOpen && (
                                            <span className="font-medium">
                                                {name}
                                            </span>
                                        )}
                                    </div>
                                    {isOpen &&
                                        (showBooking ? (
                                            <ChevronUpIcon className="w-4 h-4 text-blue-700 transition-transform duration-200" />
                                        ) : (
                                            <ChevronDownIcon className="w-4 h-4 text-gray-500 transition-transform duration-200" />
                                        ))}
                                </button>

                                {/* Sublinks - same level as main links */}
                                {showBooking && isOpen && (
                                    <div className="mt-2 space-y-1">
                                        {subLinks.map(sub => (
                                            <NavLink
                                                key={sub.path}
                                                to={sub.path}
                                                className={({ isActive }) =>
                                                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group border ${
                                                        isActive
                                                            ? "bg-blue-600 text-white shadow-md border-blue-500"
                                                            : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-700 border-blue-200 shadow-sm"
                                                    }`
                                                }
                                            >
                                                <sub.icon
                                                    className={`w-5 h-5 transition-colors flex-shrink-0 ${
                                                        window.location
                                                            .pathname ===
                                                        sub.path
                                                            ? "text-white"
                                                            : "text-blue-600 group-hover:text-blue-700"
                                                    }`}
                                                />
                                                <span className="font-medium">
                                                    {sub.name}
                                                </span>
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
                                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group border shadow-sm ${
                                        isActive
                                            ? "bg-blue-600 text-white border-blue-500"
                                            : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-700 border-blue-200"
                                    }`
                                }
                            >
                                <Icon
                                    className={`w-5 h-5 transition-colors flex-shrink-0 ${
                                        window.location.pathname === path
                                            ? "text-white"
                                            : "text-blue-600 group-hover:text-blue-700"
                                    }`}
                                />
                                {isOpen && (
                                    <span className="font-medium">{name}</span>
                                )}
                            </NavLink>
                        )
                )}
            </nav>

            {user && (
                <ProfileMenu user={user} navigate={navigate} isOpen={isOpen} />
            )}
        </div>
    );
};

export default SideBar;
