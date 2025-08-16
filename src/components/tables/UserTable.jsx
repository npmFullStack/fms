import { useMemo, useState } from "react";
import { useReactTable, flexRender } from "@tanstack/react-table";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel
} from "@tanstack/table-core";
import { UserCircleIcon, EyeIcon, PencilIcon, TrashIcon, ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { formatDate } from "../../utils/helpers/formatters";

const UserTable = ({ data, onView, onEdit, onArchive, rightAction }) => {
  const { control } = useForm();
  const [globalFilter, setGlobalFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  });

  const roles = [
    { value: "", label: "All Roles" },
    { value: "customer", label: "Customer" },
    { value: "marketing_coordinator", label: "Marketing Coordinator" },
    { value: "admin_finance", label: "Admin Finance" },
    { value: "general_manager", label: "General Manager" }
  ];

  // Filter data based on role selection
  const filteredData = useMemo(() => {
    if (!roleFilter || !data) return data || [];
    return data.filter(user => 
      user.role?.toLowerCase().includes(roleFilter.toLowerCase())
    );
  }, [data, roleFilter]);

  // Define columns
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
                className="w-12 h-12 rounded-full object-cover border-2 border-slate-200"
              />
            ) : (
              <UserCircleIcon className="w-12 h-12 text-slate-400" />
            )}
            <span className="font-medium text-slate-700">{row.getValue("fullName")}</span>
          </div>
        )
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: info => <span className="text-slate-600">{info.getValue()}</span>
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
          const role = row.getValue("role");
          const getRoleColor = (role) => {
            const colors = {
              'Admin': 'bg-red-100 text-red-800',
              'General Manager': 'bg-purple-100 text-purple-800',
              'Admin Finance': 'bg-green-100 text-green-800',
              'Marketing Coordinator': 'bg-blue-100 text-blue-800',
              'Customer': 'bg-gray-100 text-gray-800'
            };
            return colors[role] || 'bg-gray-100 text-gray-800';
          };
          
          return (
            <span className={`role-badge ${getRoleColor(role)}`}>
              {role}
            </span>
          );
        }
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
              <EyeIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(row.original.id)}
              className="action-btn bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
              title="Edit User"
            >
              <PencilIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => onArchive(row.original.id)}
              className="action-btn bg-red-50 text-red-600 hover:bg-red-100"
              title="Archive User"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        )
      }
    ],
    [onView, onEdit, onArchive]
  );

  // Table instance
  const table = useReactTable({
    data: filteredData,
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
            <h2 className="text-xl font-semibold text-slate-800">Users</h2>
            <p className="table-count">Total: {filteredData?.length || 0} users</p>
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
            placeholder="Search users..."
            className="filter-input"
          />
          <div className="w-full sm:w-48">
            <Select
              value={roles.find(r => r.value === roleFilter)}
              onChange={opt => setRoleFilter(opt?.value || "")}
              options={roles}
              getOptionValue={opt => opt.value}
              getOptionLabel={opt => opt.label}
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="Filter by role..."
              isClearable
            />
          </div>
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
                      {header.column.getIsSorted() === 'asc' && <ChevronUpIcon className="w-4 h-4" />}
                      {header.column.getIsSorted() === 'desc' && <ChevronDownIcon className="w-4 h-4" />}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-200/50">
            {table.getRowModel().rows.map(row => (
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
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-slate-200/50 bg-slate-50/30">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()} ({filteredData?.length || 0} total)
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

export default UserTable;