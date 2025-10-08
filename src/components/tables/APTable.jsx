// components/tables/APTable.jsx
import { useMemo, useEffect } from "react";
import { Receipt } from "lucide-react";
import useTable from "../../utils/hooks/useTable";
import usePagination from "../../utils/hooks/usePagination";
import { toCaps } from "../../utils/helpers/tableDataFormatters";
import DataTable from "./DataTable";

const APTable = ({ data, activeTab, onSelectionChange }) => {
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
            accessorKey: "origin_port",
            header: "Origin",
            cell: ({ row }) => (
                <span className="table-text">{toCaps(row.original.origin_port)}</span>
            )
        },
        {
            accessorKey: "destination_port",
            header: "Destination",
            cell: ({ row }) => (
                <span className="table-text">{toCaps(row.original.destination_port)}</span>
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
            accessorKey: "quantity",
            header: "Qty",
            cell: ({ row }) => (
                <span className="table-text">{row.original.quantity}</span>
            )
        },
        {
            accessorKey: "booking_mode",
            header: "Mode",
            cell: ({ row }) => (
                <span className="table-text">{row.original.booking_mode}</span>
            )
        }
    ];

    // Create expense columns dynamically
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
            accessorKey: `${prefix}_check_date`,
            header: `${label} - Check Date`,
            cell: ({ row }) => (
                <span className="table-text">
                    {row.original[`${prefix}_check_date`] 
                        ? new Date(row.original[`${prefix}_check_date`]).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric"
                        })
                        : "-"
                    }
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

    // Create dual expense columns for origin/destination
    const createDualExpenseColumns = (prefix, label) => [
        ...createExpenseColumns(`${prefix}_origin`, `${label} (Origin)`),
        ...createExpenseColumns(`${prefix}_dest`, `${label} (Dest)`)
    ];

    // Summary columns
    const summaryColumns = [
        {
            accessorKey: "total_expenses",
            header: "Total Expenses",
            cell: ({ row }) => (
                <span className="table-text-bold">
                    ₱{(row.original.total_expenses || 0).toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}
                </span>
            )
        },
        {
            accessorKey: "net_revenue",
            header: "Net Revenue",
            cell: ({ row }) => {
                const netRevenue = row.original.net_revenue || 0;
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
            id: item.ap_id // Add 'id' field that DataTable expects
        }));
    }, [data]);

    const { table, globalFilter, setGlobalFilter } = useTable({
        data: tableData, // Use the prepared data
        columns
    });

    const { paginationInfo, actions } = usePagination(table, tableData?.length);

    const selectedRows = table.getSelectedRowModel().rows;

    useEffect(() => {
        if (onSelectionChange) {
            // DataTable will now pass ap_id as id, so we can use it directly
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