import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Activity,
  BarChart3,
  Clock,
  Package,
  TrendingUp,
  AlertCircle,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

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
  const { arRecords, fetchAR, loading: financeLoading } = useFinanceStore();
  const { fetchPartners, loading: partnersLoading } = usePartnerStore();
  const { users, fetchUsers, loading: usersLoading } = useUserStore();

  // Date range
  const [dateRange, setDateRange] = useState([
    new Date(new Date().setMonth(new Date().getMonth() - 6)),
    new Date(),
  ]);

  useEffect(() => {
    fetchBookings();
    fetchPartners();
    fetchAR();
    fetchUsers();
  }, [fetchBookings, fetchPartners, fetchAR, fetchUsers]);

  // Safe arrays
  const safeBookings = Array.isArray(bookings) ? bookings : [];
  const safeARRecords = Array.isArray(arRecords) ? arRecords : [];
  const safeUsers = Array.isArray(users) ? users : [];

  // Filter data by date
  const filterByDate = (arr, key) =>
    arr.filter((item) => {
      const d = new Date(item[key] || item.created_at);
      return d >= dateRange[0] && d <= dateRange[1];
    });

  const filteredBookings = useMemo(() => filterByDate(safeBookings, "created_at"), [safeBookings, dateRange]);
  const filteredAR = useMemo(() => filterByDate(safeARRecords, "date"), [safeARRecords, dateRange]);

  const monthName = (i) =>
    ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i];

  // Chart data
  const revenueData = useMemo(() => {
    const grouped = {};
    filteredAR.forEach((r) => {
      const amount = Number(r.pesos || 0);
      const date = new Date(r.date || r.created_at);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      grouped[key] = (grouped[key] || 0) + amount;
    });
    return Object.entries(grouped)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .map(([key, revenue]) => {
        const [, m] = key.split("-");
        return { month: monthName(Number(m)), revenue };
      });
  }, [filteredAR]);

  const bookingTrendData = useMemo(() => {
    const grouped = {};
    filteredBookings.forEach((b) => {
      const date = new Date(b.created_at);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      grouped[key] = (grouped[key] || 0) + 1;
    });
    return Object.entries(grouped)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .map(([key, count]) => {
        const [, m] = key.split("-");
        return { month: monthName(Number(m)), bookings: count };
      });
  }, [filteredBookings]);

  const bookingStatusData = useMemo(() => {
    const grouped = {};
    filteredBookings.forEach((b) => {
      const key = b.status || "UNKNOWN";
      grouped[key] = (grouped[key] || 0) + 1;
    });
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [filteredBookings]);

  const metrics = useMemo(() => {
    const total = filteredBookings.length;
    const delivered = filteredBookings.filter((b) => b.status === "DELIVERED").length;
    const rate = total ? (delivered / total) * 100 : 0;
    const activeUsers = safeUsers.filter((u) => u.is_active).length;
    return { total, delivered, rate, activeUsers };
  }, [filteredBookings, safeUsers]);

  const recentActivity = useMemo(() => {
    const logs = [
      ...filteredBookings.map((b) => ({
        type: "Booking",
        desc: `Booking #${b.id || "N/A"} created`,
        time: b.created_at,
      })),
      ...safeUsers.map((u) => ({
        type: "User",
        desc: `${u.email} ${u.is_active ? "logged in" : "created"}`,
        time: u.created_at,
      })),
    ];
    return logs.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);
  }, [filteredBookings, safeUsers]);

  const COLORS = ["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#1d4ed8"];
  const loading = bookingsLoading || financeLoading || partnersLoading || usersLoading;
  if (loading) return <Loading />;

  // Summary section
  const SummaryInsights = () => (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-sm text-blue-900 mb-6 flex items-center gap-3"
      data-tooltip-id="summary-tip"
      data-tooltip-content="Overall delivery performance"
    >
      {metrics.total ? (
        <>
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <span>
            <strong>{metrics.delivered}</strong> of <strong>{metrics.total}</strong> bookings delivered (
            <CountUp end={metrics.rate} decimals={1} />%)
            {metrics.rate > 90 ? (
              <span className="ml-1 text-blue-700 font-medium">– Excellent performance!</span>
            ) : (
              <span className="ml-1 text-blue-700 font-medium">– Keep improving!</span>
            )}
          </span>
        </>
      ) : (
        <>
          <Package className="w-5 h-5 text-blue-600" />
          <span>No bookings in this date range.</span>
        </>
      )}
      <Tooltip id="summary-tip" place="top" />
    </motion.div>
  );

  const ChartContainer = ({ title, icon: Icon, children }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-xl p-5 shadow-sm border border-blue-100"
      data-tooltip-id={`chart-${title}`}
      data-tooltip-content={title}
    >
      <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 text-gray-900">
        <Icon className="w-5 h-5 text-blue-600" /> {title}
      </h2>
      {children}
      <Tooltip id={`chart-${title}`} place="right" />
    </motion.div>
  );

  // Simple Datetime Range (no react-hook-form)
  const DateRangeSelector = () => (
    <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-blue-200 shadow-sm">
      <Datetime
        value={dateRange[0]}
        onChange={(d) => setDateRange([d.toDate ? d.toDate() : d, dateRange[1]])}
        timeFormat={false}
        inputProps={{ className: "border-none text-sm text-gray-700" }}
      />
      <span className="text-gray-500">to</span>
      <Datetime
        value={dateRange[1]}
        onChange={(d) => setDateRange([dateRange[0], d.toDate ? d.toDate() : d])}
        timeFormat={false}
        inputProps={{ className: "border-none text-sm text-gray-700" }}
      />
    </div>
  );

  // Role-based dashboard sections
  const renderDashboard = () => {
    switch (userRole) {
      case "general_manager":
        return (
          <div className="space-y-8">
            <SummaryInsights />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartContainer title="Revenue Overview" icon={BarChart3}>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <ReTooltip />
                    <Bar dataKey="revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>

              <ChartContainer title="Booking Status Distribution" icon={Activity}>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={bookingStatusData} dataKey="value" nameKey="name" outerRadius={90} label>
                      {bookingStatusData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <ReTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>

            {/* Recent Activity */}
            <div>
              <h3 className="text-md font-semibold mb-3 flex items-center gap-2 text-blue-700">
                <Clock className="w-4 h-4" /> Recent Activity
              </h3>
              <ul className="divide-y divide-blue-100 bg-blue-50 rounded-lg border border-blue-100">
                {recentActivity.map((a, i) => (
                  <li key={i} className="py-2 px-3 text-sm text-gray-700 flex justify-between">
                    <span>{a.desc}</span>
                    <span className="text-gray-400 text-xs">{new Date(a.time).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );

      case "marketing_coordinator":
        return (
          <div className="space-y-8">
            <SummaryInsights />
            <ChartContainer title="Booking Trends" icon={BarChart3}>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={bookingTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <ReTooltip />
                  <Bar dataKey="bookings" fill="#2563eb" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        );

      case "admin_finance":
        return (
          <div className="space-y-8">
            <SummaryInsights />
            <ChartContainer title="Revenue Overview" icon={FileText}>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <ReTooltip />
                  <Bar dataKey="revenue" fill="#1e40af" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        );

      default:
        return (
          <div className="text-center text-gray-700 mt-10">
            <AlertCircle className="mx-auto w-8 h-8 text-blue-600 mb-2" />
            <h2 className="text-2xl font-semibold mb-2">Welcome!</h2>
            <p>Your dashboard overview will appear here.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100">
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.email || "User"} 👋</p>
            </div>
            <DateRangeSelector />
          </div>

          {renderDashboard()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
