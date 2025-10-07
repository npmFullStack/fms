// components/tables/APTable.jsx
import { useMemo, useEffect } from "react";
import { flexRender } from "@tanstack/react-table";
import { ChevronUp, ChevronDown, Receipt } from "lucide-react";
import useTable from "../../utils/hooks/useTable";
import usePagination from "../../utils/hooks/usePagination";
import { toCaps } from "../../utils/helpers/tableDataFormatters";

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

  // Expense columns for each category
  const createExpenseColumns = (prefix, label) => [
    {
      accessorKey: `${prefix}_payee`,
      header: `${label} - Payee`,
      cell: ({ row }) => (
        <span className="table-text">{toCaps(row.original[`${prefix}_payee`] || "-")}</span>
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
            : "-"}
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

  // Create columns with origin/destination
  const createDualExpenseColumns = (prefix, label) => [
    ...createExpenseColumns(`${prefix}_origin`, `${label} (Origin)`),
    ...createExpenseColumns(`${prefix}_dest`, `${label} (Dest)`)
  ];

  // Summary columns (always visible)
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
        // Show all expense columns
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

  const { table, globalFilter, setGlobalFilter } = useTable({
    data,
    columns
  });

  const { paginationInfo, actions } = usePagination(table, data?.length);

  const selectedRows = table.getSelectedRowModel().rows;
  
  useEffect(() => {
    if (onSelectionChange) {
      const selectedIds = selectedRows.map(r => r.original.ap_id);
      onSelectionChange(selectedIds);
    }
  }, [selectedRows, onSelectionChange]);

  return (
    <div className="table-wrapper">
      {/* Header */}
      <div className="table-header-container">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="table-title">
              {activeTab === "ALL" ? "All Accounts Payable" : `${activeTab.replace('_', ' ')} Expenses`}
            </h2>
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
          placeholder="Search payables..."
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
                    className="table-header whitespace-nowrap"
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
                    <td key={cell.id} className="table-cell whitespace-nowrap">
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
                    <h3 className="empty-state-title">No payables found</h3>
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

export default APTable;