// src/components/tables/ARTable.jsx
import { useMemo, useEffect } from "react";
import useTable from "../../utils/hooks/useTable";
import usePagination from "../../utils/hooks/usePagination";
import useFinanceStore from "../../utils/store/useFinanceStore";
import { toCaps, getRouteAbbreviation, formatVolume } from "../../utils/helpers/tableDataFormatters";
import DataTable from "./DataTable";

const ARTable = ({ data, onSelectionChange }) => {
  const { apRecords } = useFinanceStore();

  // Helper to find matching AP record
  const getAPRecord = (bookingId) => {
    return apRecords.find(ap => ap.booking_id === bookingId);
  };

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
          {row.original.aging || 0} days
        </span>
      )
    },
    {
      accessorKey: "terms",
      header: "Terms",
      cell: ({ row }) => {
        const terms = row.original.terms || 30;
        return (
          <span className="table-text">
            {terms} days
          </span>
        );
      }
    },
    // ✅ UPDATED: Show actual collectible_amount instead of gross_income
    {
      accessorKey: "collectible_amount",
      header: "Collectible Amount",
      cell: ({ row }) => (
        <span className="table-text-bold text-blue-600">
          ₱{(row.original.collectible_amount || row.original.gross_income || 0).toLocaleString('en-PH', {
            minimumFractionDigits: 2
          })}
        </span>
      )
    },
    {
      accessorKey: "amount_paid",
      header: "Amount Paid",
      cell: ({ row }) => (
        <span className="table-text">
          ₱{(row.original.amount_paid || 0).toLocaleString('en-PH', {
            minimumFractionDigits: 2
          })}
        </span>
      )
    },
    {
      accessorKey: "total_payables",
      header: "Total Payables",
      cell: ({ row }) => {
        const apRecord = getAPRecord(row.original.booking_id);
        // Use total_payables from AP if available
        const totalPayables = apRecord?.total_payables || 0;
        return (
          <span className="table-text">
            ₱{totalPayables.toLocaleString('en-PH', {
              minimumFractionDigits: 2
            })}
          </span>
        );
      }
    },
    // ✅ UPDATED: Net Revenue calculation using gross_income - total_payables
    {
      accessorKey: "net_revenue",
      header: "Net Revenue",
      cell: ({ row }) => {
        const grossIncome = row.original.gross_income || 0;
        const apRecord = getAPRecord(row.original.booking_id);
        const totalPayables = apRecord?.total_payables || 0;
        // ✅ CORRECTED: Calculation: gross_income - total_payables
        const netRevenue = grossIncome - totalPayables;
        
        return (
          <span className={`table-text-bold ${netRevenue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ₱{netRevenue.toLocaleString('en-PH', {
              minimumFractionDigits: 2
            })}
          </span>
        );
      }
    },
    // ✅ UPDATED: Net Revenue percentage using gross_income
    {
      accessorKey: "net_revenue_percent",
      header: "Net Revenue (%)",
      cell: ({ row }) => {
        const grossIncome = row.original.gross_income || 0;
        const apRecord = getAPRecord(row.original.booking_id);
        const totalPayables = apRecord?.total_payables || 0;
        const netRevenue = grossIncome - totalPayables;
        
        // ✅ CORRECTED: Calculate percentage based on gross_income
        const percentage = grossIncome > 0 ? (netRevenue / grossIncome) * 100 : 0;
        const color = percentage >= 20 ? "text-green-600" : percentage >= 10 ? "text-yellow-600" : "text-red-600";
        
        return (
          <span className={`table-text-bold ${color}`}>
            {percentage.toFixed(1)}%
          </span>
        );
      }
    }
  ];

  // Prepare data for DataTable
  const tableData = useMemo(() => {
    return data.map(item => ({
      ...item,
      id: item.ar_id || item.id,
      booking_id: item.booking_id || item.id
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

export default ARTable;