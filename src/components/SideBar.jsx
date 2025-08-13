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
    DocumentTextIcon,
    UserGroupIcon,
    BuildingLibraryIcon,
    BuildingStorefrontIcon
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
            path: "/booking",
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
    marketing_coordinator: [
        { name: "Dashboard", path: "/dashboard", icon: HomeIcon },
        {
            name: "Bookings",
            path: "/bookings",
            icon: ClipboardDocumentListIcon
        },
        {
            name: "Cargo Monitoring",
            path: "/cargo-monitoring",
            icon: TruckIcon
        },
        {
            name: "Shipping Lines",
            path: "/shipping-lines",
            icon: BuildingLibraryIcon
        },
        {
            name: "Trucking Companies",
            path: "/trucking-companies",
            icon: BuildingStorefrontIcon
        }
    ],
    admin_finance: [
        { name: "Dashboard", path: "/dashboard", icon: HomeIcon },
        {
            name: "Accounts Receivable",
            path: "/accounts-receivable",
            icon: CurrencyDollarIcon
        },
        {
            name: "Accounts Payable",
            path: "/accounts-payable",
            icon: CurrencyDollarIcon
        },
        {
            name: "Billing & Invoices",
            path: "/billing",
            icon: DocumentTextIcon
        }
    ],
    general_manager: [
        { name: "Dashboard", path: "/dashboard", icon: HomeIcon },
        {
            name: "Reports",
            path: "/reports",
            icon: ChartBarIcon
        },
        {
            name: "Account Management",
            path: "/account-management",
            icon: UserGroupIcon
        },
        {
            name: "Cargo Monitoring",
            path: "/cargo-monitoring",
            icon: TruckIcon
        },
        {
            name: "Financial Overview",
            path: "/financial-overview",
            icon: CurrencyDollarIcon
        }
    ]
};

const SideBar = ({ isOpen = true, user, className, onClose }) => {
    const [showBooking, setShowBooking] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);
    
    if (!user) return null;

    const role = user?.role || "customer";
    const navLinks = menuByRole[role] || [];

    if (isMobile) {
        return (
            <MobileSidebar
                isOpen={isOpen}
                onClose={onClose}
                user={user}
                navLinks={navLinks}
            />
        );
    }

    const handleDropdownClick = (path) => {
        setShowBooking(!showBooking);
        // Navigate to the main path when clicking the dropdown
        navigate(path);
    };

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
                                {/* Main dropdown button - now navigates to main path */}
                                <button
                                    onClick={() => handleDropdownClick(path)}
                                    className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition-all duration-200 group border shadow-sm ${
                                        window.location.pathname === path || window.location.pathname.startsWith(path)
                                            ? "bg-blue-600 text-white border-blue-500"
                                            : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-700 border-blue-200"
                                    }`}
                                >
                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                        <Icon
                                            className={`w-5 h-5 flex-shrink-0 ${
                                                window.location.pathname === path || window.location.pathname.startsWith(path)
                                                    ? "text-white"
                                                    : "text-blue-600"
                                            }`}
                                        />
                                        {isOpen && (
                                            <span className="font-medium truncate text-sm">
                                                {name}
                                            </span>
                                        )}
                                    </div>
                                    {isOpen &&
                                        (showBooking ? (
                                            <ChevronUpIcon className="w-4 h-4 text-current transition-transform duration-200 flex-shrink-0" />
                                        ) : (
                                            <ChevronDownIcon className="w-4 h-4 text-current transition-transform duration-200 flex-shrink-0" />
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
                                                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group border min-w-0 ${
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
                                                <span className="font-medium truncate text-sm">
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
                                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group border shadow-sm min-w-0 ${
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
                                    <span className="font-medium truncate text-sm">{name}</span>
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