// src/pages/dashboard/Dashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
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
  FileText,
  Package,
  TrendingUp,
  Calendar as CalendarIcon,
  DollarSign,
  Users as UsersIcon,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import Select from "react-select";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

import useAuthStore from "../../utils/store/useAuthStore";
import useBookingStore from "../../utils/store/useBookingStore";
import useFinanceStore from "../../utils/store/useFinanceStore";
import usePartnerStore from "../../utils/store/usePartnerStore";
import useUserStore from "../../utils/store/useUserStore";

import Loading from "../../components/Loading";
import StatCard from "../../components/cards/StatCard"; // <-- using your StatCard

const DATE_OPTIONS = [
  { value: "this_day", label: "Today" },
  { value: "this_week", label: "This Week" },
  { value: "this_month", label: "This Month" },
  { value: "this_year", label: "This Year" },
];

const monthName = (i) =>
  ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i];

const COLORS = ["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#1d4ed8"];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const userRole = user?.role || "customer";

  // stores (Zustand)
  const { bookings, fetchBookings, loading: bookingsLoading } = useBookingStore();
  const { arRecords, apRecords, fetchAR, fetchAP, loading: financeLoading } = useFinanceStore();
  const { fetchPartners, loading: partnersLoading } = usePartnerStore();
  const { users, fetchUsers, loading: usersLoading } = useUserStore();

  // Date filter (react-select)
  const [dateFilter, setDateFilter] = useState(DATE_OPTIONS[2]); // default this_month
  const [dateRange, setDateRange] = useState(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    return [start, now];
  });

  // derive dateRange from dateFilter (always runs)
  useEffect(() => {
    const now = new Date();
    let start;
    switch (dateFilter.value) {
      case "this_day":
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case "this_week": {
        // start at Monday (or Sunday depending on your preference). Here: start of week (Sunday).
        const d = new Date(now);
        const day = d.getDay(); // 0..6
        start = new Date(d.setDate(d.getDate() - day));
        start.setHours(0, 0, 0, 0);
        break;
      }
      case "this_year":
        start = new Date(now.getFullYear(), 0, 1);
        break;
      case "this_month":
      default:
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
    }
    setDateRange([start, new Date()]);
  }, [dateFilter]);

  // Fetch data once on mount (all fetch functions called in same effect)
  useEffect(() => {
    // call all fetches (they can be no-ops in some roles)
    fetchBookings?.();
    fetchPartners?.();
    fetchAR?.();
    fetchAP?.();
    fetchUsers?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally empty so it runs once. If your stores return stable functions, you can add them.

  // Defensive typed arrays
  const safeBookings = Array.isArray(bookings) ? bookings : [];
  const safeARRecords = Array.isArray(arRecords) ? arRecords : [];
  const safeAPRecords = Array.isArray(apRecords) ? apRecords : [];
  const safeUsers = Array.isArray(users) ? users : [];

  // Helper: filter by dateRange
  const filterByDate = (arr, key = "created_at") =>
    arr.filter((item) => {
      try {
        const d = new Date(item[key] || item.created_at || item.date);
        if (isNaN(d)) return false;
        return d >= dateRange[0] && d <= dateRange[1];
      } catch {
        return false;
      }
    });

  // All derived hooks sit at top-level (no conditionals)
  const filteredBookings = useMemo(() => filterByDate(safeBookings, "created_at"), [safeBookings, dateRange]);
  const filteredAR = useMemo(() => filterByDate(safeARRecords, "date"), [safeARRecords, dateRange]);
  const filteredAP = useMemo(() => filterByDate(safeAPRecords, "date"), [safeAPRecords, dateRange]);

  const revenueData = useMemo(() => {
    const grouped = {};
    filteredAR.forEach((r) => {
      const amount = Number(r.pesos || r.amount || 0);
      const date = new Date(r.date || r.created_at || r.payment_date);
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

  const expenseData = useMemo(() => {
    const grouped = {};
    filteredAP.forEach((a) => {
      const amount = Number(a.total_amount || a.amount || 0);
      const date = new Date(a.date || a.created_at);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      grouped[key] = (grouped[key] || 0) + amount;
    });
    return Object.entries(grouped)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .map(([key, expense]) => {
        const [, m] = key.split("-");
        return { month: monthName(Number(m)), expense };
      });
  }, [filteredAP]);

  const bookingTrendData = useMemo(() => {
    const grouped = {};
    filteredBookings.forEach((b) => {
      const d = new Date(b.created_at);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
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
    const totalRevenue = filteredAR.reduce((s, r) => s + Number(r.pesos || r.amount || 0), 0);
    const totalExpenses = filteredAP.reduce((s, a) => s + Number(a.total_amount || a.amount || 0), 0);
    return { total, delivered, rate, activeUsers, totalRevenue, totalExpenses };
  }, [filteredBookings, safeUsers, filteredAR, filteredAP]);

  const recentActivity = useMemo(() => {
    const logs = [
      ...filteredBookings.map((b) => ({
        type: "Booking",
        desc: `Booking #${b.booking_number || b.id || "N/A"} created`,
        time: b.created_at || b.createdAt,
      })),
      ...safeUsers.map((u) => ({
        type: "User",
        desc: `${u.email} ${u.is_active ? "active" : "created"}`,
        time: u.created_at,
      })),
    ];
    return logs
      .filter((l) => l.time)
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 6);
  }, [filteredBookings, safeUsers]);

  const loading = bookingsLoading || financeLoading || partnersLoading || usersLoading;

  if (loading) return <Loading />;

  // UI components (local)
  const CompactDateSelect = () => (
    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg shadow-sm px-3 py-2">
      <CalendarIcon className="w-4 h-4 text-gray-500" />
      <Select
        className="w-44 text-sm"
        value={dateFilter}
        onChange={(opt) => setDateFilter(opt)}
        options={DATE_OPTIONS}
        isSearchable={false}
        styles={{
          control: (base) => ({ ...base, minHeight: 28, border: "none", boxShadow: "none" }),
          indicatorsContainer: (base) => ({ ...base, padding: 0 }),
          valueContainer: (base) => ({ ...base, padding: "0 6px" }),
        }}
      />
    </div>
  );

  const ProgressBar = ({ label, value, max = 100, color = "bg-blue-600" }) => {
    const percent = max > 0 ? Math.min(100, (value / max) * 100) : 0;
    return (
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium text-gray-700">{label}</div>
          <div className="text-sm text-gray-600">
            {value} / {max}
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`${color} h-full rounded-full`}
          />
        </div>
        <div className="text-xs text-gray-500 mt-1">
          <CountUp end={percent} decimals={1} />% complete
        </div>
      </div>
    );
  };

  const ChartCard = ({ title, Icon, children }) => (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      className="bg-gray-50 rounded-xl p-5 border border-gray-200"
      data-tooltip-id={`chart-${title}`}
      data-tooltip-content={title}
    >
      <h3 className="text-base font-semibold mb-3 flex items-center gap-2 text-gray-800">
        <Icon className="w-5 h-5 text-blue-600" /> {title}
      </h3>
      {children}
      <Tooltip id={`chart-${title}`} />
    </motion.div>
  );

  // Role-based render (only UI; all hooks computed above)
  const renderForRole = () => {
    switch (userRole) {
      case "general_manager":
        return (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard title="Total Bookings" value={metrics.total} color="bg-blue-600" icon={Package} />
              <StatCard title="Delivered" value={metrics.delivered} color="bg-green-600" icon={TrendingUp} />
              <StatCard title="Delivery Rate" value={`${metrics.rate.toFixed(1)}%`} color="bg-indigo-600" icon={Activity} />
              <StatCard title="Active Users" value={metrics.activeUsers} color="bg-amber-600" icon={Clock} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <ChartCard title="Revenue Overview" Icon={BarChart3}>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={revenueData.length ? revenueData : [{ month: "-", revenue: 0 }]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <ReTooltip />
                    <Bar dataKey="revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Booking Status Distribution" Icon={Activity}>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={bookingStatusData.length ? bookingStatusData : [{ name: "No data", value: 1 }]}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label
                    >
                      {(bookingStatusData.length ? bookingStatusData : [{ name: "No data" }]).map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <ReTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <h4 className="text-base font-semibold mb-4 text-gray-800">Performance Overview</h4>
                <div className="space-y-4">
                  <ProgressBar label="Delivery Rate" value={metrics.delivered} max={Math.max(1, metrics.total)} color="bg-green-600" />
                  <ProgressBar label="Active Bookings" value={metrics.total - metrics.delivered} max={Math.max(1, metrics.total)} color="bg-blue-600" />
                  <ProgressBar label="User Engagement" value={metrics.activeUsers} max={Math.max(1, safeUsers.length)} color="bg-amber-600" />
                </div>
              </div>

              <div className="lg:col-span-2 bg-gray-50 rounded-xl p-5 border border-gray-200">
                <h4 className="text-base font-semibold mb-4 text-gray-800">Recent Activity</h4>
                <div className="space-y-2">
                  {recentActivity.length ? (
                    recentActivity.map((a, i) => (
                      <div key={i} className="flex justify-between items-center bg-white p-3 rounded border border-gray-200">
                        <div className="text-sm text-gray-700">{a.desc}</div>
                        <div className="text-xs text-gray-400">{new Date(a.time).toLocaleString()}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500">No recent activity in this range.</div>
                  )}
                </div>
              </div>
            </div>
          </>
        );

      case "marketing_coordinator":
        return (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <StatCard title="Total Bookings" value={metrics.total} color="bg-blue-600" icon={Package} />
              <StatCard title="Delivered" value={metrics.delivered} color="bg-green-600" icon={TrendingUp} />
              <StatCard title="Delivery Rate" value={`${Math.round(metrics.rate)}%`} color="bg-purple-600" icon={Activity} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard title="Booking Trends" Icon={BarChart3}>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={bookingTrendData.length ? bookingTrendData : [{ month: "-", bookings: 0 }]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <ReTooltip />
                    <Bar dataKey="bookings" fill="#2563eb" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <h4 className="text-base font-semibold mb-4 text-gray-800">Booking Performance</h4>
                <ProgressBar label="Completion Rate" value={metrics.delivered} max={Math.max(1, metrics.total)} color="bg-green-600" />
              </div>
            </div>
          </>
        );

      case "admin_finance":
        return (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <StatCard title="Total Revenue" value={metrics.totalRevenue} color="bg-emerald-600" icon={DollarSign} />
              <StatCard title="Total Expenses" value={metrics.totalExpenses} color="bg-red-600" icon={FileText} />
              <StatCard title="Net Income" value={metrics.totalRevenue - metrics.totalExpenses} color="bg-blue-600" icon={TrendingUp} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard title="Revenue Overview" Icon={FileText}>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={revenueData.length ? revenueData : [{ month: "-", revenue: 0 }]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <ReTooltip />
                    <Bar dataKey="revenue" fill="#1e40af" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Expenses Overview" Icon={FileText}>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={expenseData.length ? expenseData : [{ month: "-", expense: 0 }]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <ReTooltip />
                    <Bar dataKey="expense" fill="#ef4444" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>
          </>
        );

      default:
        return (
          <div className="text-center text-gray-700 mt-10">
            <AlertCircle className="mx-auto w-10 h-10 text-blue-600 mb-2" />
            <h2 className="text-2xl font-semibold mb-2">Welcome!</h2>
            <p>Your dashboard overview will appear here.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.email || "User"} 👋</p>
            </div>

            <div className="flex items-center gap-3">
              <CompactDateSelect />
            </div>
          </div>

          {renderForRole()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
