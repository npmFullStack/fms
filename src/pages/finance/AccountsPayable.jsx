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

    // Safe arrays
    const safeBookings = useMemo(
        () => (Array.isArray(bookings) ? bookings : []),
        [bookings]
    );

    const safeAPRecords = useMemo(
        () => (Array.isArray(apRecords) ? apRecords : []),
        [apRecords]
    );

    // Format AP records for table - use real AP data instead of placeholder
    const apRecordsForTable = useMemo(() => {
        if (safeAPRecords.length > 0) {
            // Use real AP data from database
            return safeAPRecords.map(ap => ({
                ap_id: ap.ap_id,
                booking_id: ap.booking_id,
                booking_number: ap.booking_number,
                hwb_number: ap.hwb_number,
                origin_port: ap.origin_port,
                destination_port: ap.destination_port,
                commodity: ap.commodity,
                quantity: ap.quantity,
                booking_mode: ap.booking_mode,
                created_at: ap.created_at,

                // Client info
                client: ap.consignee || "-",
                mode: ap.booking_mode === "DOOR_TO_DOOR" ? "D-D" : "P-P",
                route: `${ap.origin_port || "-"} → ${ap.destination_port || "-"}`,
                volume: `${ap.quantity || 1}${ap.container_size || "LCL"}`,

                // Freight expenses (from real data)
                freight_payee: ap.freight_payee || "-",
                freight_amount: parseFloat(ap.freight_amount) || 0,
                freight_check_date: ap.freight_check_date,
                freight_voucher: ap.freight_voucher || "",

                // Trucking Origin
                trucking_origin_payee: ap.trucking_origin_payee || "-",
                trucking_origin_amount: parseFloat(ap.trucking_origin_amount) || 0,
                trucking_origin_check_date: ap.trucking_origin_check_date,
                trucking_origin_voucher: ap.trucking_origin_voucher || "",

                // Trucking Destination
                trucking_dest_payee: ap.trucking_dest_payee || "-",
                trucking_dest_amount: parseFloat(ap.trucking_dest_amount) || 0,
                trucking_dest_check_date: ap.trucking_dest_check_date,
                trucking_dest_voucher: ap.trucking_dest_voucher || "",

                // Port Charges (from JSON arrays)
                ...parsePortCharges(ap.port_charges),
                ...parseMiscCharges(ap.misc_charges),

                // Calculate totals from real data
                total_expenses: calculateTotalExpenses(ap),
                bir: calculateBIR(ap),
                total_expenses_with_bir: calculateTotalWithBIR(ap),
                net_revenue: calculateNetRevenue(ap),

                remarks: ap.remarks || "",
            }));
        } else {
            // Fallback to booking data if no AP records exist
            return safeBookings.map(booking => ({
                ap_id: booking.id,
                booking_id: booking.id,
                booking_number: booking.booking_number,
                hwb_number: booking.hwb_number,
                origin_port: booking.origin_port,
                destination_port: booking.destination_port,
                commodity: booking.commodity,
                quantity: booking.quantity,
                booking_mode: booking.booking_mode,
                created_at: booking.created_at,

                // Default values for new AP records
                client: booking.shipper || "-",
                mode: booking.booking_mode === "DOOR_TO_DOOR" ? "D-D" : "P-P",
                route: `${booking.origin_port || "-"} → ${booking.destination_port || "-"}`,
                volume: `${booking.quantity || 1}${booking.container_size || "LCL"}`,

                // Initialize with zero values
                freight_payee: "-",
                freight_amount: 0,
                freight_check_date: null,
                freight_voucher: "",

                trucking_origin_payee: "-",
                trucking_origin_amount: 0,
                trucking_origin_check_date: null,
                trucking_origin_voucher: "",

                trucking_dest_payee: "-",
                trucking_dest_amount: 0,
                trucking_dest_check_date: null,
                trucking_dest_voucher: "",

                // Initialize all charge types with zero values
                crainage_payee: "-",
                crainage_amount: 0,
                crainage_check_date: null,
                crainage_voucher: "",

                arrastre_origin_payee: "-",
                arrastre_origin_amount: 0,
                arrastre_origin_check_date: null,
                arrastre_origin_voucher: "",

                arrastre_dest_payee: "-",
                arrastre_dest_amount: 0,
                arrastre_dest_check_date: null,
                arrastre_dest_voucher: "",

                wharfage_origin_payee: "-",
                wharfage_origin_amount: 0,
                wharfage_origin_check_date: null,
                wharfage_origin_voucher: "",

                wharfage_dest_payee: "-",
                wharfage_dest_amount: 0,
                wharfage_dest_check_date: null,
                wharfage_dest_voucher: "",

                labor_origin_payee: "-",
                labor_origin_amount: 0,
                labor_origin_check_date: null,
                labor_origin_voucher: "",

                labor_dest_payee: "-",
                labor_dest_amount: 0,
                labor_dest_check_date: null,
                labor_dest_voucher: "",

                rebates_payee: "-",
                rebates_amount: 0,
                rebates_check_date: null,
                rebates_voucher: "",

                storage_payee: "-",
                storage_amount: 0,
                storage_check_date: null,
                storage_voucher: "",

                facilitation_payee: "-",
                facilitation_amount: 0,
                facilitation_check_date: null,
                facilitation_voucher: "",

                total_expenses: 0,
                bir: 0,
                total_expenses_with_bir: 0,
                net_revenue: 0,

                remarks: "",
            }));
        }
    }, [safeBookings, safeAPRecords]);

    // Helper functions for calculations
    const calculateTotalExpenses = (ap) => {
        return (parseFloat(ap.freight_amount) || 0) +
               (parseFloat(ap.trucking_origin_amount) || 0) +
               (parseFloat(ap.trucking_dest_amount) || 0) +
               calculatePortChargesTotal(ap.port_charges) +
               calculateMiscChargesTotal(ap.misc_charges);
    };

    const calculateBIR = (ap) => {
        const totalExpenses = calculateTotalExpenses(ap);
        return totalExpenses * 0.12; // 12% BIR
    };

    const calculateTotalWithBIR = (ap) => {
        return calculateTotalExpenses(ap) + calculateBIR(ap);
    };

    const calculateNetRevenue = (ap) => {
        // This should come from your gross revenue calculation
        const grossRevenue = parseFloat(ap.gross_revenue) || 50000; // Example fallback
        return grossRevenue - calculateTotalWithBIR(ap);
    };

    const parsePortCharges = (portCharges) => {
        if (!portCharges || !Array.isArray(portCharges)) return {};
        
        const result = {};
        portCharges.forEach(charge => {
            const prefix = charge.charge_type.toLowerCase();
            result[`${prefix}_payee`] = charge.payee || "-";
            result[`${prefix}_amount`] = parseFloat(charge.amount) || 0;
            result[`${prefix}_check_date`] = charge.check_date;
            result[`${prefix}_voucher`] = charge.voucher || "";
        });
        return result;
    };

    const parseMiscCharges = (miscCharges) => {
        if (!miscCharges || !Array.isArray(miscCharges)) return {};
        
        const result = {};
        miscCharges.forEach(charge => {
            const prefix = charge.charge_type.toLowerCase();
            result[`${prefix}_payee`] = charge.payee || "-";
            result[`${prefix}_amount`] = parseFloat(charge.amount) || 0;
            result[`${prefix}_check_date`] = charge.check_date;
            result[`${prefix}_voucher`] = charge.voucher || "";
        });
        return result;
    };

    const calculatePortChargesTotal = (portCharges) => {
        if (!portCharges || !Array.isArray(portCharges)) return 0;
        return portCharges.reduce((sum, charge) => sum + (parseFloat(charge.amount) || 0), 0);
    };

    const calculateMiscChargesTotal = (miscCharges) => {
        if (!miscCharges || !Array.isArray(miscCharges)) return 0;
        return miscCharges.reduce((sum, charge) => sum + (parseFloat(charge.amount) || 0), 0);
    };

    // Calculate statistics from real data
    const stats = useMemo(() => {
        const totalPayable = apRecordsForTable.reduce((sum, r) => sum + r.total_expenses_with_bir, 0);
        const totalExpenses = apRecordsForTable.reduce((sum, r) => sum + r.total_expenses, 0);
        
        // Count pending (no check date) vs paid (has check date)
        const pendingCount = apRecordsForTable.filter(r => 
            !r.freight_check_date && 
            !r.trucking_origin_check_date && 
            !r.trucking_dest_check_date
        ).length;
        
        const paidCount = apRecordsForTable.filter(r => 
            r.freight_check_date || 
            r.trucking_origin_check_date || 
            r.trucking_dest_check_date
        ).length;

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

    const handleBulkEdit = (id) => {
    if (!id) {
        alert("Please select one record to edit");
        return;
    }
    handleEditAP(id);
};


    const handleBulkPrint = (ids) => {
        const records = apRecordsForTable.filter(r => ids.includes(r.ap_id));
        console.log("Print records:", records);
    };

    const handleBulkDownload = (ids) => {
        const records = apRecordsForTable.filter(r => ids.includes(r.ap_id));
        console.log("Download records:", records);
        // Add your download logic here
    };

    const handleBulkDelete = (ids) => {
        if (window.confirm(`Delete ${ids.length} AP record(s)?`)) {
            console.log("Delete records:", ids);
            // Add your delete logic here
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
                                                ${isActive
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
                        data={apRecordsForTable}
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