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

// Customer
const BookingCreate = lazy(() => import("./pages/booking/BookingCreate")); // Unified D2D/P2P form
const BookingLogs = lazy(() => import("./pages/booking/BookingLogs"));
const TrackOrder = lazy(() => import("./pages/booking/TrackOrder"));

// Marketing Coordinator
const Bookings = lazy(() => import("./pages/operations/Bookings")); // Master bookings table
const CargoMonitoring = lazy(() => import("./pages/operations/CargoMonitoring"));
const Partners = lazy(() => import("./pages/operations/Partners")); // Shipping/trucking CRUD
const HouseWaybill = lazy(() => import("./pages/operations/HouseWaybill"));
const IncidentReports = lazy(() => import("./pages/operations/IncidentReports"));

// Admin Finance
const AccountsReceivable = lazy(() => import("./pages/finance/AccountsReceivable"));
const AccountsPayable = lazy(() => import("./pages/finance/AccountsPayable"));
const PriceQuotes = lazy(() => import("./pages/finance/PriceQuotes")); // Negotiated rates log
const PaymentReconciliation = lazy(() => import("./pages/finance/PaymentReconciliation"));

// General Manager
const FinancialOverview = lazy(() => import("./pages/management/FinancialOverview"));
const PartnerContracts = lazy(() => import("./pages/management/PartnerContracts")); // Contract PDFs
const AuditLogs = lazy(() => import("./pages/management/AuditLogs"));
const AccountManagement = lazy(() => import("./pages/management/AccountManagement"));

function App() {
    return (
        <Router>
            <Suspense fallback={<Loading />}>
                <Routes>
                    {/* Public routes */}
                    <Route element={<PublicLayout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Route>

                    {/* Protected routes */}
                    <Route element={<ProtectedLayout />}>
                        <Route path="/dashboard" element={<Dashboard />} />

                        {/* Customer */}
                        <Route path="/booking/create" element={<BookingCreate />} />
                        <Route path="/booking/logs" element={<BookingLogs />} />
                        <Route path="/track-order" element={<TrackOrder />} />

                        {/* Marketing Coordinator */}
                        <Route path="/bookings" element={<Bookings />} />
                        <Route path="/cargo-monitoring" element={<CargoMonitoring />} />
                        <Route path="/partners" element={<Partners />} />
                        <Route path="/house-waybill" element={<HouseWaybill />} />
                        <Route path="/incident-reports" element={<IncidentReports />} />

                        {/* Admin Finance */}
                        <Route path="/accounts-receivable" element={<AccountsReceivable />} />
                        <Route path="/accounts-payable" element={<AccountsPayable />} />
                        <Route path="/price-quotes" element={<PriceQuotes />} />
                        <Route path="/payment-reconciliation" element={<PaymentReconciliation />} />

                        {/* General Manager */}
                        <Route path="/financial-overview" element={<FinancialOverview />} />
                        <Route path="/partner-contracts" element={<PartnerContracts />} />
                        <Route path="/audit-logs" element={<AuditLogs />} />
                        <Route path="/account-management" element={<AccountManagement />} />
                    </Route>
                </Routes>
            </Suspense>
        </Router>
    );
}

export default App;