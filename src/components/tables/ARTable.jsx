// src/components/tables/ARTable.jsx
import { useMemo, useEffect } from "react";
import useTable from "../../utils/hooks/useTable";
import usePagination from "../../utils/hooks/usePagination";
import { toCaps, getRouteAbbreviation, formatVolume } from "../../utils/helpers/tableDataFormatters";
import DataTable from "./DataTable";

const ARTable = ({ data, onSelectionChange }) => {
    const columns = [
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
            accessorKey: "payment_date",
            header: "Payment Date",
            cell: ({ row }) => (
                <span className="table-text">
                    {row.original.payment_date 
                        ? new Date(row.original.payment_date).toLocaleDateString() 
                        : '---'
                    }
                </span>
            )
        },
        {
            accessorKey: "client",
            header: "Client",
            cell: ({ row }) => (
                <span className="table-text">
                    {toCaps(row.original.client || row.original.shipper)}
                </span>
            )
        },
        {
            accessorKey: "hwb_number",
            header: "HWB #",
            cell: ({ row }) => (
                <span className="table-text-bold">
                    {toCaps(row.original.hwb_number || '---')}
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
            accessorKey: "volume",
            header: "Volume",
            cell: ({ row }) => (
                <span className="table-text">
                    {formatVolume(row.original.quantity, row.original.container_size)}
                </span>
            )
        },
        {
            accessorKey: "date_delivered",
            header: "Date Delivered",
            cell: ({ row }) => (
                <span className="table-text">
                    {row.original.date_delivered 
                        ? new Date(row.original.date_delivered).toLocaleDateString() 
                        : '---'
                    }
                </span>
            )
        },
        {
            accessorKey: "aging",
            header: "Aging",
            cell: ({ row }) => (
                <span className={row.original.aging > 30 ? "text-red-600 font-semibold" : "table-text"}>
                    {row.original.aging || 0}
                </span>
            )
        },
        {
            accessorKey: "terms",
            header: "Terms",
            cell: ({ row }) => (
                <span className="table-text">
                    {row.original.terms ? `${row.original.terms} DAYS` : '30 DAYS'}
                </span>
            )
        },
        {
            accessorKey: "amount_paid",
            header: "Amount Paid (₱)",
            cell: ({ row }) => (
                <span className="table-text">
                    ₱{(row.original.amount_paid || 0).toLocaleString('en-PH', { 
                        minimumFractionDigits: 2 
                    })}
                </span>
            )
        },
        {
            accessorKey: "total_expenses",
            header: "Total Expenses (₱)",
            cell: ({ row }) => (
                <span className="table-text">
                    ₱{(row.original.total_expenses || 0).toLocaleString('en-PH', { 
                        minimumFractionDigits: 2 
                    })}
                </span>
            )
        },
        {
            accessorKey: "net_revenue",
            header: "Net Revenue (₱)",
            cell: ({ row }) => {
                const amountPaid = row.original.amount_paid || 0;
                const totalExpenses = row.original.total_expenses || 0;
                const netRevenue = amountPaid - totalExpenses;
                
                return (
                    <span className={`table-text-bold ${netRevenue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ₱{netRevenue.toLocaleString('en-PH', { 
                            minimumFractionDigits: 2 
                        })}
                    </span>
                );
            }
        },
        {
            accessorKey: "net_revenue_percent",
            header: "Net Revenue (%)",
            cell: ({ row }) => {
                const amountPaid = row.original.amount_paid || 0;
                const totalExpenses = row.original.total_expenses || 0;
                
                if (!amountPaid || amountPaid <= 0) {
                    return <span className="table-text">0%</span>;
                }
                
                const netRevenue = amountPaid - totalExpenses;
                const percentage = (netRevenue / amountPaid) * 100;
                const color = percentage >= 20 ? "text-green-600" : percentage >= 10 ? "text-yellow-600" : "text-red-600";
                
                return (
                    <span className={`table-text-bold ${color}`}>
                        {percentage.toFixed(1)}%
                    </span>
                );
            }
        }
    ];

    // Prepare data for DataTable - add 'id' field and ensure total_expenses is calculated
    const tableData = useMemo(() => {
        return data.map(item => ({
            ...item,
            id: item.ar_id || item.id,
            // Ensure total_expenses is available, if not calculate from AP data
            total_expenses: item.total_expenses || calculateTotalExpenses(item)
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
            title="Accounts Receivable"
            searchPlaceholder="Search receivables..."
            onSelectionChange={onSelectionChange}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            paginationInfo={paginationInfo}
            paginationActions={actions}
        />
    );
};

// Helper function to calculate total expenses from accounts payable data
const calculateTotalExpenses = (arRecord) => {
    let total = 0;
    
    // Add freight expenses
    if (arRecord.freight_amount) total += parseFloat(arRecord.freight_amount);
    
    // Add trucking expenses
    if (arRecord.origin_trucking_amount) total += parseFloat(arRecord.origin_trucking_amount);
    if (arRecord.destination_trucking_amount) total += parseFloat(arRecord.destination_trucking_amount);
    
    // Add port charges
    if (arRecord.crainage_amount) total += parseFloat(arRecord.crainage_amount);
    if (arRecord.arrastre_origin_amount) total += parseFloat(arRecord.arrastre_origin_amount);
    if (arRecord.arrastre_dest_amount) total += parseFloat(arRecord.arrastre_dest_amount);
    if (arRecord.wharfage_origin_amount) total += parseFloat(arRecord.wharfage_origin_amount);
    if (arRecord.wharfage_dest_amount) total += parseFloat(arRecord.wharfage_dest_amount);
    if (arRecord.labor_origin_amount) total += parseFloat(arRecord.labor_origin_amount);
    if (arRecord.labor_dest_amount) total += parseFloat(arRecord.labor_dest_amount);
    
    // Add misc charges
    if (arRecord.rebates_amount) total += parseFloat(arRecord.rebates_amount);
    if (arRecord.storage_amount) total += parseFloat(arRecord.storage_amount);
    if (arRecord.facilitation_amount) total += parseFloat(arRecord.facilitation_amount);
    if (arRecord.denr_amount) total += parseFloat(arRecord.denr_amount);
    
    return total;
};

export default ARTable;