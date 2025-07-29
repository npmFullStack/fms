import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PublicLayout from "./components/PublicLayout";
import ProtectedLayout from "./components/ProtectedLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Booking from "./pages/Booking";
import ShippingLine from "./pages/ShippingLine";

function App() {
    return (
        <Router>
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
        </Router>
    );
}

export default App;
