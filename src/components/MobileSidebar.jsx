import { NavLink } from "react-router-dom";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import ProfileMenu from "./ProfileMenu";
import { useState } from "react";

const MobileSidebar = ({ isOpen, onClose, user, navLinks, navigate }) => {
    const [openDropdowns, setOpenDropdowns] = useState({});

    if (!isOpen) return null;

    const toggleDropdown = name => {
        setOpenDropdowns(prev => ({
            ...prev,
            [name]: !prev[name]
        }));
    };

    // Recursive renderer for links
    const renderLinks = links => (
        <div className="space-y-2">
            {links.map(({ name, path, icon: Icon, isDropdown, subLinks }) =>
                isDropdown ? (
                    <div key={name} className="w-full">
                        <button
                            onClick={() => toggleDropdown(name)}
                            className={`flex items-center justify-between w-full px-4 py-3 rounded-lg border shadow-sm transition-all duration-200 ${
                                openDropdowns[name]
                                    ? "bg-blue-600 text-white border-blue-500"
                                    : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-700 border-blue-200"
                            }`}
                        >
                            <div className="flex items-center gap-3 overflow-hidden">
                                <Icon
                                    className={`w-5 h-5 shrink-0 ${
                                        openDropdowns[name]
                                            ? "text-white"
                                            : "text-blue-600"
                                    }`}
                                />
                                <span className="font-medium text-sm truncate">
                                    {name}
                                </span>
                            </div>
                            {openDropdowns[name] ? (
                                <ChevronUp className="w-4 h-4 shrink-0" />
                            ) : (
                                <ChevronDown className="w-4 h-4 shrink-0" />
                            )}
                        </button>

                        {openDropdowns[name] && subLinks && (
                            <div className="mt-2">{renderLinks(subLinks)}</div>
                        )}
                    </div>
                ) : (
                    <NavLink
                        key={path}
                        to={path}
                        onClick={onClose}
                        className={({ isActive }) =>
                            `flex items-center gap-3 w-full px-4 py-3 rounded-lg border shadow-sm transition-all duration-200 ${
                                isActive
                                    ? "bg-blue-600 text-white border-blue-500"
                                    : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-700 border-blue-200"
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <Icon
                                    className={`w-5 h-5 shrink-0 ${
                                        isActive
                                            ? "text-white"
                                            : "text-blue-600"
                                    }`}
                                />
                                <span className="font-medium text-sm truncate">
                                    {name}
                                </span>
                            </>
                        )}
                    </NavLink>
                )
            )}
        </div>
    );

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                onClick={onClose}
            />

            {/* Mobile Drawer */}
            <div className="fixed top-0 left-0 h-full w-80 bg-gray-50 shadow-2xl z-50 transform transition-transform duration-300 md:hidden border-r border-gray-200 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-blue-600 shrink-0">
                    <h2 className="text-lg font-semibold text-white">Menu</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-white hover:bg-blue-700 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation (scrollable) */}
                <nav className="flex-1 overflow-y-auto p-4">
                    {renderLinks(navLinks)}
                </nav>

                {/* Profile at bottom */}
                <div className="border-t border-gray-200 p-4 shrink-0">
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
