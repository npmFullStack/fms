// src/components/modals/booking/BookingStep2.jsx
import { useEffect, useState } from "react";
import { Controller, useWatch } from "react-hook-form";
import Select from "react-select";
import { PH_PORTS } from "../../../utils/helpers/shipRoutes";

const containerTypes = [
    { value: "LCL", label: "LCL" },
    { value: "20FT", label: "1X20" },
    { value: "40FT", label: "1X40" }
];

const bookingModes = [
    { value: "DOOR_TO_DOOR", label: "Door to Door (D-D)" },
    { value: "PIER_TO_PIER", label: "Port to Port (P-P)" },
    { value: "CY_TO_DOOR", label: "CY to Door" },
    { value: "DOOR_TO_CY", label: "Door to CY" },
    { value: "CY_TO_CY", label: "CY to CY" }
];

const BookingStep2 = ({ control, register, errors, partners }) => {
    const shippingLineId = useWatch({ control, name: "shipping_line_id" });
    const quantity = useWatch({ control, name: "quantity" });
    const containerType = useWatch({ control, name: "container_type" });
    const [ships, setShips] = useState([]);

    // Filter partners by type
    const shippingLines = partners.filter(
        partner => partner.type === "shipping"
    );
    const truckingCompanies = partners.filter(
        partner => partner.type === "trucking"
    );

    // Fetch ships when shipping line changes
    useEffect(() => {
        if (shippingLineId) {
            // In a real app, you would fetch ships for this shipping line
            // For now, we'll simulate it with mock data
            const mockShips = [
                { id: 1, van_number: "VAN001", name: "Ship 1" },
                { id: 2, van_number: "VAN002", name: "Ship 2" },
                { id: 3, van_number: "VAN003", name: "Ship 3" }
            ];
            setShips(mockShips);
        } else {
            setShips([]);
        }
    }, [shippingLineId]);

    return (
        <div className="space-y-4">
            {/* Shipping Line */}
            <div>
                <label className="input-label-modern">Shipping Line</label>
                <Controller
                    name="shipping_line_id"
                    control={control}
                    rules={{ required: "Shipping line is required" }}
                    render={({ field }) => (
                        <Select
                            {...field}
                            options={shippingLines.map(line => ({
                                value: line.id,
                                label: line.name
                            }))}
                            placeholder="Select shipping line"
                        />
                    )}
                />
                {errors.shipping_line_id && (
                    <p className="error-message">
                        {errors.shipping_line_id.message}
                    </p>
                )}
            </div>

            {/* Ship */}
            <div>
                <label className="input-label-modern">Ship (Van Number)</label>
                <Controller
                    name="ship_id"
                    control={control}
                    rules={{ required: "Ship is required" }}
                    render={({ field }) => (
                        <Select
                            {...field}
                            options={ships.map(ship => ({
                                value: ship.id,
                                label: ship.van_number || ship.name
                            }))}
                            placeholder="Select ship"
                            isLoading={ships.length === 0}
                        />
                    )}
                />
                {errors.ship_id && (
                    <p className="error-message">{errors.ship_id.message}</p>
                )}
            </div>

            {/* Route */}
            <div>
                <label className="input-label-modern">Origin Port</label>
                <Controller
                    name="origin_port"
                    control={control}
                    rules={{ required: "Origin port is required" }}
                    render={({ field }) => (
                        <Select
                            {...field}
                            options={PH_PORTS}
                            placeholder="Select origin port"
                        />
                    )}
                />
                {errors.origin_port && (
                    <p className="error-message">
                        {errors.origin_port.message}
                    </p>
                )}
            </div>

            <div>
                <label className="input-label-modern">Destination Port</label>
                <Controller
                    name="destination_port"
                    control={control}
                    rules={{ required: "Destination port is required" }}
                    render={({ field }) => (
                        <Select
                            {...field}
                            options={PH_PORTS}
                            placeholder="Select destination port"
                        />
                    )}
                />
                {errors.destination_port && (
                    <p className="error-message">
                        {errors.destination_port.message}
                    </p>
                )}
            </div>

            {/* Container Type + Quantity */}
            <div>
                <label className="input-label-modern">Container</label>
                <Controller
                    name="container_type"
                    control={control}
                    render={({ field }) => (
                        <Select
                            {...field}
                            options={containerTypes}
                            placeholder="Select container"
                        />
                    )}
                />
                <input
                    type="number"
                    min="1"
                    {...register("quantity", { required: true })}
                    className="input-field-modern mt-2"
                    placeholder="Enter quantity"
                />
                {quantity && containerType && (
                    <p className="text-xs text-gray-600 mt-1">
                        Selected: {quantity}X{containerType.replace("FT", "")}
                    </p>
                )}
            </div>

            {/* Commodity Field */}
            <div>
                <label className="input-label-modern">Commodity</label>
                <input
                    {...register("commodity", {
                        required: "Commodity is required"
                    })}
                    placeholder="Enter commodity type"
                    className={`input-field-modern ${
                        errors.commodity ? "input-error" : ""
                    }`}
                />
                {errors.commodity && (
                    <p className="error-message">{errors.commodity.message}</p>
                )}
            </div>

            {/* Booking Mode */}
            <div>
                <label className="input-label-modern">Mode of Service</label>
                <Controller
                    name="booking_mode"
                    control={control}
                    render={({ field }) => (
                        <Select
                            {...field}
                            options={bookingModes}
                            placeholder="Select mode"
                        />
                    )}
                />
            </div>

            {/* Pickup Trucking Company */}
            <div>
                <label className="input-label-modern">
                    Pickup Trucking Company
                </label>
                <Controller
                    name="pickup_trucker_id"
                    control={control}
                    render={({ field }) => (
                        <Select
                            {...field}
                            options={truckingCompanies.map(t => ({
                                value: t.id,
                                label: t.name
                            }))}
                            placeholder="Select pickup trucking company"
                            isClearable
                        />
                    )}
                />
            </div>

            {/* Delivery Trucking Company */}
            <div>
                <label className="input-label-modern">
                    Delivery Trucking Company
                </label>
                <Controller
                    name="delivery_trucker_id"
                    control={control}
                    render={({ field }) => (
                        <Select
                            {...field}
                            options={truckingCompanies.map(t => ({
                                value: t.id,
                                label: t.name
                            }))}
                            placeholder="Select delivery trucking company"
                            isClearable
                        />
                    )}
                />
            </div>
        </div>
    );
};

export default BookingStep2;
