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
    CreditCard,
    CalendarDays,
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
import { calculateTotalWithBIR, calculateNetRevenue } from "../../utils/helpers/financeCalculations";

// Constants
const DATE_OPTIONS = [
    { value: "all", label: "All Time" },
    { value: "month", label: "This Month" },
    { value: "3months", label: "Last 3 Months" },
    { value: "year", label: "This Year" },
];

const MONTHS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];
const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

const GmDashboard = () => {
    // State and Stores
    const [dateFilter, setDateFilter] = useState(DATE_OPTIONS[0]);
    const { bookings, fetchBookings, loading: bookingsLoading } = useBookingStore();
    const { partners, fetchPartners } = usePartnerStore();
    const { users, fetchUsers, loading: usersLoading } = useUserStore();
    const { apRecords, arRecords, fetchAP, fetchAR, loading: financeLoading } = useFinanceStore();

    // Data Fetching
    useEffect(() => {
        fetchBookings();
        fetchPartners();
        fetchUsers();
        fetchAP();
        fetchAR();
    }, [fetchBookings, fetchPartners, fetchUsers, fetchAP, fetchAR]);

    // Format currency
    const formatCurrency = (amount) =>
        new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount || 0);

    // Helper to match AR and AP records
    const getAPRecord = (bookingId) => {
        return apRecords.find(ap => ap.booking_id === bookingId);
    };

    // Filter data based on date selection (similar to afDashboard)
    const filteredData = useMemo(() => {
        const now = new Date();
        let startDate = new Date(0); // Beginning of time

        switch (dateFilter.value) {
            case "month":
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case "3months":
                startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
                break;
            case "year":
                startDate = new Date(now.getFullYear(), 0, 1);
                break;
            default:
                startDate = new Date(0);
        }

        return arRecords.filter(ar => {
            const recordDate = new Date(ar.payment_date || ar.created_at);
            return recordDate >= startDate;
        });
    }, [arRecords, dateFilter]);

    // Calculate comprehensive financial metrics (similar to afDashboard)
    const financialMetrics = useMemo(() => {
        let totalRevenue = 0;
        let totalExpenses = 0;
        let totalCollected = 0;
        let totalNetRevenue = 0;

        filteredData.forEach(ar => {
            const apRecord = getAPRecord(ar.booking_id);
            const amountPaid = parseFloat(ar.amount_paid || 0);
            const expenses = calculateTotalWithBIR(apRecord);
            const netRevenue = calculateNetRevenue(ar, apRecord);

            totalCollected += amountPaid;
            totalExpenses += expenses;
            totalNetRevenue += netRevenue;
            totalRevenue += parseFloat(ar.pesos || ar.total_amount || 0);
        });

        const profitMargin = totalCollected > 0 ? (totalNetRevenue / totalCollected) * 100 : 0;
        const totalBookings = filteredData.length;
        const avgRevenuePerBooking = totalBookings > 0 ? totalCollected / totalBookings : 0;
        const expenseRatio = totalCollected > 0 ? (totalExpenses / totalCollected) * 100 : 0;

        return {
            totalExpenses,
            totalCollected,
            totalRevenue,
            totalNetRevenue,
            profitMargin,
            totalBookings,
            avgRevenuePerBooking,
            expenseRatio,
        };
    }, [filteredData, apRecords]);

    // Calculate operational metrics
    const operationalMetrics = useMemo(() => {
        const totalBookings = bookings.length;
        const delivered = bookings.filter((b) => b.status === "DELIVERED").length;
        const inTransit = bookings.filter((b) => b.status === "IN_TRANSIT").length;
        const deliveryRate = totalBookings ? (delivered / totalBookings) * 100 : 0;

        const activeUsers = users.filter((user) => user.is_active).length;
        const shippingPartners = partners.filter((p) => p.type === "shipping").length;
        const truckingPartners = partners.filter((p) => p.type === "trucking").length;

        return {
            totalBookings,
            delivered,
            inTransit,
            deliveryRate,
            activeUsers,
            shippingPartners,
            truckingPartners,
        };
    }, [bookings, users, partners]);

    // Revenue Trend Data (last 6 months) - Updated to use financial metrics
    const revenueTrendData = useMemo(() => {
        const monthlyData = {};

        filteredData.forEach((ar) => {
            const date = new Date(ar.payment_date || ar.created_at);
            if (isNaN(date)) return;
            
            const key = `${date.getFullYear()}-${String(date.getMonth()).padStart(2, '0')}`;
            const monthLabel = MONTHS[date.getMonth()];

            if (!monthlyData[key]) {
                monthlyData[key] = {
                    month: monthLabel,
                    revenue: 0,
                    expense: 0,
                    collected: 0,
                    netRevenue: 0
                };
            }

            const apRecord = getAPRecord(ar.booking_id);
            const amountPaid = parseFloat(ar.amount_paid || 0);
            const expenses = calculateTotalWithBIR(apRecord);
            const netRevenue = calculateNetRevenue(ar, apRecord);

            monthlyData[key].collected += amountPaid;
            monthlyData[key].expense += expenses;
            monthlyData[key].netRevenue += netRevenue;
            monthlyData[key].revenue += parseFloat(ar.pesos || ar.total_amount || 0);
        });

        // Sort by date and return last 6 months
        return Object.keys(monthlyData)
            .sort()
            .slice(-6)
            .map(key => monthlyData[key]);
    }, [filteredData, apRecords]);

    // Booking Status Distribution
    const bookingStatusData = useMemo(() => {
        const statusCount = {};
        bookings.forEach((booking) => {
            const status = booking.status || "UNKNOWN";
            statusCount[status] = (statusCount[status] || 0) + 1;
        });

        return Object.entries(statusCount).map(([status, count]) => ({ 
            name: status.replace("_", " "), 
            value: count 
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
                    description: `Booking ${booking.booking_number || "--"} status updated`,
                    timeRaw: dateRaw,
                    formattedDate,
                };
            });
    }, [bookings]);

