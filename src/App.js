import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import PublicLayout from "./components/PublicLayout";
import ProtectedLayout from "./components/ProtectedLayout";
import Loading from "./components/Loading";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Booking = lazy(() => import("./pages/Booking"));
const ShippingLine = lazy(() => import("./pages/ShippingLine"));

function App() {
    return (
        <Router>
            <Suspense fallback={<Loading />}>
                <Routes>
                    {/* Public layout pages */}
                    <Route element={<PublicLayout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Route>

                    {/* Protected layout pages */}
                    <Route element={<ProtectedLayout />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/booking" element={<Booking />} />
                        <Route path="/shipping" element={<ShippingLine />} />
                    </Route>
                </Routes>
            </Suspense>
        </Router>
    );
}

export default App;
