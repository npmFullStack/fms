// components/tables/APTable.jsx
import { useMemo, useEffect } from "react";
import { Receipt } from "lucide-react";
import useTable from "../../utils/hooks/useTable";
import usePagination from "../../utils/hooks/usePagination";
import useFinanceStore from "../../utils/store/useFinanceStore";
import { 
  toCaps, 
  getModeBadge, 
  getRouteAbbreviation, 
  formatVolume 
} from "../../utils/helpers/tableDataFormatters";
import DataTable from "./DataTable";

const APTable = ({ data, activeTab, onSelectionChange }) => {
  const { arRecords } = useFinanceStore();


  // Helper to find matching AR record
const getARRecord = (bookingId) => {
    return arRecords.find(arr => arr.booking_id === bookingId);
};

  const baseColumns = [
    {
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllRowsSelected?.()}
          onChange={e => table.toggleAllRowsSelected?.(e.target.checked)}
          className="table-checkbox"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected?.()}
          onChange={row.getToggleSelectedHandler?.()}
          className="table-checkbox"
        />
      )
    },
    {
      accessorKey: "booking_number",
      header: "Booking #",
      cell: ({ row }) => (
        <span className="table-text-bold">
          {toCaps(row.original.booking_number)}
        </span>
      )
    },
    {
      accessorKey: "hwb_number",
      header: "HWB #",
      cell: ({ row }) => (
        <span className="table-text-bold">
          {toCaps(row.original.hwb_number)}
        </span>
      )
    },
    {
      accessorKey: "route",
      header: "Route",
      cell: ({ row }) => (
        <span className="table-text">
          {getRouteAbbreviation(row.original.origin_port, row.original.destination_port)}
        </span>
      )
    },
    {
      accessorKey: "commodity",
      header: "Commodity",
      cell: ({ row }) => (
        <span className="table-text">{toCaps(row.original.commodity)}</span>
      )
    },
    {
      accessorKey: "volume",
      header: "Volume",
      cell: ({ row }) => (
        <span className="table-text">
          {formatVolume(row.original.quantity, row.original.container_size)}
        </span>
      )
    },
    {
      accessorKey: "booking_mode",
      header: "Mode of Service",
      cell: ({ row }) => {
        const modeBadge = getModeBadge(row.original.booking_mode);
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${modeBadge.bg} ${modeBadge.text}`}>
            {modeBadge.label}
          </span>
        );
      }
    }
  ];

  // ✅ UPDATED: Create expense columns WITHOUT dates
  const createExpenseColumns = (prefix, label) => [
    {
      accessorKey: `${prefix}_payee`,
      header: `${label} - Payee`,
      cell: ({ row }) => (
        <span className="table-text">
          {toCaps(row.original[`${prefix}_payee`] || "-")}
        </span>
      )
    },
    {
      accessorKey: `${prefix}_amount`,
      header: `${label} - Amount`,
      cell: ({ row }) => (
        <span className="table-text">
          ₱{(row.original[`${prefix}_amount`] || 0).toLocaleString("en-PH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </span>
      )
    },
    {
      accessorKey: `${prefix}_voucher`,
      header: `${label} - Voucher`,
      cell: ({ row }) => (
        <span className="table-text">{row.original[`${prefix}_voucher`] || "-"}</span>
      )
    }
  ];

  // ✅ UPDATED: Create dual expense columns WITHOUT dates
  const createDualExpenseColumns = (prefix, label) => [
    ...createExpenseColumns(`${prefix}_origin`, `${label} (Origin)`),
    ...createExpenseColumns(`${prefix}_dest`, `${label} (Dest)`)
  ];

  // ✅ UPDATED: Summary columns with corrected calculations
  const summaryColumns = [
    {
      accessorKey: "total_expenses",
      header: "Total Expenses",
      cell: ({ row }) => {
        const totalExpenses = parseFloat(row.original.total_expenses) || 0;
        return (
          <span className="table-text-bold">
            ₱{totalExpenses.toLocaleString("en-PH", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </span>
        );
      }
    },
    {
      accessorKey: "total_payables",
      header: "Total Payables",
      cell: ({ row }) => {
        const totalPayables = parseFloat(row.original.total_payables) || 0;
        const birPercentage = parseFloat(row.original.bir_percentage) || 0;
        
        return (
          <div className="text-right">
            <div className="table-text-bold text-red-600">
              ₱{totalPayables.toLocaleString("en-PH", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </div>
            {birPercentage > 0 && (
              <div className="text-xs text-slate-500 mt-1">
                BIR {birPercentage}%
              </div>
            )}
          </div>
        );
      }
    },
    {
      accessorKey: "gross_income",
      header: "Gross Income",
      cell: ({ row }) => {
        const arRecord = getARRecord(row.original.booking_id);
        const grossIncome = parseFloat(arRecord?.gross_income) || 0;
        return (
          <span className="table-text-bold text-green-600">
            ₱{grossIncome.toLocaleString("en-PH", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </span>
        );
      }
    },
    {
      accessorKey: "net_revenue",
      header: "Net Revenue",
      cell: ({ row }) => {
        const arRecord = getARRecord(row.original.booking_id);
        const grossIncome = parseFloat(arRecord?.gross_income) || 0;
        const totalPayables = parseFloat(row.original.total_payables) || 0;
        
        // ✅ CORRECTED: Net Revenue = Gross Income - Total Payables
        const netRevenue = grossIncome - totalPayables;
        
        const colorClass = netRevenue >= 0 ? "text-green-600" : "text-red-600";
        return (
          <span className={`table-text-bold ${colorClass}`}>
            ₱{netRevenue.toLocaleString("en-PH", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </span>
        );
      }
    }
  ];

  // Build columns based on active tab
  const columns = useMemo(() => {
    let expenseColumns = [];
    
    switch (activeTab) {
      case "FREIGHT":
        expenseColumns = createExpenseColumns("freight", "Freight");
        break;
      case "TRUCKING":
        expenseColumns = createDualExpenseColumns("trucking", "Trucking");
        break;
      case "PORT_CHARGES":
        expenseColumns = [
          ...createExpenseColumns("crainage", "Crainage"),
          ...createDualExpenseColumns("arrastre", "Arrastre"),
          ...createDualExpenseColumns("wharfage", "Wharfage"),
          ...createDualExpenseColumns("labor", "Labor")
        ];
        break;
      case "MISC_CHARGES":
        expenseColumns = [
          ...createExpenseColumns("rebates", "Rebates/DENR"),
          ...createExpenseColumns("storage", "Storage"),
          ...createExpenseColumns("facilitation", "Facilitation")
        ];
        break;
      case "ALL":
      default:
        expenseColumns = [
          ...createExpenseColumns("freight", "Freight"),
          ...createDualExpenseColumns("trucking", "Trucking"),
          ...createExpenseColumns("crainage", "Crainage"),
          ...createDualExpenseColumns("arrastre", "Arrastre"),
          ...createDualExpenseColumns("wharfage", "Wharfage"),
          ...createDualExpenseColumns("labor", "Labor"),
          ...createExpenseColumns("rebates", "Rebates/DENR"),
          ...createExpenseColumns("storage", "Storage"),
          ...createExpenseColumns("facilitation", "Facilitation")
        ];
        break;
    }

    return [...baseColumns, ...expenseColumns, ...summaryColumns];
  }, [activeTab]);

  // Prepare data for DataTable - add 'id' field that DataTable expects
  const tableData = useMemo(() => {
    return data.map(item => ({
      ...item,
      id: item.ap_id
    }));
  }, [data]);

  const { table, globalFilter, setGlobalFilter } = useTable({
    data: tableData,
    columns
  });

  const { paginationInfo, actions } = usePagination(table, tableData?.length);
  const selectedRows = table.getSelectedRowModel().rows;

  useEffect(() => {
    if (onSelectionChange) {
      const selectedIds = selectedRows.map(r => r.original.id);
      onSelectionChange(selectedIds);
    }
  }, [selectedRows, onSelectionChange]);

  return (
    <DataTable
      table={table}
      columns={columns}
      data={tableData}
      title={activeTab === "ALL" ? "All Accounts Payable" : `${activeTab.replace("_", " ")} Expenses`}
      searchPlaceholder="Search payables..."
      onSelectionChange={onSelectionChange}
      globalFilter={globalFilter}
      setGlobalFilter={setGlobalFilter}
      paginationInfo={paginationInfo}
      paginationActions={actions}
    />
  );
};

export default APTable;