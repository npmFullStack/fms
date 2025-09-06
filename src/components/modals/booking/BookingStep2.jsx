// src/components/modals/booking/BookingStep2.jsx
import { useEffect } from "react";
import { Controller, useWatch } from "react-hook-form";
import Select from "react-select";
import useShippingLineStore from "../../../utils/store/useShippingLineStore";
import useTruckStore from "../../../utils/store/useTruckStore";
import { PH_PORTS } from "../../../utils/helpers/shipRoutes";

const containerTypes = [
  { value: "LCL", label: "LCL" },
  { value: "20FT", label: "1X20" },
  { value: "40FT", label: "1X40" },
];

const bookingModes = [
  { value: "DOOR_TO_DOOR", label: "Door to Door (D-D)" },
  { value: "PIER_TO_PIER", label: "Port to Port (P-P)" },
  { value: "CY_TO_DOOR", label: "CY to Door" },
  { value: "DOOR_TO_CY", label: "Door to CY" },
  { value: "CY_TO_CY", label: "CY to CY" },
];

const BookingStep2 = ({ control, register, errors }) => {
  const { ships, fetchShips } = useShippingLineStore();
  const { trucks, fetchTrucks } = useTruckStore();

  // Watch form values
  const shippingLineId = useWatch({ control, name: "shipping_line_id" });
  const quantity = useWatch({ control, name: "quantity" });
  const containerType = useWatch({ control, name: "container_type" });

  // Fetch ships when shipping line changes
  useEffect(() => {
    if (shippingLineId) {
      fetchShips(shippingLineId);
    }
  }, [shippingLineId, fetchShips]);

  // Fetch trucks once
  useEffect(() => {
    fetchTrucks();
  }, [fetchTrucks]);

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
              options={[
                { value: "1", label: "Trans-Asia" },
                { value: "2", label: "2GO" },
              ]}
              placeholder="Select shipping line"
            />
          )}
        />
        {errors.shipping_line_id && (
          <p className="error-message">{errors.shipping_line_id.message}</p>
        )}
      </div>

      {/* Ship */}
      <div>
        <label className="input-label-modern">Ship</label>
        <Controller
          name="ship_id"
          control={control}
          rules={{ required: "Ship is required" }}
          render={({ field }) => (
            <Select
              {...field}
              options={ships.map((ship) => ({
                value: ship.id,
                label: ship.vessel_number || ship.name,
              }))}
              placeholder="Select ship"
              isLoading={!ships.length}
            />
          )}
        />
        {errors.ship_id && (
          <p className="error-message">{errors.ship_id.message}</p>
        )}
      </div>

      {/* Route (Origin Port + Destination Port) */}
      <div>
        <label className="input-label-modern">Origin Port</label>
        <Controller
          name="origin_port"
          control={control}
          rules={{ required: "Origin port is required" }}
          render={({ field }) => (
            <Select {...field} options={PH_PORTS} placeholder="Select origin port" />
          )}
        />
        {errors.origin_port && (
          <p className="error-message">{errors.origin_port.message}</p>
        )}
      </div>

      <div>
        <label className="input-label-modern">Destination Port</label>
        <Controller
          name="destination_port"
          control={control}
          rules={{ required: "Destination port is required" }}
          render={({ field }) => (
            <Select {...field} options={PH_PORTS} placeholder="Select destination port" />
          )}
        />
        {errors.destination_port && (
          <p className="error-message">{errors.destination_port.message}</p>
        )}
      </div>

      {/* Container Type + Quantity */}
      <div>
        <label className="input-label-modern">Container</label>
        <Controller
          name="container_type"
          control={control}
          render={({ field }) => (
            <Select {...field} options={containerTypes} placeholder="Select container" />
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

      {/* Booking Mode */}
      <div>
        <label className="input-label-modern">Mode of Service</label>
        <Controller
          name="booking_mode"
          control={control}
          render={({ field }) => (
            <Select {...field} options={bookingModes} placeholder="Select mode" />
          )}
        />
      </div>

      {/* Trucker */}
      <div>
        <label className="input-label-modern">Trucking Company</label>
        <Controller
          name="trucker_id"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              options={trucks.map((t) => ({
                value: t.id,
                label: t.name,
              }))}
              placeholder="Select trucking company"
              isClearable
            />
          )}
        />
      </div>
    </div>
  );
};

export default BookingStep2;
