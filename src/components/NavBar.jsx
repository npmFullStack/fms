import { Link } from "react-router-dom";

const NavBar = () => {
    return (
        <nav className="bg-white border-b shadow-sm px-6 py-4 flex justify-between items-center">
                {/* Logo */}
                <div className="flex flex-col text-left md:text-left">
                    <p className="gradient font-bold text-sm md:text-xl">
                        XTRA-MILE FREIGHT FORWARDING-INC
                    </p>
                    <p className="text-gray-800 font-bold text-sm md:text-xl">
                        FREIGHT MONITORING SYSTEM
                    </p>
                </div>
            <div className="flex items-center space-x-4">
                {/* You can add more links or buttons here */}
                <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default NavBar;
