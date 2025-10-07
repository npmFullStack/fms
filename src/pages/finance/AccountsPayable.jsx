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
  Settings
} from "lucide-react";
import Loading from "../../components/Loading";
import APTable from "../../components/tables/APTable";
import StatCard from "../../components/cards/StatCard";

const AccountsPayable = () => {
  const { bookings, fetchBookings, loading, error, clearError } = useBookingStore();
  const [activeTab, setActiveTab] = useState("ALL");

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
        id: booking.id,
        date: booking.created_at,
        hwb_number: booking.hwb_number || "-",
        client: booking.shipper || "-",
        mode: booking.booking_mode === "DOOR_TO_DOOR" ? "D-D" : "P-P",
        route: `${booking.origin_port || "-"}–${booking.destination_port || "-"}`,
        volume,
        gross_revenue: booking.gross_revenue || 0,

        // Freight expenses
        freight_payee: booking.shipping_line_name || "-",
        freight_amount: 0,
        freight_check_date: null,
        freight_voucher: "",

        // Trucking Origin
        trucking_origin_payee: booking.pickup_trucker || "-",
        trucking_origin_amount: 0,
        trucking_origin_check_date: null,
        trucking_origin_voucher: "",

        // Trucking Destination
        trucking_dest_payee: booking.delivery_trucker || "-",
        trucking_dest_amount: 0,
        trucking_dest_check_date: null,
        trucking_dest_voucher: "",

        // Crainage Charges
        crainage_payee: "-",
        crainage_amount: 0,
        crainage_check_date: null,
        crainage_voucher: "",

        // Arrastre Origin
        arrastre_origin_payee: "-",
        arrastre_origin_amount: 0,
        arrastre_origin_check_date: null,
        arrastre_origin_voucher: "",

        // Arrastre Destination
        arrastre_dest_payee: "-",
        arrastre_dest_amount: 0,
        arrastre_dest_check_date: null,
        arrastre_dest_voucher: "",

        // Wharfage Origin
        wharfage_origin_payee: "-",
        wharfage_origin_amount: 0,
        wharfage_origin_check_date: null,
        wharfage_origin_voucher: "",

        // Wharfage Destination
        wharfage_dest_payee: "-",
        wharfage_dest_amount: 0,
        wharfage_dest_check_date: null,
        wharfage_dest_voucher: "",

        // Labor Origin
        labor_origin_payee: "-",
        labor_origin_amount: 0,
        labor_origin_check_date: null,
        labor_origin_voucher: "",

        // Labor Destination
        labor_dest_payee: "-",
        labor_dest_amount: 0,
        labor_dest_check_date: null,
        labor_dest_voucher: "",

        // Rebates/DENR
        rebates_payee: "-",
        rebates_amount: 0,
        rebates_check_date: null,
        rebates_voucher: "",

        // Storage
        storage_payee: "-",
        storage_amount: 0,
        storage_check_date: null,
        storage_voucher: "",

        // Facilitation
        facilitation_payee: "-",
        facilitation_amount: 0,
        facilitation_check_date: null,
        facilitation_voucher: "",

        // Totals
        total_expenses: 0,
        bir: 0,
        total_expenses_with_bir: 0,
        net_revenue: 0,

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
    { key: "CRAINAGE", label: "Crainage", icon: Package },
    { key: "ARRASTRE", label: "Arrastre", icon: Anchor },
    { key: "WHARFAGE", label: "Wharfage", icon: Warehouse },
    { key: "LABOR", label: "Labor", icon: Users },
    { key: "REBATES", label: "Rebates/DENR", icon: FileText },
    { key: "STORAGE", label: "Storage", icon: Warehouse },
    { key: "FACILITATION", label: "Facilitation", icon: Settings }
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
          <APTable data={apRecords} activeTab={activeTab} />
        </div>
      </div>
    </div>
  );
};

export default AccountsPayable;