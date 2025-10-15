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

  // Function to refresh data
  const refreshData = async () => {
    try {
      await Promise.all([fetchBookings(), fetchAR(), fetchAP()]);
    } catch (err) {
      console.error("Error refreshing data:", err);
    }
  };

  useEffect(() => {
    refreshData();
  }, [fetchBookings, fetchAR, fetchAP]);

  // Safe arrays
  const safeBookings = useMemo(() => (Array.isArray(bookings) ? bookings : []), [bookings]);
  const safeARRecords = useMemo(() => (Array.isArray(arRecords) ? arRecords : []), [arRecords]);
  const safeAPRecords = useMemo(() => (Array.isArray(apRecords) ? apRecords : []), [apRecords]);

  // Helper to get booking data for AR record
  const getBookingData = (bookingId) => {
    return safeBookings.find(booking => booking.id === bookingId);
  };

  // Helper to get AP record
  const getAPRecord = (bookingId) => {
    return safeAPRecords.find(ap => ap.booking_id === bookingId);
  };

// Format data for AR table - FIXED booking date logic
const arRecordsForTable = useMemo(() => {
  if (safeARRecords.length > 0) {
    return safeARRecords.map(ar => {
      // Get corresponding booking data to access the correct booking_date
      const bookingData = getBookingData(ar.booking_id);

      return {
        ...ar,
        id: ar.ar_id || ar.id,
        booking_date: bookingData?.booking_date || ar.booking_date || ar.created_at,
        client: ar.shipper || "-",
        description: "FREIGHT",
        hwb_number: ar.hwb_number || "-",
        origin_port: ar.origin_port,
        destination_port: ar.destination_port,
        quantity: ar.quantity || 1,
        container_size: ar.container_size || "LCL",
        date_delivered: ar.date_delivered,
        aging: ar.current_aging || ar.aging || 0,
        terms: ar.terms !== undefined && ar.terms !== null ? ar.terms : 0,
        amount_paid: ar.amount_paid || 0,
        gross_income: ar.gross_income || 0,
        collectible_amount: ar.collectible_amount || ar.gross_income || 0,
        payment_status: ar.ar_payment_status || ar.payment_status || "PENDING",
        shipping_line: ar.shipping_line || "-",
        booking_id: ar.booking_id
      };
    });
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
        // ✅ FIXED: Use actual booking_date from booking
        booking_date: booking.booking_date || booking.created_at,
        client: booking.shipper || "-",
        description: "FREIGHT",
        hwb_number: booking.hwb_number || "-",
        origin_port: booking.origin_port,
        destination_port: booking.destination_port,
        quantity: booking.quantity || 1,
        container_size: containerSize,
        date_delivered: booking.date_delivered,
        aging,
        // ✅ FIXED: Default to 0 instead of 30
        terms: 0,
        amount_paid: 0,
        gross_income: 0,
        collectible_amount: 0,
        payment_status: booking.payment_status || "PENDING",
        shipping_line: booking.shipping_line_name || "-",
        booking_id: booking.id
      };
    });
  }
}, [safeBookings, safeARRecords]);

  // Calculate statistics with CORRECT net revenue calculation
  const stats = useMemo(() => {
    let totalCollectible = 0;
    let totalCollected = 0;
    let totalExpenses = 0;
    let totalNetRevenue = 0;
    let overdueCount = 0;
    let totalBookings = arRecordsForTable.length;

    arRecordsForTable.forEach(ar => {
      const apRecord = getAPRecord(ar.booking_id);
      const amountPaid = parseFloat(ar.amount_paid || 0);
      const grossIncome = parseFloat(ar.gross_income || 0);
      const collectibleAmount = parseFloat(ar.collectible_amount || grossIncome);
      
      const expenses = parseFloat(apRecord?.total_payables || apRecord?.total_expenses || 0);
      
      const netRevenue = grossIncome - expenses;

      totalCollectible += collectibleAmount;
      totalCollected += amountPaid;
      totalExpenses += expenses;
      totalNetRevenue += netRevenue;


const terms = ar.terms !== undefined && ar.terms !== null ? ar.terms : 0;
      if (ar.aging > terms) {
        overdueCount++;
      }
    });

    const totalBalance = totalCollectible - totalCollected;
    const averageNetRevenuePercent = totalCollectible > 0 
      ? (totalNetRevenue / totalCollectible) * 100 
      : 0;

    return {
      totalCollectible,
      totalCollected,
      totalBalance,
      totalExpenses,
      totalNetRevenue,
      averageNetRevenuePercent,
      overdueCount,
      totalBookings
    };
  }, [arRecordsForTable, safeAPRecords]);

  // Stats configuration
  const statsConfig = [
    {
      key: "COLLECTIBLE",
      title: "Total Collectible",
      value: `₱${stats.totalCollectible.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`,
      color: "bg-gradient-to-br from-blue-500 to-blue-600 text-white",
      icon: Wallet,
      subtitle: `Balance: ₱${stats.totalBalance.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`
    },
    {
      key: "COLLECTED",
      title: "Total Collected",
      value: `₱${stats.totalCollected.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`,
      color: "bg-gradient-to-br from-green-500 to-green-600 text-white",
      icon: DollarSign,
      subtitle: `Collected from clients`
    },
    {
      key: "NET_REVENUE",
      title: "Net Revenue",
      value: `₱${stats.totalNetRevenue.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`,
      color: stats.totalNetRevenue >= 0 
        ? "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white"
        : "bg-gradient-to-br from-red-500 to-red-600 text-white",
      icon: TrendingUp,
      subtitle: `Margin: ${stats.averageNetRevenuePercent.toFixed(1)}%`
    },
    {
      key: "OVERDUE",
      title: "Overdue Records",
      value: stats.overdueCount,
      color: stats.overdueCount > 0
        ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white"
        : "bg-gradient-to-br from-gray-500 to-gray-600 text-white",
      icon: AlertCircle,
      subtitle: `Out of ${stats.totalBookings} total`
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

  // Handle modal close with auto-refresh
  const handleModalClose = () => {
    setIsUpdateARModalOpen(false);
    setActiveARId(null);
    // Refresh data after a short delay to allow backend to process
    setTimeout(() => {
      refreshData();
    }, 1500);
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
          {/* Header - REMOVED Refresh Button */}
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

          {/* Update AR Modal with auto-refresh */}
          <UpdateAR
            isOpen={isUpdateARModalOpen}
            onClose={handleModalClose}
            arId={activeARId}
            arRecord={arRecordsForTable.find(r => r.ar_id === activeARId || r.id === activeARId)}
          />
        </div>
      </div>
    </div>
  );
};

export default AccountsReceivable;