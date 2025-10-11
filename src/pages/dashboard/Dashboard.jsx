// pages/shared/Dashboard.jsx
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import {
  DollarSign,
  TrendingUp,
  Ship,
  Truck,
  Users,
  Package,
  FileText,
  CheckCircle,
  Clock,
  Activity,
  Wallet,
  BarChart3,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import useAuthStore from "../../utils/store/useAuthStore";
import useBookingStore from "../../utils/store/useBookingStore";
import useFinanceStore from "../../utils/store/useFinanceStore";
import usePartnerStore from "../../utils/store/usePartnerStore";
import useUserStore from "../../utils/store/useUserStore";
import Loading from "../../components/Loading";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const userRole = user?.role || "customer";

  // Stores
  const { bookings, fetchBookings, loading: bookingsLoading } = useBookingStore();
  const { arRecords, apRecords, fetchAR, fetchAP, loading: financeLoading } = useFinanceStore();
  const { partners, fetchPartners, loading: partnersLoading } = usePartnerStore();
  const { users, fetchUsers, loading: usersLoading } = useUserStore();

  // Fetch data on mount
  useEffect(() => {
    fetchBookings();
    fetchPartners();
    fetchAR();
    fetchAP();
    fetchUsers();
  }, [fetchBookings, fetchPartners, fetchAR, fetchAP, fetchUsers]);

  // ✅ ALL HOOKS AT TOP LEVEL - Fix React Hooks rules
  const safeBookings = useMemo(() => (Array.isArray(bookings) ? bookings : []), [bookings]);
  const safeARRecords = useMemo(() => (Array.isArray(arRecords) ? arRecords : []), [arRecords]);
  const safeAPRecords = useMemo(() => (Array.isArray(apRecords) ? apRecords : []), [apRecords]);
  const safePartners = useMemo(() => (Array.isArray(partners) ? partners : []), [partners]);
  const safeUsers = useMemo(() => (Array.isArray(users) ? users : []), [users]);

  // Month helper
  const monthName = (i) =>
    ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i];

  // Revenue data from AR
  const revenueData = useMemo(() => {
    if (!safeARRecords.length) return [];
    const grouped = {};
    safeARRecords.forEach((r) => {
      const amount = Number(r.pesos || 0);
      const date = new Date(r.date || r.created_at || Date.now());
      if (isNaN(date.getTime())) return;
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      grouped[key] = (grouped[key] || 0) + amount;
    });

    return Object.entries(grouped)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .slice(-6) // Last 6 months
      .map(([key, revenue]) => {
        const [y, m] = key.split("-");
        return { month: `${monthName(Number(m))}`, revenue };
      });
  }, [safeARRecords]);

  // Bookings per month trend
  const bookingTrendData = useMemo(() => {
    if (!safeBookings.length) return [];
    const grouped = {};
    safeBookings.forEach((b) => {
      const date = new Date(b.created_at || Date.now());
      if (isNaN(date.getTime())) return;
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      grouped[key] = (grouped[key] || 0) + 1;
    });
    return Object.entries(grouped)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .slice(-6) // Last 6 months
      .map(([key, count]) => {
        const [y, m] = key.split("-");
        return { month: `${monthName(Number(m))}`, bookings: count };
      });
  }, [safeBookings]);

  // Booking status distribution
  const bookingStatusData = useMemo(() => {
    if (!safeBookings.length) return [];
    const grouped = {};
    safeBookings.forEach((b) => {
      const key = b.status || "UNKNOWN";
      grouped[key] = (grouped[key] || 0) + 1;
    });
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [safeBookings]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalBookings = safeBookings.length;
    const deliveredBookings = safeBookings.filter(b => b.status === "DELIVERED").length;
    const inTransitBookings = safeBookings.filter(b => b.status === "IN_TRANSIT").length;
    const pendingBookings = safeBookings.filter(b => b.status === "PICKUP_SCHEDULED").length;

    const totalReceivable = safeARRecords.reduce((sum, r) => sum + (Number(r.pesos) || 0), 0);
    const totalPayable = safeAPRecords.reduce((sum, r) => sum + (Number(r.total_expenses_with_bir) || 0), 0);
    const grossRevenue = totalReceivable - totalPayable;

    const shippingLines = safePartners.filter(p => p.type === "shipping").length;
    const truckingCompanies = safePartners.filter(p => p.type === "trucking").length;

    const totalUsers = safeUsers.length;
    const activeUsers = safeUsers.filter(u => u.is_active).length;

    // Calculate delivery rate
    const deliveryRate = totalBookings > 0 ? (deliveredBookings / totalBookings) * 100 : 0;

    return {
      totalBookings,
      deliveredBookings,
      inTransitBookings,
      pendingBookings,
      totalReceivable,
      totalPayable,
      grossRevenue,
      shippingLines,
      truckingCompanies,
      totalUsers,
      activeUsers,
      deliveryRate
    };
  }, [safeBookings, safeARRecords, safeAPRecords, safePartners, safeUsers]);

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4"];

  const loading = bookingsLoading || financeLoading || partnersLoading || usersLoading;

  if (loading) return <Loading />;

  // Stat Component
  const Stat = ({ title, value, subtitle, icon: Icon, onClick, trend }) => (
    <div
      onClick={onClick}
      className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-all cursor-pointer hover:shadow-md"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Icon className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600">{title}</h3>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );

  // Progress Component
  const Progress = ({ title, percentage, label, color }) => (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        <span className="text-sm font-bold text-gray-900">{percentage.toFixed(1)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div
          className={`${color} h-2 rounded-full transition-all duration-500`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      {label && <p className="text-xs text-gray-500">{label}</p>}
    </div>
  );

  // Chart Container Component
  const ChartContainer = ({ title, icon: Icon, children, className = "" }) => (
    <div className={`bg-gray-50 rounded-lg p-4 border border-gray-200 ${className}`}>
      <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 text-gray-900">
        <Icon className="w-5 h-5 text-blue-600" />
        {title}
      </h2>
      {children}
    </div>
  );

  // Render based on role
  const renderDashboard = () => {
    switch (userRole) {
      case "general_manager":
        return (
          <div className="space-y-6">
            {/* Revenue Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Stat
                title="Gross Revenue"
                value={`₱${metrics.grossRevenue.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`}
                subtitle="Total Revenue - Expenses"
                icon={TrendingUp}
                onClick={() => navigate("/dashboard/accounts-receivable")}
                trend={12.5}
              />
              <Stat
                title="Total Receivable"
                value={`₱${metrics.totalReceivable.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`}
                subtitle={`${safeARRecords.length} records`}
                icon={DollarSign}
                onClick={() => navigate("/dashboard/accounts-receivable")}
                trend={8.3}
              />
              <Stat
                title="Total Payable"
                value={`₱${metrics.totalPayable.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`}
                subtitle={`${safeAPRecords.length} records`}
                icon={Wallet}
                onClick={() => navigate("/dashboard/accounts-payable")}
                trend={-3.2}
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Revenue Chart */}
              <ChartContainer title="Revenue Trend (Last 6 Months)" icon={BarChart3}>
                {revenueData.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No revenue data available</p>
                ) : (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip
                        formatter={(v) =>
                          new Intl.NumberFormat("en-PH", {
                            style: "currency",
                            currency: "PHP",
                          }).format(v)
                        }
                      />
                      <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </ChartContainer>

              {/* Status Distribution */}
              <ChartContainer title="Booking Status Distribution" icon={Activity}>
                {bookingStatusData.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No booking data available</p>
                ) : (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={bookingStatusData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {bookingStatusData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </ChartContainer>
            </div>

            {/* Progress Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Progress
                title="Delivery Success Rate"
                percentage={metrics.deliveryRate}
                label={`${metrics.deliveredBookings} of ${metrics.totalBookings} bookings delivered`}
                color="bg-green-500"
              />
              <Progress
                title="User Activity Rate"
                percentage={metrics.totalUsers > 0 ? (metrics.activeUsers / metrics.totalUsers) * 100 : 0}
                label={`${metrics.activeUsers} of ${metrics.totalUsers} users active`}
                color="bg-blue-500"
              />
            </div>

            {/* Bookings & Partners Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Stat
                title="Total Bookings"
                value={metrics.totalBookings}
                icon={Package}
                onClick={() => navigate("/bookings")}
              />
              <Stat
                title="Delivered"
                value={metrics.deliveredBookings}
                icon={CheckCircle}
                onClick={() => navigate("/cargo-monitoring")}
              />
              <Stat
                title="In Transit"
                value={metrics.inTransitBookings}
                icon={Activity}
                onClick={() => navigate("/cargo-monitoring")}
              />
              <Stat
                title="Pending"
                value={metrics.pendingBookings}
                icon={Clock}
                onClick={() => navigate("/cargo-monitoring")}
              />
            </div>

            {/* Partners & Users */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Stat
                title="Shipping Lines"
                value={metrics.shippingLines}
                icon={Ship}
                onClick={() => navigate("/partners")}
              />
              <Stat
                title="Trucking Companies"
                value={metrics.truckingCompanies}
                icon={Truck}
                onClick={() => navigate("/partners")}
              />
              <Stat
                title="Active Users"
                value={metrics.activeUsers}
                subtitle={`${metrics.totalUsers} total`}
                icon={Users}
                onClick={() => navigate("/users")}
              />
            </div>
          </div>
        );

      case "marketing_coordinator":
        return (
          <div className="space-y-6">
            {/* Bookings Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Stat
                title="Total Bookings"
                value={metrics.totalBookings}
                icon={Package}
                onClick={() => navigate("/bookings")}
              />
              <Stat
                title="Delivered"
                value={metrics.deliveredBookings}
                icon={CheckCircle}
                onClick={() => navigate("/cargo-monitoring")}
              />
              <Stat
                title="In Transit"
                value={metrics.inTransitBookings}
                icon={Activity}
                onClick={() => navigate("/cargo-monitoring")}
              />
              <Stat
                title="Pending"
                value={metrics.pendingBookings}
                icon={Clock}
                onClick={() => navigate("/cargo-monitoring")}
              />
            </div>

            {/* Booking Trend Chart */}
            <ChartContainer title="Booking Trends (Last 6 Months)" icon={BarChart3}>
              {bookingTrendData.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No booking trend data available</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={bookingTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="bookings"
                      stroke="#2563eb"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </ChartContainer>

            {/* Progress Widget */}
            <Progress
              title="Delivery Success Rate"
              percentage={metrics.deliveryRate}
              label={`${metrics.deliveredBookings} of ${metrics.totalBookings} bookings delivered`}
              color="bg-green-500"
            />

            {/* Partners */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Stat
                title="Shipping Lines"
                value={metrics.shippingLines}
                icon={Ship}
                onClick={() => navigate("/partners")}
              />
              <Stat
                title="Trucking Companies"
                value={metrics.truckingCompanies}
                icon={Truck}
                onClick={() => navigate("/partners")}
              />
            </div>
          </div>
        );

      case "admin_finance":
        return (
          <div className="space-y-6">
            {/* Finance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Stat
                title="Total Receivable"
                value={`₱${metrics.totalReceivable.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`}
                subtitle={`${safeARRecords.length} records`}
                icon={DollarSign}
                onClick={() => navigate("/dashboard/accounts-receivable")}
                trend={5.2}
              />
              <Stat
                title="Total Payable"
                value={`₱${metrics.totalPayable.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`}
                subtitle={`${safeAPRecords.length} records`}
                icon={Wallet}
                onClick={() => navigate("/dashboard/accounts-payable")}
                trend={-2.1}
              />
            </div>

            {/* Quick Access */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                onClick={() => navigate("/dashboard/accounts-receivable")}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-green-300 transition-all cursor-pointer hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FileText className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Accounts Receivable</h3>
                    <p className="text-sm text-gray-500">Manage customer payments and invoices</p>
                  </div>
                </div>
              </div>

              <div
                onClick={() => navigate("/dashboard/accounts-payable")}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-red-300 transition-all cursor-pointer hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <FileText className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Accounts Payable</h3>
                    <p className="text-sm text-gray-500">Track expenses and vendor payments</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-gray-50 rounded-lg p-8 border border-gray-200 text-center">
            <div className="p-4 bg-blue-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <Users className="h-10 w-10 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome!</h2>
            <p className="text-gray-600 mb-6">Your dashboard is ready.</p>
            <button
              onClick={() => navigate("/bookings")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Bookings
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">
              Welcome back, {user?.email || "User"}! Here's your overview.
            </p>
          </div>

          {/* Role-based Dashboard */}
          {renderDashboard()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;