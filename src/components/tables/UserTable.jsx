import { useMemo } from "react";
import { flexRender } from "@tanstack/react-table";
import {
  UserCircleIcon,
  EyeIcon,
  PencilIcon,
  LockClosedIcon,
  LockOpenIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import Select from "react-select";
import useTable from "../../utils/hooks/useTable";

const UserTable = ({ data, onView, onEdit, onRestrict, rightAction }) => {
  const roles = [
    { value: "", label: "All Roles" },
    { value: "customer", label: "Customer" },
    { value: "marketing_coordinator", label: "Marketing Coordinator" },
    { value: "admin_finance", label: "Admin Finance" },
    { value: "general_manager", label: "General Manager" },
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
                className="w-12 h-12 rounded-full object-cover border-2 border-slate-200"
              />
            ) : (
              <UserCircleIcon className="w-12 h-12 text-slate-400" />
            )}
            <span className="font-medium text-slate-700">
              {row.getValue("fullName")}
            </span>
          </div>
        ),
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
            general_manager: "bg-purple-100 text-purple-800",
          };
          return (
            <span
              className={`px-2 py-1 text-xs rounded-lg ${
                roleColors[row.original.role] || "bg-gray-100 text-gray-800"
              }`}
            >
              {row.original.displayRole}
            </span>
          );
        },
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
          ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button onClick={() => onView(row.original.id)} className="action-btn bg-blue-50 text-blue-600">
              <EyeIcon className="w-4 h-4" />
            </button>
            <button onClick={() => onEdit(row.original.id)} className="action-btn bg-emerald-50 text-emerald-600">
              <PencilIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => onRestrict(row.original)}
              className={`action-btn ${
                row.original.is_active
                  ? "bg-red-50 text-red-600"
                  : "bg-green-50 text-green-600"
              }`}
            >
              {row.original.is_active ? (
                <LockClosedIcon className="w-4 h-4" />
              ) : (
                <LockOpenIcon className="w-4 h-4" />
              )}
            </button>
          </div>
        ),
      },
    ],
    [onView, onEdit, onRestrict]
  );

  const { table, globalFilter, setGlobalFilter } = useTable({
    data,
    columns,
  });

  return (
    <div className="table-wrapper">
      {/* Filter Bar */}
      <div className="filter-bar flex gap-4">
        <input
          type="text"
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search users..."
          className="filter-input"
        />
        <Select
          options={roles}
          onChange={(opt) => setGlobalFilter(opt?.value || "")}
          placeholder="Filter by role..."
        />
      </div>

      {/* Table */}
      <table className="w-full">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className="cursor-pointer"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {header.column.getIsSorted() === "asc" && <ChevronUpIcon className="w-4 h-4" />}
                  {header.column.getIsSorted() === "desc" && <ChevronDownIcon className="w-4 h-4" />}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
