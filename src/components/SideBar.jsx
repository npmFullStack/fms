import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/axios";
import Loading from "../components/Loading";

const navLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Booking", path: "/booking" },
    { name: "Shipping Line", path: "/shipping" }
];

const SideBar = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get("/auth/profile");
                setUser(res.data.user);
            } catch (error) {
                console.log("Not authorized", error.response?.data?.message);
                navigate("/login");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [navigate]);

    if (loading) return <Loading />;

    return (
        <div className="w-64 bg-white border-r min-h-screen p-4 shadow-sm flex flex-col">
            <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

            <nav className="flex flex-col gap-2 flex-grow">
                {navLinks.map(link => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) =>
                            `px-4 py-2 rounded font-medium transition-colors duration-200 ${
                                isActive
                                    ? "bg-blue-500 text-white"
                                    : "text-gray-800 hover:bg-blue-100"
                            }`
                        }
                    >
                        {link.name}
                    </NavLink>
                ))}
            </nav>

            <div className="mt-auto px-3 py-2 text-center bg-gray-700 text-white rounded">
                {user?.email}
            </div>
        </div>
    );
};

export default SideBar;
