import { useMemo } from "react";
import { flexRender } from "@tanstack/react-table";
import {
    EyeIcon,
    PencilSquareIcon,
    TrashIcon,
    ChevronUpIcon,
    ChevronDownIcon
} from "@heroicons/react/24/outline";
import useTable from "../../utils/hooks/useTable";
import usePagination from "../../utils/hooks/usePagination";

const sizeColors = {
    LCL: "bg-indigo-100 text-indigo-800 border-indigo-200",
    "20FT": "bg-green-100 text-green-800 border-green-200",
    "40FT": "bg-yellow-100 text-yellow-800 border-yellow-200",
    DEFAULT: "bg-slate-100 text-slate-800 border-slate-200"
};

const ShipTable = ({ data, onDelete, onEdit, onView, rightAction }) => {
    const columns = useMemo(
        () => [
            {
                accessorKey: "vessel_number",
                header: "VESSEL NUMBER",
                cell: ({ row }) => (
                    <span className="font-medium text-slate-700">
                        {row.original.vessel_number}
                    </span>
                )
            },
            {
                accessorKey: "containers",
                header: "CONTAINERS",
                cell: ({ row }) => {
                    const containers = row.original.containers || [];
                    if (containers.length === 0) {
                        return (
                            <span className="text-slate-400 text-sm">
                                NO CONTAINERS
                            </span>
                        );
                    }

                    // Sort: LCL → 20FT → 40FT
                    const sortOrder = { LCL: 1, "20FT": 2, "40FT": 3 };
                    const sortedContainers = [...containers].sort(
                        (a, b) =>
                            (sortOrder[a.size] || 99) -
                            (sortOrder[b.size] || 99)
                    );

                    return (
                        <div className="flex flex-col gap-2">
                            {sortedContainers.map(c => {
                                const color =
                                    sizeColors[c.size] || sizeColors.DEFAULT;
                                return (
                                    <span
                                        key={c.id}
                                        className={`px-3 py-1 rounded-lg text-xs border w-fit ${color}`}
                                    >
                                        {c.size} – {c.van_number}
                                    </span>
                                );
                            })}
                        </div>
                    );
                }
            },

            {
                id: "actions",
                header: "ACTIONS",
                cell: ({ row }) => (
                    <div className="flex gap-2">
                        {/* View Ship */}
                        <button
                            onClick={() => onView(row.original)}
                            className="action-btn bg-blue-50 text-blue-600 hover:bg-blue-100"
                            title="View Ship"
                        >
                            <EyeIcon className="w-5 h-5" />
                        </button>

                        {/* Update Ship */}
                        <button
                            onClick={() => onEdit(row.original)}
                            className="action-btn bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                            title="Update Ship"
                        >
                            <PencilSquareIcon className="w-4 h-4" />
                        </button>

                        {/* Delete Ship */}
                        <button
                            onClick={() => onDelete(row.original)}
                            className="action-btn bg-red-50 text-red-600 hover:bg-red-100"
                            title="Delete Ship"
                        >
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    </div>
                )
            }
        ],
        [onDelete, onEdit, onView]
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
                            Ships
                        </h2>
                        <p className="table-count">
                            Total: {data?.length || 0} ships
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
                    placeholder="Search ships..."
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
                                            No ships found
                                        </h3>
                                        <p className="empty-state-description">
                                            Try adjusting your search to find
                                            ships.
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

export default ShipTable;
