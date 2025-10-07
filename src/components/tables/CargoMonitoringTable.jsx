// components/tables/CargoMonitoringTable.jsx
import { useMemo, useState } from "react";
import { CalendarPlus2, Check, X, Ship } from "lucide-react";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import { toast } from "react-hot-toast";

// Custom Hooks
import useTable from "../../utils/hooks/useTable";
import usePagination from "../../utils/hooks/usePagination";

// Utils
import {
    toCaps,
    getStatusBadge,
    getModeBadge
} from "../../utils/helpers/tableDataFormatters";

// Stores
import useBookingStore from "../../utils/store/useBookingStore";
import useContainerStore from "../../utils/store/useContainerStore";

// Components
import DataTable from "./DataTable";

const CargoMonitoringTable = ({ data, rightAction, onSelectionChange }) => {
    const [editingCell, setEditingCell] = useState(null);
    const [tempDate, setTempDate] = useState(null);

    const { updateBookingStatusHistory } = useBookingStore();
    const { updateContainer, markContainerAsReturned } = useContainerStore();

    // Helper function to get history date
    const getHistoryDate = (booking, status) => {
        if (!booking.status_history || !Array.isArray(booking.status_history)) {
            return "--";
        }
        const entry = booking.status_history.find(h => h.status === status);
        return entry ? new Date(entry.status_date).toLocaleDateString() : "--";
    };

    // Date editing handlers
    const handleEditDate = (bookingId, dateType, containerId = null) => {
        setEditingCell({ bookingId, dateType, containerId });
        setTempDate(null);
    };
    
    const handleSaveDate = async (bookingId, dateType, containerId = null, shippingLineId = null) => {
        if (!tempDate) {
            setEditingCell(null);
            return;
        }

        try {
            if (dateType === "empty_return") {
                const result = await updateContainer(containerId, {
                    isReturned: true,
                    returnedDate: new Date(tempDate).toISOString(),
                    shippingLineId
                });

                if (result.success) {
                    toast.success("Container return date updated");
                } else {
                    toast.error(result.error || "Failed to update return date");
                }

                setEditingCell(null);
                setTempDate(null);
                return;
            }

            const statusMap = {
                origin_pickup: "LOADED_TO_TRUCK",
                origin_port_arrival: "ARRIVED_ORIGIN_PORT",
                stuffing_date: "LOADED_TO_SHIP",
                atd: "IN_TRANSIT",
                ata: "ARRIVED_DESTINATION_PORT",
                dest_port_pickup: "OUT_FOR_DELIVERY",
                dest_delivery: "DELIVERED"
            };

            const status = statusMap[dateType];
            const result = await updateBookingStatusHistory(bookingId, status, tempDate);

            if (result.success) {
                toast.success("Date updated successfully");
            } else {
                toast.error(result.error || "Failed to update date");
            }

            setEditingCell(null);
            setTempDate(null);
        } catch (error) {
            console.error("Failed to update date:", error);
            toast.error("Failed to update date");
        }
    };

    const handleCancelEdit = () => {
        setEditingCell(null);
        setTempDate(null);
    };

    // Date Cell Component
    const DateCell = ({
        booking,
        dateType,
        currentDate,
        containerId = null,
        label
    }) => {
        const isEditing =
            editingCell?.bookingId === booking.id &&
            editingCell?.dateType === dateType &&
            (editingCell?.containerId ?? null) === (containerId ?? null);

        if (isEditing) {
            return (
                <div className="flex items-center gap-1">
                    <Datetime
                        value={tempDate}
                        onChange={setTempDate}
                        dateFormat="MM/DD/YYYY"
                        timeFormat={false}
                        inputProps={{
                            className: "border rounded px-2 py-1 w-28",
                            placeholder: "Select date"
                        }}
                    />
                    <button
                        onClick={() =>
                            handleSaveDate(
                                booking.id,
                                dateType,
                                containerId,
                                booking.shipping_line_id
                            )
                        }
                        className="p-1 text-green-600 bg-green-100 rounded"
                    >
                        <Check className="h-4 w-4" />
                    </button>
                    <button
                        onClick={handleCancelEdit}
                        className="p-1 text-red-600 bg-red-100 rounded"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            );
        }

        return (
            <div className="flex items-center gap-2">
                <span>
                    {label} {currentDate}
                </span>
                <button
                    onClick={() =>
                        handleEditDate(booking.id, dateType, containerId)
                    }
                    className="p-1 text-slate-600 hover:bg-slate-50 rounded"
                >
                    <CalendarPlus2 className="h-4 w-4" />
                </button>
            </div>
        );
    };

    // Table Columns Definition
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
                    <span className="font-medium">
                        {toCaps(row.original.hwb_number)}
                    </span>
                )
            },
            {
                accessorKey: "shipper",
                header: "SHIPPER",
                cell: ({ row }) => <span>{toCaps(row.original.shipper)}</span>
            },
            {
                id: "volume",
                header: "VOLUME",
                cell: ({ row }) => {
                    const containers = row.original.containers || [];
                    if (!containers.length) return <span>---</span>;

                    const containerGroups = containers.reduce((acc, c) => {
                        if (!acc[c.size]) acc[c.size] = 0;
                        acc[c.size]++;
                        return acc;
                    }, {});

                    return (
                        <span className="font-medium">
                            {Object.entries(containerGroups)
                                .map(
                                    ([size, count]) =>
                                        `${count}X${toCaps(size)}`
                                )
                                .join(", ")}
                        </span>
                    );
                }
            },
            {
                id: "van_numbers",
                header: "VAN#",
                cell: ({ row }) => {
                    const containers = row.original.containers || [];
                    if (!containers.length) return <span>--</span>;
                    return (
                        <div className="flex flex-col gap-1">
                            {containers.map((c, idx) => (
                                <div key={idx} className="font-mono">
                                    {toCaps(c.van_number)}
                                </div>
                            ))}
                        </div>
                    );
                }
            },
            {
                id: "origin_trucker_dates",
                header: "ORIGIN TRUCKER DATES",
                cell: ({ row }) => {
                    const pickupDate = getHistoryDate(
                        row.original,
                        "LOADED_TO_TRUCK"
                    );
                    const portArrivalDate = getHistoryDate(
                        row.original,
                        "ARRIVED_ORIGIN_PORT"
                    );
                    return (
                        <div className="flex flex-col gap-1">
                            <DateCell
                                booking={row.original}
                                dateType="origin_pickup"
                                currentDate={pickupDate}
                                label="PICKEDUP:"
                            />
                            <DateCell
                                booking={row.original}
                                dateType="origin_port_arrival"
                                currentDate={portArrivalDate}
                                label="PORT ARRIVAL:"
                            />
                        </div>
                    );
                }
            },
            {
                id: "stuffing_date",
                header: "STUFFING DATE",
                cell: ({ row }) => {
                    const stuffingDate = getHistoryDate(
                        row.original,
                        "LOADED_TO_SHIP"
                    );
                    return (
                        <DateCell
                            booking={row.original}
                            dateType="stuffing_date"
                            currentDate={stuffingDate}
                            label="STUFFED:"
                        />
                    );
                }
            },
            {
                id: "shipping_dates",
                header: "SHIPPING DATES",
                cell: ({ row }) => {
                    const atdDate = getHistoryDate(row.original, "IN_TRANSIT");
                    const ataDate = getHistoryDate(
                        row.original,
                        "ARRIVED_DESTINATION_PORT"
                    );
                    return (
                        <div className="flex flex-col gap-1">
                            <DateCell
                                booking={row.original}
                                dateType="atd"
                                currentDate={atdDate}
                                label="ATD:"
                            />
                            <DateCell
                                booking={row.original}
                                dateType="ata"
                                currentDate={ataDate}
                                label="ATA:"
                            />
                        </div>
                    );
                }
            },
            {
                id: "destination_trucker_dates",
                header: "DEST. TRUCKER DATES",
                cell: ({ row }) => {
                    const portPickupDate = getHistoryDate(
                        row.original,
                        "OUT_FOR_DELIVERY"
                    );
                    const deliveryDate = getHistoryDate(
                        row.original,
                        "DELIVERED"
                    );
                    return (
                        <div className="flex flex-col gap-1">
                            <DateCell
                                booking={row.original}
                                dateType="dest_port_pickup"
                                currentDate={portPickupDate}
                                label="PORT PICKUP:"
                            />
                            <DateCell
                                booking={row.original}
                                dateType="dest_delivery"
                                currentDate={deliveryDate}
                                label="DELIVERED: "
                            />
                        </div>
                    );
                }
            },
            {
                id: "empty_return",
                header: "EMPTY CONTAINER RETURN",
                cell: ({ row }) => {
                    const containers = row.original.containers || [];
                    if (!containers.length) return <span>--</span>;

                    return (
                        <div className="flex flex-col gap-2">
                            {containers.map((c, idx) => {
                                const returnDate = c.is_returned
                                    ? editingCell?.containerId === c.id && tempDate
                                        ? new Date(tempDate).toLocaleDateString()
                                        : c.returned_date
                                        ? new Date(c.returned_date).toLocaleDateString()
                                        : "--"
                                    : "--";

                                return (
                                    <div key={idx} className="flex items-start gap-2">
                                        <DateCell
                                            booking={row.original}
                                            dateType="empty_return"
                                            containerId={c.id}
                                            label={
                                                <div className="flex flex-col">
                                                    <span className="font-medium">
                                                        VAN# {c.van_number}
                                                    </span>
                                                    <span className="text-gray-600">
                                                        RETURNED: {returnDate}
                                                    </span>
                                                </div>
                                            }
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    );
                }
            },
            {
                accessorKey: "route",
                header: "ROUTE",
                cell: ({ row }) => (
                    <div>
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
                    </div>
                )
            },
            {
                accessorKey: "booking_mode",
                header: "MODE OF SERVICE",
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
                header: "STATUS",
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
        [editingCell, tempDate]
    );

    // Use custom hooks
    const { table, globalFilter, setGlobalFilter } = useTable({
        data,
        columns
    });
    const { paginationInfo, actions } = usePagination(table, data?.length);

    return (
        <DataTable
            table={table}
            columns={columns}
            data={data}
            title="Cargo Monitoring"
            rightAction={rightAction}
            searchPlaceholder="Search cargo records..."
            onSelectionChange={onSelectionChange}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            paginationInfo={paginationInfo}
            paginationActions={actions}
        />
    );
};

export default CargoMonitoringTable;