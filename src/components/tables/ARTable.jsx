// components/tables/ARTable.jsx
import { useMemo } from "react";
import { flexRender } from "@tanstack/react-table";
import { ChevronUp, ChevronDown, Receipt } from "lucide-react";
import useTable from "../../utils/hooks/useTable";
import usePagination from "../../utils/hooks/usePagination";
import { toCaps } from "../../utils/helpers/tableDataFormatters";

const ARTable = ({ data }) => {
  const columns = useMemo(
    () => [
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
        accessorKey: "description",
        header: "Desc.",
        cell: ({ row }) => (
          <span className="table-text">{row.original.description}</span>
        )
      },
      {
        accessorKey: "remarks",
        header: "Remarks",
        cell: ({ row }) => (
          <span className="table-text">{row.original.remarks || "-"}</span>
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
        header: "Vol.",
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
      },
      {
        accessorKey: "payment_status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.payment_status;
          const statusConfig = {
            PENDING: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending" },
            PAID: { bg: "bg-green-100", text: "text-green-800", label: "Paid" },
            OVERDUE: { bg: "bg-red-100", text: "text-red-800", label: "Overdue" }
          };
          const { bg, text, label } = statusConfig[status] || statusConfig.PENDING;
          return <span className={`badge ${bg} ${text}`}>{label}</span>;
        }
      }
    ],
    []
  );

  const { table, globalFilter, setGlobalFilter } = useTable({
    data,
    columns
  });

  const { paginationInfo, actions } = usePagination(table, data?.length);

  return (
    <div className="table-wrapper">
      {/* Header */}
      <div className="table-header-container">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="table-title">Receivables</h2>
            <p className="table-count">Total: {paginationInfo.totalItems} records</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <input
          type="text"
          value={globalFilter ?? ""}
          onChange={e => setGlobalFilter(e.target.value)}
          placeholder="Search receivables..."
          className="filter-input"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="table-thead">
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id}>
                {hg.headers.map(header => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="table-header"
                  >
                    <div className="flex items-center gap-2">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getIsSorted() === "asc" && (
                        <ChevronUp className="table-sort-icon" />
                      )}
                      {header.column.getIsSorted() === "desc" && (
                        <ChevronDown className="table-sort-icon" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="table-body">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map(row => (
                <tr key={row.id} className="table-row">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="table-cell">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length}>
                  <div className="empty-state">
                    <Receipt className="empty-state-icon" />
                    <h3 className="empty-state-title">No receivables found</h3>
                    <p className="empty-state-description">
                      Try adjusting your search.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="table-pagination-container">
        <div className="table-pagination-inner">
          <span className="table-pagination-info">
            Page {paginationInfo.currentPage} of {paginationInfo.totalPages} (
            {paginationInfo.totalItems} total)
          </span>
          <div className="table-pagination-actions">
            <button
              onClick={actions.previousPage}
              disabled={!actions.canPrevious}
              className="table-pagination-button"
            >
              Previous
            </button>
            <button
              onClick={actions.nextPage}
              disabled={!actions.canNext}
              className="table-pagination-button"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ARTable;