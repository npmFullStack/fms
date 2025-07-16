import Header from "./Header";

const Layout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex flex-1">
                <main className="flex-1">{children}</main>
            </div>
        </div>
    );
};

export default Layout;
