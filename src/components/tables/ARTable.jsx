// src/components/tables/ARTable.jsx
import { useMemo, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import useTable from "../../utils/hooks/useTable";
import usePagination from "../../utils/hooks/usePagination";
import useFinanceStore from "../../utils/store/useFinanceStore";
import { toCaps, getRouteAbbreviation, formatVolume } from "../../utils/helpers/tableDataFormatters";
import DataTable from "./DataTable";

const ARTable = ({ data, onSelectionChange }) => {
  const { apRecords } = useFinanceStore();

  const getAPRecord = (bookingId) => {
    return apRecords.find(ap => ap.booking_id === bookingId);
  };

  // ✅ Helper to check if record is overdue
  const isOverdue = (record) => {
    const terms = record.terms || 0;
    if (terms <= 0) return false;

    const bookingDate = new Date(record.booking_date || record.created_at);
    const today = new Date();
    const dueDate = new Date(bookingDate);
    dueDate.setDate(dueDate.getDate() + terms);

    const collectibleAmount = parseFloat(record.collectible_amount || record.gross_income || 0);
    const amountPaid = parseFloat(record.amount_paid || 0);

    return today > dueDate && collectibleAmount > amountPaid;
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
      accessorKey: "booking_date",
      header: "Booking Date",
      cell: ({ row }) => (
        <span className="table-text">
          {row.original.booking_date
            ? new Date(row.original.booking_date).toLocaleDateString()
            : "---"}
        </span>
      ),
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
    // ✅ FIXED: Terms column with overdue icon
    {
      accessorKey: "terms",
      header: "Terms",
      cell: ({ row }) => {
        const terms = row.original.terms || 0;
        const overdueStatus = isOverdue(row.original);
        
        return (
          <div className="flex items-center gap-2">
            {overdueStatus && (
              <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" title="Overdue Payment" />
            )}
            <span className={`table-text ${overdueStatus ? 'text-red-600 font-semibold' : ''}`}>
              {terms} days
            </span>
          </div>
        );
      }
    },
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
    {
      accessorKey: "net_revenue",
      header: "Net Revenue",
      cell: ({ row }) => {
        const grossIncome = row.original.gross_income || 0;
        const apRecord = getAPRecord(row.original.booking_id);
        const totalPayables = apRecord?.total_payables || 0;
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
    {
      accessorKey: "net_revenue_percent",
      header: "Net Revenue (%)",
      cell: ({ row }) => {
        const grossIncome = row.original.gross_income || 0;
        const apRecord = getAPRecord(row.original.booking_id);
        const totalPayables = apRecord?.total_payables || 0;
        const netRevenue = grossIncome - totalPayables;
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