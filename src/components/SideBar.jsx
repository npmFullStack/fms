import { NavLink } from "react-router-dom";

const navLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Booking", path: "/booking" },
    { name: "Shipping Line", path: "/shipping" },
];

const SideBar = () => {
    return (
        <div className="w-64 bg-white border-r min-h-screen p-4 shadow-sm">
            <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
            <nav className="flex flex-col gap-2">
                {navLinks.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) =>
                            `px-4 py-2 rounded hover:bg-blue-100 ${
                                isActive ? "bg-blue-500 text-white" : "text-gray-800"
                            }`
                        }
                    >
                        {link.name}
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};

export default SideBar;
