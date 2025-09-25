// components/tables/CargoMonitoringTable.jsx
import { useMemo, useEffect } from "react";
import { flexRender } from "@tanstack/react-table";
import {
    ChevronUpIcon,
    ChevronDownIcon,
    CubeIcon
} from "@heroicons/react/24/outline";
import useTable from "../../utils/hooks/useTable";
import usePagination from "../../utils/hooks/usePagination";
import { toCaps, getModeBadge } from "../../utils/helpers/tableDataFormatters";
import usePartnerStore from "../../utils/store/usePartnerStore";

const CargoMonitoringTable = ({ data, rightAction, onSelectionChange }) => {
    const { partners, fetchPartners } = usePartnerStore();

    useEffect(() => {
        // Fetch partners to get trucking company names
        fetchPartners();
    }, [fetchPartners]);

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
                header: "HWB#",
                cell: ({ row }) => (
                    <span className="table-cell">
                        {toCaps(row.original.hwb_number)}
                    </span>
                )
            },
            {
                accessorKey: "shipper",
                header: "Shipper",
                cell: ({ row }) => (
                    <span className="table-cell">
                        {toCaps(row.original.shipper)}
                    </span>
                )
            },
            {
                accessorKey: "pickup_stuffing",
                header: "Stuffing/Pickup date",
                cell: () => <span className="table-cell">—</span> // manual input later
            },
            {
                id: "volume",
                header: "Volume",
                cell: ({ row }) => {
                    const containers = row.original.containers || [];
                    if (!containers.length)
                        return <span className="table-cell">—</span>;
                    const containerGroups = containers.reduce(
                        (acc, container) => {
                            if (!acc[container.size]) {
                                acc[container.size] = 0;
                            }
                            acc[container.size]++;
                            return acc;
                        },
                        {}
                    );

                    // Format as "2x20FT, 1x40FT"
                    const volumeText = Object.entries(containerGroups)
                        .map(([size, count]) => `${count}X${toCaps(size)}`)
                        .join(", ");

                    return <span className="table-cell">{volumeText}</span>;
                }
            },
            {
                id: "commodity_ship",
                header: "Commodity",
                cell: ({ row }) => (
                    <span className="table-cell">
                        {toCaps(row.original.commodity)}
                    </span>
                )
            },
            {
                id: "shipping_line",
                header: "Shipping Line",
                cell: ({ row }) => (
                    <span className="table-cell text-xs text-gray-600">
                        {toCaps(row.original.shipping_line_name)}
                    </span>
                )
            },
            {
                id: "van_numbers",
                header: "van#",
                cell: ({ row }) => {
                    const containers = row.original.containers || [];
                    if (!containers.length)
                        return <span className="table-cell">—</span>;

                    return (
                        <span className="table-cell">
                            <div className="flex flex-col">
                                {containers.map((container, idx) => (
                                    <div key={idx}>
                                        {toCaps(container.van_number)}
                                    </div>
                                ))}
                            </div>
                        </span>
                    );
                }
            },

            {
                accessorKey: "route",
                header: "Route",
                cell: ({ row }) => (
                    <span className="table-cell">
                        <div>
                            <span className="text-yellow-600 font-medium mr-1">
                                ORIGIN:
                            </span>{" "}
                            {toCaps(row.original.origin_port)}
                        </div>
                        <div>
                            <span className="text-blue-600 font-medium mr-1">
                                DEST:
                            </span>{" "}
                            {toCaps(row.original.destination_port)}
                        </div>
                    </span>
                )
            },
            {
                accessorKey: "booking_mode",
                header: "mode of service",
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
                id: "atd",
                header: "atd",
                cell: ({ row }) => (
                    <span className="table-cell">
                        {row.original.actual_departure || "—"}
                    </span>
                )
            },
            {
                id: "ata",
                header: "ata",
                cell: ({ row }) => (
                    <span className="table-cell">
                        {row.original.actual_arrival || "—"}
                    </span>
                )
            },
            {
                id: "trucks",
                header: "truck origin & truck dest.",
                cell: ({ row }) => {
                    // Get trucking company names from partners
                    const getCompanyName = id => {
                        if (!id || !Array.isArray(partners)) return "—";
                        const company = partners.find(
                            p =>
                                String(p.id) === String(id) &&
                                p.type === "trucking"
                        );
                        return company ? toCaps(company.name) : "—";
                    };

                    const pickupCompany = getCompanyName(
                        row.original.pickup_trucker_id
                    );
                    const deliveryCompany = getCompanyName(
                        row.original.delivery_trucker_id
                    );

                    return (
                        <span className="table-cell">
                            <div>
                                <span
                                    className="text-yellow-600 font-medium
                                mr-1"
                                >
                                    ORIGIN:
                                </span>{" "}
                                {pickupCompany}
                            </div>
                            <div>
                                <span className="text-blue-600 font-medium mr-1">
                                    DEST:
                                </span>{" "}
                                {deliveryCompany}
                            </div>
                        </span>
                    );
                }
            },

            {
                id: "delivery",
                header: "Delivery",
                cell: ({ row }) => (
                    <span className="table-cell">
                        {row.original.actual_delivery || "—"}
                    </span>
                )
            },
            {
                id: "empty_return",
                header: "Empty Container Return date",
                cell: ({ row }) => (
                    <span className="table-cell">
                        {row.original.empty_return || "—"}
                    </span>
                )
            }
        ],
        [partners]
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
                        <h2 className="table-title">Cargo Monitoring</h2>
                        <p className="table-count">
                            Total: {paginationInfo.totalItems} records
                        </p>
                    </div>
                    {rightAction}
                </div>
            </div>

            {/* Filter */}
            <div className="filter-bar">
                <input
                    type="text"
                    value={globalFilter ?? ""}
                    onChange={e => setGlobalFilter(e.target.value)}
                    placeholder="Search cargo records..."
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
                                                <ChevronUpIcon className="table-sort-icon" />
                                            )}
                                            {header.column.getIsSorted() ===
                                                "desc" && (
                                                <ChevronDownIcon className="table-sort-icon" />
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
                                        <CubeIcon className="empty-state-icon" />
                                        <h3 className="empty-state-title">
                                            No cargo records found
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

export default CargoMonitoringTable;
