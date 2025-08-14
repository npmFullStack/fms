import { NavLink } from "react-router-dom";
import {
    ChevronDownIcon,
    ChevronUpIcon,
    XMarkIcon
} from "@heroicons/react/24/outline";
import ProfileMenu from "./ProfileMenu";
import { useState } from "react";

const MobileSidebar = ({ isOpen, onClose, user, navLinks, navigate }) => {
    const [showBooking, setShowBooking] = useState(false);

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                onClick={onClose}
            />

            {/* Mobile drawer */}
            <div className="fixed top-0 left-0 h-full w-80 bg-gray-50 shadow-2xl z-50 transform transition-transform duration-300 md:hidden border-r border-gray-200">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-blue-600">
                    <h2 className="text-lg font-semibold text-white">Menu</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-white hover:bg-blue-700 rounded-lg transition-colors"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex flex-col gap-2 p-4 flex-grow overflow-y-auto">
                    {navLinks.map(
                        ({ name, path, icon: Icon, isDropdown, subLinks }) =>
                            isDropdown ? (
                                <div key={name} className="w-full">
                                    <button
                                        onClick={() =>
                                            setShowBooking(!showBooking)
                                        }
                                        className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition-all duration-200 group border shadow-sm ${
                                            showBooking
                                                ? "bg-blue-600 text-white border-blue-500"
                                                : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-700 border-blue-200"
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon
                                                className={`w-5 h-5 flex-shrink-0 ${
                                                    showBooking
                                                        ? "text-white"
                                                        : "text-blue-600"
                                                }`}
                                            />
                                            <span className="font-medium">
                                                {name}
                                            </span>
                                        </div>
                                        {showBooking ? (
                                            <ChevronUpIcon className="w-4 h-4" />
                                        ) : (
                                            <ChevronDownIcon className="w-4 h-4" />
                                        )}
                                    </button>

                                    {showBooking && (
                                        <div className="mt-2 space-y-1">
                                            {subLinks.map(sub => (
                                                <NavLink
                                                    key={sub.path}
                                                    to={sub.path}
                                                    onClick={onClose}
                                                    className={({ isActive }) =>
                                                        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group border shadow-sm ${
                                                            isActive
                                                                ? "bg-blue-600 text-white border-blue-500"
                                                                : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-700 border-blue-200"
                                                        }`
                                                    }
                                                >
                                                    <sub.icon
                                                        className={`w-5 h-5 flex-shrink-0 ${
                                                            window.location
                                                                .pathname ===
                                                            sub.path
                                                                ? "text-white"
                                                                : "text-blue-600"
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
                                    onClick={onClose}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group border shadow-sm ${
                                            isActive
                                                ? "bg-blue-600 text-white border-blue-500"
                                                : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-700 border-blue-200"
                                        }`
                                    }
                                >
                                    <Icon
                                        className={`w-5 h-5 flex-shrink-0 ${
                                            window.location.pathname === path
                                                ? "text-white"
                                                : "text-blue-600"
                                        }`}
                                    />
                                    <span className="font-medium">{name}</span>
                                </NavLink>
                            )
                    )}
                </nav>

                {/* Profile at bottom */}
                <div className="border-t border-gray-200 p-4">
                    <ProfileMenu
                        user={user}
                        navigate={navigate}
                        isOpen={true}
                        isMobile={true}
                    />
                </div>
            </div>
        </>
    );
};

export default MobileSidebar;