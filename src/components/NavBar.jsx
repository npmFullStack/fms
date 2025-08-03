import useAuthStore from "../utils/store/useAuthStore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    BellIcon,
    Bars3Icon,
    UserCircleIcon
} from "@heroicons/react/24/outline";

const NavBar = ({ onToggleSidebar }) => {
    const { user, fetchUser, logout } = useAuthStore();
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUser(navigate); // load user info on mount
    }, [fetchUser, navigate]);

    return (
        <nav className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center shadow-md">
            {/* Left side: Sidebar toggle */}
            <div className="flex items-center gap-3">
                <button onClick={onToggleSidebar}>
                    <Bars3Icon className="w-6 h-6" />
                </button>
                <span className="text-lg font-semibold hidden sm:block">
                    X-TRA MILE FREIGHT FORWARDING INC.
                </span>
            </div>

            {/* Right side: Icons */}
            <div className="flex items-center gap-4 relative">
                <BellIcon className="w-6 h-6 cursor-pointer" />
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center gap-1"
                >
                    <UserCircleIcon className="w-7 h-7" />
                    <span className="hidden sm:block">{user?.first_name}</span>
                </button>

{menuOpen && (
    <div className="absolute right-0 top-full bg-white text-gray-800 rounded shadow-md w-40 z-10">
        <button className="block w-full px-4 py-2 text-left hover:bg-gray-100">
            Settings
        </button>
        <button
            onClick={() => logout(navigate)}
            className="block w-full px-4 py-2 text-left hover:bg-gray-100"
        >
            Logout
        </button>
    </div>
)}
            </div>
        </nav>
    );
};

export default NavBar;
