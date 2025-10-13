import React, { useMemo, useEffect, useState } from "react";
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
  LineChart,
  Line,
} from "recharts";
import {
  Package,
  TrendingUp,
  Activity,
  Users,
  DollarSign,
  BarChart3,
} from "lucide-react";
import { motion } from "framer-motion";
import Select from "react-select";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import useBookingStore from "../../utils/store/useBookingStore";
import usePartnerStore from "../../utils/store/usePartnerStore";
import useUserStore from "../../utils/store/useUserStore";
import useFinanceStore from "../../utils/store/useFinanceStore";
import Loading from "../../components/Loading";
import StatCard from "../../components/cards/StatCard";

// Constants
const DATE_OPTIONS = [
  { value: "all", label: "All Time" },
  { value: "month", label: "This Month" },
  { value: "3months", label: "Last 3 Months" },
  { value: "year", label: "This Year" },
];

const MONTHS = [
  "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"
];

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

const GmDashboard = () => {
  // State and Stores
  const [dateFilter, setDateFilter] = useState(DATE_OPTIONS[0]);
  const { bookings, fetchBookings, loading: bookingsLoading } = useBookingStore();
  const { partners, fetchPartners } = usePartnerStore();
  const { users, fetchUsers, loading: usersLoading } = useUserStore();
  const { apRecords, fetchAP } = useFinanceStore();

  // Data Fetching
  useEffect(() => {
    fetchBookings();
    fetchPartners();
    fetchUsers();
    fetchAP();
  }, [fetchBookings, fetchPartners, fetchUsers, fetchAP]);

  // Format currency
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);

  // Calculate comprehensive metrics
  const dashboardData = useMemo(() => {
    const totalBookings = bookings.length;
    const delivered = bookings.filter((b) => b.status === "DELIVERED").length;
    const inTransit = bookings.filter((b) => b.status === "IN_TRANSIT").length;
    const deliveryRate = totalBookings ? (delivered / totalBookings) * 100 : 0;

    const totalRevenue = apRecords.reduce(
      (sum, record) => sum + (parseFloat(record.net_revenue) || 0),
      0
    );
    const totalExpenses = apRecords.reduce(
      (sum, record) => sum + (parseFloat(record.total_expenses) || 0),
      0
    );
    const netIncome = totalRevenue - totalExpenses;

    const activeUsers = users.filter((user) => user.is_active).length;
    const shippingPartners = partners.filter((p) => p.type === "shipping").length;
    const truckingPartners = partners.filter((p) => p.type === "trucking").length;

    return {
      totalBookings,
      delivered,
      inTransit,
      deliveryRate,
      totalRevenue,
      totalExpenses,
      netIncome,
      activeUsers,
      shippingPartners,
      truckingPartners,
    };
  }, [bookings, apRecords, users, partners]);

  // Booking Trend Data (safe date handling)
  const bookingTrendData = useMemo(() => {
    const grouped = {};
    bookings.forEach((booking) => {
      if (!booking.created_at) return;
      const date = new Date(booking.created_at);
      if (isNaN(date)) return;
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      grouped[key] = (grouped[key] || 0) + 1;
    });

    return Object.entries(grouped).map(([key, value]) => {
      const [, monthIndex] = key.split("-");
      return { month: MONTHS[Number(monthIndex)], bookings: value };
    });
  }, [bookings]);

  // Revenue Trend Data (last 6 months)
  const revenueTrendData = useMemo(() => {
    const monthlyData = {};
    apRecords.forEach((record) => {
      if (!record.created_at) return;
      const date = new Date(record.created_at);
      if (isNaN(date)) return;
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { month: MONTHS[date.getMonth()], revenue: 0, profit: 0 };
      }
      const revenue = parseFloat(record.net_revenue) || 0;
      const expenses = parseFloat(record.total_expenses) || 0;
      monthlyData[monthKey].revenue += revenue;
      monthlyData[monthKey].profit += revenue - expenses;
    });
    return Object.values(monthlyData).slice(-6);
  }, [apRecords]);

  // Booking Status Distribution (safe)
  const bookingStatusData = useMemo(() => {
    const statusCount = {};
    bookings.forEach((booking) => {
      const status = booking.status || "UNKNOWN";
      statusCount[status] = (statusCount[status] || 0) + 1;
    });
    return Object.entries(statusCount).map(([status, count]) => ({
      name: status.replace("_", " "),
      value: count,
    }));
  }, [bookings]);

  // Recent Activity (latest 5, safe dates)
  const recentActivities = useMemo(() => {
    return [...bookings]
      .filter(Boolean)
      .sort((a, b) => {
        const ta = new Date(a.updated_at || a.created_at || 0);
        const tb = new Date(b.updated_at || b.created_at || 0);
        return tb - ta;
      })
      .slice(0, 5)
      .map((booking, idx) => {
        const dateRaw = booking.updated_at || booking.created_at;
        const d = dateRaw ? new Date(dateRaw) : null;
        const formattedDate =
          d && !isNaN(d)
            ? d.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "No Date";
        return {
          id: booking.id || `${Date.now()}-${idx}`,
          description: `Booking ${booking.booking_number || "—"} status updated`,
          timeRaw: dateRaw,
          formattedDate,
        };
      });
  }, [bookings]);

  // Stat Cards Configuration (keeps icons inside StatCard as before)
  const statConfig = useMemo(
    () => [
      { title: "Total Bookings", value: dashboardData.totalBookings, color: "bg-blue-500", icon: Package },
      { title: "Total Revenue", value: formatCurrency(dashboardData.totalRevenue), color: "bg-emerald-500", icon: DollarSign },
      { title: "Net Income", value: formatCurrency(dashboardData.netIncome), color: dashboardData.netIncome >= 0 ? "bg-green-500" : "bg-orange-500", icon: TrendingUp },
      { title: "Delivery Rate", value: `${dashboardData.deliveryRate.toFixed(1)}%`, color: "bg-indigo-500", icon: Activity },
      { title: "Active Users", value: dashboardData.activeUsers, color: "bg-amber-500", icon: Users },
      { title: "Business Partners", value: dashboardData.shippingPartners + dashboardData.truckingPartners, color: "bg-purple-500", icon: Users },
    ],
    [dashboardData]
  );

  // Loading state
  if (bookingsLoading || usersLoading) return <Loading />;

  return (
    <div className="space-y-6">
      {/* Filter Section (no header icons, clean text) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white rounded-xl p-4 border border-slate-50 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Executive Overview</h2>
          <p className="text-sm text-slate-600 mt-1">Comprehensive business performance and financial metrics</p>
        </div>

        <div className="flex flex-col text-sm mt-3 sm:mt-0">
          <label className="mb-1 font-medium text-slate-700">Filter By:</label>
          <Select
            options={DATE_OPTIONS}
            value={dateFilter}
            onChange={setDateFilter}
            className="text-sm min-w-[160px]"
            styles={{
              control: (base) => ({ ...base, minHeight: "34px", borderColor: "#93c5fd", boxShadow: "none", "&:hover": { borderColor: "#2563eb" } }),
              option: (base, state) => ({ ...base, backgroundColor: state.isSelected ? "#2563eb" : "white", color: state.isSelected ? "white" : "#1e3a8a", "&:hover": { backgroundColor: "#dbeafe" } }),
              singleValue: (base) => ({ ...base, color: "#1e3a8a" }),
            }}
          />
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {statConfig.map((stat, index) => (
          <StatCard key={index} title={stat.title} value={stat.value} color={stat.color} icon={stat.icon} />
        ))}
      </div>

      {/* Charts Section (Revenue & Profit + Booking Status) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue & Profit Trend */}
        <div className="bg-white border border-slate-50 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Revenue & Profit Trend</h3>
            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Last 6 months</span>
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={revenueTrendData.length ? revenueTrendData : [{ month: "-", revenue: 0, profit: 0 }]}
              margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(v) => `$${v / 1000}k`} />
              <ReTooltip
                formatter={(value) => [formatCurrency(value), "Amount"]}
                contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "12px" }}
              />
              <Legend />
              <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} name="Revenue" />
              <Bar dataKey="profit" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} name="Profit" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Booking Status Distribution */}
        <div className="bg-white border border-slate-50 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Booking Status Distribution</h3>
            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Current status</span>
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={bookingStatusData.length ? bookingStatusData : [{ name: "No data", value: 1 }]}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {(bookingStatusData.length ? bookingStatusData : [{ name: "No data", value: 1 }]).map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <ReTooltip
                formatter={(value, name) => [value, name]}
                contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "12px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance Metrics & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Metrics (circular progress like McDashboard) */}
        <div className="bg-white border border-slate-50 rounded-xl p-5 shadow-sm flex flex-col items-center justify-center">
          <h3 className="font-semibold text-slate-900 mb-4">Delivery Performance</h3>
          <div className="w-36 h-36 mb-3">
            <CircularProgressbar
              value={Math.min(Math.max(dashboardData.deliveryRate || 0, 0), 100)}
              text={`${dashboardData.deliveryRate ? dashboardData.deliveryRate.toFixed(1) : 0}%`}
              styles={buildStyles({
                textColor: "#1e40af",
                pathColor: "#2563eb",
                trailColor: "#dbeafe",
                textSize: "16px",
                pathTransitionDuration: 0.5,
              })}
            />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-slate-800">Success Rate</p>
            <p className="text-xs text-slate-600 mt-1">{dashboardData.delivered} of {dashboardData.totalBookings} bookings delivered</p>
          </div>
        </div>

        {/* Recent Activity (span 2 columns on large screens) */}
        <div className="lg:col-span-2 bg-white border border-slate-50 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Recent Activity</h3>
            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Latest updates</span>
          </div>

          <div className="space-y-3">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.28, delay: index * 0.06 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-blue-50 transition-colors duration-150 border border-transparent hover:border-blue-100"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{activity.description}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{activity.formattedDate}</p>
                  </div>

                  <div className="text-xs text-slate-500 whitespace-nowrap ml-3">
                    {/* left intentionally blank for additional metadata if needed */}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-500 text-sm">No recent activity found</p>
                <p className="text-slate-400 text-xs mt-1">System updates will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GmDashboard;
