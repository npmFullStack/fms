// components/tables/BookingTable.jsx
import { useMemo, useEffect } from "react";
import { flexRender } from "@tanstack/react-table";
import {
    ChevronUpIcon,
    ChevronDownIcon,
    CubeIcon
} from "@heroicons/react/24/outline";
import useTable from "../../utils/hooks/useTable";
import usePagination from "../../utils/hooks/usePagination";

const BookingTable = ({ data, rightAction, onSelectionChange }) => {
    const columns = useMemo(
        () => [
            {
                id: "select",
                header: ({ table }) => (
                    <input
                        type="checkbox"
                        checked={table.getIsAllRowsSelected?.()}
                        onChange={e =>
                            table.toggleAllRowsSelected?.(e.target.checked)
                        }
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                ),
                cell: ({ row }) => (
                    <input
                        type="checkbox"
                        checked={row.getIsSelected?.()}
                        onChange={row.getToggleSelectedHandler?.()}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                )
            },
            {
                accessorKey: "hwb_number",
                header: "HWB #",
                cell: ({ row }) => (
                    <span className="font-mono text-sm text-slate-600">
                        {row.original.hwb_number || "—"}
                    </span>
                )
            },
            {
                accessorKey: "booking_number",
                header: "Booking #",
                cell: ({ row }) => (
                    <span className="font-mono text-sm text-slate-600">
                        {row.original.booking_number || "—"}
                    </span>
                )
            },
            {
                accessorKey: "shipper",
                header: "Shipper",
                cell: ({ row }) => (
                    <div>
                        <div className="font-medium text-slate-800">
                            {row.original.shipper}
                        </div>
                        {row.original.phone && (
                            <div className="text-sm text-slate-500">
                                {row.original.phone}
                            </div>
                        )}
                    </div>
                )
            },
            {
                accessorKey: "booking_mode",
                header: "Mode of Service",
                cell: ({ row }) => {
                    const mode = row.original.booking_mode;
                    const modeMap = {
                        DOOR_TO_DOOR: {
                            label: "DOOR-DOOR",
                            color: "bg-orange-600 text-white"
                        },
                        PIER_TO_PIER: {
                            label: "PORT-PORT",
                            color: "bg-blue-600 text-white"
                        },
                        CY_TO_DOOR: {
                            label: "CY-DOOR",
                            color: "bg-purple-600 text-white"
                        },
                        DOOR_TO_CY: {
                            label: "DOOR-CY",
                            color: "bg-pink-600 text-white"
                        },
                        CY_TO_CY: {
                            label: "CY-CY",
                            color: "bg-green-600 text-white"
                        }
                    };
                    const { label, color } = modeMap[mode] || {
                        label: mode,
                        color: "bg-gray-600 text-white"
                    };

                    return (
                        <span
                            className={`px-3 py-1 text-xs rounded-full font-semibold ${color}`}
                        >
                            {label}
                        </span>
                    );
                }
            },
            {
                accessorKey: "status",
                header: "Status",
                cell: ({ row }) => {
                    const statusColors = {
                        pending: "bg-yellow-100 text-yellow-900",
                        in_transit: "bg-blue-100 text-blue-900",
                        delivered: "bg-green-100 text-green-900"
                    };
                    const status =
                        row.original.status?.toLowerCase() || "pending";
                    return (
                        <span
                            className={`px-2 py-1 text-xs rounded-2xl
                            font-medium ${
                                statusColors[status] || "bg-gray-600 text-white"
                            }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                    );
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

    // 🔥 Fix ESLint warning by extracting rows first
    const selectedRows = table.getSelectedRowModel().rows;
    useEffect(() => {
        if (onSelectionChange) {
            const selectedIds = selectedRows.map(r => r.original.id);
            onSelectionChange(selectedIds);
        }
    }, [selectedRows, onSelectionChange]);

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
