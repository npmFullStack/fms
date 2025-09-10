import { useEffect, useState } from "react";
import { Controller, useWatch } from "react-hook-form";
import Select from "react-select";
import { PH_PORTS } from "../../../utils/helpers/shipRoutes";
import useShipStore from "../../../utils/store/useShipStore";

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

const BookingStep2 = ({ control, register, errors, partners, setValue }) => {
  const shippingLineId = useWatch({ control, name: "shipping_line_id" });
  const { ships, fetchAllShips } = useShipStore();
  const [filteredShips, setFilteredShips] = useState([]);

  // Filter partners by type
  const shippingLines = partners.filter((partner) => partner.type === "shipping");

  // Fetch ships when shipping line changes
  useEffect(() => {
    if (shippingLineId) {
      fetchAllShips().then(() => {
        setFilteredShips(
          ships.filter((s) => String(s.shipping_line_id) === String(shippingLineId))
        );
      });
    } else {
      setFilteredShips([]);
    }
  }, [shippingLineId, fetchAllShips, ships]);

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
              value={
                field.value
                  ? shippingLines
                      .map((line) => ({ value: line.id, label: line.name }))
                      .find((opt) => opt.value === field.value) || null
                  : null
              }
              onChange={(option) => {
                field.onChange(option ? option.value : "");
                setValue("ship_id", ""); // reset ship when line changes
              }}
              options={shippingLines.map((line) => ({
                value: line.id,
                label: line.name,
              }))}
              placeholder="Select shipping line"
              isClearable
            />
          )}
        />
        {errors.shipping_line_id && (
          <p className="error-message">{errors.shipping_line_id.message}</p>
        )}
      </div>

      {/* Ship (Van Number) */}
      <div>
        <label className="input-label-modern">Ship (Van Number)</label>
        <Controller
          name="ship_id"
          control={control}
          rules={{ required: "Ship is required" }}
          render={({ field }) => (
            <Select
              value={
                field.value
                  ? filteredShips
                      .map((ship) => ({
                        value: ship.id,
                        label:
                          ship.van_number ||
                          ship.vessel_number ||
                          `Ship ${ship.id}`,
                      }))
                      .find((opt) => opt.value === field.value) || null
                  : null
              }
              onChange={(option) => field.onChange(option ? option.value : "")}
              options={filteredShips.map((ship) => ({
                value: ship.id,
                label:
                  ship.van_number ||
                  ship.vessel_number ||
                  `Ship ${ship.id}`,
              }))}
              placeholder={
                shippingLineId ? "Select ship" : "Select shipping line first"
              }
              isDisabled={!shippingLineId}
              isClearable
            />
          )}
        />
        {errors.ship_id && (
          <p className="error-message">{errors.ship_id.message}</p>
        )}
      </div>

      {/* Origin Port */}
      <div>
        <label className="input-label-modern">Origin Port</label>
        <Controller
          name="origin_port"
          control={control}
          rules={{ required: "Origin port is required" }}
          render={({ field }) => (
            <Select
              value={
                field.value
                  ? PH_PORTS.find((p) => p.value === field.value) || null
                  : null
              }
              onChange={(option) => field.onChange(option ? option.value : "")}
              options={PH_PORTS}
              placeholder="Select origin port"
              isClearable
            />
          )}
        />
        {errors.origin_port && (
          <p className="error-message">{errors.origin_port.message}</p>
        )}
      </div>

      {/* Destination Port */}
      <div>
        <label className="input-label-modern">Destination Port</label>
        <Controller
          name="destination_port"
          control={control}
          rules={{ required: "Destination port is required" }}
          render={({ field }) => (
            <Select
              value={
                field.value
                  ? PH_PORTS.find((p) => p.value === field.value) || null
                  : null
              }
              onChange={(option) => field.onChange(option ? option.value : "")}
              options={PH_PORTS}
              placeholder="Select destination port"
              isClearable
            />
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
            <Select
              value={
                field.value
                  ? containerTypes.find((c) => c.value === field.value) || null
                  : null
              }
              onChange={(option) => field.onChange(option ? option.value : "")}
              options={containerTypes}
              placeholder="Select container"
              isClearable
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
      </div>

      {/* Commodity */}
      <div>
        <label className="input-label-modern">Commodity</label>
        <input
          {...register("commodity", { required: "Commodity is required" })}
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
              value={
                field.value
                  ? bookingModes.find((m) => m.value === field.value) || null
                  : null
              }
              onChange={(option) => {
                field.onChange(option ? option.value : "");
                if (option?.value === "PIER_TO_PIER") {
                  setValue("skipTrucking", true);
                } else {
                  setValue("skipTrucking", false);
                }
              }}
              options={bookingModes}
              placeholder="Select mode"
              isClearable
            />
          )}
        />
      </div>
    </div>
  );
};

export default BookingStep2;