const statConfig = useMemo(() => [
    { 
        title: "Total Bookings", 
        value: operationalMetrics.totalBookings, 
        color: "bg-gradient-to-br from-blue-500 to-blue-600 text-white", 
        icon: Package 
    },
    { 
        title: "Total Collected", 
        value: formatCurrency(financialMetrics.totalCollected), 
        color: "bg-gradient-to-br from-green-500 to-green-600 text-white", 
        icon: DollarSign,
        subtitle: `${financialMetrics.totalBookings} bookings`
    },
    { 
        title: "Total Expenses", 
        value: formatCurrency(financialMetrics.totalExpenses), 
        color: "bg-gradient-to-br from-red-500 to-red-600 text-white", 
        icon: CreditCard,
        subtitle: "Including 12% BIR"
    },
    { 
        title: "Net Revenue", 
        value: formatCurrency(financialMetrics.totalNetRevenue), 
        color: financialMetrics.totalNetRevenue >= 0 
            ? "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white" 
            : "bg-gradient-to-br from-orange-500 to-orange-600 text-white", 
        icon: TrendingUp,
        subtitle: `${financialMetrics.profitMargin.toFixed(1)}% margin`
    },
    { 
        title: "Delivery Rate", 
        value: `${operationalMetrics.deliveryRate.toFixed(1)}%`, 
        color: "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white", 
        icon: Activity,
        subtitle: `${operationalMetrics.delivered} of ${operationalMetrics.totalBookings} delivered`
    },
    { 
        title: "Active Users", 
        value: operationalMetrics.activeUsers, 
        color: "bg-gradient-to-br from-amber-500 to-amber-600 text-white", 
        icon: Users 
    },
    { 
        title: "Business Partners", 
        value: operationalMetrics.shippingPartners + operationalMetrics.truckingPartners, 
        color: "bg-gradient-to-br from-violet-500 to-violet-600 text-white", 
        icon: Users,
        subtitle: `${operationalMetrics.shippingPartners} shipping, ${operationalMetrics.truckingPartners} trucking`
    },
    { 
        title: "Avg Revenue/Booking", 
        value: formatCurrency(financialMetrics.avgRevenuePerBooking), 
        color: "bg-gradient-to-br from-cyan-500 to-cyan-600 text-white", 
        icon: BarChart3,
        subtitle: `${financialMetrics.expenseRatio.toFixed(1)}% expense ratio`
    },
], [financialMetrics, operationalMetrics]);

    // Loading state
    if (bookingsLoading || usersLoading || financeLoading) return <Loading />;

    return (
        <div className="space-y-6">
            {/* Filter Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white rounded-xl p-4 border border-slate-50 shadow-sm">
                <div>
                    <h2 className="text-lg font-semibold text-slate-900">Executive Overview</h2>
                    <p className="text-sm text-slate-600 mt-1">
                        Comprehensive business performance and financial metrics
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
                                "&:hover": { borderColor: "#2563eb" },
                            }),
                            option: (base, state) => ({
                                ...base,
                                backgroundColor: state.isSelected ? "#2563eb" : "white",
                                color: state.isSelected ? "white" : "#1e3a8a",
                                "&:hover": { backgroundColor: "#dbeafe" },
                            }),
                            singleValue: (base) => ({ ...base, color: "#1e3a8a" }),
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
                        subtitle={stat.subtitle}
                    />
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue & Profit Trend */}
                <div className="bg-white border border-slate-50 rounded-xl p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-slate-900">Revenue & Expense Trend</h3>
                        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                            Last 6 months
                        </span>
                    </div>

                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart
                            data={revenueTrendData.length ? revenueTrendData : [{ month: "-", collected: 0, expense: 0 }]}
                            margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                            <YAxis 
                                stroke="#6b7280" 
                                fontSize={12} 
                                tickFormatter={(v) => `₱${(v / 1000).toFixed(0)}k`} 
                            />
                            <ReTooltip
                                formatter={(value) => [formatCurrency(value), "Amount"]}
                                contentStyle={{ 
                                    backgroundColor: "white", 
                                    border: "1px solid #e5e7eb", 
                                    borderRadius: "8px", 
                                    fontSize: "12px" 
                                }}
                            />
                            <Legend />
                            <Bar 
                                dataKey="collected" 
                                fill="#10b981" 
                                radius={[4, 4, 0, 0]} 
                                barSize={20} 
                                name="Collected" 
                            />
                            <Bar 
                                dataKey="expense" 
                                fill="#ff2222" 
                                radius={[4, 4, 0, 0]} 
                                barSize={20} 
                                name="Expenses" 
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Booking Status Distribution */}
                <div className="bg-white border border-slate-50 rounded-xl p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-slate-900">Booking Status Distribution</h3>
                        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                            Current status
                        </span>
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
                                {bookingStatusData.map((entry, idx) => (
                                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                                ))}
                            </Pie>
                            <ReTooltip
                                formatter={(value, name) => [value, name]}
                                contentStyle={{ 
                                    backgroundColor: "white", 
                                    border: "1px solid #e5e7eb", 
                                    borderRadius: "8px", 
                                    fontSize: "12px" 
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Performance Metrics & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Performance Metrics */}
                <div className="bg-white border border-slate-50 rounded-xl p-5 shadow-sm flex flex-col items-center justify-center">
                    <h3 className="font-semibold text-slate-900 mb-4">Delivery Performance</h3>
                    <div className="w-36 h-36 mb-3">
                        <CircularProgressbar
                            value={Math.min(Math.max(operationalMetrics.deliveryRate || 0, 0), 100)}
                            text={`${operationalMetrics.deliveryRate ? operationalMetrics.deliveryRate.toFixed(1) : 0}%`}
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
                        <p className="text-xs text-slate-600 mt-1">
                            {operationalMetrics.delivered} of {operationalMetrics.totalBookings} bookings delivered
                        </p>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white border border-slate-50 rounded-xl p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-slate-900">Recent Activity</h3>
                        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                            Latest updates
                        </span>
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
                                        <p className="text-sm font-semibold text-slate-900 truncate">
                                            {activity.description}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            {activity.formattedDate}
                                        </p>
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