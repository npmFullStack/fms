// src/components/modals/booking/BookingStep5.jsx
import { useWatch } from "react-hook-form";
import { getPortByValue } from "../../../utils/helpers/shipRoutes";
import useTruckStore from "../../../utils/store/useTruckStore";
import useShipStore from "../../../utils/store/useShipStore";

const bookingModes = {
  DOOR_TO_DOOR: "Door to Door (D-D)",
  PIER_TO_PIER: "Port to Port (P-P)",
  CY_TO_DOOR: "Customer Yard to Door (CY-D)",
  DOOR_TO_CY: "Door to Customer Yard (D-CY)",
  CY_TO_CY: "Customer Yard to Customer Yard (CY-CY)",
};

const BookingStep5 = ({ control, partners = [] }) => {
  const data = useWatch({ control });
  const { trucks } = useTruckStore();
  const { ships } = useShipStore();


  // Ports
  const originPort = data.origin_port
    ? getPortByValue(data.origin_port)
    : null;
  const destinationPort = data.destination_port
    ? getPortByValue(data.destination_port)
    : null;

  // Ship
  const getShipLabel = (id) => {
    if (!id) return "—";
    const ship = ships.find((s) => String(s.id) === String(id));
    return ship ? ship.vessel_number || `Ship ${ship.id}` : "—";
  };

  // Trucking company
  const getCompanyName = (id) => {
    if (!id || !Array.isArray(partners)) return "—";
    const company = partners.find((p) => String(p.id) === String(id));
    return company ? company.name : "—";
  };

  // Truck
  const getTruckLabel = (id) => {
    if (!id) return "";
    const truck = trucks.find((t) => String(t.id) === String(id));
    return truck ? `${truck.plate_number} (${truck.name || "Truck"})` : "";
  };

  // Find selected container by ID
  const selectedContainer = ships
    .flatMap((s) => s.containers || [])
    .find((c) => String(c.id) === String(data.container_id));

  // Format container info
  const formatContainerInfo = () => {
    if (selectedContainer) {
      return `${selectedContainer.size} - ${selectedContainer.van_number}`;
    }
    return data.van_number || "—";
  };

  return (
    <div className="p-3 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-bold text-blue-800 border-b pb-2">
          Review Booking Details
        </h3>

        {/* Shipper Info */}
        <div className="bg-white p-3 rounded border mt-3">
          <h4 className="font-semibold text-blue-700 mb-2">
            Shipper Information
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-600 text-xs">Company/Shipper:</span>
              <p className="font-medium truncate">{data.shipper || "—"}</p>
            </div>
            <div>
              <span className="text-gray-600 text-xs">Contact:</span>
              <p className="font-medium truncate">
                {data.first_name || "—"} {data.last_name || ""}
              </p>
            </div>
            <div>
              <span className="text-gray-600 text-xs">Phone:</span>
              <p className="font-medium truncate">{data.phone || "—"}</p>
            </div>
            {/* Van Number */}
            {data.van_number && (
              <div className="col-span-2">
                <span className="text-gray-600 text-xs">Van Number:</span>
                <p className="font-medium truncate">{data.van_number}</p>
              </div>
            )}
          </div>
        </div>

        {/* Shipment Info */}
        <div className="bg-white p-3 rounded border mt-3">
          <h4 className="font-semibold text-blue-700 mb-2">
            Shipment Details
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-600 text-xs">Container:</span>
              <p className="font-medium">{formatContainerInfo()}</p>
            </div>
            <div>
              <span className="text-gray-600 text-xs">Mode:</span>
              <p className="font-medium">
                {bookingModes[data.booking_mode] ||
                  data.booking_mode ||
                  "—"}
              </p>
            </div>
            <div className="col-span-2">
              <span className="text-gray-600 text-xs">Route:</span>
              <p className="font-medium">
                {originPort?.label || data.origin_port || "—"} →{" "}
                {destinationPort?.label || data.destination_port || "—"}
              </p>
            </div>
            <div>
              <span className="text-gray-600 text-xs">Commodity:</span>
              <p className="font-medium truncate">{data.commodity || "—"}</p>
            </div>
            <div>
              <span className="text-gray-600 text-xs">Vessel:</span>
              <p className="font-medium truncate">
                {getShipLabel(data.ship_id)}
              </p>
            </div>
            <div>
              <span className="text-gray-600 text-xs">Departure Date:</span>
              <p className="font-medium truncate">{data.preferred_departure || "—"}</p>
            </div>
            <div>
              <span className="text-gray-600 text-xs">Delivery Date:</span>
              <p className="font-medium truncate">{data.preferred_delivery || "—"}</p>
            </div>
          </div>
        </div>

        {/* Trucking Info */}
        {!data.skipTrucking && (
          <div className="bg-white p-3 rounded border mt-3">
            <h4 className="font-semibold text-blue-700 mb-2">
              Trucking Information
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600 text-xs">Pickup Company:</span>
                <p className="font-medium truncate">
                  {getCompanyName(data.pickup_trucker_id)}
                  {data.pickup_truck_id && (
                    <span className="text-xs text-gray-500 block">
                      Vehicle: {getTruckLabel(data.pickup_truck_id)}
                    </span>
                  )}
                </p>
              </div>
              <div>
                <span className="text-gray-600 text-xs">Delivery Company:</span>
                <p className="font-medium truncate">
                  {getCompanyName(data.delivery_trucker_id)}
                  {data.delivery_truck_id && (
                    <span className="text-xs text-gray-500 block">
                      Vehicle: {getTruckLabel(data.delivery_truck_id)}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-yellow-50 p-3 rounded border border-yellow-200 text-xs mt-3">
          <p className="text-yellow-800">
            Please review all details carefully before clicking{" "}
            <strong>Create Booking</strong>.
          </p>
        </div>
      </div>
  
  );
};

export default BookingStep5;