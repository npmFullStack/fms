import { useMemo, useEffect } from "react";
import { Ship, Truck, Image as ImageIcon } from "lucide-react";
import useTable from "../../utils/hooks/useTable";
import usePagination from "../../utils/hooks/usePagination";
import { toCaps, formatCurrency } from "../../utils/helpers/tableDataFormatters";
import DataTable from "./DataTable";

const IncidentTable = ({ data, rightAction, onSelectionChange }) => {
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
        accessorKey: "image_url",
        header: "Image",
        cell: ({ row }) => (
          <div className="flex justify-center">
            {row.original.image_url ? (
              <img
                src={row.original.image_url}
                alt="Incident"
                className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : (
              <div className="w-16 h-16 rounded-lg border border-gray-200 bg-gray-100 flex items-center justify-center">
                <ImageIcon className="h-6 w-6 text-gray-400" />
              </div>
            )}
          </div>
        )
      },
{
  accessorKey: "type",
  header: "Type",
  cell: ({ row }) => {
    const { label, bg, text, icon: Icon } = getIncidentTypeBadge(row.original.type);
    return (
      <div className={`badge ${bg} ${text} inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase w-24 justify-center`}>
        {label}
        <Icon className="h-3 w-3" />
      </div>
    );
  }
},
      {
        accessorKey: "booking_number",
        header: "Booking #",
        cell: ({ row }) => (
          <span className="table-text-bold">
            {toCaps(row.original.booking_number || "—")}
          </span>
        )
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
          <div className="max-w-xs">
            <p className="table-text truncate" title={row.original.description}>
              {toCaps(row.original.description)}
            </p>
          </div>
        )
      },
      {
        accessorKey: "total_cost",
        header: "Total Cost",
        cell: ({ row }) => (
          <span className="table-text-bold text-red-600">
            {formatCurrency(row.original.total_cost)}
          </span>
        )
      },
      {
        accessorKey: "created_at",
        header: "Reported Date",
        cell: ({ row }) => (
          <span className="table-text">
            {row.original.created_at
              ? new Date(row.original.created_at).toLocaleDateString()
              : "—"}
          </span>
        )
      }
      // Actions column removed as requested
    ],
    [] // Removed onEdit, onDelete dependencies
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
      title="Incidents"
      rightAction={rightAction}
      searchPlaceholder="Search incidents..."
      onSelectionChange={onSelectionChange}
      globalFilter={globalFilter}
      setGlobalFilter={setGlobalFilter}
      paginationInfo={paginationInfo}
      paginationActions={actions}
    />
  );
};

// Helper function for incident type badges
const getIncidentTypeBadge = (type) => {
  switch (type) {
    case "SEA":
      return {
        label: "SEA",
        bg: "bg-blue-100 border border-blue-700",
        text: "text-blue-700",
        icon: Ship
      };
    case "LAND":
      return {
        label: "LAND", 
        bg: "bg-orange-100 border border-orange-700",
        text: "text-orange-700",
        icon: Truck
      };
    default:
      return {
        label: "UNKNOWN",
        bg: "bg-gray-100 border border-gray-700",
        text: "text-gray-700",
        icon: ImageIcon
      };
  }
};

export default IncidentTable;