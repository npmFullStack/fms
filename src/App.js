import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import PublicLayout from "./components/PublicLayout";
import ProtectedLayout from "./components/ProtectedLayout";
import Loading from "./components/Loading";
import { Toaster } from "react-hot-toast";

// Public pages
const Home = lazy(() => import("./pages/public/Home"));
const Login = lazy(() => import("./pages/public/Login"));
const Register = lazy(() => import("./pages/public/Register"));
const ForgotPassword = lazy(() => import("./pages/public/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/public/ResetPassword"));
const TermsConditions = lazy(() => import("./pages/public/TermsConditions"));

// Shared Protected
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));

// Customer
const CustomerBookings = lazy(() => import("./pages/booking/CustomerBookings"));

const BookingLogs = lazy(() => import("./pages/booking/BookingLogs"));
const TrackOrder = lazy(() => import("./pages/booking/TrackOrder"));

// Marketing Coordinator
const CargoMonitoring = lazy(() =>
    import("./pages/operations/CargoMonitoring")
);
const Partners = lazy(() => import("./pages/operations/Partners"));
const ShippingLines = lazy(() => import("./pages/operations/ShippingLines"));
const TruckingCompanies = lazy(() =>
    import("./pages/operations/TruckingCompanies")
);
const IncidentReports = lazy(() =>
    import("./pages/operations/IncidentReports")
);
const Bookings = lazy(() => import("./pages/booking/Bookings"));
// Admin Finance
const AccountsReceivable = lazy(() =>
    import("./pages/finance/AccountsReceivable")
);
const AccountsPayable = lazy(() => import("./pages/finance/AccountsPayable"));
const PriceQuotes = lazy(() => import("./pages/finance/PriceQuotes"));
const PaymentReconciliation = lazy(() =>
    import("./pages/finance/PaymentReconciliation")
);

// General Manager
const FinancialOverview = lazy(() =>
    import("./pages/management/FinancialOverview")
);
const PartnerContracts = lazy(() =>
    import("./pages/management/PartnerContracts")
);
const AuditLogs = lazy(() => import("./pages/management/AuditLogs"));
const AccountManagement = lazy(() =>
    import("./pages/management/AccountManagement")
);

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
                        <Route
                            path="/forgot-password"
                            element={<ForgotPassword />}
                        />
                        <Route path="/reset-password" element={<ResetPassword />} />
                        <Route path="/terms-conditions"
                        element={<TermsConditions />} />

                    </Route>



                    {/* Protected routes */}
                    <Route element={<ProtectedLayout />}>
                        <Route path="/dashboard" element={<Dashboard />} />

                        {/* Customer */}
                        <Route path="/booking" element={<CustomerBookings />} />
                        <Route path="/booking/logs" element={<BookingLogs />} />
                        <Route path="/track-order" element={<TrackOrder />} />

                        {/* Marketing Coordinator */}
                        <Route path="/bookings" element={<Bookings />} />
                        <Route
                            path="/cargo-monitoring"
                            element={<CargoMonitoring />}
                        />
                        <Route path="/partners" element={<Partners />} />
                        <Route
                            path="/operations/shipping-lines/:id"
                            element={<ShippingLines />}
                        />
                        <Route
                            path="/operations/trucking-companies/:id"
                            element={<TruckingCompanies />}
                        />

                        <Route
                            path="/incident-reports"
                            element={<IncidentReports />}
                        />

                        {/* Admin Finance */}
                        <Route
                            path="/accounts-receivable"
                            element={<AccountsReceivable />}
                        />
                        <Route
                            path="/accounts-payable"
                            element={<AccountsPayable />}
                        />
                        <Route path="/price-quotes" element={<PriceQuotes />} />
                        <Route
                            path="/payment-reconciliation"
                            element={<PaymentReconciliation />}
                        />

                        {/* General Manager */}
                        <Route
                            path="/financial-overview"
                            element={<FinancialOverview />}
                        />
                        <Route
                            path="/partner-contracts"
                            element={<PartnerContracts />}
                        />
                        <Route path="/audit-logs" element={<AuditLogs />} />
                        <Route
                            path="/account-management"
                            element={<AccountManagement />}
                        />
                    </Route>
                </Routes>
            </Suspense>
            {/* TOAST */}
            <Toaster
                position="top-center"
                containerStyle={{
                    position: "fixed",
                    top: "1rem",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 9999
                }}
                toastOptions={{
                    duration: 1500,
                    className: `
            font-[Poppins] rounded-lg border
            shadow-lg border-l-4 px-4 py-3
        `,
                    style: {
                        minWidth: "280px",
                        maxWidth: "min(90vw, 350px)",
                        margin: "0.5rem auto"
                    },
                    success: {
                        className:
                            "!bg-green-100 !text-green-800 !border-green-200 !border-l-green-500"
                    },
                    error: {
                        className:
                            "!bg-red-100 !text-red-800 !border-red-200 !border-l-red-500"
                    },
                    loading: {
                        className:
                            "!bg-blue-100 !text-blue-800 !border-blue-200 !border-l-blue-500"
                    }
                }}
                gutter={8}
            />
        </Router>
    );
}

export default App;
