// components/tables/BookingTable.jsx
import { useMemo } from "react";
import { flexRender } from "@tanstack/react-table";
import {
    EyeIcon,
    PencilIcon,
    TrashIcon,
    ChevronUpIcon,
    ChevronDownIcon,
    TruckIcon,
    CubeIcon
} from "@heroicons/react/24/outline";
import Select from "react-select";
import useTable from "../../utils/hooks/useTable";
import usePagination from "../../utils/hooks/usePagination";

const BookingTable = ({ data, onView, onEdit, onDelete, rightAction }) => {
    const statusOptions = [
        { value: "", label: "All Status" },
        { value: "BOOKED", label: "Booked" },
        { value: "IN_TRANSIT", label: "In Transit" },
        { value: "ARRIVED", label: "Arrived" },
        { value: "DELIVERED", label: "Delivered" },
        { value: "CANCELLED", label: "Cancelled" }
    ];

    const containerTypeOptions = [
        { value: "", label: "All Types" },
        { value: "LCL", label: "LCL" },
        { value: "20FT", label: "20FT" },
        { value: "40FT", label: "40FT" }
    ];

    const columns = useMemo(
        () => [
            {
                accessorKey: "id",
                header: "Booking ID",
                cell: ({ row }) => (
                    <span className="font-mono text-sm text-slate-600">
                        #{row.original.id.slice(0, 8)}
                    </span>
                )
            },
            {
                accessorKey: "customer_name",
                header: "Customer",
                cell: ({ row }) => (
                    <div>
                        <div className="font-medium text-slate-800">
                            {row.original.customer_first_name}{" "}
                            {row.original.customer_last_name}
                        </div>
                        {row.original.customer_phone && (
                            <div className="text-sm text-slate-500">
                                {row.original.customer_phone}
                            </div>
                        )}
                    </div>
                )
            },
            {
                accessorKey: "route",
                header: "Route",
                cell: ({ row }) => (
                    <div>
                        <div className="font-medium text-slate-800">
                            {row.original.origin} → {row.original.destination}
                        </div>
                        <div className="text-sm text-slate-500 capitalize">
                            {row.original.booking_mode
                                ?.toLowerCase()
                                .replace(/_/g, " ")}
                        </div>
                    </div>
                )
            },
            {
                accessorKey: "container_type",
                header: "Container",
                cell: ({ row }) => {
                    const containerColors = {
                        LCL: "bg-blue-100 text-blue-800",
                        "20FT": "bg-green-100 text-green-800",
                        "40FT": "bg-purple-100 text-purple-800"
                    };
                    return (
                        <span
                            className={`px-2 py-1 text-xs rounded-lg ${
                                containerColors[row.original.container_type] ||
                                "bg-gray-100 text-gray-800"
                            }`}
                        >
                            {row.original.container_type}
                        </span>
                    );
                }
            },
            {
                accessorKey: "shipping_line_name",
                header: "Shipping Line",
                cell: ({ row }) => row.original.shipping_line_name || "-"
            },
            {
                accessorKey: "status",
                header: "Status",
                cell: ({ row }) => {
                    const statusColors = {
                        BOOKED: "bg-blue-100 text-blue-700",
                        IN_TRANSIT: "bg-yellow-100 text-yellow-700",
                        ARRIVED: "bg-green-100 text-green-700",
                        DELIVERED: "bg-emerald-100 text-emerald-700",
                        CANCELLED: "bg-red-100 text-red-700"
                    };
                    return (
                        <span
                            className={`px-2 py-1 text-xs rounded-lg font-medium ${
                                statusColors[row.original.status] ||
                                "bg-gray-100 text-gray-700"
                            }`}
                        >
                            {row.original.status?.replace(/_/g, " ")}
                        </span>
                    );
                }
            },
            {
                accessorKey: "dates",
                header: "Dates",
                cell: ({ row }) => (
                    <div className="text-sm">
                        <div>
                            Depart:{" "}
                            {new Date(
                                row.original.preferred_departure
                            ).toLocaleDateString()}
                        </div>
                        {row.original.preferred_delivery && (
                            <div>
                                Delivery:{" "}
                                {new Date(
                                    row.original.preferred_delivery
                                ).toLocaleDateString()}
                            </div>
                        )}
                    </div>
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
                            title="View Booking"
                        >
                            <EyeIcon className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onEdit(row.original.id)}
                            className="action-btn bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                            title="Edit Booking"
                        >
                            <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onDelete(row.original)}
                            className="action-btn bg-red-50 text-red-600 hover:bg-red-100"
                            title="Delete Booking"
                        >
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    </div>
                )
            }
        ],
        [onView, onEdit, onDelete]
    );

    const { table, globalFilter, setGlobalFilter } = useTable({
        data,
        columns
    });
    const { paginationInfo, actions } = usePagination(table, data?.length);

    return (
        <div className="table-wrapper">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200/50 bg-gradient-to-r from-slate-50 to-slate-100">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-800">
                            Bookings
                        </h2>
                        <p className="table-count">
                            Total: {paginationInfo.totalItems} bookings
                        </p>
                    </div>
                    {rightAction}
                </div>
            </div>

            {/* Filter Bar */}
            <div className="filter-bar flex gap-4 p-4">
                <input
                    type="text"
                    value={globalFilter ?? ""}
                    onChange={e => setGlobalFilter(e.target.value)}
                    placeholder="Search bookings..."
                    className="filter-input"
                />
                <div className="w-48">
                    <Select
                        options={statusOptions}
                        onChange={opt => setGlobalFilter(opt?.value || "")}
                        placeholder="Filter by status..."
                        menuPortalTarget={document.body}
                        styles={{
                            menuPortal: base => ({ ...base, zIndex: 9999 })
                        }}
                    />
                </div>
                <div className="w-48">
                    <Select
                        options={containerTypeOptions}
                        onChange={opt => setGlobalFilter(opt?.value || "")}
                        placeholder="Filter by container..."
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
                                        className="table-header cursor-pointer select-none hover:bg-slate-100/50 transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                            {header.column.getIsSorted() ===
                                                "asc" && (
                                                <ChevronUpIcon className="w-4 h-4" />
                                            )}
                                            {header.column.getIsSorted() ===
                                                "desc" && (
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
                                        <CubeIcon className="empty-state-icon" />
                                        <h3 className="empty-state-title">
                                            No bookings found
                                        </h3>
                                        <p className="empty-state-description">
                                            Try adjusting your search or
                                            filters.
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
                        Page {paginationInfo.currentPage} of{" "}
                        {paginationInfo.totalPages} ({paginationInfo.totalItems}{" "}
                        total)
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

export default BookingTable;
