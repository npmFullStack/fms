// components/tables/BookingTable.jsx
import { useMemo, useEffect } from "react";
import { Clipboard } from "lucide-react";
import useTable from "../../utils/hooks/useTable";
import usePagination from "../../utils/hooks/usePagination";
import {
    toCaps,
    getStatusBadge,
    getModeBadge
} from "../../utils/helpers/tableDataFormatters";
import DataTable from "./DataTable";

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
    accessorKey: "booking_date",
    header: "Booking Date",
    cell: ({ row }) => (
        <span className="table-text">
            {row.original.booking_date
                ? new Date(row.original.booking_date).toLocaleDateString()
                : "—"}
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
                        {row.original.shipper_phone && (
                            <div className="table-subtext">
                                {toCaps(row.original.shipper_phone)}
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
        <DataTable
            table={table}
            columns={columns}
            data={data}
            title="Bookings"
            rightAction={rightAction}
            searchPlaceholder="Search bookings..."
            onSelectionChange={onSelectionChange}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            paginationInfo={paginationInfo}
            paginationActions={actions}
        />
    );
};

export default BookingTable;