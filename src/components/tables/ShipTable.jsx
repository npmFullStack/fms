import { useMemo } from "react";
import { flexRender } from "@tanstack/react-table";
import {
    EyeIcon,
    PencilSquareIcon,
    TrashIcon,
    ChevronUpIcon,
    ChevronDownIcon,
    ArrowRightIcon
} from "@heroicons/react/24/outline";
import useTable from "../../utils/hooks/useTable";
import usePagination from "../../utils/hooks/usePagination";

const sizeColors = {
    LCL: "bg-indigo-100 text-indigo-800 border-indigo-200",
    "20FT": "bg-emerald-100 text-emerald-800 border-emerald-200",
    "40FT": "bg-rose-100 text-rose-800 border-rose-200",
    DEFAULT: "bg-slate-100 text-slate-800 border-slate-200"
};

// soft route colors
const routeColors = [
    "bg-blue-50 border-blue-200",
    "bg-emerald-50 border-emerald-200",
    "bg-amber-50 border-amber-200",
    "bg-pink-50 border-pink-200",
    "bg-violet-50 border-violet-200"
];

const ShipTable = ({ data, onDelete, onEdit, onView, rightAction }) => {
    const columns = useMemo(
        () => [
            {
                accessorKey: "name",
                header: "SHIP NAME",
                cell: ({ row }) => (
                    <span className="font-medium text-slate-700">
                        {row.original.name}
                    </span>
                )
            },
            {
                accessorKey: "vessel_number",
                header: "VESSEL NUMBER",
                cell: ({ row }) => (
                    <span className="text-slate-600 text-sm">
                        {row.original.vessel_number || "N/A"}
                    </span>
                )
            },
            {
                accessorKey: "routes",
                header: "ROUTES",
                cell: ({ row }) => {
                    const routes = row.original.routes || [];
                    if (routes.length === 0) {
                        return (
                            <span className="text-slate-400 text-sm">
                                NO ROUTES
                            </span>
                        );
                    }

                    return (
                        <div className="flex flex-col gap-2">
                            {routes.map((r, i) => {
                                const routeColor =
                                    routeColors[i % routeColors.length];

                                return (
                                    <div
                                        key={i}
                                        className={`rounded-lg border px-3 py-2 text-sm ${routeColor}`}
                                        style={{ width: "fit-content" }}
                                    >
                                        {/* Route */}
                                        <div className="flex items-center gap-1 font-semibold text-slate-700 uppercase mb-1">
                                            <span>{r.origin}</span>
                                            <ArrowRightIcon className="w-4 h-4 text-slate-500" />
                                            <span>{r.destination}</span>
                                        </div>

                                        {/* Pricing for this route */}
                                        {r.pricing && r.pricing.length > 0 ? (
                                            <div className="flex flex-wrap gap-1">
                                                {r.pricing.map(p => {
                                                    const color =
                                                        sizeColors[
                                                            p.container_type
                                                        ] || sizeColors.DEFAULT;
                                                    return (
                                                        <span
                                                            key={p.id}
                                                            className={`px-2 py-0.5 rounded-md text-xs border ${color}`}
                                                        >
                                                            {p.container_type}:
                                                            ₱{p.price}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <span className="text-slate-400 text-xs">
                                                NO PRICING
                                            </span>
                                        )}
                                    </div>
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
                        {/* View Ship → now opens ViewShip modal */}
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
