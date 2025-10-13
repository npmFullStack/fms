// components/tables/ARTable.jsx
import { useMemo, useEffect } from "react";
import useTable from "../../utils/hooks/useTable";
import usePagination from "../../utils/hooks/usePagination";
import { toCaps } from "../../utils/helpers/tableDataFormatters";
import DataTable from "./DataTable";
import { Edit } from "lucide-react";

const ARTable = ({ data, onSelectionChange, onEdit }) => {
  const columns = useMemo(
    () => [
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
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => (
          <span className="table-text">
            {new Date(row.original.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric"
            })}
          </span>
        )
      },
      {
        accessorKey: "client",
        header: "Client",
        cell: ({ row }) => (
          <span className="table-text-bold">{toCaps(row.original.client)}</span>
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
          <span className="table-text">{toCaps(row.original.route)}</span>
        )
      },
      {
        accessorKey: "volume",
        header: "Volume",
        cell: ({ row }) => (
          <span className="table-text">{row.original.volume}</span>
        )
      },
      {
        accessorKey: "aging",
        header: "Aging",
        cell: ({ row }) => {
          const aging = row.original.aging;
          const colorClass =
            aging > 60
              ? "text-red-600 font-semibold"
              : aging > 30
              ? "text-yellow-600 font-semibold"
              : "text-gray-600";
          return (
            <span className={`table-text ${colorClass}`}>{aging} days</span>
          );
        }
      },
      {
        accessorKey: "pesos",
        header: "Total Amount",
        cell: ({ row }) => (
          <span className="table-text-bold">
            ₱
            {row.original.pesos.toLocaleString("en-PH", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </span>
        )
      },
      {
        accessorKey: "amount_paid",
        header: "Amount Paid",
        cell: ({ row }) => (
          <span className="table-text-bold text-green-600">
            ₱
            {(row.original.amount_paid || 0).toLocaleString("en-PH", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </span>
        )
      },
      {
        accessorKey: "balance",
        header: "Balance",
        cell: ({ row }) => {
          const balance = row.original.balance || row.original.pesos;
          const colorClass = balance > 0 ? "text-red-600" : "text-green-600";
          return (
            <span className={`table-text-bold ${colorClass}`}>
              ₱
              {balance.toLocaleString("en-PH", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </span>
          );
        }
      },
      {
        accessorKey: "payment_status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.payment_status;
          const colorClass = 
            status === "PAID" ? "bg-green-100 text-green-800" :
            status === "OVERDUE" ? "bg-red-100 text-red-800" :
            "bg-yellow-100 text-yellow-800";
          
          return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
              {status}
            </span>
          );
        }
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <button
            onClick={() => onEdit?.(row.original.ar_id || row.original.id)}
            className="btn-secondary p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Edit payment"
          >
            <Edit className="h-4 w-4" />
          </button>
        )
      }
    ],
    [onEdit]
  );

  // Prepare data for DataTable
  const tableData = useMemo(() => {
    return data.map(item => ({
      ...item,
      id: item.ar_id || item.id
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
      const selectedIds = selectedRows.map(r => r.original.ar_id || r.original.id);
      onSelectionChange(selectedIds);
    }
  }, [selectedRows, onSelectionChange]);

  return (
    <DataTable
      table={table}
      columns={columns}
      data={tableData}
      title="Receivables"
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