import { useMemo, useState } from "react";
import { useReactTable, flexRender } from "@tanstack/react-table";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel
} from "@tanstack/table-core";
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  BuildingOfficeIcon,
  TruckIcon
} from "@heroicons/react/24/outline";
import Select from "react-select";

const PartnerTable = ({ 
  data, 
  onView, 
  onEdit, 
  onDelete, 
  rightAction,
  type 
}) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  });

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Company",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            {row.original.logo_url ? (
              <img
                src={row.original.logo_url}
                alt={row.getValue("name")}
                className="w-10 h-10 rounded-full aspect-square object-cover border-2 border-slate-200"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                {type === 'shipping' ? (
                  <BuildingOfficeIcon className="h-5 w-5 text-slate-400" />
                ) : (
                  <TruckIcon className="h-5 w-5 text-slate-400" />
                )}
              </div>
            )}
            <span className="font-medium text-slate-700">
              {row.getValue("name")}
            </span>
          </div>
        )
      },
      {
        accessorKey: "contact_email",
        header: "Email",
        cell: info => (
          <span className="text-slate-600 text-sm">
            {info.getValue() || '-'}
          </span>
        )
      },
      {
        accessorKey: "contact_phone",
        header: "Phone",
        cell: info => (
          <span className="text-slate-600 text-sm">
            {info.getValue() || '-'}
          </span>
        )
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          row.original.is_active ? (
            <span className="px-2 py-1 text-xs rounded-lg bg-green-100 text-green-700 font-medium">
              Active
            </span>
          ) : (
            <span className="px-2 py-1 text-xs rounded-lg bg-red-100 text-red-700 font-medium">
              Inactive
            </span>
          )
        )
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              onClick={() => onView(row.original)}
              className="action-btn bg-blue-50 text-blue-600 hover:bg-blue-100"
              title="View Partner"
            >
              <EyeIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(row.original)}
              className="action-btn bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
              title="Edit Partner"
            >
              <PencilIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(row.original)}
              className={`action-btn ${
                row.original.is_active
                  ? "bg-red-50 text-red-600 hover:bg-red-100"
                  : "bg-green-50 text-green-600 hover:bg-green-100"
              }`}
              title={row.original.is_active ? "Deactivate Partner" : "Reactivate Partner"}
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        )
      }
    ],
    [onView, onEdit, onDelete]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      pagination
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  return (
    <div className="table-wrapper">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200/50 bg-gradient-to-r from-slate-50 to-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">
              {type === 'shipping' ? 'Shipping Lines' : 'Trucking Companies'}
            </h2>
            <p className="table-count">
              Total: {data?.length || 0} {type === 'shipping' ? 'shipping lines' : 'trucking companies'}
            </p>
          </div>
          {rightAction}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <input
            type="text"
            value={globalFilter ?? ""}
            onChange={e => setGlobalFilter(e.target.value)}
            placeholder={`Search ${type === 'shipping' ? 'shipping lines' : 'trucking companies'}...`}
            className="filter-input"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50/50">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="table-header cursor-pointer select-none hover:bg-slate-100/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getIsSorted() === "asc" && (
                        <ChevronUpIcon className="w-4 h-4" />
                      )}
                      {header.column.getIsSorted() === "desc" && (
                        <ChevronDownIcon className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-200/50">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map(row => (
                <tr key={row.id} className="table-row">
                  {row.getVisibleCells().map(cell => (
                    <td
                      key={cell.id}
                      className="table-cell"
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
                    {type === 'shipping' ? (
                      <BuildingOfficeIcon className="empty-state-icon" />
                    ) : (
                      <TruckIcon className="empty-state-icon" />
                    )}
                    <h3 className="empty-state-title">
                      No {type === 'shipping' ? 'shipping lines' : 'trucking companies'} found
                    </h3>
                    <p className="empty-state-description">
                      Try adjusting your search to find partners.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-slate-200/50 bg-slate-50/30">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()} ({data?.length || 0} total)
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerTable;