// components/tables/CargoMonitoringTable.jsx
import { useMemo, useEffect, useState } from "react";
import { flexRender } from "@tanstack/react-table";
import {
  ChevronUp,
  ChevronDown,
  Ship,
  Pencil,
  Check,
  X
} from "lucide-react";

import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import useTable from "../../utils/hooks/useTable";
import usePagination from "../../utils/hooks/usePagination";
import {
  toCaps,
  getStatusBadge,
  getModeBadge
} from "../../utils/helpers/tableDataFormatters";
import api from "../../config/axios";

const CargoMonitoringTable = ({ data, rightAction, onSelectionChange, onDataUpdate }) => {
  const [editingCell, setEditingCell] = useState(null);
  const [tempDate, setTempDate] = useState(null);
  const [bookingHistory, setBookingHistory] = useState({});

  // Fetch history for all bookings
  useEffect(() => {
    const fetchAllHistories = async () => {
      for (const booking of data) {
        if (!bookingHistory[booking.id]) {
          try {
            const res = await api.get(`/bookings/${booking.id}/history`);
            setBookingHistory(prev => ({
              ...prev,
              [booking.id]: res.data.history || []
            }));
          } catch (error) {
            console.error(`Failed to fetch history for ${booking.id}:`, error);
          }
        }
      }
    };

    if (data.length > 0) {
      fetchAllHistories();
    }
  }, [data]);

  const getHistoryDate = (bookingId, status) => {
    const history = bookingHistory[bookingId] || [];
    const entry = history.find(h => h.status === status);
    return entry ? new Date(entry.status_date).toLocaleDateString() : "--";
  };

  const handleEditDate = (bookingId, dateType) => {
    setEditingCell({ bookingId, dateType });
    setTempDate(null);
  };

  const handleSaveDate = async (bookingId, dateType) => {
    if (!tempDate) {
      setEditingCell(null);
      return;
    }

    try {
      const statusMap = {
        origin_pickup: "LOADED_TO_TRUCK",
        origin_port_arrival: "ARRIVED_ORIGIN_PORT",
        dest_port_pickup: "OUT_FOR_DELIVERY",
        dest_delivery: "DELIVERED"
      };

      const status = statusMap[dateType];
      const history = bookingHistory[bookingId] || [];
      const existingEntry = history.find(h => h.status === status);

      if (existingEntry) {
        // Update existing history entry
        await api.patch(`/bookings/history/${existingEntry.id}`, {
          status_date: tempDate
        });
      } else {
        // Create new history entry
        await api.post(`/bookings/${bookingId}/history`, {
          status,
          status_date: tempDate
        });
      }

      // Refresh history
      const res = await api.get(`/bookings/${bookingId}/history`);
      setBookingHistory(prev => ({
        ...prev,
        [bookingId]: res.data.history || []
      }));

      setEditingCell(null);
      setTempDate(null);

      if (onDataUpdate) {
        onDataUpdate();
      }
    } catch (error) {
      console.error("Failed to update date:", error);
      alert("Failed to update date");
    }
  };

  const handleCancelEdit = () => {
    setEditingCell(null);
    setTempDate(null);
  };

  const DateCell = ({ bookingId, dateType, currentDate }) => {
    const isEditing = editingCell?.bookingId === bookingId && editingCell?.dateType === dateType;

    if (isEditing) {
      return (
        <div className="flex items-center gap-1">
          <Datetime
            value={tempDate}
            onChange={setTempDate}
            dateFormat="MM/DD/YYYY"
            timeFormat={false}
            inputProps={{
              className: "border rounded px-2 py-1 text-xs w-24",
              placeholder: "Select date"
            }}
          />
          <button
            onClick={() => handleSaveDate(bookingId, dateType)}
            className="p-1 text-green-600 hover:bg-green-50 rounded"
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            onClick={handleCancelEdit}
            className="p-1 text-red-600 hover:bg-red-50 rounded"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 group">
        <span>{currentDate}</span>
        {currentDate !== "--" && (
          <button
            onClick={() => handleEditDate(bookingId, dateType)}
            className="opacity-0 group-hover:opacity-100 p-1 text-blue-600 hover:bg-blue-50 rounded transition-opacity"
          >
            <Pencil className="h-3 w-3" />
          </button>
        )}
      </div>
    );
  };

  const columns = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllRowsSelected?.()}
            onChange={e => table.toggleAllRowsSelected?.(e.target.checked)}
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
        header: "SHIPPER",
        cell: ({ row }) => (
          <span className="table-cell">{toCaps(row.original.shipper)}</span>
        )
      },
      {
        id: "volume",
        header: "VOLUME",
        cell: ({ row }) => {
          const containers = row.original.containers || [];
          if (!containers.length)
            return <span className="table-cell">---</span>;

          const containerGroups = containers.reduce((acc, container) => {
            if (!acc[container.size]) acc[container.size] = 0;
            acc[container.size]++;
            return acc;
          }, {});

          const volumeText = Object.entries(containerGroups)
            .map(([size, count]) => `${count}X${toCaps(size)}`)
            .join(", ");

          return <span className="table-cell font-medium">{volumeText}</span>;
        }
      },
      {
        id: "van_numbers",
        header: "VAN#",
        cell: ({ row }) => {
          const containers = row.original.containers || [];
          if (!containers.length)
            return <span className="table-cell">--</span>;

          return (
            <span className="table-cell">
              <div className="flex flex-col gap-1">
                {containers.map((container, idx) => (
                  <div key={idx} className="text-xs font-mono">
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
        header: "SHIPPING DATES",
        cell: ({ row }) => (
          <span className="table-cell text-xs">
            <div className="flex flex-col gap-1">
              <div>
                <span className="font-medium text-gray-600">ATD: </span>
                {row.original.actual_departure
                  ? new Date(row.original.actual_departure).toLocaleDateString()
                  : "--"}
              </div>
              <div>
                <span className="font-medium text-gray-600">ATA: </span>
                {row.original.actual_arrival
                  ? new Date(row.original.actual_arrival).toLocaleDateString()
                  : "--"}
              </div>
            </div>
          </span>
        )
      },
      {
        id: "origin_trucker_dates",
        header: "ORIGIN TRUCKER DATES",
        cell: ({ row }) => {
          const pickupDate = getHistoryDate(row.original.id, "LOADED_TO_TRUCK");
          const portArrivalDate = getHistoryDate(row.original.id, "ARRIVED_ORIGIN_PORT");

          return (
            <span className="table-cell text-xs">
              <div className="flex flex-col gap-1">
                <div>
                  <span className="font-medium text-gray-600">PICKUP: </span>
                  <DateCell
                    bookingId={row.original.id}
                    dateType="origin_pickup"
                    currentDate={pickupDate}
                  />
                </div>
                <div>
                  <span className="font-medium text-gray-600">PORT ARRIVAL: </span>
                  <DateCell
                    bookingId={row.original.id}
                    dateType="origin_port_arrival"
                    currentDate={portArrivalDate}
                  />
                </div>
              </div>
            </span>
          );
        }
      },
      {
        id: "destination_trucker_dates",
        header: "DEST. TRUCKER DATES",
        cell: ({ row }) => {
          const portPickupDate = getHistoryDate(row.original.id, "OUT_FOR_DELIVERY");
          const deliveryDate = getHistoryDate(row.original.id, "DELIVERED");

          return (
            <span className="table-cell text-xs">
              <div className="flex flex-col gap-1">
                <div>
                  <span className="font-medium text-gray-600">PORT PICKUP: </span>
                  <DateCell
                    bookingId={row.original.id}
                    dateType="dest_port_pickup"
                    currentDate={portPickupDate}
                  />
                </div>
                <div>
                  <span className="font-medium text-gray-600">DELIVERY: </span>
                  <DateCell
                    bookingId={row.original.id}
                    dateType="dest_delivery"
                    currentDate={deliveryDate}
                  />
                </div>
              </div>
            </span>
          );
        }
      },
      {
        id: "empty_return",
        header: "EMPTY RETURN",
        cell: ({ row }) => {
          const containers = row.original.containers || [];
          const returnedContainer = containers.find(c => c.is_returned);
          const returnDate = returnedContainer && row.original.actual_delivery
            ? new Date(row.original.actual_delivery).toLocaleDateString()
            : "--";

          return <span className="table-cell">{returnDate}</span>;
        }
      },
      {
        accessorKey: "route",
        header: "ROUTE",
        cell: ({ row }) => (
          <span className="table-cell text-xs">
            <div>
              <span className="text-yellow-600 font-medium mr-1">ORIGIN:</span>
              {toCaps(row.original.origin_port)}
            </div>
            <div>
              <span className="text-blue-600 font-medium mr-1">DEST:</span>
              {toCaps(row.original.destination_port)}
            </div>
          </span>
        )
      },
      {
        accessorKey: "booking_mode",
        header: "MODE OF SERVICE",
        cell: ({ row }) => {
          const { label, bg, text } = getModeBadge(row.original.booking_mode);
          return <span className={`badge ${bg} ${text}`}>{label}</span>;
        }
      },
      {
        accessorKey: "status",
        header: "STATUS",
        cell: ({ row }) => {
          const { label, bg, text } = getStatusBadge(row.original.status);
          return <span className={`badge ${bg} ${text}`}>{label}</span>;
        }
      }
    ],
    [bookingHistory, editingCell, tempDate]
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
      <div className="table-header-container">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="table-title">Cargo Monitoring</h2>
            <p className="table-count">Total: {paginationInfo.totalItems} records</p>
          </div>
          {rightAction}
        </div>
      </div>

      <div className="filter-bar">
        <input
          type="text"
          value={globalFilter ?? ""}
          onChange={e => setGlobalFilter(e.target.value)}
          placeholder="Search cargo records..."
          className="filter-input"
        />
      </div>

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
                      {header.column.getIsSorted() === "asc" && (
                        <ChevronUp className="table-sort-icon" />
                      )}
                      {header.column.getIsSorted() === "desc" && (
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
                    <td key={cell.id} className="table-cell">
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
                    <Ship className="empty-state-icon" />
                    <h3 className="empty-state-title">No cargo records found</h3>
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

      <div className="table-pagination-container">
        <div className="table-pagination-inner">
          <span className="table-pagination-info">
            Page {paginationInfo.currentPage} of {paginationInfo.totalPages} (
            {paginationInfo.totalItems} total)
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