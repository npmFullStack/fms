import NavBar from "./NavBar";
import SideBar from "./SideBar";
import { Outlet } from "react-router-dom";

const ProtectedLayout = () => {
    return (
        <div className="flex min-h-screen">
            <div className="flex flex-col flex-1">
                <NavBar />

                <main className="flex-1">
                                <SideBar />
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default ProtectedLayout;
