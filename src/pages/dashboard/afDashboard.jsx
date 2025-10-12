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
  DollarSign,
  FileText,
  TrendingUp,
  CalendarDays,
  CreditCard,
  PieChart,
  Users,
  Building,
} from "lucide-react";
import { motion } from "framer-motion";
import Select from "react-select";

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

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const AfDashboard = () => {
  // State and Stores
  const [dateFilter, setDateFilter] = useState(DATE_OPTIONS[0]);
  const { 
    apRecords,
    arRecords,
    loading,
    fetchAP,
    fetchAR
  } = useFinanceStore();

  // Data Fetching
  useEffect(() => {
    fetchAP();
    fetchAR();
  }, [fetchAP, fetchAR]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  // Calculate financial metrics from AP records
  const financialMetrics = useMemo(() => {
    const totalExpenses = apRecords.reduce((sum, record) => 
      sum + (parseFloat(record.total_expenses) || 0), 0
    );
    
    const totalRevenue = apRecords.reduce((sum, record) => 
      sum + (parseFloat(record.net_revenue) || 0), 0
    );

    const netIncome = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? (netIncome / totalRevenue) * 100 : 0;
    const totalBookings = apRecords.length;
    const avgRevenuePerBooking = totalBookings > 0 ? totalRevenue / totalBookings : 0;
    const expenseRatio = totalRevenue > 0 ? (totalExpenses / totalRevenue) * 100 : 0;

    return {
      totalExpenses,
      totalRevenue,
      netIncome,
      profitMargin,
      totalBookings,
      avgRevenuePerBooking,
      expenseRatio
    };
  }, [apRecords]);

  // Generate chart data from AP records
  const chartData = useMemo(() => {
    const monthlyData = {};
    
    apRecords.forEach(record => {
      if (record.created_at) {
        const date = new Date(record.created_at);
        const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
        
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = {
            month: MONTHS[date.getMonth()],
            revenue: 0,
            expense: 0
          };
        }
        
        monthlyData[monthKey].revenue += parseFloat(record.net_revenue) || 0;
        monthlyData[monthKey].expense += parseFloat(record.total_expenses) || 0;
      }
    });

    return Object.values(monthlyData).slice(-6); // Last 6 months
  }, [apRecords]);

  // Get top payees
  const topPayees = useMemo(() => {
    const payeeMap = {};
    
    apRecords.forEach(record => {
      // Freight payee
      if (record.freight_payee && record.freight_amount > 0) {
        const payee = record.freight_payee;
        payeeMap[payee] = (payeeMap[payee] || 0) + (parseFloat(record.freight_amount) || 0);
      }
      
      // Trucking origin payee
      if (record.trucking_origin_payee && record.trucking_origin_amount > 0) {
        const payee = record.trucking_origin_payee;
        payeeMap[payee] = (payeeMap[payee] || 0) + (parseFloat(record.trucking_origin_amount) || 0);
      }
      
      // Trucking destination payee
      if (record.trucking_dest_payee && record.trucking_dest_amount > 0) {
        const payee = record.trucking_dest_payee;
        payeeMap[payee] = (payeeMap[payee] || 0) + (parseFloat(record.trucking_dest_amount) || 0);
      }
    });

    return Object.entries(payeeMap)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([name, amount]) => ({ name, amount }));
  }, [apRecords]);

  // Stat Cards Configuration
  const statConfig = useMemo(() => [
    { 
      title: "Total Revenue", 
      value: formatCurrency(financialMetrics.totalRevenue), 
      color: "bg-emerald-500", 
      icon: DollarSign,
      trend: "up" 
    },
    { 
      title: "Total Expenses", 
      value: formatCurrency(financialMetrics.totalExpenses), 
      color: "bg-red-500", 
      icon: CreditCard,
      trend: "down" 
    },
    { 
      title: "Net Income", 
      value: formatCurrency(financialMetrics.netIncome), 
      color: financialMetrics.netIncome >= 0 ? "bg-blue-500" : "bg-orange-500", 
      icon: TrendingUp,
      trend: financialMetrics.netIncome >= 0 ? "up" : "down" 
    },
    { 
      title: "Profit Margin", 
      value: `${financialMetrics.profitMargin.toFixed(1)}%`, 
      color: financialMetrics.profitMargin >= 0 ? "bg-green-500" : "bg-rose-500", 
      icon: PieChart,
      trend: financialMetrics.profitMargin >= 0 ? "up" : "down" 
    },
  ], [financialMetrics]);

  // Loading state
  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      {/* Filter Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white rounded-xl p-4 border border-slate-50 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Financial Overview</h2>
          <p className="text-sm text-slate-600 mt-1">
            Track accounts payable, expenses, and financial performance
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statConfig.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            color={stat.color}
            icon={stat.icon}
            trend={stat.trend}
          />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue vs Expenses */}
        <div className="bg-white border border-slate-50 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-slate-900">Revenue vs Expenses</h3>
            </div>
            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              Last 6 months
            </span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart 
              data={chartData}
              margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="month" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <ReTooltip 
                formatter={(value) => [formatCurrency(value), 'Amount']}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Bar 
                dataKey="revenue" 
                fill="#10b981" 
                radius={[4, 4, 0, 0]}
                barSize={24}
                name="Revenue"
              />
              <Bar 
                dataKey="expense" 
                fill="#ef4444" 
                radius={[4, 4, 0, 0]}
                barSize={24}
                name="Expenses"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Payees */}
        <div className="bg-white border border-slate-50 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-slate-900">Top Payees</h3>
            </div>
            <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
              By Amount
            </span>
          </div>
          
          <div className="space-y-3">
            {topPayees.length > 0 ? (
              topPayees.map((payee, index) => (
                <motion.div
                  key={payee.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Building className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{payee.name}</p>
                      <p className="text-xs text-slate-500">Vendor</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">
                      {formatCurrency(payee.amount)}
                    </p>
                    <p className="text-xs text-slate-500">Total Paid</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <Building className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">No payee data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="bg-white border border-slate-50 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-slate-900">Accounts Payable Summary</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-600 mb-1">Total AP Records</p>
            <p className="text-2xl font-bold text-slate-900">{financialMetrics.totalBookings}</p>
            <p className="text-xs text-slate-500 mt-1">Active accounts payable</p>
          </div>
          
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-600 mb-1">Avg Revenue per Booking</p>
            <p className="text-2xl font-bold text-slate-900">
              {formatCurrency(financialMetrics.avgRevenuePerBooking)}
            </p>
            <p className="text-xs text-slate-500 mt-1">Per booking average</p>
          </div>
          
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-600 mb-1">Expense Ratio</p>
            <p className="text-2xl font-bold text-slate-900">
              {financialMetrics.expenseRatio.toFixed(1)}%
            </p>
            <p className="text-xs text-slate-500 mt-1">Expenses to Revenue</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AfDashboard;