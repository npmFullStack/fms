// pages/finance/AccountsPayable.jsx
import { useEffect, useState, useMemo } from "react";
import useBookingStore from "../../utils/store/useBookingStore";
import useFinanceStore from "../../utils/store/useFinanceStore";
import {
  DollarSign,
  TrendingDown,
  Receipt,
  Percent,
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
  const [dataLoaded, setDataLoaded] = useState(false);

  // 🔄 Enhanced data fetching with timeout and retry
  const refreshData = async () => {
    try {
      setDataLoaded(false);
      // Add a small delay to ensure data is properly fetched from backend
      await Promise.all([
        fetchBookings(),
        fetchAP()
      ]);
      
      // Set timeout to ensure data is fully processed
      setTimeout(() => {
        setDataLoaded(true);
      }, 1500);
      
    } catch (err) {
      console.error("Error refreshing data:", err);
      setDataLoaded(true); // Still set to true to show UI even if there's an error
    }
  };

  useEffect(() => {
    refreshData();
  }, [fetchBookings, fetchAP]);

  // Safe arrays
  const safeBookings = useMemo(() => (Array.isArray(bookings) ? bookings : []), [bookings]);
  const safeAPRecords = useMemo(() => (Array.isArray(apRecords) ? apRecords : []), [apRecords]);

  // 🔸 Data preparation for AP table
  const apRecordsForTable = useMemo(() => {
    if (!dataLoaded) return []; // Return empty array until data is loaded
    
    if (safeAPRecords.length > 0) {
      return safeAPRecords.map(ap => ({
        ...ap,
        client: ap.consignee || "-",
        mode: ap.booking_mode === "DOOR_TO_DOOR" ? "D-D" : "P-P",
        route: `${ap.origin_port || "-"} → ${ap.destination_port || "-"}`,
        container_size: ap.container_size || "LCL",
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
        
        // ✅ Use actual database fields
        total_expenses: parseFloat(ap.total_expenses) || 0,
        bir_percentage: parseFloat(ap.bir_percentage) || 0,
        total_payables: parseFloat(ap.total_payables) || 0,
        
        // ✅ Calculate BIR amount for display
        bir_amount: (parseFloat(ap.total_expenses) || 0) * (parseFloat(ap.bir_percentage) || 0) / 100,
      }));
    } else {
      // fallback from bookings if AP empty
      return safeBookings.map(booking => ({
        ap_id: booking.id,
        booking_id: booking.id,
        booking_number: booking.booking_number,
        hwb_number: booking.hwb_number,
        origin_port: booking.origin_port,
        destination_port: booking.destination_port,
        commodity: booking.commodity,
        quantity: booking.quantity,
        container_size: booking.container_size || "LCL",
        booking_mode: booking.booking_mode,
        created_at: booking.created_at,
        client: booking.shipper || "-",
        mode: booking.booking_mode === "DOOR_TO_DOOR" ? "D-D" : "P-P",
        route: `${booking.origin_port || "-"} → ${booking.destination_port || "-"}`,
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
        
        // ✅ Default values for new fields
        total_expenses: 0,
        bir_percentage: 0,
        total_payables: 0,
        bir_amount: 0,
        remarks: "",
      }));
    }
  }, [safeBookings, safeAPRecords, dataLoaded]);

  // 🔸 Stats - Updated to use actual database fields
  const stats = useMemo(() => {
    if (!dataLoaded) {
      return { total: 0, expenses: 0, bir: 0, records: 0 };
    }
    
    const totalPayable = apRecordsForTable.reduce((sum, r) => sum + (r.total_payables || 0), 0);
    const totalExpenses = apRecordsForTable.reduce((sum, r) => sum + (r.total_expenses || 0), 0);
    const totalBIR = apRecordsForTable.reduce((sum, r) => sum + (r.bir_amount || 0), 0);
    const totalRecords = apRecordsForTable.length;

    return { 
      total: totalPayable, 
      expenses: totalExpenses, 
      bir: totalBIR,
      records: totalRecords
    };
  }, [apRecordsForTable, dataLoaded]);

  // 🔸 Updated stats config with dynamic BIR percentage
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
      key: "BIR", 
      title: "BIR Tax", 
      value: `₱${stats.bir.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`, 
      color: "bg-gradient-to-br from-purple-500 to-purple-600 text-white", 
      icon: Percent 
    },
    { 
      key: "RECORDS", 
      title: "Total Records", 
      value: stats.records, 
      color: "bg-gradient-to-br from-blue-500 to-blue-600 text-white", 
      icon: Receipt 
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

  // ✅ NEW: Handle modal close with auto-refresh
  const handleModalClose = () => {
    setIsUpdateAPModalOpen(false);
    setActiveAPId(null);
    // Refresh data after modal closes to show updated data
    setTimeout(() => {
      refreshData();
    }, 500);
  };

  const loading = bookingsLoading || financeLoading || !dataLoaded;

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

          {/* Tabs - Centered and Responsive */}
          <div className="mb-6">
            <div className="flex justify-center">
              <div className="inline-flex p-1 rounded-lg bg-slate-100 overflow-x-auto max-w-full">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex items-center gap-2 px-4 sm:px-6 py-2 rounded-md text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                        isActive
                          ? "bg-blue-600 text-white shadow-md"
                          : "text-gray-600 hover:text-gray-800 hover:bg-white"
                      }`}
                    >
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="hidden sm:inline">{tab.label}</span>
                      <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
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

          {/* Update AP Modal with auto-refresh */}
          <UpdateAP
            isOpen={isUpdateAPModalOpen}
            onClose={handleModalClose}
            apId={activeAPId}
            apRecord={apRecordsForTable.find(r => r.ap_id === activeAPId)}
          />
        </div>
      </div>
    </div>
  );
};

export default AccountsPayable;