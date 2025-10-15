// pages/dashboard/afDashboard.jsx
import React, { useMemo, useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  ResponsiveContainer,
} from "recharts";
import {
  DollarSign,
  TrendingUp,
  CalendarDays,
  CreditCard,
  PieChart,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";
import Select from "react-select";

import useFinanceStore from "../../utils/store/useFinanceStore";
import useBookingStore from "../../utils/store/useBookingStore";
import Loading from "../../components/Loading";
import StatCard from "../../components/cards/StatCard";

const DATE_OPTIONS = [
  { value: "all", label: "All Time" },
  { value: "month", label: "This Month" },
  { value: "3months", label: "Last 3 Months" },
  { value: "year", label: "This Year" },
];

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const AfDashboard = () => {
  const [dateFilter, setDateFilter] = useState(DATE_OPTIONS[0]);
  const { apRecords, arRecords, loading, fetchAP, fetchAR } = useFinanceStore();
  const { bookings, fetchBookings } = useBookingStore();

  useEffect(() => {
    fetchAP();
    fetchAR();
    fetchBookings();
  }, [fetchAP, fetchAR, fetchBookings]);

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

  // ✅ NEW: Calculate overdue records
  const overdueRecords = useMemo(() => {
    return arRecords.filter(ar => {
      const terms = ar.terms || 0;
      if (terms <= 0) return false;

      const bookingDate = new Date(ar.booking_date || ar.created_at);
      const today = new Date();
      const dueDate = new Date(bookingDate);
      dueDate.setDate(dueDate.getDate() + terms);
      
      const collectibleAmount = parseFloat(ar.collectible_amount || ar.gross_income || 0);
      const amountPaid = parseFloat(ar.amount_paid || 0);
      
      return today > dueDate && collectibleAmount > amountPaid;
    });
  }, [arRecords]);

  // ✅ NEW: Calculate total overdue amount
  const totalOverdueAmount = useMemo(() => {
    return overdueRecords.reduce((total, ar) => {
      const collectibleAmount = parseFloat(ar.collectible_amount || ar.gross_income || 0);
      const amountPaid = parseFloat(ar.amount_paid || 0);
      return total + (collectibleAmount - amountPaid);
    }, 0);
  }, [overdueRecords]);

  // Filter data based on date selection
  const filteredData = useMemo(() => {
    const now = new Date();
    let startDate = new Date(0);

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

  const financialMetrics = useMemo(() => {
    let totalRevenue = 0;
    let totalExpenses = 0;
    let totalCollected = 0;
    let totalNetRevenue = 0;

    filteredData.forEach(ar => {
      const apRecord = getAPRecord(ar.booking_id);
      const amountPaid = parseFloat(ar.amount_paid || 0);
      const grossIncome = parseFloat(ar.gross_income || 0);
      const expenses = parseFloat(apRecord?.total_payables || 0);
      const netRevenue = grossIncome - expenses;

      totalCollected += amountPaid;
      totalExpenses += expenses;
      totalNetRevenue += netRevenue;
      totalRevenue += grossIncome;
    });

    const profitMargin = totalRevenue > 0 ? (totalNetRevenue / totalRevenue) * 100 : 0;
    const totalBookings = filteredData.length;
    const avgRevenuePerBooking = totalBookings > 0 ? totalCollected / totalBookings : 0;
    const expenseRatio = totalRevenue > 0 ? (totalExpenses / totalRevenue) * 100 : 0;

    return {
      totalExpenses,
      totalCollected,
      totalRevenue,
      totalNetRevenue,
      profitMargin,
      totalBookings,
      avgRevenuePerBooking,
      expenseRatio,
      overdueCount: overdueRecords.length,
      totalOverdueAmount,
    };
  }, [filteredData, apRecords, overdueRecords, totalOverdueAmount]);

  const chartData = useMemo(() => {
    const monthlyData = {};
    
    filteredData.forEach((ar) => {
      const date = new Date(ar.payment_date || ar.created_at);
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
      const grossIncome = parseFloat(ar.gross_income || 0);
      const expenses = parseFloat(apRecord?.total_payables || 0);
      const netRevenue = grossIncome - expenses;

      monthlyData[key].collected += amountPaid;
      monthlyData[key].expense += expenses;
      monthlyData[key].netRevenue += netRevenue;
      monthlyData[key].revenue += grossIncome;
    });

    return Object.keys(monthlyData)
      .sort()
      .slice(-6)
      .map(key => monthlyData[key]);
  }, [filteredData, apRecords]);

  const recentActivity = useMemo(() => {
    return filteredData
      .filter(ar => ar.payment_date)
      .slice(-5)
      .reverse()
      .map((ar) => {
        const apRecord = getAPRecord(ar.booking_id);
        const grossIncome = parseFloat(ar.gross_income || 0);
        const expenses = parseFloat(apRecord?.total_payables || 0);
        const netRevenue = grossIncome - expenses;
        
        return {
          id: ar.ar_id || ar.id,
          action: `${ar.shipper || ar.client || "Client"} - ${ar.hwb_number || "N/A"}`,
          date: new Date(ar.payment_date).toLocaleDateString("en-PH"),
          amount: formatCurrency(netRevenue),
          isPositive: netRevenue >= 0
        };
      });
  }, [filteredData, apRecords]);

  // ✅ NEW: Overdue notifications
  const overdueNotifications = useMemo(() => {
    return overdueRecords.slice(0, 5).map(ar => {
      const terms = ar.terms || 0;
      const bookingDate = new Date(ar.booking_date || ar.created_at);
      const dueDate = new Date(bookingDate);
      dueDate.setDate(dueDate.getDate() + terms);
      
      const collectibleAmount = parseFloat(ar.collectible_amount || ar.gross_income || 0);
      const amountPaid = parseFloat(ar.amount_paid || 0);
      const overdueAmount = collectibleAmount - amountPaid;
      
      return {
        id: ar.ar_id || ar.id,
        client: ar.shipper || ar.client || "Client",
        hwb: ar.hwb_number || "N/A",
        dueDate: dueDate.toLocaleDateString("en-PH"),
        overdueAmount,
        daysOverdue: Math.floor((new Date() - dueDate) / (1000 * 60 * 60 * 24))
      };
    });
  }, [overdueRecords]);

  const statConfig = useMemo(
    () => [
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
        color: "bg-gradient-to-br from-purple-500 to-purple-600 text-white",
        icon: CreditCard,
        subtitle: "Payables including BIR"
      },
      {
        title: "Net Revenue",
        value: formatCurrency(financialMetrics.totalNetRevenue),
        color: financialMetrics.totalNetRevenue >= 0
          ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
          : "bg-gradient-to-br from-red-500 to-red-600 text-white",
        icon: TrendingUp,
        subtitle: `${financialMetrics.profitMargin.toFixed(1)}% margin`
      },
      // ✅ NEW: Overdue Records Card
      {
        title: "Overdue Records",
        value: financialMetrics.overdueCount.toString(),
        color: financialMetrics.overdueCount > 0
          ? "bg-gradient-to-br from-red-500 to-red-600 text-white"
          : "bg-gradient-to-br from-gray-500 to-gray-600 text-white",
        icon: AlertTriangle,
        subtitle: formatCurrency(financialMetrics.totalOverdueAmount)
      },
    ],
    [financialMetrics]
  );

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      {/* Header / Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white rounded-xl p-4 border border-slate-50 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Financial Overview</h2>
          <p className="text-sm text-slate-600 mt-1">
            Track collections, expenses, and net revenue performance
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

      {/* Overdue Alerts */}
      {overdueNotifications.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="font-semibold text-red-900">Overdue Payments Alert</h3>
            <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full">
              {overdueNotifications.length} records
            </span>
          </div>
          <div className="space-y-2">
            {overdueNotifications.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-2 bg-white rounded-lg border border-red-100">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-red-900 truncate">
                    {item.client} - {item.hwb}
                  </p>
                  <p className="text-xs text-red-600">
                    Due: {item.dueDate} • {item.daysOverdue} days overdue
                  </p>
                </div>
                <p className="text-sm font-semibold text-red-700 ml-2">
                  {formatCurrency(item.overdueAmount)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statConfig.map((stat, i) => (
          <StatCard
            key={i}
            title={stat.title}
            value={stat.value}
            color={stat.color}
            icon={stat.icon}
            subtitle={stat.subtitle}
          />
        ))}
      </div>

      {/* Charts & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Collections vs Expenses */}
        <div className="bg-white border border-slate-50 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Collections vs Expenses</h3>
            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              Last 6 months
            </span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#2563eb" fontSize={12} />
              <YAxis
                stroke="#2563eb"
                fontSize={12}
                tickFormatter={(v) => `₱${(v / 1000).toFixed(0)}k`}
              />
              <ReTooltip
                formatter={(v) => [formatCurrency(v), "Amount"]}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #93c5fd",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="collected" name="Collected" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
              <Bar dataKey="expense" name="Expenses" fill="#a855f7" radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-slate-50 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Recent Payments</h3>
            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              Latest 5
            </span>
          </div>
          <div className="space-y-3">
            {recentActivity.length > 0 ? (
              recentActivity.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="flex justify-between items-center p-3 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-blue-900 truncate">{item.action}</p>
                    <p className="text-xs text-blue-600">{item.date}</p>
                  </div>
                  <p className={`text-sm font-semibold ml-2 ${
                    item.isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {item.amount}
                  </p>
                </motion.div>
              ))
            ) : (
              <p className="text-blue-500 text-sm text-center py-6">
                No recent payments
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Net Revenue Trend */}
      <div className="bg-white border border-slate-50 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900">Net Revenue Trend</h3>
          <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
            6-month overview
          </span>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" stroke="#2563eb" fontSize={12} />
            <YAxis
              stroke="#2563eb"
              fontSize={12}
              tickFormatter={(v) => `₱${(v / 1000).toFixed(0)}k`}
            />
            <ReTooltip
              formatter={(v) => [formatCurrency(v), "Amount"]}
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #93c5fd",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Line
              type="monotone"
              dataKey="netRevenue"
              name="Net Revenue"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 5, fill: "#3b82f6" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AfDashboard;