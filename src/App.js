import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import PublicLayout from "./components/PublicLayout";
import ProtectedLayout from "./components/ProtectedLayout";
import Loading from "./components/Loading";

// Public pages
const Home = lazy(() => import("./pages/public/Home"));
const Login = lazy(() => import("./pages/public/Login"));
const Register = lazy(() => import("./pages/public/Register"));

// Shared Protected
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));

// Booking-related (Customer)
const Booking = lazy(() => import("./pages/booking/Booking"));
const BookingCreate = lazy(() => import("./pages/booking/BookingCreate"));
const BookingLogs = lazy(() => import("./pages/booking/BookingLogs"));
const TrackOrder = lazy(() => import("./pages/booking/TrackOrder"));

// Operations (Marketing Coordinator)
const Bookings = lazy(() => import("./pages/operations/Bookings"));
const CargoMonitoring = lazy(() =>
    import("./pages/operations/CargoMonitoring")
);
const ShippingLines = lazy(() => import("./pages/operations/ShippingLines"));
const TruckingCompanies = lazy(() =>
    import("./pages/operations/TruckingCompanies")
);

// Finance (Admin Finance + General Manager)
const AccountsReceivable = lazy(() =>
    import("./pages/finance/AccountsReceivable")
);
const AccountsPayable = lazy(() => import("./pages/finance/AccountsPayable"));
const Billing = lazy(() => import("./pages/finance/Billing"));
const FinancialOverview = lazy(() =>
    import("./pages/finance/FinancialOverview")
);

// Management (General Manager)
const Reports = lazy(() => import("./pages/management/Reports"));
const AccountManagement = lazy(() =>
    import("./pages/management/AccountManagement")
);

function App() {
    return (
        <Router>
            <Suspense fallback={<Loading />}>
                <Routes>
                    {/* Public layout */}
                    <Route element={<PublicLayout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Route>

                    {/* Protected layout */}
                    <Route element={<ProtectedLayout />}>
                        {/* Shared */}
                        <Route path="/dashboard" element={<Dashboard />} />

                        {/* Booking (Customer) */}
                        <Route path="/booking" element={<Booking />} />
                        <Route
                            path="/booking/create"
                            element={<BookingCreate />}
                        />
                        <Route path="/booking/logs" element={<BookingLogs />} />
                        <Route path="/track-order" element={<TrackOrder />} />

                        {/* Operations */}
                        <Route path="/bookings" element={<Bookings />} />
                        <Route
                            path="/cargo-monitoring"
                            element={<CargoMonitoring />}
                        />
                        <Route
                            path="/shipping-lines"
                            element={<ShippingLines />}
                        />
                        <Route
                            path="/trucking-companies"
                            element={<TruckingCompanies />}
                        />

                        {/* Finance */}
                        <Route
                            path="/accounts-receivable"
                            element={<AccountsReceivable />}
                        />
                        <Route
                            path="/accounts-payable"
                            element={<AccountsPayable />}
                        />
                        <Route path="/billing" element={<Billing />} />
                        <Route
                            path="/financial-overview"
                            element={<FinancialOverview />}
                        />

                        {/* Management */}
                        <Route path="/reports" element={<Reports />} />
                        <Route
                            path="/account-management"
                            element={<AccountManagement />}
                        />
                    </Route>
                </Routes>
            </Suspense>
        </Router>
    );
}

export default App;
