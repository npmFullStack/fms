import { useWatch } from "react-hook-form";
import { getPortByValue } from "../../../utils/helpers/shipRoutes";
import useTruckStore from "../../../utils/store/useTruckStore";

const containerTypes = {
    LCL: "LCL",
    "20FT": "1X20",
    "40FT": "1X40",
    "40FT_HC": "1X40 HC"
};

const bookingModes = {
    DOOR_TO_DOOR: "Door to Door (D-D)",
    PIER_TO_PIER: "Port to Port (P-P)",
    CY_TO_DOOR: "CY to Door",
    DOOR_TO_CY: "Door to CY",
    CY_TO_CY: "CY to CY"
};

const BookingStep5 = ({ control, partners = [] }) => {
    const data = useWatch({ control });
    const { trucks } = useTruckStore();

    // Ports (convert from value → label)
    const originPort = data.origin_port
        ? getPortByValue(data.origin_port)
        : null;
    const destinationPort = data.destination_port
        ? getPortByValue(data.destination_port)
        : null;

    // Find trucking company names
    const getCompanyName = id => {
        if (!id || !Array.isArray(partners)) return "N/A";
        const company = partners.find(p => String(p.id) === String(id));
        return company ? company.name : `Company #${id}`;
    };

    // Find truck details
    const getTruckLabel = id => {
        if (!id) return "";
        const truck = trucks.find(t => String(t.id) === String(id));
        return truck
            ? `${truck.plate_number} (${truck.model})`
            : `Truck #${id}`;
    };

    return (
        <div className="space-y-6 text-sm">
            <h3 className="text-lg font-semibold">Review Booking Details</h3>

            {/* Shipper Info */}
            <div>
                <h4 className="font-medium mb-2">Shipper Info</h4>
                <ul className="list-disc list-inside space-y-1">
                    <li>Company/Shipper: {data.shipper}</li>
                    <li>
                        Contact: {data.first_name} {data.last_name}
                    </li>
                    <li>Phone: {data.phone}</li>
                </ul>
            </div>

            {/* Shipment Info */}
            <div>
                <h4 className="font-medium mb-2">Shipment</h4>
                <ul className="list-disc list-inside space-y-1">
                    <li>Booking #: {data.booking_number || "—"}</li>
                    <li>HWB #: {data.hwb_number || "—"}</li>
                    <li>
                        Container: {data.quantity} ×{" "}
                        {containerTypes[data.container_type] ||
                            data.container_type}
                    </li>
                    <li>
                        Mode:{" "}
                        {bookingModes[data.booking_mode] || data.booking_mode}
                    </li>
                    <li>
                        Route: {originPort?.label || data.origin_port} →{" "}
                        {destinationPort?.label || data.destination_port}
                    </li>
                    <li>Commodity: {data.commodity}</li>
                    <li>Ship (Van #): {data.van_number || data.ship_id}</li>
                </ul>
            </div>

            {/* Trucking Info (Only if trucking is not skipped) */}
            {!data.skipTrucking && (
                <div>
                    <h4 className="font-medium mb-2">Trucking</h4>
                    <ul className="list-disc list-inside space-y-1">
                        <li>
                            Pickup Company:{" "}
                            {getCompanyName(data.pickup_trucker_id)}{" "}
                            {data.pickup_truck_id && (
                                <span>
                                    - {getTruckLabel(data.pickup_truck_id)}
                                </span>
                            )}
                        </li>
                        <li>
                            Delivery Company:{" "}
                            {getCompanyName(data.delivery_trucker_id)}{" "}
                            {data.delivery_truck_id && (
                                <span>
                                    - {getTruckLabel(data.delivery_truck_id)}
                                </span>
                            )}
                        </li>
                    </ul>
                </div>
            )}

            <p className="text-gray-600 text-xs">
                Please review all details carefully before clicking{" "}
                <strong>Create Booking</strong>.
            </p>
        </div>
    );
};

export default BookingStep5;
