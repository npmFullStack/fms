import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Menu, UserCircle } from "lucide-react";
import useAuthStore from "../utils/store/useAuthStore";

const NavBar = ({ onToggleSidebar }) => {
    const { user, logout } = useAuthStore();
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <nav className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center shadow-md">
            {/* Left side: Sidebar toggle */}
            <div className="flex items-center gap-3">
                <button onClick={onToggleSidebar}>
                    <Menu className="w-6 h-6" />
                </button>
                <span className="text-lg font-semibold hidden sm:block">
                    X-TRA MILE FREIGHT FORWARDING INC.
                </span>
            </div>

            {/* Right side: Icons */}
            <div className="flex items-center gap-4 relative">
                <Bell className="w-6 h-6 cursor-pointer" />
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center gap-1"
                >
                    {user?.profile_picture ? (
                        <img
                            src={user.profile_picture}
                            alt="Profile"
                            className="w-7 h-7 rounded-full object-cover"
                        />
                    ) : (
                        <UserCircle className="w-7 h-7" />
                    )}
                    <span className="hidden sm:block">
                        {user?.first_name || "User"}
                    </span>
                </button>

                {menuOpen && (
                    <div className="absolute right-0 top-full bg-white text-gray-800 rounded shadow-md w-40 z-10">
                        <button
                            onClick={() => {
                                setMenuOpen(false);
                                navigate("/profile");
                            }}
                            className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                        >
                            Profile
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
