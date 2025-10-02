import { useMemo } from "react";
import { flexRender } from "@tanstack/react-table";
import { Edit2, Trash2, ChevronUp, ChevronDown } from "lucide-react";

import useTable from "../../utils/hooks/useTable";
import usePagination from "../../utils/hooks/usePagination";

const sizeColors = {
    LCL: "text-sky-500",
    "20FT": "text-blue-500",
    "40FT": "text-indigo-500",
    DEFAULT: "text-slate-500"
};

const ContainerTable = ({ data, onDelete, onEdit, rightAction }) => {
    const columns = useMemo(
        () => [
            {
                accessorKey: "van_number",
                header: "VAN NUMBER",
                cell: ({ row }) => (
                    <span className="font-medium text-slate-800">
                        {row.original.van_number}
                    </span>
                )
            },
            {
                accessorKey: "size",
                header: "SIZE",
                cell: ({ row }) => {
                    const colorClass =
                        sizeColors[row.original.size] || sizeColors.DEFAULT;
                    return (
                        <span className={`text-sm font-semibold ${colorClass}`}>
                            {row.original.size}
                        </span>
                    );
                }
            },

            {
                accessorKey: "is_returned",
                header: "STATUS",
                cell: ({ row }) => (
                    <span
                        className={`px-2 py-1 text-xs font-semibold rounded-xl ${
                            row.original.is_returned
                                ? "bg-green-200 text-green-800"
                                : "bg-rose-200 text-rose-800"
                        }`}
                    >
                        {row.original.is_returned ? "Returned" : "In Use"}
                    </span>
                )
            },
            {
                id: "actions",
                header: "ACTIONS",
                cell: ({ row }) => (
                    <div className="flex gap-2">
                        <button
                            onClick={() => onEdit(row.original)}
                            className="action-btn bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                            title="Update Container"
                        >
                            <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onDelete(row.original)}
                            className="action-btn bg-red-50 text-red-600 hover:bg-red-100"
                            title="Delete Container"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                )
            }
        ],
        [onDelete, onEdit]
    );

    const { table, globalFilter, setGlobalFilter } = useTable({
        data,
        columns
    });
    const { paginationInfo, actions } = usePagination(table, data?.length);

    return (
        <div className="table-wrapper mt-10">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200/50 bg-gradient-to-r from-slate-50 to-slate-100">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-800">
                            Containers
                        </h2>
                        <p className="table-count">
                            Total: {data?.length || 0} containers
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
                    placeholder="Search containers..."
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
                                                <ChevronUp className="w-4 h-4" />
                                            )}
                                            {header.column.getIsSorted() ===
                                                "desc" && (
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
                                        <td
                                            key={cell.id}
                                            className="table-cell align-top"
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
                                            No containers found
                                        </h3>
                                        <p className="empty-state-description">
                                            Try adjusting your search to find
                                            containers.
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

export default ContainerTable;
