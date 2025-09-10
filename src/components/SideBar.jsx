import { NavLink, useNavigate, useLocation } from "react-router-dom";
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
    DocumentIcon,
    ExclamationTriangleIcon,
    CalculatorIcon,
    ShieldCheckIcon,
    UserGroupIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import ProfileMenu from "./ProfileMenu";
import MobileSidebar from "./MobileSidebar";
import useIsMobile from "../utils/hooks/useIsMobile";

// ---------------- MENU CONFIG ----------------
const menuByRole = {
    customer: [
        { name: "Dashboard", path: "/dashboard", icon: HomeIcon },
        {
            name: "My Bookings",
            path: "/booking",
            icon: ClipboardDocumentListIcon,
            
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
        { name: "House Waybill", path: "/house-waybill", icon: DocumentIcon },
        {
            name: "Incident Reports",
            path: "/incident-reports",
            icon: ExclamationTriangleIcon
        },
        {
            name: "Partners",
            path: "/partners",
            icon: UserGroupIcon
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
            name: "Payment Reconciliation",
            path: "/payment-reconciliation",
            icon: CalculatorIcon
        }
    ],
    general_manager: [
        { name: "Dashboard", path: "/dashboard", icon: HomeIcon },
        {
            name: "Financial Overview",
            path: "/financial-overview",
            icon: ChartBarIcon
        },
        { name: "Audit Logs", path: "/audit-logs", icon: ShieldCheckIcon },
        {
            name: "Account Management",
            path: "/account-management",
            icon: UserGroupIcon
        },
        {
            name: "Partners",
            path: "/partners",
            icon: UserGroupIcon
        }
    ]
};

// ---------------- SIDEBAR ----------------
const SideBar = ({ isOpen = true, user, className, onClose }) => {
    const [openDropdowns, setOpenDropdowns] = useState({});
    const isMobile = useIsMobile();
    const navigate = useNavigate();
    const location = useLocation();

    if (!user) return null;

    const role = user?.role || "customer";
    const navLinks = menuByRole[role] || [];

    const toggleDropdown = name => {
        setOpenDropdowns(prev => ({ ...prev, [name]: !prev[name] }));
    };

    // Recursive renderer for nav links
    const renderLinks = links => (
        <div className="space-y-1">
            {links.map(({ name, path, icon: Icon, isDropdown, subLinks }) => {
                const isActiveParent =
                    location.pathname === path ||
                    location.pathname.startsWith(path + "/");

                return isDropdown ? (
                    <div key={name}>
                        <button
                            onClick={() => {
                                toggleDropdown(name);
                                navigate(path);
                            }}
                            className={`flex w-full rounded-lg border shadow-sm transition-all duration-300 ${
                                isOpen
                                    ? "items-center justify-between px-4 py-2"
                                    : "justify-center p-2"
                            } ${
                                isActiveParent
                                    ? "bg-blue-600 text-white border-blue-500"
                                    : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-700 border-blue-200"
                            }`}
                        >
                            <div
                                className={`flex items-center overflow-hidden transition-all duration-300 ${
                                    isOpen ? "gap-2" : "justify-center"
                                }`}
                            >
                                <Icon
                                    className={`w-5 h-5 shrink-0 transition-colors duration-300 ${
                                        isActiveParent
                                            ? "text-white"
                                            : "text-blue-600"
                                    }`}
                                />
                                {isOpen && (
                                    <span className="font-medium text-sm truncate transition-opacity duration-300">
                                        {name}
                                    </span>
                                )}
                            </div>
                            {isOpen &&
                                (openDropdowns[name] ? (
                                    <ChevronUpIcon
                                        className={`w-4 h-4 shrink-0 transition-all duration-300 ${
                                            isActiveParent
                                                ? "text-white"
                                                : "text-blue-600"
                                        }`}
                                    />
                                ) : (
                                    <ChevronDownIcon
                                        className={`w-4 h-4 shrink-0 transition-all duration-300 ${
                                            isActiveParent
                                                ? "text-white"
                                                : "text-blue-600"
                                        }`}
                                    />
                                ))}
                        </button>
                        {openDropdowns[name] && subLinks && isOpen && (
                            <div className="mt-1 pl-4 transition-all duration-300 ease-in-out">
                                {renderLinks(subLinks)}
                            </div>
                        )}
                    </div>
                ) : (
                    <NavLink
                        key={path}
                        to={path}
                        className={({ isActive }) =>
                            `flex rounded-lg border shadow-sm transition-all duration-300 ${
                                isOpen
                                    ? "items-center gap-2 px-4 py-2"
                                    : "justify-center p-2"
                            } ${
                                isActive
                                    ? "bg-blue-600 text-white border-blue-500"
                                    : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-700 border-blue-200"
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <Icon
                                    className={`w-5 h-5 shrink-0 transition-colors duration-300 ${
                                        isActive
                                            ? "text-white"
                                            : "text-blue-600"
                                    }`}
                                />
                                {isOpen && (
                                    <span className="font-medium text-sm truncate transition-opacity duration-300">
                                        {name}
                                    </span>
                                )}
                            </>
                        )}
                    </NavLink>
                );
            })}
        </div>
    );

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

    return (
        <div
            className={`bg-gray-50 border-r border-gray-200 text-gray-800 p-4 flex flex-col transition-all duration-300 ease-in-out hidden md:flex ${
                isOpen ? "w-64" : "w-20"
            } ${className}`}
            style={{ transitionProperty: 'width, transform' }}
        >
            <nav className="flex flex-col gap-2 flex-grow">
                {renderLinks(navLinks)}
            </nav>
            {user && (
                <ProfileMenu user={user} navigate={navigate} isOpen={isOpen} />
            )}
        </div>
    );
};

export default SideBar;