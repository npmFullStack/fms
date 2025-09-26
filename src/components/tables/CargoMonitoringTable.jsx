// components/tables/CargoMonitoringTable.jsx
import { useMemo, useEffect, useState } from "react";
import { flexRender } from "@tanstack/react-table";
import {
    ChevronUpIcon,
    ChevronDownIcon,
    CubeIcon,
    ClockIcon
} from "@heroicons/react/24/outline";
import useTable from "../../utils/hooks/useTable";
import usePagination from "../../utils/hooks/usePagination";
import {
    toCaps,
    getStatusBadge,
    getModeBadge
} from "../../utils/helpers/tableDataFormatters";
import usePartnerStore from "../../utils/store/usePartnerStore";
import useCourierStore from "../../utils/store/useCourierStore";

const CargoMonitoringTable = ({ data, rightAction, onSelectionChange }) => {
    const { partners, fetchPartners } = usePartnerStore();
    const { courierData, fetchShippingTimeline, setCourierData } =
        useCourierStore();
    const [loadingTimelines, setLoadingTimelines] = useState({});

    useEffect(() => {
        fetchPartners();
    }, [fetchPartners]);

    // Fetch shipping timeline when data changes
    useEffect(() => {
        const fetchTimelines = async () => {
            for (const booking of data) {
                if (booking.hwb_number && !courierData[booking.id]) {
                    setLoadingTimelines(prev => ({
                        ...prev,
                        [booking.id]: true
                    }));
                    try {
                        const result = await fetchShippingTimeline(
                            booking.hwb_number
                        );
                        if (result.success) {
                            setCourierData(booking.id, result.data);
                        }
                    } catch (error) {
                        console.error(
                            `Failed to fetch timeline for booking ${booking.id}:`,
                            error
                        );
                    } finally {
                        setLoadingTimelines(prev => ({
                            ...prev,
                            [booking.id]: false
                        }));
                    }
                }
            }
        };

        if (data.length > 0) {
            fetchTimelines();
        }
    }, [data, courierData, fetchShippingTimeline, setCourierData]);

    const getTimelineEvent = (bookingId, eventType) => {
        const timeline = courierData[bookingId]?.booking?.timeline || [];
        const event = timeline.find(item => item.event_type === eventType);
        return event ? new Date(event.event_date).toLocaleDateString() : "--";
    };

    const getEmptyReturnDate = booking => {
        // Use is_returned column from containers
        const containers = booking.containers || [];
        const returnedContainer = containers.find(
            container => container.is_returned
        );
        if (returnedContainer) {
            return booking.actual_delivery
                ? new Date(booking.actual_delivery).toLocaleDateString()
                : "--";
        }
        return "--";
    };

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
                    <span className="table-cell font-medium">
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
                id: "origin_trucker_dates",
                header: "Origin Trucker Dates",
                cell: ({ row }) => {
                    const timeline =
                        courierData[row.original.id]?.booking?.timeline || [];

                    // Find relevant dates from timeline
                    const gateOutEmpty = timeline.find(
                        item =>
                            item.event_type === "GATE_OUT_EMPTY" ||
                            item.description?.includes("Gate out Empty")
                    );

                    const gateIn = timeline.find(
                        item =>
                            item.event_type === "GATE_IN" ||
                            item.description?.includes("Gate in")
                    );

                    return (
                        <span className="table-cell text-xs">
                            <div className="flex flex-col gap-1">
                                <div>
                                    <span className="font-medium text-gray-600">
                                        Pickup:{" "}
                                    </span>
                                    {gateOutEmpty
                                        ? new Date(
                                              gateOutEmpty.event_date
                                          ).toLocaleDateString()
                                        : "--"}
                                </div>
                                <div>
                                    <span className="font-medium text-gray-600">
                                        Port Arrival:{" "}
                                    </span>
                                    {gateIn
                                        ? new Date(
                                              gateIn.event_date
                                          ).toLocaleDateString()
                                        : "--"}
                                </div>
                            </div>
                        </span>
                    );
                }
            },
            {
                id: "volume",
                header: "Volume",
                cell: ({ row }) => {
                    const containers = row.original.containers || [];
                    if (!containers.length)
                        return <span className="table-cell">---</span>;

                    const containerGroups = containers.reduce(
                        (acc, container) => {
                            if (!acc[container.size]) acc[container.size] = 0;
                            acc[container.size]++;
                            return acc;
                        },
                        {}
                    );

                    const volumeText = Object.entries(containerGroups)
                        .map(([size, count]) => `${count}X${toCaps(size)}`)
                        .join(", ");

                    return (
                        <span className="table-cell font-medium">
                            {volumeText}
                        </span>
                    );
                }
            },
            {
                id: "van_numbers",
                header: "Van#",
                cell: ({ row }) => {
                    const containers = row.original.containers || [];
                    if (!containers.length)
                        return <span className="table-cell">--</span>;

                    return (
                        <span className="table-cell">
                            <div className="flex flex-col gap-1">
                                {containers.map((container, idx) => (
                                    <div
                                        key={idx}
                                        className="text-xs font-mono"
                                    >
                                        {toCaps(container.van_number)}
                                    </div>
                                ))}
                            </div>
                        </span>
                    );
                }
            },
            {
                id: "shipping_dates",
                header: "Shipping Dates",
                cell: ({ row }) => (
                    <span className="table-cell text-xs">
                        <div className="flex flex-col gap-1">
                            <div>
                                <span className="font-medium text-gray-600">
                                    ATD:{" "}
                                </span>
                                {row.original.actual_departure
                                    ? new Date(
                                          row.original.actual_departure
                                      ).toLocaleDateString()
                                    : "--"}
                            </div>
                            <div>
                                <span className="font-medium text-gray-600">
                                    ATA:{" "}
                                </span>
                                {row.original.actual_arrival
                                    ? new Date(
                                          row.original.actual_arrival
                                      ).toLocaleDateString()
                                    : "--"}
                            </div>
                        </div>
                    </span>
                )
            },
            {
                id: "destination_trucker_dates",
                header: "Dest. Trucker Dates",
                cell: ({ row }) => {
                    const timeline =
                        courierData[row.original.id]?.booking?.timeline || [];

                    const gateOutDelivery = timeline.find(
                        item =>
                            item.event_type === "GATE_OUT_DELIVERY" ||
                            item.description?.includes("Gate out for Delivery")
                    );

                    const emptyReturn = timeline.find(
                        item =>
                            item.event_type === "EMPTY_RETURN" ||
                            item.description?.includes("Empty Container Return")
                    );

                    return (
                        <span className="table-cell text-xs">
                            <div className="flex flex-col gap-1">
                                <div>
                                    <span className="font-medium text-gray-600">
                                        Port Pickup:{" "}
                                    </span>
                                    {gateOutDelivery
                                        ? new Date(
                                              gateOutDelivery.event_date
                                          ).toLocaleDateString()
                                        : "--"}
                                </div>
                                <div>
                                    <span className="font-medium text-gray-600">
                                        Delivery:{" "}
                                    </span>
                                    {row.original.actual_delivery
                                        ? new Date(
                                              row.original.actual_delivery
                                          ).toLocaleDateString()
                                        : "--"}
                                </div>
                            </div>
                        </span>
                    );
                }
            },
            {
                id: "empty_return",
                header: "Empty Return",
                cell: ({ row }) => (
                    <span className="table-cell">
                        {loadingTimelines[row.original.id] ? (
                            <ClockIcon className="h-4 w-4 animate-spin" />
                        ) : (
                            getEmptyReturnDate(row.original)
                        )}
                    </span>
                )
            },
            {
                accessorKey: "route",
                header: "Route",
                cell: ({ row }) => (
                    <span className="table-cell text-xs">
                        <div>
                            <span className="text-yellow-600 font-medium mr-1">
                                ORIGIN:
                            </span>
                            {toCaps(row.original.origin_port)}
                        </div>
                        <div>
                            <span className="text-blue-600 font-medium mr-1">
                                DEST:
                            </span>
                            {toCaps(row.original.destination_port)}
                        </div>
                    </span>
                )
            },
            {
                accessorKey: "booking_mode",
                header: "Mode of service",
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
        [partners, courierData, loadingTimelines]
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
