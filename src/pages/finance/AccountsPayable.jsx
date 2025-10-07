// pages/finance/AccountsPayable.jsx
import { useEffect, useState, useMemo } from "react";
import useBookingStore from "../../utils/store/useBookingStore";
import { 
  DollarSign, 
  TrendingDown, 
  Clock, 
  CheckCircle,
  Truck,
  Ship,
  Anchor,
  Package,
  Users,
  FileText,
  Warehouse,
  Settings,
  PlusCircle,
  Edit2,
  Printer,
  Download,
  Trash2
} from "lucide-react";
import Loading from "../../components/Loading";
import APTable from "../../components/tables/APTable";
import UpdateAP from "../../components/modals/UpdateAP";
import BulkActionBar from "../../components/BulkActionBar";
import StatCard from "../../components/cards/StatCard";

const AccountsPayable = () => {
  const { bookings, fetchBookings, loading, error, clearError } = useBookingStore();
  const [activeTab, setActiveTab] = useState("ALL");
  const [selectedAP, setSelectedAP] = useState([]);
  const [isUpdateAPModalOpen, setIsUpdateAPModalOpen] = useState(false);
  const [activeAPId, setActiveAPId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Safe array
  const safeBookings = useMemo(
    () => (Array.isArray(bookings) ? bookings : []),
    [bookings]
  );

  // Format bookings for AP table
  const apRecords = useMemo(() => {
    return safeBookings.map(booking => {
      // Calculate volume (quantity × container size)
      const containerSize = booking.container_size || "LCL";
      const volume =
        booking.quantity > 1
          ? `${booking.quantity}×${containerSize}`
          : containerSize;

      // Placeholder expense data - this should come from your pricing/expense logic
      return {
        ap_id: booking.id, // Use booking ID as ap_id for selection
        booking_id: booking.id,
        booking_number: booking.booking_number,
        hwb_number: booking.hwb_number,
        origin_port: booking.origin_port,
        destination_port: booking.destination_port,
        commodity: booking.commodity,
        quantity: booking.quantity,
        booking_mode: booking.booking_mode,
        created_at: booking.created_at,

        // Client info
        client: booking.shipper || "-",
        mode: booking.booking_mode === "DOOR_TO_DOOR" ? "D-D" : "P-P",
        route: `${booking.origin_port || "-"}–${booking.destination_port || "-"}`,
        volume,
        gross_revenue: booking.gross_revenue || 0,

        // Freight expenses
        freight_payee: booking.shipping_line_name || "-",
        freight_amount: 15000, // Example amount
        freight_check_date: null,
        freight_voucher: "",

        // Trucking Origin
        trucking_origin_payee: booking.pickup_trucker || "-",
        trucking_origin_amount: 5000, // Example amount
        trucking_origin_check_date: null,
        trucking_origin_voucher: "",

        // Trucking Destination
        trucking_dest_payee: booking.delivery_trucker || "-",
        trucking_dest_amount: 5000, // Example amount
        trucking_dest_check_date: null,
        trucking_dest_voucher: "",

        // Crainage Charges
        crainage_payee: "Port Authority",
        crainage_amount: 2000,
        crainage_check_date: null,
        crainage_voucher: "",

        // Arrastre Origin
        arrastre_origin_payee: "Origin Port",
        arrastre_origin_amount: 1500,
        arrastre_origin_check_date: null,
        arrastre_origin_voucher: "",

        // Arrastre Destination
        arrastre_dest_payee: "Destination Port",
        arrastre_dest_amount: 1500,
        arrastre_dest_check_date: null,
        arrastre_dest_voucher: "",

        // Wharfage Origin
        wharfage_origin_payee: "Origin Port",
        wharfage_origin_amount: 1000,
        wharfage_origin_check_date: null,
        wharfage_origin_voucher: "",

        // Wharfage Destination
        wharfage_dest_payee: "Destination Port",
        wharfage_dest_amount: 1000,
        wharfage_dest_check_date: null,
        wharfage_dest_voucher: "",

        // Labor Origin
        labor_origin_payee: "Origin Labor",
        labor_origin_amount: 800,
        labor_origin_check_date: null,
        labor_origin_voucher: "",

        // Labor Destination
        labor_dest_payee: "Destination Labor",
        labor_dest_amount: 800,
        labor_dest_check_date: null,
        labor_dest_voucher: "",

        // Rebates/DENR
        rebates_payee: "DENR",
        rebates_amount: 500,
        rebates_check_date: null,
        rebates_voucher: "",

        // Storage
        storage_payee: "Storage Facility",
        storage_amount: 1200,
        storage_check_date: null,
        storage_voucher: "",

        // Facilitation
        facilitation_payee: "Facilitator",
        facilitation_amount: 1000,
        facilitation_check_date: null,
        facilitation_voucher: "",

        // Totals
        total_expenses: 32400, // Sum of all example amounts
        bir: 3888, // 12% of total expenses
        total_expenses_with_bir: 36288,
        net_revenue: (booking.gross_revenue || 50000) - 36288, // Example calculation

        remarks: booking.remarks || ""
      };
    });
  }, [safeBookings]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalPayable = apRecords.reduce((sum, r) => sum + r.total_expenses_with_bir, 0);
    const totalExpenses = apRecords.reduce((sum, r) => sum + r.total_expenses, 0);
    const pendingCount = apRecords.filter(r => !r.freight_check_date).length;
    const paidCount = apRecords.filter(r => r.freight_check_date).length;

    return {
      total: totalPayable,
      expenses: totalExpenses,
      pending: pendingCount,
      paid: paidCount
    };
  }, [apRecords]);

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
    }
  ];

  const tabs = [
    { key: "ALL", label: "All Expenses", icon: FileText },
    { key: "FREIGHT", label: "Freight", icon: Ship },
    { key: "TRUCKING", label: "Trucking", icon: Truck },
    { key: "PORT_CHARGES", label: "Port Charges", icon: Anchor },
    { key: "MISC_CHARGES", label: "Misc Charges", icon: Settings }
  ];

  // Handlers
  const handleEditAP = (id) => {
    setActiveAPId(id);
    setIsUpdateAPModalOpen(true);
  };

  const handleBulkEdit = (ids) => {
    if (ids.length === 1) {
      handleEditAP(ids[0]);
    }
  };

  const handleBulkPrint = (ids) => {
    const records = apRecords.filter(r => ids.includes(r.ap_id));
    console.log("Print records:", records);
    // Add your print logic here
  };

  const handleBulkDownload = (ids) => {
    const records = apRecords.filter(r => ids.includes(r.ap_id));
    console.log("Download records:", records);
    // Add your download logic here
  };

  const handleBulkDelete = (ids) => {
    if (window.confirm(`Delete ${ids.length} AP record(s)?`)) {
      console.log("Delete records:", ids);
      // Add your delete logic here
    }
  };

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
            <h1 className="page-title">Accounts Payable</h1>
            <p className="page-subtitle">
              Track and manage all operational expenses and payments
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsConfig.map(stat => (
              <StatCard key={stat.key} {...stat} />
            ))}
          </div>

          {/* Tab Group */}
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
                      className={`
                        flex items-center gap-2 px-6 py-4 font-medium text-sm 
                        whitespace-nowrap transition-all duration-200 border-b-2
                        ${
                          isActive
                            ? "border-blue-600 text-blue-600 bg-blue-50"
                            : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        }
                      `}
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
            data={apRecords} 
            activeTab={activeTab}
            onSelectionChange={setSelectedAP}
          />

          {/* Bulk Actions */}
          <BulkActionBar
            selected={selectedAP}
            onEdit={handleBulkEdit}
            onPrint={handleBulkPrint}
            onDownload={handleBulkDownload}
            onDelete={handleBulkDelete}
          />

          {/* Update AP Modal */}
          <UpdateAP
            isOpen={isUpdateAPModalOpen}
            onClose={() => setIsUpdateAPModalOpen(false)}
            apId={activeAPId}
          />
        </div>
      </div>
    </div>
  );
};

export default AccountsPayable;