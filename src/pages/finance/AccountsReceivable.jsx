// pages/finance/AccountsReceivable.jsx
import { useEffect, useState, useMemo } from "react";
import useBookingStore from "../../utils/store/useBookingStore";
import useFinanceStore from "../../utils/store/useFinanceStore";
import { DollarSign, TrendingUp, AlertCircle, Wallet } from "lucide-react";
import Loading from "../../components/Loading";
import ARTable from "../../components/tables/ARTable";
import UpdateAR from "../../components/modals/UpdateAR";
import BulkActionBar from "../../components/BulkActionBar";
import StatCard from "../../components/cards/StatCard";
import { calculateTotalWithBIR, calculateNetRevenue } from "../../utils/helpers/financeCalculations";

const AccountsReceivable = () => {
  const { bookings, fetchBookings, loading: bookingsLoading, error, clearError } = useBookingStore();
  const {
    arRecords,
    apRecords,
    fetchAR,
    fetchAP,
    loading: financeLoading,
    error: financeError
  } = useFinanceStore();

  const [selectedAR, setSelectedAR] = useState([]);
  const [isUpdateARModalOpen, setIsUpdateARModalOpen] = useState(false);
  const [activeARId, setActiveARId] = useState(null);

  useEffect(() => {
    fetchBookings();
    fetchAR();
    fetchAP();
  }, [fetchBookings, fetchAR, fetchAP]);

  // Safe arrays
  const safeBookings = useMemo(() => (Array.isArray(bookings) ? bookings : []), [bookings]);
  const safeARRecords = useMemo(() => (Array.isArray(arRecords) ? arRecords : []), [arRecords]);
  const safeAPRecords = useMemo(() => (Array.isArray(apRecords) ? apRecords : []), [apRecords]);

  // Helper to get AP record
  const getAPRecord = (bookingId) => {
    return safeAPRecords.find(ap => ap.booking_id === bookingId);
  };

  // Format data for AR table
  const arRecordsForTable = useMemo(() => {
    if (safeARRecords.length > 0) {
      return safeARRecords.map(ar => ({
        ...ar,
        id: ar.ar_id || ar.id,
        date: ar.booking_date || ar.created_at,
        client: ar.shipper || "-",
        description: "FREIGHT",
        hwb_number: ar.hwb_number || "-",
        origin_port: ar.origin_port,
        destination_port: ar.destination_port,
        quantity: ar.quantity || 1,
        container_size: ar.container_size || "LCL",
        date_delivered: ar.date_delivered,
        aging: ar.current_aging || ar.aging || 0,
        terms: ar.terms || 30,
        amount_paid: ar.amount_paid || 0,
        payment_status: ar.ar_payment_status || ar.payment_status || "PENDING",
        shipping_line: ar.shipping_line || "-",
        booking_id: ar.booking_id
      }));
    } else {
      // Fallback to bookings data
      return safeBookings.map(booking => {
        const containerSize = booking.container_size || "LCL";
        const createdDate = new Date(booking.created_at);
        const today = new Date();
        const aging = Math.floor((today - createdDate) / (1000 * 60 * 60 * 24));

        return {
          id: booking.id,
          ar_id: booking.id,
          date: booking.created_at,
          client: booking.shipper || "-",
          description: "FREIGHT",
          hwb_number: booking.hwb_number || "-",
          origin_port: booking.origin_port,
          destination_port: booking.destination_port,
          quantity: booking.quantity || 1,
          container_size: containerSize,
          date_delivered: booking.date_delivered,
          aging,
          terms: 30,
          amount_paid: 0,
          payment_status: booking.payment_status || "PENDING",
          shipping_line: booking.shipping_line_name || "-",
          booking_id: booking.id
        };
      });
    }
  }, [safeBookings, safeARRecords]);

  // Calculate statistics
  const stats = useMemo(() => {
    let totalReceivable = 0;
    let totalCollected = 0;
    let totalExpenses = 0;
    let totalNetRevenue = 0;
    let highAgingCount = 0;

    arRecordsForTable.forEach(ar => {
      const apRecord = getAPRecord(ar.booking_id);
      const amountPaid = parseFloat(ar.amount_paid || 0);
      const expenses = calculateTotalWithBIR(apRecord);
      const netRevenue = calculateNetRevenue(ar, apRecord);

      totalReceivable += parseFloat(ar.pesos || ar.total_amount || 0);
      totalCollected += amountPaid;
      totalExpenses += expenses;
      totalNetRevenue += netRevenue;

      // Count high aging (> 60 days)
      if (ar.aging > 60) {
        highAgingCount++;
      }
    });

    const totalBalance = totalReceivable - totalCollected;
    const averageNetRevenuePercent = totalCollected > 0 
      ? (totalNetRevenue / totalCollected) * 100 
      : 0;

    return {
      totalReceivable,
      totalCollected,
      totalBalance,
      totalExpenses,
      totalNetRevenue,
      averageNetRevenuePercent,
      highAgingCount
    };
  }, [arRecordsForTable, safeAPRecords]);

  const statsConfig = [
    {
      key: "COLLECTED",
      title: "Total Collected",
      value: `₱${stats.totalCollected.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`,
      color: "bg-gradient-to-br from-green-500 to-green-600 text-white",
      icon: Wallet,
      subtitle: `Balance: ₱${stats.totalBalance.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`
    },
    {
      key: "NET_REVENUE",
      title: "Net Revenue",
      value: `₱${stats.totalNetRevenue.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`,
      color: stats.totalNetRevenue >= 0 
        ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
        : "bg-gradient-to-br from-red-500 to-red-600 text-white",
      icon: TrendingUp,
      subtitle: `Average: ${stats.averageNetRevenuePercent.toFixed(1)}%`
    },
    {
      key: "EXPENSES",
      title: "Total Expenses",
      value: `₱${stats.totalExpenses.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`,
      color: "bg-gradient-to-br from-purple-500 to-purple-600 text-white",
      icon: DollarSign,
      subtitle: "Including 12% BIR"
    },
    {
      key: "HIGH_AGING",
      title: "High Aging (>60 days)",
      value: stats.highAgingCount,
      color: stats.highAgingCount > 0
        ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white"
        : "bg-gradient-to-br from-gray-500 to-gray-600 text-white",
      icon: AlertCircle,
      subtitle: "Needs attention"
    }
  ];

  // Handlers
  const handleEditAR = (id) => {
    setActiveARId(id);
    setIsUpdateARModalOpen(true);
  };

  const handleBulkEdit = (ids) => {
    if (ids.length !== 1) {
      alert("Please select exactly one record to edit.");
      return;
    }
    handleEditAR(ids[0]);
  };

  const handleBulkDelete = (ids) => {
    if (window.confirm(`Delete ${ids.length} AR record(s)?`)) {
      console.log("TODO: implement bulk delete for", ids);
    }
  };

  const loading = bookingsLoading || financeLoading;

  if (loading) return <Loading />;

  if (error || financeError) {
    return (
      <div className="page-container">
        <div className="max-w-md mx-auto">
          <div className="error-message">{error || financeError}</div>
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
              Track payments, expenses, and net revenue
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsConfig.map(stat => (
              <StatCard key={stat.key} {...stat} />
            ))}
          </div>

          {/* AR Table */}
          <ARTable
            data={arRecordsForTable}
            onSelectionChange={setSelectedAR}
            onEdit={handleEditAR}
          />

          {/* Bulk Actions */}
          <BulkActionBar
            selected={selectedAR}
            onEdit={handleBulkEdit}
            onPrint={(ids) => console.log("Print", ids)}
            onDownload={(ids) => console.log("Download", ids)}
            onDelete={handleBulkDelete}
          />

          {/* Update AR Modal */}
          <UpdateAR
            isOpen={isUpdateARModalOpen}
            onClose={() => {
              setIsUpdateARModalOpen(false);
              setActiveARId(null);
            }}
            arId={activeARId}
            arRecord={arRecordsForTable.find(r => r.ar_id === activeARId || r.id === activeARId)}
          />
        </div>
      </div>
    </div>
  );
};

export default AccountsReceivable;