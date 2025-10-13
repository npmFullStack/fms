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
} from "lucide-react";
import { motion } from "framer-motion";
import Select from "react-select";

import useFinanceStore from "../../utils/store/useFinanceStore";
import Loading from "../../components/Loading";
import StatCard from "../../components/cards/StatCard";

const DATE_OPTIONS = [
  { value: "all", label: "All Time" },
  { value: "month", label: "This Month" },
  { value: "3months", label: "Last 3 Months" },
  { value: "year", label: "This Year" },
];

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const AfDashboard = () => {
  const [dateFilter, setDateFilter] = useState(DATE_OPTIONS[0]);
  const { apRecords, arRecords, loading, fetchAP, fetchAR } = useFinanceStore();

  useEffect(() => {
    fetchAP();
    fetchAR();
  }, [fetchAP, fetchAR]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);

  const financialMetrics = useMemo(() => {
    const totalExpenses = apRecords.reduce(
      (sum, r) => sum + (parseFloat(r.total_expenses) || 0),
      0
    );
    const totalRevenue = apRecords.reduce(
      (sum, r) => sum + (parseFloat(r.net_revenue) || 0),
      0
    );
    const netIncome = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? (netIncome / totalRevenue) * 100 : 0;
    const totalBookings = apRecords.length;
    const avgRevenuePerBooking =
      totalBookings > 0 ? totalRevenue / totalBookings : 0;
    const expenseRatio =
      totalRevenue > 0 ? (totalExpenses / totalRevenue) * 100 : 0;

    return {
      totalExpenses,
      totalRevenue,
      netIncome,
      profitMargin,
      totalBookings,
      avgRevenuePerBooking,
      expenseRatio,
    };
  }, [apRecords]);

  const chartData = useMemo(() => {
    const monthlyData = {};
    apRecords.forEach((r) => {
      if (r.created_at) {
        const date = new Date(r.created_at);
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        if (!monthlyData[key])
          monthlyData[key] = { month: MONTHS[date.getMonth()], revenue: 0, expense: 0 };
        monthlyData[key].revenue += parseFloat(r.net_revenue) || 0;
        monthlyData[key].expense += parseFloat(r.total_expenses) || 0;
      }
    });
    return Object.values(monthlyData).slice(-6);
  }, [apRecords]);

  const recentActivity = useMemo(() => {
    return apRecords
      .slice(-5)
      .reverse()
      .map((r) => ({
        id: r.id,
        action: r.freight_payee || "Transaction",
        date: new Date(r.created_at).toLocaleDateString(),
        amount: r.net_revenue ? formatCurrency(r.net_revenue) : "—",
      }));
  }, [apRecords]);

  const statConfig = useMemo(
    () => [
      {
        title: "Total Revenue",
        value: formatCurrency(financialMetrics.totalRevenue),
        color: "bg-blue-500",
        icon: DollarSign,
      },
      {
        title: "Total Expenses",
        value: formatCurrency(financialMetrics.totalExpenses),
        color: "bg-blue-400",
        icon: CreditCard,
      },
      {
        title: "Net Income",
        value: formatCurrency(financialMetrics.netIncome),
        color: "bg-indigo-500",
        icon: TrendingUp,
      },
      {
        title: "Profit Margin",
        value: `${financialMetrics.profitMargin.toFixed(1)}%`,
        color: "bg-sky-500",
        icon: PieChart,
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
            Track accounts payable, expenses, and performance
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statConfig.map((stat, i) => (
          <StatCard
            key={i}
            title={stat.title}
            value={stat.value}
            color={stat.color}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Charts & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue vs Expenses */}
        <div className="bg-white border border-slate-50 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Revenue vs Expenses</h3>
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
                tickFormatter={(v) => `$${v / 1000}k`}
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
              <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
              <Bar dataKey="expense" fill="#93c5fd" radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-slate-50 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Recent Activity</h3>
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
                  <div>
                    <p className="text-sm font-medium text-blue-900">{item.action}</p>
                    <p className="text-xs text-blue-600">{item.date}</p>
                  </div>
                  <p className="text-sm font-semibold text-blue-900">
                    {item.amount}
                  </p>
                </motion.div>
              ))
            ) : (
              <p className="text-blue-500 text-sm text-center py-6">
                No recent activity
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Account Summary (Line Chart) */}
      <div className="bg-white border border-slate-50 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900">Accounts Summary</h3>
          <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
            Overview
          </span>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" stroke="#2563eb" fontSize={12} />
            <YAxis
              stroke="#2563eb"
              fontSize={12}
              tickFormatter={(v) => `$${v / 1000}k`}
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
              dataKey="revenue"
              stroke="#2563eb"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#2563eb" }}
            />
            <Line
              type="monotone"
              dataKey="expense"
              stroke="#60a5fa"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#60a5fa" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AfDashboard;
