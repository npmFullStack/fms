// components/tables/DataTable.jsx
import { useMemo } from "react";
import { flexRender } from "@tanstack/react-table";
import { ChevronUp, ChevronDown } from "lucide-react";

const DataTable = ({ 
  table, 
  columns, 
  data = [],
  title = "Data Table",
  rightAction = null,
  searchPlaceholder = "Search...",
  onSelectionChange,
  globalFilter,
  setGlobalFilter,
  paginationInfo,
  paginationActions
}) => {
  const selectedRows = table?.getSelectedRowModel().rows || [];

  useMemo(() => {
    if (onSelectionChange && selectedRows.length >= 0) {
      const selectedIds = selectedRows.map(r => r.original.id);
      onSelectionChange(selectedIds);
    }
  }, [selectedRows, onSelectionChange]);

  return (
    <div className="table-wrapper">
      {/* Header */}
      <div className="table-header-container">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="table-title">{title}</h2>
            <p className="table-count">
              Total: {data.length} records
            </p>
          </div>
          {rightAction}
        </div>
      </div>

      {/* Search Filter */}
      {setGlobalFilter && (
        <div className="filter-bar">
          <input
            type="text"
            value={globalFilter ?? ""}
            onChange={e => setGlobalFilter(e.target.value)}
            placeholder={searchPlaceholder}
            className="filter-input"
          />
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto relative">
        <table className="w-full">
          <thead className="table-thead">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className={`table-header ${
                      index === 0 ? 'sticky left-0 z-10 bg-white' : ''
                    }`}
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
                  {row.getVisibleCells().map((cell, index) => (
                    <td 
                      key={cell.id} 
                      className={`table-cell ${
                        index === 0 ? 'sticky left-0 z-10 bg-white' : ''
                      }`}
                    >
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
                    <h3 className="empty-state-title">
                      No records found
                    </h3>
                    <p className="empty-state-description">
                      Try adjusting your search or filters.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {paginationInfo && paginationActions && (
        <div className="table-pagination-container">
          <div className="table-pagination-inner">
            <span className="table-pagination-info">
              Page {paginationInfo.currentPage} of {paginationInfo.totalPages} ({paginationInfo.totalItems} total)
            </span>
            <div className="table-pagination-actions">
              <button
                onClick={paginationActions.previousPage}
                disabled={!paginationActions.canPrevious}
                className="table-pagination-button"
              >
                Previous
              </button>
              <button
                onClick={paginationActions.nextPage}
                disabled={!paginationActions.canNext}
                className="table-pagination-button"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;