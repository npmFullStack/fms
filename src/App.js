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
const Bookings = lazy(() => import("./pages/booking/Bookings"));
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
const HouseWaybill = lazy(() => import("./pages/operations/HouseWaybill"));
const IncidentReports = lazy(() =>
    import("./pages/operations/IncidentReports")
);

// Shipping Line sub-pages
const Vessels = lazy(() => import("./pages/operations/shipping-lines/Vessels"));
const RoutesSL = lazy(() => import("./pages/operations/shipping-lines/Routes"));
const ContainerPricing = lazy(() =>
    import("./pages/operations/shipping-lines/ContainerPricing")
);

// Trucking Companies sub-pages
const Trucks = lazy(() =>
    import("./pages/operations/trucking-companies/Trucks")
);
const RoutesPricing = lazy(() =>
    import("./pages/operations/trucking-companies/RoutesPricing")
);

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
                    </Route>

                    {/* Protected routes */}
                    <Route element={<ProtectedLayout />}>
                        <Route path="/dashboard" element={<Dashboard />} />

                        {/* Customer */}
                        <Route
                            path="/bookings"
                            element={<Bookings />}
                        />
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
  path="/partners/shipping-lines/:id"
  element={<ShippingLines />}
/>
<Route
  path="/partners/trucking-companies/:id"
  element={<TruckingCompanies />}
/>

                        <Route
                            path="/house-waybill"
                            element={<HouseWaybill />}
                        />
                        <Route
                            path="/incident-reports"
                            element={<IncidentReports />}
                        />

                        {/* Shipping Line sub-pages */}
                        <Route
                            path="/partners/shipping-lines/vessels"
                            element={<Vessels />}
                        />
                        <Route
                            path="/partners/shipping-lines/routes"
                            element={<RoutesSL />}
                        />
                        <Route
                            path="/partners/shipping-lines/container-pricing"
                            element={<ContainerPricing />}
                        />

                        {/* Trucking Companies sub-pages */}
                        <Route
                            path="/partners/trucking-companies/trucks"
                            element={<Trucks />}
                        />
                        <Route
                            path="/partners/trucking-companies/routes-pricing"
                            element={<RoutesPricing />}
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
        </Router>
    );
}

export default App;
