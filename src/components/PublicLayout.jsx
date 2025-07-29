import Header from "./Header";
import { Outlet } from "react-router-dom";

const PublicLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    );
};

export default PublicLayout;
