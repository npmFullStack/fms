// pages/finance/AccountsReceivable.jsx
import { useEffect, useState, useMemo } from "react";
import useBookingStore from "../../utils/store/useBookingStore";
import { DollarSign, FileText, Clock, CheckCircle } from "lucide-react";
import Loading from "../../components/Loading";
import ARTable from "../../components/tables/ARTable";
import StatCard from "../../components/cards/StatCard";

const AccountsReceivable = () => {
  const { bookings, fetchBookings, loading, error, clearError } = useBookingStore();

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Safe array
  const safeBookings = useMemo(
    () => (Array.isArray(bookings) ? bookings : []),
    [bookings]
  );

  // Format bookings for AR table
  const arRecords = useMemo(() => {
    return safeBookings.map(booking => {
      // Calculate volume (quantity × container size)
      const containerSize = booking.container_size || "LCL";
      const volume =
        booking.quantity > 1
          ? `${booking.quantity}×${containerSize}`
          : containerSize;

      // Calculate aging (days since created)
      const createdDate = new Date(booking.created_at);
      const today = new Date();
      const aging = Math.floor((today - createdDate) / (1000 * 60 * 60 * 24));

      // Get payment terms (default 30 DAYS)
      const terms = "30 DAYS";

      // Calculate amount (this should come from your pricing logic)
      const pesos = booking.total_amount || 0;

      // Get shipping line
      const shippingLine = booking.shipping_line_name || "-";

      // Calculate net revenue percentage (placeholder - implement your logic)
      const netRevenuePercent = 0;

      return {
        id: booking.id,
        date: booking.created_at,
        client: booking.shipper || "-",
        description: "FREIGHT",
        remarks: booking.remarks || "",
        hwb_number: booking.hwb_number || "-",
        route: `${booking.origin_port || "-"}–${booking.destination_port || "-"}`,
        volume,
        date_delivered: booking.delivered_at || null,
        aging,
        terms,
        pesos,
        shipping_line: shippingLine,
        net_revenue_percent: netRevenuePercent,
        payment_status: booking.payment_status || "PENDING",
        booking_mode: booking.booking_mode
      };
    });
  }, [safeBookings]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalReceivable = arRecords.reduce((sum, r) => sum + r.pesos, 0);
    const pendingCount = arRecords.filter(r => r.payment_status === "PENDING").length;
    const paidCount = arRecords.filter(r => r.payment_status === "PAID").length;
    const overdueCount = arRecords.filter(r => r.payment_status === "OVERDUE").length;

    return {
      total: totalReceivable,
      pending: pendingCount,
      paid: paidCount,
      overdue: overdueCount
    };
  }, [arRecords]);

  const statsConfig = [
    {
      key: "TOTAL",
      title: "Total Receivable",
      value: `₱${stats.total.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`,
      color: "bg-gradient-to-br from-blue-500 to-blue-600 text-white",
      icon: DollarSign
    },
    {
      key: "PENDING",
      title: "Pending",
      value: stats.pending,
      color: "bg-gradient-to-br from-yellow-500 to-yellow-600 text-white",
      icon: Clock
    },
    {
      key: "PAID",
      title: "Paid",
      value: stats.paid,
      color: "bg-gradient-to-br from-green-500 to-green-600 text-white",
      icon: CheckCircle
    },
    {
      key: "OVERDUE",
      title: "Overdue",
      value: stats.overdue,
      color: "bg-gradient-to-br from-red-500 to-red-600 text-white",
      icon: FileText
    }
  ];

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="page-container">
        <div className="max-w-md mx-auto">
          <div className="error-message">{error}</div>
          <button onClick={clearError} className="btn-primary mt-4">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="page-title">Accounts Receivable</h1>
            <p className="page-subtitle">
              Track and manage outstanding customer payments
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsConfig.map(stat => (
              <StatCard key={stat.key} {...stat} />
            ))}
          </div>

          {/* AR Table */}
          <ARTable data={arRecords} />
        </div>
      </div>
    </div>
  );
};

export default AccountsReceivable;