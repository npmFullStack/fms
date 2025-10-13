// pages/finance/AccountsReceivable.jsx
import { useEffect, useState, useMemo } from "react";
import useBookingStore from "../../utils/store/useBookingStore";
import useFinanceStore from "../../utils/store/useFinanceStore";
import { DollarSign, FileText, Clock, CheckCircle } from "lucide-react";
import Loading from "../../components/Loading";
import ARTable from "../../components/tables/ARTable";
import UpdateAR from "../../components/modals/UpdateAR";
import BulkActionBar from "../../components/BulkActionBar";
import StatCard from "../../components/cards/StatCard";

const AccountsReceivable = () => {
  const { bookings, fetchBookings, loading: bookingsLoading, error, clearError } = useBookingStore();
  const {
    arRecords,
    fetchAR,
    loading: financeLoading,
    error: financeError
  } = useFinanceStore();

  const [selectedAR, setSelectedAR] = useState([]);
  const [isUpdateARModalOpen, setIsUpdateARModalOpen] = useState(false);
  const [activeARId, setActiveARId] = useState(null);

  useEffect(() => {
    fetchBookings();
    fetchAR();
  }, [fetchBookings, fetchAR]);

  // Safe arrays
  const safeBookings = useMemo(() => (Array.isArray(bookings) ? bookings : []), [bookings]);
  const safeARRecords = useMemo(() => (Array.isArray(arRecords) ? arRecords : []), [arRecords]);

  // Format data for AR table - use backend AR data if available, otherwise fallback to bookings
  const arRecordsForTable = useMemo(() => {
    if (safeARRecords.length > 0) {
      return safeARRecords.map(ar => ({
        ...ar,
        id: ar.ar_id || ar.id,
        date: ar.booking_date || ar.created_at,
        client: ar.shipper || "-",
        description: "FREIGHT",
        hwb_number: ar.hwb_number || "-",
        route: `${ar.origin_port || "-"} → ${ar.destination_port || "-"}`,
        volume: `${ar.quantity || 1}${ar.container_size || "LCL"}`,
        aging: ar.current_aging || ar.aging || 0,
        terms: "30 DAYS",
        pesos: ar.total_amount || 0,
        amount_paid: ar.amount_paid || 0,
        balance: ar.balance || (ar.total_amount || 0) - (ar.amount_paid || 0),
        payment_status: ar.ar_payment_status || ar.payment_status || "PENDING",
        shipping_line: ar.shipping_line || "-",
        net_revenue_percent: 0 // Placeholder
      }));
    } else {
      // Fallback to bookings data
      return safeBookings.map(booking => {
        const containerSize = booking.container_size || "LCL";
        const volume = booking.quantity > 1 ? `${booking.quantity}×${containerSize}` : containerSize;
        
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
          route: `${booking.origin_port || "-"} → ${booking.destination_port || "-"}`,
          volume,
          aging,
          terms: "30 DAYS",
          pesos: booking.total_amount || 0,
          amount_paid: 0,
          balance: booking.total_amount || 0,
          payment_status: booking.payment_status || "PENDING",
          shipping_line: booking.shipping_line_name || "-",
          net_revenue_percent: 0
        };
      });
    }
  }, [safeBookings, safeARRecords]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalReceivable = arRecordsForTable.reduce((sum, r) => sum + r.pesos, 0);
    const totalCollected = arRecordsForTable.reduce((sum, r) => sum + (r.amount_paid || 0), 0);
    const totalBalance = arRecordsForTable.reduce((sum, r) => sum + (r.balance || 0), 0);
    
    const pendingCount = arRecordsForTable.filter(r => 
      r.payment_status === "PENDING" || (r.balance > 0 && r.amount_paid === 0)
    ).length;
    
    const paidCount = arRecordsForTable.filter(r => 
      r.payment_status === "PAID" || r.balance === 0
    ).length;
    
    const overdueCount = arRecordsForTable.filter(r => 
      r.payment_status === "OVERDUE" || (r.aging > 30 && r.balance > 0)
    ).length;

    return {
      total: totalReceivable,
      collected: totalCollected,
      balance: totalBalance,
      pending: pendingCount,
      paid: paidCount,
      overdue: overdueCount
    };
  }, [arRecordsForTable]);

  const statsConfig = [
    {
      key: "TOTAL",
      title: "Total Receivable",
      value: `₱${stats.total.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`,
      color: "bg-gradient-to-br from-blue-500 to-blue-600 text-white",
      icon: DollarSign
    },
    {
      key: "COLLECTED",
      title: "Amount Collected",
      value: `₱${stats.collected.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`,
      color: "bg-gradient-to-br from-green-500 to-green-600 text-white",
      icon: CheckCircle
    },
    {
      key: "PENDING",
      title: "Pending",
      value: stats.pending,
      color: "bg-gradient-to-br from-yellow-500 to-yellow-600 text-white",
      icon: Clock
    },
    {
      key: "OVERDUE",
      title: "Overdue",
      value: stats.overdue,
      color: "bg-gradient-to-br from-red-500 to-red-600 text-white",
      icon: FileText
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