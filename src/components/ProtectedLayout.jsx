import NavBar from "./NavBar";
import SideBar from "./SideBar";
import { Outlet } from "react-router-dom";

const ProtectedLayout = () => {
    return (
        <div className="flex min-h-screen">
            <SideBar />
            <div className="flex flex-col flex-1">
                <NavBar />
                <main className="flex-1 p-4 bg-gray-50">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default ProtectedLayout;
