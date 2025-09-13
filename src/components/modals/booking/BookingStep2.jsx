import { useEffect, useState } from "react";
import { Controller, useWatch } from "react-hook-form";
import Select from "react-select";
import { PH_PORTS } from "../../../utils/helpers/shipRoutes";
import useShipStore from "../../../utils/store/useShipStore";

const bookingModes = [
  { value: "DOOR_TO_DOOR", label: "Door to Door (D-D)" },
  { value: "PIER_TO_PIER", label: "Port to Port (P-P)" },
  { value: "CY_TO_DOOR", label: "CY to Door" },
  { value: "DOOR_TO_CY", label: "Door to CY" },
  { value: "CY_TO_CY", label: "CY to CY" },
];

const BookingStep2 = ({ control, register, errors, partners, setValue }) => {
  const shippingLineId = useWatch({ control, name: "shipping_line_id" });
  const selectedShipId = useWatch({ control, name: "ship_id" });

  const { ships, fetchAllShips, currentShip, fetchShipById, clearCurrentShip } =
    useShipStore();
  const [filteredShips, setFilteredShips] = useState([]);

  // Filter partners by shipping type
  const shippingLines = partners.filter(
    (partner) => partner.type === "shipping"
  );

  // Fetch ships when shipping line changes
  useEffect(() => {
    if (shippingLineId) {
      fetchAllShips().then(() => {
        setFilteredShips(
          ships.filter(
            (s) => String(s.shipping_line_id) === String(shippingLineId)
          )
        );
      });
    } else {
      setFilteredShips([]);
    }
  }, [shippingLineId, fetchAllShips, ships]);

  // Fetch containers when ship changes
  useEffect(() => {
    if (selectedShipId) {
      fetchShipById(selectedShipId);
    } else {
      clearCurrentShip();
    }
  }, [selectedShipId, fetchShipById, clearCurrentShip]);

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
                field.onChange(option ? option.value : null);
                setValue("ship_id", null); // reset ship when line changes
                setValue("container_id", null); // reset container too
                setValue("van_number", null); // reset van number
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

      {/* Ship */}
      <div>
        <label className="input-label-modern">Ship</label>
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
                        label: ship.vessel_number || `Ship ${ship.id}`,
                      }))
                      .find((opt) => opt.value === field.value) || null
                  : null
              }
              onChange={(option) => {
                field.onChange(option ? option.value : null);
                setValue("container_id", null); // reset container if ship changes
                setValue("van_number", null);
              }}
              options={filteredShips.map((ship) => ({
                value: ship.id,
                label: ship.vessel_number || `Ship ${ship.id}`,
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
              onChange={(option) => field.onChange(option ? option.value : null)}
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
              onChange={(option) => field.onChange(option ? option.value : null)}
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

      {/* Container (Dynamic) */}
      <div>
        <label className="input-label-modern">Container</label>
        <Controller
          name="container_id"
          control={control}
          rules={{ required: "Container is required" }}
          render={({ field }) => (
            <Select
              value={
                field.value
                  ? currentShip?.containers
                      ?.map((c) => ({
                        value: c.id,
                        label: `${c.size} - ${c.van_number}`,
                      }))
                      .find((opt) => opt.value === field.value) || null
                  : null
              }
              onChange={(option) => {
                const id = option ? option.value : null;
                field.onChange(id);

                if (id) {
                  const selected = currentShip?.containers?.find(
                    (c) => String(c.id) === String(id)
                  );
                  if (selected) {
                    setValue("van_number", selected.van_number); // ✅ only keep van_number for Step5 display
                  }
                } else {
                  setValue("van_number", null);
                }
              }}
              options={
                currentShip?.containers?.map((c) => ({
                  value: c.id,
                  label: `${c.size} - ${c.van_number}`,
                })) || []
              }
              placeholder={
                selectedShipId
                  ? currentShip?.containers?.length > 0
                    ? "Select container"
                    : "No containers available"
                  : "Select ship first"
              }
              isDisabled={!selectedShipId}
              isClearable
            />
          )}
        />
        {errors.container_id && (
          <p className="error-message">{errors.container_id.message}</p>
        )}
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
          rules={{ required: "Mode of service is required" }}
          render={({ field }) => (
            <Select
              value={
                field.value
                  ? bookingModes.find((m) => m.value === field.value) || null
                  : null
              }
              onChange={(option) => {
                field.onChange(option ? option.value : null);
                setValue("skipTrucking", option?.value === "PIER_TO_PIER");
              }}
              options={bookingModes}
              placeholder="Select mode"
              isClearable
            />
          )}
        />
        {errors.booking_mode && (
          <p className="error-message">{errors.booking_mode.message}</p>
        )}
      </div>
    </div>
  );
};

export default BookingStep2;
