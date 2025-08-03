import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import Loading from "../components/Loading";
import useAuthStore from "../utils/store/useAuthStore";

const ProtectedLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { user, loading, fetchUser } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        fetchUser(navigate);
    }, [fetchUser, navigate]);

    if (loading) return <Loading />;

    return (
        <div className="flex flex-col h-screen text-gray-800">
            {/* Top Navbar */}
            <div className="flex-shrink-0">
                <NavBar onToggleSidebar={() => setIsSidebarOpen(prev => !prev)} />
            </div>

            {/* Main Body */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <div className="h-full">
                    <SideBar
                        isOpen={isSidebarOpen}
                        user={user}
                        className={`${
                            isSidebarOpen ? "w-64" : "w-20"
                        } transition-all duration-300 ease-in-out h-full`}
                    />
                </div>

                {/* Page Content */}
                <main className="flex-1 overflow-auto p-4 bg-gray-100">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default ProtectedLayout;
