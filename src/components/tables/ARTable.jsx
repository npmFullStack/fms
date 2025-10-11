// components/tables/ARTable.jsx
import { useMemo, useEffect } from "react";
import useTable from "../../utils/hooks/useTable";
import usePagination from "../../utils/hooks/usePagination";
import { toCaps } from "../../utils/helpers/tableDataFormatters";
import DataTable from "./DataTable";

const ARTable = ({ data, onSelectionChange }) => {
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
        accessorKey: "date_delivered",
        header: "Date Delivered",
        cell: ({ row }) => (
          <span className="table-text">
            {row.original.date_delivered
              ? new Date(row.original.date_delivered).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                  }
                )
              : "-"}
          </span>
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
        accessorKey: "terms",
        header: "Terms",
        cell: ({ row }) => (
          <span className="table-text">{row.original.terms}</span>
        )
      },
      {
        accessorKey: "pesos",
        header: "Pesos",
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
        accessorKey: "shipping_line",
        header: "Shipping Lines",
        cell: ({ row }) => (
          <span className="table-text">{toCaps(row.original.shipping_line)}</span>
        )
      },
      {
        accessorKey: "net_revenue_percent",
        header: "Net Revenue (%)",
        cell: ({ row }) => (
          <span className="table-text">
            {row.original.net_revenue_percent.toFixed(2)}%
          </span>
        )
      }
    ],
    []
  );

  // Prepare data for DataTable - add 'id' field that DataTable expects
  const tableData = useMemo(() => {
    return data.map(item => ({
      ...item,
      id: item.id
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