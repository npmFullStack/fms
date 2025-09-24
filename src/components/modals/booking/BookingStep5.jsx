// src/components/modals/booking/BookingStep5.jsx
import { useWatch } from "react-hook-form";
import { getPortByValue } from "../../../utils/helpers/shipRoutes";
import useTruckStore from "../../../utils/store/useTruckStore";
import { useState, useEffect } from "react";
import api from "../../../config/axios";

const bookingModes = {
    DOOR_TO_DOOR: "Door to Door (D-D)",
    PIER_TO_PIER: "Port to Port (P-P)",
    CY_TO_DOOR: "Customer Yard to Door (CY-D)",
    DOOR_TO_CY: "Door to Customer Yard (D-CY)",
    CY_TO_CY: "Customer Yard to Customer Yard (CY-CY)"
};

const BookingStep5 = ({ control, partners = [] }) => {
    const data = useWatch({ control });
    const { trucks } = useTruckStore();
    const [selectedContainers, setSelectedContainers] = useState([]);

    // Fetch selected containers details
    useEffect(() => {
        const fetchContainerDetails = async () => {
            if (
                data.container_ids &&
                data.container_ids.length > 0 &&
                data.shipping_line_id
            ) {
                try {
                    const response = await api.get(
                        `/containers/available-containers/${data.shipping_line_id}`
                    );
                    const allContainers = response.data.containers || [];
                    const selected = allContainers.filter(container =>
                        data.container_ids.includes(container.id)
                    );
                    setSelectedContainers(selected);
                } catch (error) {
                    console.error("Error fetching container details:", error);
                    setSelectedContainers([]);
                }
            } else {
                setSelectedContainers([]);
            }
        };

        fetchContainerDetails();
    }, [data.container_ids, data.shipping_line_id]);

    // Ports
    const originPort = data.origin_port
        ? getPortByValue(data.origin_port)
        : null;
    const destinationPort = data.destination_port
        ? getPortByValue(data.destination_port)
        : null;

    // Trucking company
    const getCompanyName = id => {
        if (!id || !Array.isArray(partners)) return "—";
        const company = partners.find(p => String(p.id) === String(id));
        return company ? company.name : "—";
    };

    // Truck
    const getTruckLabel = id => {
        if (!id) return "";
        const truck = trucks.find(t => String(t.id) === String(id));
        return truck ? `${truck.plate_number} (${truck.name || "Truck"})` : "";
    };

    // Format volume display
    const formatVolumeInfo = () => {
        if (!selectedContainers.length) return "—";

        // Group containers by size
        const containerGroups = selectedContainers.reduce((acc, container) => {
            if (!acc[container.size]) {
                acc[container.size] = 0;
            }
            acc[container.size]++;
            return acc;
        }, {});

        // Format as "2x20FT, 1x40FT" etc
        return Object.entries(containerGroups)
            .map(([size, count]) => `${count}x${size}`)
            .join(", ");
    };

    // Format container list with van numbers
    const formatContainerList = () => {
        if (!selectedContainers.length) return "—";

        return selectedContainers
            .map(container => `${container.size} (${container.van_number})`)
            .join(", ");
    };
    // Format address for display
    const formatAddress = type => {
        const province = data[`${type}_province`] || "";
        const city = data[`${type}_city`] || "";
        const barangay = data[`${type}_barangay`] || "";
        const street = data[`${type}_street`] || "";

        if (!province && !city && !barangay && !street) return "--";

        return `${street}${street ? ", " : ""}${barangay}${
            barangay ? ", " : ""
        }${city}${city ? ", " : ""}${province}`;
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
                        <span className="text-gray-600 text-xs">
                            Company/Shipper:
                        </span>
                        <p className="font-medium truncate">
                            {data.shipper || "—"}
                        </p>
                    </div>
                    <div>
                        <span className="text-gray-600 text-xs">Contact:</span>
                        <p className="font-medium truncate">
                            {data.first_name || "—"} {data.last_name || ""}
                        </p>
                    </div>
                    <div className="col-span-2">
                        <span className="text-gray-600 text-xs">Phone:</span>
                        <p className="font-medium truncate">
                            {data.phone || "—"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Consignee Info */}
            <div className="bg-white p-3 rounded border mt-3">
                <h4 className="font-semibold text-green-700 mb-2">
                    Consignee Information
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                        <span className="text-gray-600 text-xs">
                            Company/Consignee:
                        </span>
                        <p className="font-medium truncate">
                            {data.consignee || "—"}
                        </p>
                    </div>
                    <div>
                        <span className="text-gray-600 text-xs">
                            Contact Name:
                        </span>
                        <p className="font-medium truncate">
                            {data.consignee_name || "—"}
                        </p>
                    </div>
                    <div className="col-span-2">
                        <span className="text-gray-600 text-xs">Phone:</span>
                        <p className="font-medium truncate">
                            {data.consignee_phone || "—"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Shipment Info */}
            <div className="bg-white p-3 rounded border mt-3">
                <h4 className="font-semibold text-blue-700 mb-2">
                    Shipment Details
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                        <span className="text-gray-600 text-xs">Volume:</span>
                        <p className="font-medium text-blue-600 text-base">
                            {formatVolumeInfo()}
                        </p>
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
                            {destinationPort?.label ||
                                data.destination_port ||
                                "—"}
                        </p>
                    </div>
                    <div className="col-span-2">
                        <span className="text-gray-600 text-xs">
                            Containers:
                        </span>
                        <p className="font-medium text-sm">
                            {formatContainerList()}
                        </p>
                    </div>
                    <div>
                        <span className="text-gray-600 text-xs">
                            Commodity:
                        </span>
                        <p className="font-medium truncate">
                            {data.commodity || "—"}
                        </p>
                    </div>
                    <div>
                        <span className="text-gray-600 text-xs">Quantity:</span>
                        <p className="font-medium truncate">
                            {data.quantity || 1}
                        </p>
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
                            <span className="text-gray-600 text-xs">
                                Pickup Company:
                            </span>
                            <p className="font-medium truncate">
                                {getCompanyName(data.pickup_trucker_id)}
                                {data.pickup_truck_id && (
                                    <span className="text-xs text-gray-500 block">
                                        Vehicle:{" "}
                                        {getTruckLabel(data.pickup_truck_id)}
                                    </span>
                                )}
                            </p>
                        </div>
                        <div>
                            <span className="text-gray-600 text-xs">
                                Delivery Company:
                            </span>
                            <p className="font-medium truncate">
                                {getCompanyName(data.delivery_trucker_id)}
                                {data.delivery_truck_id && (
                                    <span className="text-xs text-gray-500 block">
                                        Vehicle:{" "}
                                        {getTruckLabel(data.delivery_truck_id)}
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            )}
            {!data.skipTrucking && (
                <div className="bg-white p-3 rounded border mt-3">
                    <h4 className="font-semibold text-blue-700 mb-2">
                        Location Details
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                            <span className="text-gray-600 text-xs">
                                Pickup Address:
                            </span>
                            <p className="font-medium truncate">
                                {formatAddress("pickup")}
                            </p>
                        </div>
                        <div>
                            <span className="text-gray-600 text-xs">
                                Delivery Address:
                            </span>
                            <p className="font-medium truncate">
                                {formatAddress("delivery")}
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
