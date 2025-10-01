import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { flexRender } from "@tanstack/react-table";
import {
  ArrowRightCircle,
  Edit2,
  Trash2,
  ChevronUp,
  ChevronDown,
  Ship,
  Truck
} from "lucide-react";

import useTable from "../../utils/hooks/useTable";
import { formatDate } from "../../utils/helpers/formatters";
import usePagination from "../../utils/hooks/usePagination";

const PartnerTable = ({ data, onEdit, onDelete, rightAction, type }) => {
    const navigate = useNavigate();

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
                                className="w-16 h-16 rounded-lg object-cover border-2 border-slate-200"
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center">
                                {type === "shipping" ? (
                                    <Ship className="h-7 w-7 text-slate-400" />
                                ) : (
                                    <Truck className="h-7 w-7 text-slate-400" />
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
                accessorKey: "created_at",
                header: "Created At",
                cell: ({ row }) => (
                    <span className="text-slate-600 text-sm">
                        {formatDate(row.original.created_at)}
                    </span>
                )
            },
            {
                id: "actions",
                header: "Actions",
                cell: ({ row }) => (
                    <div className="flex gap-2">
                        <button
                            onClick={() =>
                                navigate(
                                    row.original.type === "shipping"
                                        ? `/operations/shipping-lines/${row.original.id}`
                                        : `/operations/trucking-companies/${row.original.id}`
                                )
                            }
                            className="action-btn bg-blue-50 text-blue-600 hover:bg-blue-100"
                            title="View Details"
                        >
                            <ArrowRightCircle className="w-5 h-5" />
                        </button>

                        <button
                            onClick={() => onEdit(row.original)}
                            className="action-btn bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                            title="Edit Partner"
                        >
                            <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                            onClick={() => onDelete(row.original)}
                            className={`action-btn ${
                                row.original.is_active
                                    ? "bg-red-50 text-red-600 hover:bg-red-100"
                                    : "bg-green-50 text-green-600 hover:bg-green-100"
                            }`}
                            title={
                                row.original.is_active
                                    ? "Deactivate Partner"
                                    : "Reactivate Partner"
                            }
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                )
            }
        ],
        [navigate, onEdit, onDelete, type]
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
                            {type === "shipping"
                                ? "Shipping Lines"
                                : "Trucking Companies"}
                        </h2>
                        <p className="table-count">
                            Total: {data?.length || 0}{" "}
                            {type === "shipping"
                                ? "shipping lines"
                                : "trucking companies"}
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
                    placeholder={`Search ${
                        type === "shipping"
                            ? "shipping lines"
                            : "trucking companies"
                    }...`}
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
                                        {type === "shipping" ? (
                                            <Ship className="empty-state-icon" />
                                        ) : (
                                            <Truck className="empty-state-icon" />
                                        )}
                                        <h3 className="empty-state-title">
                                            No{" "}
                                            {type === "shipping"
                                                ? "shipping lines"
                                                : "trucking companies"}{" "}
                                            found
                                        </h3>
                                        <p className="empty-state-description">
                                            Try adjusting your search to find
                                            partners.
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

export default PartnerTable;
