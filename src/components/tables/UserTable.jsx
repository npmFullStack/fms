import { useMemo } from "react";
import { flexRender } from "@tanstack/react-table";
import {
  UserCircle,
  Eye,
  Edit2,
  Lock,
  Unlock,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import Select from "react-select";
import useTable from "../../utils/hooks/useTable";
import usePagination from "../../utils/hooks/usePagination";

const UserTable = ({ data, onView, onEdit, onRestrict, rightAction }) => {
  const roles = [
    { value: "", label: "All Roles" },
    { value: "customer", label: "Customer" },
    { value: "marketing_coordinator", label: "Marketing Coordinator" },
    { value: "admin_finance", label: "Admin Finance" },
    { value: "general_manager", label: "General Manager" }
  ];

  const columns = useMemo(
    () => [
      {
        accessorKey: "fullName",
        header: "Name",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            {row.original.profile_picture ? (
              <img
                src={row.original.profile_picture}
                alt={row.getValue("fullName")}
                className="w-10 h-10 rounded-full object-cover border-2 border-slate-200"
              />
            ) : (
              <UserCircle className="w-10 h-10 text-slate-400" />
            )}
            <span className="font-medium text-slate-700">
              {row.getValue("fullName")}
            </span>
          </div>
        )
      },
      { accessorKey: "email", header: "Email" },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
          const roleColors = {
            customer: "bg-gray-100 text-gray-800",
            marketing_coordinator: "bg-blue-100 text-blue-800",
            admin_finance: "bg-green-100 text-green-800",
            general_manager: "bg-purple-100 text-purple-800"
          };
          return (
            <span
              className={`px-2 py-1 text-xs rounded-lg ${
                roleColors[row.original.role] ||
                "bg-gray-100 text-gray-800"
              }`}
            >
              {row.original.displayRole}
            </span>
          );
        }
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) =>
          row.original.is_active ? (
            <span className="px-2 py-1 text-xs rounded-lg bg-green-100 text-green-700 font-medium">
              Active
            </span>
          ) : (
            <span className="px-2 py-1 text-xs rounded-lg bg-red-100 text-red-700 font-medium">
              Restricted
            </span>
          )
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              onClick={() => onView(row.original.id)}
              className="action-btn bg-blue-50 text-blue-600 hover:bg-blue-100"
              title="View User"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(row.original.id)}
              className="action-btn bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
              title="Edit User"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onRestrict(row.original)}
              className={`action-btn ${
                row.original.is_active
                  ? "bg-red-50 text-red-600 hover:bg-red-100"
                  : "bg-green-50 text-green-600 hover:bg-green-100"
              }`}
              title={row.original.is_active ? "Restrict User" : "Unrestrict User"}
            >
              {row.original.is_active ? (
                <Lock className="w-4 h-4" />
              ) : (
                <Unlock className="w-4 h-4" />
              )}
            </button>
          </div>
        )
      }
    ],
    [onView, onEdit, onRestrict]
  );

  const { table, globalFilter, setGlobalFilter } = useTable({ data, columns });
  const { paginationInfo, actions } = usePagination(table, data?.length);

  return (
    <div className="table-wrapper">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200/50 bg-gradient-to-r from-slate-50 to-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">User Accounts</h2>
            <p className="table-count">Total: {paginationInfo.totalItems} users</p>
          </div>
          {rightAction}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar flex gap-4 relative">
        <input
          type="text"
          value={globalFilter ?? ""}
          onChange={e => setGlobalFilter(e.target.value)}
          placeholder="Search users..."
          className="filter-input"
        />
        <div className="w-60">
          <Select
            options={roles}
            onChange={opt => setGlobalFilter(opt?.value || "")}
            placeholder="Filter by role..."
            menuPortalTarget={document.body}
            styles={{
              menuPortal: base => ({ ...base, zIndex: 9999 })
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50/50">
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id}>
                {hg.headers.map(header => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="table-header text-sm cursor-pointer select-none hover:bg-slate-100/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() === "asc" && (
                        <ChevronUp className="w-4 h-4" />
                      )}
                      {header.column.getIsSorted() === "desc" && (
                        <ChevronDown className="w-4 h-4" />
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
                    <td key={cell.id} className="table-cell">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length}>
                  <div className="empty-state">
                    <UserCircle className="empty-state-icon" />
                    <h3 className="empty-state-title">No users found</h3>
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
      <div className="px-6 py-4 border-t border-slate-200/50 bg-slate-50/30">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">
            Page {paginationInfo.currentPage} of {paginationInfo.totalPages} (
            {paginationInfo.totalItems} total)
          </span>
          <div className="flex gap-2">
            <button
              onClick={actions.previousPage}
              disabled={!actions.canPrevious}
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={actions.nextPage}
              disabled={!actions.canNext}
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

export default UserTable;
