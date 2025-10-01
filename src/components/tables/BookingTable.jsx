// components/tables/BookingTable.jsx
import { useMemo, useEffect } from "react";
import { flexRender } from "@tanstack/react-table";
import { ChevronUp, ChevronDown, Clipboard } from "lucide-react";
import useTable from "../../utils/hooks/useTable";
import usePagination from "../../utils/hooks/usePagination";
import {
    toCaps,
    getStatusBadge,
    getModeBadge
} from "../../utils/helpers/tableDataFormatters";

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
                accessorKey: "hwb_number",
                header: "HWB #",
                cell: ({ row }) => (
                    <span className="table-text-bold">
                        {toCaps(row.original.hwb_number)}
                    </span>
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
                accessorKey: "shipper",
                header: "Shipper",
                cell: ({ row }) => (
                    <div className="table-cell-stack">
                        <div className="table-text-bold">
                            {toCaps(row.original.shipper)}
                        </div>
                        {row.original.phone && (
                            <div className="table-subtext">
                                {toCaps(row.original.phone)}
                            </div>
                        )}
                    </div>
                )
            },
            {
                accessorKey: "consignee",
                header: "Consignee",
                cell: ({ row }) => (
                    <div className="table-cell-stack">
                        <div className="table-text-bold">
                            {toCaps(row.original.consignee)}
                        </div>
                        {row.original.consignee_phone && (
                            <div className="table-subtext">
                                {toCaps(row.original.consignee_phone)}
                            </div>
                        )}
                    </div>
                )
            },
            {
                accessorKey: "booking_mode",
                header: "Mode of Service",
                cell: ({ row }) => {
                    const { label, bg, text } = getModeBadge(
                        row.original.booking_mode
                    );
                    return (
                        <span className={`badge ${bg} ${text}`}>{label}</span>
                    );
                }
            },
            {
                accessorKey: "status",
                header: "Status",
                cell: ({ row }) => {
                    const { label, bg, text } = getStatusBadge(
                        row.original.status
                    );
                    return (
                        <span className={`badge ${bg} ${text}`}>{label}</span>
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
            <div className="table-header-container">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="table-title">Bookings</h2>
                        <p className="table-count">
                            Total: {paginationInfo.totalItems} bookings
                        </p>
                    </div>
                    {rightAction}
                </div>
            </div>

            {/* Filter Bar */}
            <div className="filter-bar">
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
                                            {header.column.getIsSorted() ===
                                                "asc" && (
                                                <ChevronUp className="table-sort-icon" />
                                            )}
                                            {header.column.getIsSorted() ===
                                                "desc" && (
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
                                        <Clipboard className="empty-state-icon" />
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
            <div className="table-pagination-container">
                <div className="table-pagination-inner">
                    <span className="table-pagination-info">
                        Page {paginationInfo.currentPage} of{" "}
                        {paginationInfo.totalPages} ({paginationInfo.totalItems}{" "}
                        total)
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

export default BookingTable;
