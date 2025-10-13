import React, { useMemo, useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Package,
  Truck,
  Ship,
  Activity,
  TrendingUp,
  CalendarDays,
  Bell,
} from "lucide-react";
import { motion } from "framer-motion";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Select from "react-select";

import useBookingStore from "../../utils/store/useBookingStore";
import usePartnerStore from "../../utils/store/usePartnerStore";
import useContainerStore from "../../utils/store/useContainerStore";
import Loading from "../../components/Loading";
import StatCard from "../../components/cards/StatCard";
import { getStatusBadge } from "../../utils/helpers/tableDataFormatters";

// Constants
const DATE_OPTIONS = [
  { value: "all", label: "All Time" },
  { value: "month", label: "This Month" },
  { value: "3months", label: "Last 3 Months" },
  { value: "year", label: "This Year" },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const McDashboard = () => {
  // State and Stores
  const [dateFilter, setDateFilter] = useState(DATE_OPTIONS[0]);
  const { bookings, fetchBookings, loading } = useBookingStore();
  const { partners, fetchPartners } = usePartnerStore();
  const { containers } = useContainerStore();

  // Data Fetching
  useEffect(() => {
    fetchBookings();
    fetchPartners();
  }, [fetchBookings, fetchPartners]);

  // Derived Data Calculations
  const dashboardData = useMemo(() => {
    const totalBookings = bookings.length;
    const delivered = bookings.filter((b) => b.status === "DELIVERED").length;
    const inTransit = bookings.filter((b) => b.status === "IN_TRANSIT").length;
    const deliveryRate = totalBookings ? (delivered / totalBookings) * 100 : 0;
    const shippingCount = partners.filter((p) => p.type === "shipping").length;
    const truckingCount = partners.filter((p) => p.type === "trucking").length;
    const totalContainers = containers.length;

    return {
      totalBookings,
      delivered,
      inTransit,
      deliveryRate,
      shippingCount,
      truckingCount,
      totalContainers,
    };
  }, [bookings, partners, containers]);

  // Booking Trend Data
  const bookingTrendData = useMemo(() => {
    const grouped = {};
    bookings.forEach((booking) => {
      const date = new Date(booking.created_at);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      grouped[key] = (grouped[key] || 0) + 1;
    });

    return Object.entries(grouped).map(([key, value]) => {
      const [, monthIndex] = key.split("-");
      return { month: MONTHS[Number(monthIndex)], bookings: value };
    });
  }, [bookings]);

  // Stat Cards Configuration
  const statConfig = useMemo(() => [
    { 
      title: "Total Bookings", 
      value: dashboardData.totalBookings, 
      color: "bg-blue-500", 
      icon: Package 
    },
    { 
      title: "Delivered", 
      value: dashboardData.delivered, 
      color: "bg-green-500", 
      icon: TrendingUp 
    },
    { 
      title: "In Transit", 
      value: dashboardData.inTransit, 
      color: "bg-blue-400", 
      icon: Truck 
    },
    { 
      title: "Delivery Rate", 
      value: `${dashboardData.deliveryRate.toFixed(1)}%`, 
      color: "bg-indigo-500", 
      icon: Activity 
    },
    { 
      title: "Shipping Partners", 
      value: dashboardData.shippingCount, 
      color: "bg-sky-500", 
      icon: Ship 
    },
    { 
      title: "Trucking Partners", 
      value: dashboardData.truckingCount, 
      color: "bg-cyan-500", 
      icon: Truck 
    },
  ], [dashboardData]);

  // Recent Activity Items
  const recentActivities = useMemo(() => 
    bookings.slice(-5).reverse().map((booking, index) => {
      const statusBadge = getStatusBadge(booking.status);
      return {
        ...booking,
        id: booking.id || index,
        displayNumber: booking.booking_number || `B-${index + 1}`,
        statusBadge,
        formattedDate: new Date(booking.created_at || new Date()).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };
    }), [bookings]);

  // Loading state should be at the top for early return
  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      {/* Filter Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white rounded-xl p-4 border border-slate-50 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Performance Overview</h2>
          <p className="text-sm text-slate-600 mt-1">
            Monitor your shipping operations and key metrics
          </p>
        </div>

        <div className="flex flex-col text-sm mt-3 sm:mt-0">
          <label className="flex items-center gap-1 text-slate-700 mb-1 font-medium">
            <CalendarDays className="w-4 h-4 text-blue-600" />
            Filter By:
          </label>
          <Select
            options={DATE_OPTIONS}
            value={dateFilter}
            onChange={setDateFilter}
            className="text-sm min-w-[160px]"
            styles={{
              control: (base) => ({
                ...base,
                minHeight: "34px",
                borderColor: "#93c5fd",
                boxShadow: "none",
                "&:hover": { borderColor: "#2563eb" },
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isSelected ? "#2563eb" : "white",
                color: state.isSelected ? "white" : "#1e3a8a",
                fontSize: "0.875rem",
                "&:hover": { backgroundColor: "#dbeafe" },
              }),
              singleValue: (base) => ({
                ...base,
                color: "#1e3a8a",
              }),
            }}
          />
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {statConfig.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            color={stat.color}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Chart & Performance Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Booking Trends Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-50 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900">Booking Trends</h2>
            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              Last 12 months
            </span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={bookingTrendData.length ? bookingTrendData : [{ month: "-", bookings: 0 }]}
              barSize={24}
              margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#dbeafe" />
              <XAxis 
                dataKey="month" 
                stroke="#3b82f6"
                fontSize={12}
              />
              <YAxis 
                stroke="#3b82f6"
                fontSize={12}
              />
              <ReTooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #93c5fd',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Bar 
                dataKey="bookings" 
                fill="#3b82f6" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Overview */}
        <div className="bg-white border border-slate-50 rounded-xl p-5 shadow-sm flex flex-col items-center justify-center">
          <h2 className="font-semibold text-slate-900 mb-4">Delivery Performance</h2>
          <div className="w-32 h-32 mb-3">
            <CircularProgressbar
              value={dashboardData.deliveryRate}
              text={`${dashboardData.deliveryRate.toFixed(1)}%`}
              styles={buildStyles({
                textColor: "#1e40af",
                pathColor: "#2563eb",
                trailColor: "#dbeafe",
                textSize: '16px',
                pathTransitionDuration: 0.5,
              })}
            />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-slate-800">Success Rate</p>
            <p className="text-xs text-slate-600 mt-1">
              {dashboardData.delivered} of {dashboardData.totalBookings} bookings delivered
            </p>
          </div>
        </div>
      </div>

{/* Recent Activity */}
<div className="bg-white border border-slate-50 rounded-xl shadow-sm overflow-hidden">
  <div className="flex items-center justify-between p-4 bg-blue-500">
    <h2 className="font-semibold text-white">Recent Activity</h2>
    <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
      Last Updates
    </span>
  </div>

  <div className="p-3">
    {recentActivities.length > 0 ? (
      <div className="space-y-2">
        {recentActivities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, delay: index * 0.05 }}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-blue-50 transition-colors duration-150 border border-transparent hover:border-blue-100"
          >
            {/* Left: Booking Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold text-blue-900 truncate">
                  Booking #{activity.displayNumber}
                </p>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full border ${activity.statusBadge.text} ${activity.statusBadge.bg}`}
                >
                  {activity.statusBadge.label}
                </span>
              </div>
              <p className="text-sm text-blue-700 mt-0.5 truncate">
                {activity.description || "Shipping activity updated"}
              </p>
            </div>

            {/* Right: Date */}
            <p className="text-sm font-semibold text-blue-500 whitespace-nowrap ml-3">
              {activity.formattedDate}
            </p>
          </motion.div>
        ))}
      </div>
    ) : (
      <div className="text-center py-6">
        <p className="text-blue-600 text-sm font-medium">No recent activity found</p>
        <p className="text-blue-400 text-xs mt-1">New bookings will appear here</p>
      </div>
    )}
  </div>
</div>
    </div>
  );
};

export default McDashboard;