// pages/finance/AccountsPayable.jsx
import { useEffect, useState, useMemo } from "react";
import useBookingStore from "../../utils/store/useBookingStore";
import useFinanceStore from "../../utils/store/useFinanceStore";
import {
  DollarSign,
  TrendingDown,
  Clock,
  CheckCircle,
  Truck,
  Ship,
  Anchor,
  FileText,
  Settings
} from "lucide-react";
import Loading from "../../components/Loading";
import APTable from "../../components/tables/APTable";
import UpdateAP from "../../components/modals/UpdateAP";
import BulkActionBar from "../../components/BulkActionBar";
import StatCard from "../../components/cards/StatCard";

const AccountsPayable = () => {
  const { bookings, fetchBookings, loading: bookingsLoading, error, clearError } = useBookingStore();
  const {
    apRecords,
    fetchAP,
    updateAPRecord,
    loading: financeLoading,
    error: financeError
  } = useFinanceStore();

  const [activeTab, setActiveTab] = useState("ALL");
  const [selectedAP, setSelectedAP] = useState([]);
  const [isUpdateAPModalOpen, setIsUpdateAPModalOpen] = useState(false);
  const [activeAPId, setActiveAPId] = useState(null);

  useEffect(() => {
    fetchBookings();
    fetchAP();
  }, [fetchBookings, fetchAP]);

  // 🔸 Helper functions for calculations - MOVE THESE BEFORE useMemo
  const calculateTotalExpenses = (ap) => {
    return (parseFloat(ap.freight_amount) || 0) +
           (parseFloat(ap.trucking_origin_amount) || 0) +
           (parseFloat(ap.trucking_dest_amount) || 0) +
           (parseFloat(ap.crainage_amount) || 0) +
           (parseFloat(ap.arrastre_origin_amount) || 0) +
           (parseFloat(ap.arrastre_dest_amount) || 0) +
           (parseFloat(ap.wharfage_origin_amount) || 0) +
           (parseFloat(ap.wharfage_dest_amount) || 0) +
           (parseFloat(ap.labor_origin_amount) || 0) +
           (parseFloat(ap.labor_dest_amount) || 0) +
           (parseFloat(ap.rebates_amount) || 0) +
           (parseFloat(ap.storage_amount) || 0) +
           (parseFloat(ap.facilitation_amount) || 0);
  };

  const calculateBIR = (ap) => {
    const totalExpenses = calculateTotalExpenses(ap);
    return totalExpenses * 0.12;
  };

  const calculateTotalWithBIR = (ap) => {
    return calculateTotalExpenses(ap) + calculateBIR(ap);
  };

  const calculateNetRevenue = (ap) => {
    // For now, using a placeholder calculation
    // You might want to fetch actual revenue data from your backend
    const grossRevenue = 50000; // placeholder
    return grossRevenue - calculateTotalWithBIR(ap);
  };

  // Safe arrays
  const safeBookings = useMemo(() => (Array.isArray(bookings) ? bookings : []), [bookings]);
  const safeAPRecords = useMemo(() => (Array.isArray(apRecords) ? apRecords : []), [apRecords]);

  // 🔸 Data preparation for AP table
  const apRecordsForTable = useMemo(() => {
    if (safeAPRecords.length > 0) {
      return safeAPRecords.map(ap => ({
        ...ap,
        client: ap.consignee || "-",
        mode: ap.booking_mode === "DOOR_TO_DOOR" ? "D-D" : "P-P",
        route: `${ap.origin_port || "-"} → ${ap.destination_port || "-"}`,
        volume: `${ap.quantity || 1}${ap.container_size || "LCL"}`,
        freight_amount: parseFloat(ap.freight_amount) || 0,
        trucking_origin_amount: parseFloat(ap.trucking_origin_amount) || 0,
        trucking_dest_amount: parseFloat(ap.trucking_dest_amount) || 0,
        crainage_amount: parseFloat(ap.crainage_amount) || 0,
        arrastre_origin_amount: parseFloat(ap.arrastre_origin_amount) || 0,
        arrastre_dest_amount: parseFloat(ap.arrastre_dest_amount) || 0,
        wharfage_origin_amount: parseFloat(ap.wharfage_origin_amount) || 0,
        wharfage_dest_amount: parseFloat(ap.wharfage_dest_amount) || 0,
        labor_origin_amount: parseFloat(ap.labor_origin_amount) || 0,
        labor_dest_amount: parseFloat(ap.labor_dest_amount) || 0,
        rebates_amount: parseFloat(ap.rebates_amount) || 0,
        storage_amount: parseFloat(ap.storage_amount) || 0,
        facilitation_amount: parseFloat(ap.facilitation_amount) || 0,
        total_expenses: calculateTotalExpenses(ap),
        bir: calculateBIR(ap),
        total_expenses_with_bir: calculateTotalWithBIR(ap),
        net_revenue: calculateNetRevenue(ap),
      }));
    } else {
      // fallback from bookings if AP empty
      return safeBookings.map(booking => ({
        ap_id: booking.id, // Use booking ID as temporary AP ID
        booking_id: booking.id,
        booking_number: booking.booking_number,
        hwb_number: booking.hwb_number,
        origin_port: booking.origin_port,
        destination_port: booking.destination_port,
        commodity: booking.commodity,
        quantity: booking.quantity,
        booking_mode: booking.booking_mode,
        created_at: booking.created_at,
        client: booking.shipper || "-",
        mode: booking.booking_mode === "DOOR_TO_DOOR" ? "D-D" : "P-P",
        route: `${booking.origin_port || "-"} → ${booking.destination_port || "-"}`,
        volume: `${booking.quantity || 1}${booking.container_size || "LCL"}`,
        freight_payee: booking.shipping_line_name || "-",
        freight_amount: 0,
        trucking_origin_payee: booking.pickup_trucker || "-",
        trucking_origin_amount: 0,
        trucking_dest_payee: booking.delivery_trucker || "-",
        trucking_dest_amount: 0,
        crainage_amount: 0,
        arrastre_origin_amount: 0,
        arrastre_dest_amount: 0,
        wharfage_origin_amount: 0,
        wharfage_dest_amount: 0,
        labor_origin_amount: 0,
        labor_dest_amount: 0,
        rebates_amount: 0,
        storage_amount: 0,
        facilitation_amount: 0,
        total_expenses: 0,
        bir: 0,
        total_expenses_with_bir: 0,
        net_revenue: 0,
        remarks: "",
      }));
    }
  }, [safeBookings, safeAPRecords]);

  // 🔸 Stats
  const stats = useMemo(() => {
    const totalPayable = apRecordsForTable.reduce((sum, r) => sum + (r.total_expenses_with_bir || 0), 0);
    const totalExpenses = apRecordsForTable.reduce((sum, r) => sum + (r.total_expenses || 0), 0);
    
    // Simple logic to determine pending/paid - you might want to improve this
    const pendingCount = apRecordsForTable.filter(r => 
      !r.freight_check_date && 
      !r.trucking_origin_check_date && 
      !r.trucking_dest_check_date
    ).length;
    const paidCount = apRecordsForTable.length - pendingCount;

    return { 
      total: totalPayable, 
      expenses: totalExpenses, 
      pending: pendingCount, 
      paid: paidCount 
    };
  }, [apRecordsForTable]);

  const statsConfig = [
    { 
      key: "TOTAL", 
      title: "Total Payable", 
      value: `₱${stats.total.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`, 
      color: "bg-gradient-to-br from-red-500 to-red-600 text-white", 
      icon: TrendingDown 
    },
    { 
      key: "EXPENSES", 
      title: "Total Expenses", 
      value: `₱${stats.expenses.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`, 
      color: "bg-gradient-to-br from-orange-500 to-orange-600 text-white", 
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
  ];

  const tabs = [
    { key: "ALL", label: "All Expenses", icon: FileText },
    { key: "FREIGHT", label: "Freight", icon: Ship },
    { key: "TRUCKING", label: "Trucking", icon: Truck },
    { key: "PORT_CHARGES", label: "Port Charges", icon: Anchor },
    { key: "MISC_CHARGES", label: "Misc Charges", icon: Settings }
  ];

  // 🔸 Handlers
  const handleEditAP = (id) => {
    setActiveAPId(id);
    setIsUpdateAPModalOpen(true);
  };

  const handleBulkEdit = (ids) => {
    if (ids.length !== 1) {
      alert("Please select exactly one record to edit.");
      return;
    }
    handleEditAP(ids[0]);
  };

  const handleBulkDelete = (ids) => {
    if (window.confirm(`Delete ${ids.length} AP record(s)?`)) {
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
          <button onClick={clearError} className="btn-primary mt-4">Try Again</button>
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
            <h1 className="page-title">Accounts Payable</h1>
            <p className="page-subtitle">Track and manage all operational expenses and payments</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsConfig.map(stat => <StatCard key={stat.key} {...stat} />)}
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
            <div className="overflow-x-auto">
              <div className="flex border-b border-gray-200">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex items-center gap-2 px-6 py-4 font-medium text-sm whitespace-nowrap transition-all duration-200 border-b-2
                        ${isActive
                          ? "border-blue-600 text-blue-600 bg-blue-50"
                          : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        }`}
                    >
                      <Icon className="h-5 w-5" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* AP Table */}
          <APTable
            data={apRecordsForTable}
            activeTab={activeTab}
            onSelectionChange={setSelectedAP}
            onEdit={handleEditAP}
          />

          {/* Bulk Actions */}
          <BulkActionBar
            selected={selectedAP}
            onEdit={handleBulkEdit}
            onPrint={(ids) => console.log("Print", ids)}
            onDownload={(ids) => console.log("Download", ids)}
            onDelete={handleBulkDelete}
          />

          {/* Update AP Modal */}
          <UpdateAP
            isOpen={isUpdateAPModalOpen}
            onClose={() => {
              setIsUpdateAPModalOpen(false);
              setActiveAPId(null);
            }}
            apId={activeAPId}
            apRecord={apRecordsForTable.find(r => r.ap_id === activeAPId)}
          />
        </div>
      </div>
    </div>
  );
};

export default AccountsPayable;