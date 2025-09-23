// components/modals/booking/BookingStep2.js
import { useEffect } from "react";
import { Controller, useWatch } from "react-hook-form";
import Select from "react-select";
import { PH_PORTS } from "../../../utils/helpers/shipRoutes";
import useShipStore from "../../../utils/store/useShipStore";
import useContainerStore from "../../../utils/store/useContainerStore";

const bookingModes = [
  { value: "DOOR_TO_DOOR", label: "Door to Door (D-D)" },
  { value: "PIER_TO_PIER", label: "Port to Port (P-P)" },
  { value: "CY_TO_DOOR", label: "CY to Door (CY-D)" },
  { value: "DOOR_TO_CY", label: "Door to CY (D-CY)" },
  { value: "CY_TO_CY", label: "CY to CY (CY-CY)" }
];

const BookingStep2 = ({ control, register, errors, partners, setValue }) => {
  const shippingLineId = useWatch({ control, name: "shipping_line_id" });
  const shipId = useWatch({ control, name: "ship_id" });
  const selectedContainerIds = useWatch({ control, name: "container_ids" }) || [];
  const quantity = useWatch({ control, name: "quantity" }) || 1;

  // ✅ Zustand stores
  const { ships, fetchShipsByLine } = useShipStore();
  const { containers: availableContainers, fetchContainersByLine, loading } = useContainerStore();

  // Filter partners by shipping type
  const shippingLines = partners.filter(partner => partner.type === "shipping");

  // Fetch ships when shipping line changes
  useEffect(() => {
    if (shippingLineId) {
      fetchShipsByLine(shippingLineId);
      setValue("ship_id", null);
    } else {
      setValue("ship_id", null);
    }
  }, [shippingLineId, fetchShipsByLine, setValue]);

  // Fetch containers when shipping line changes
  useEffect(() => {
    if (shippingLineId) {
      fetchContainersByLine(shippingLineId);
      setValue("container_ids", []);
    }
  }, [shippingLineId, fetchContainersByLine, setValue]);

  // Reset container selection when shipping line changes
  useEffect(() => {
    if (shippingLineId) {
      setValue("container_ids", []);
    }
  }, [shippingLineId, setValue]);

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
                      .map(line => ({ value: line.id, label: line.name }))
                      .find(opt => opt.value === field.value) || null
                  : null
              }
              onChange={option => {
                field.onChange(option ? option.value : null);
                setValue("ship_id", null);
                setValue("container_ids", []);
              }}
              options={shippingLines.map(line => ({ value: line.id, label: line.name }))}
              placeholder="Select shipping line"
              isClearable
            />
          )}
        />
        {errors.shipping_line_id && <p className="error-message">{errors.shipping_line_id.message}</p>}
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
                  ? ships
                      .map(ship => ({
                        value: ship.id,
                        label: `${ship.shipping_line_name} ${ship.ship_name}` // ✅ fixed
                      }))
                      .find(opt => opt.value === field.value) || null
                  : null
              }
              onChange={option => {
                field.onChange(option ? option.value : null);
                setValue("container_ids", []);
              }}
              options={ships.map(ship => ({
                value: ship.id,
                label: `${ship.shipping_line_name} ${ship.ship_name}` // ✅ fixed
              }))}
              placeholder={shippingLineId ? "Select ship" : "Select shipping line first"}
              isClearable
              isDisabled={!shippingLineId}
            />
          )}
        />
        {errors.ship_id && <p className="error-message">{errors.ship_id.message}</p>}
      </div>

      {/* Quantity */}
      <div>
        <label className="input-label-modern">Quantity *</label>
        <input
          {...register("quantity", {
            required: "Quantity is required",
            min: { value: 1, message: "Quantity must be at least 1" },
            max: { value: 10, message: "Quantity cannot exceed 10" }
          })}
          type="number"
          min="1"
          max="10"
          placeholder="Enter quantity"
          className={`input-field-modern ${errors.quantity ? "input-error" : ""}`}
        />
        {errors.quantity && <p className="error-message">{errors.quantity.message}</p>}
      </div>

      {/* Container Selection */}
      <div>
        <label className="input-label-modern">
          Containers * (Select {quantity} container{quantity > 1 ? "s" : ""})
        </label>
        <Controller
          name="container_ids"
          control={control}
          rules={{
            required: "Please select containers",
            validate: value => {
              if (!value || value.length === 0) return "Please select at least one container";
              if (value.length !== quantity) {
                return `Please select exactly ${quantity} container${quantity > 1 ? "s" : ""}`;
              }
              return true;
            }
          }}
          render={({ field }) => (
            <Select
              {...field}
              isMulti
              value={
                field.value
                  ? availableContainers
                      .filter(container => field.value.includes(container.id))
                      .map(container => ({
                        value: container.id,
                        label: `${container.size} - ${container.van_number}`
                      }))
                  : []
              }
              onChange={options => {
                const values = options ? options.map(opt => opt.value) : [];
                if (values.length <= quantity) {
                  field.onChange(values);
                }
              }}
              options={availableContainers.map(container => ({
                value: container.id,
                label: `${container.size} - ${container.van_number}`
              }))}
              placeholder={
                loading
                  ? "Loading containers..."
                  : shippingLineId
                  ? availableContainers.length > 0
                    ? `Select ${quantity} container${quantity > 1 ? "s" : ""}`
                    : "No available containers"
                  : "Select shipping line first"
              }
              isDisabled={!shippingLineId || loading}
              isLoading={loading}
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              isOptionDisabled={() => selectedContainerIds.length >= quantity}
            />
          )}
        />
        {errors.container_ids && <p className="error-message">{errors.container_ids.message}</p>}
        {selectedContainerIds.length > 0 && (
          <p className="text-sm text-blue-600 mt-1">
            Selected: {selectedContainerIds.length}/{quantity} containers
          </p>
        )}
      </div>

      {/* Origin Port */}
      <div>
        <label className="input-label-modern">Origin Port *</label>
        <Controller
          name="origin_port"
          control={control}
          rules={{ required: "Origin port is required" }}
          render={({ field }) => (
            <Select
              value={field.value ? PH_PORTS.find(p => p.value === field.value) || null : null}
              onChange={option => field.onChange(option ? option.value : null)}
              options={PH_PORTS}
              placeholder="Select origin port"
              isClearable
            />
          )}
        />
        {errors.origin_port && <p className="error-message">{errors.origin_port.message}</p>}
      </div>

      {/* Destination Port */}
      <div>
        <label className="input-label-modern">Destination Port *</label>
        <Controller
          name="destination_port"
          control={control}
          rules={{ required: "Destination port is required" }}
          render={({ field }) => (
            <Select
              value={field.value ? PH_PORTS.find(p => p.value === field.value) || null : null}
              onChange={option => field.onChange(option ? option.value : null)}
              options={PH_PORTS}
              placeholder="Select destination port"
              isClearable
            />
          )}
        />
        {errors.destination_port && <p className="error-message">{errors.destination_port.message}</p>}
      </div>

      {/* Commodity */}
      <div>
        <label className="input-label-modern">Commodity *</label>
        <input
          {...register("commodity", { required: "Commodity is required" })}
          placeholder="Enter commodity type"
          className={`input-field-modern ${errors.commodity ? "input-error" : ""}`}
        />
        {errors.commodity && <p className="error-message">{errors.commodity.message}</p>}
      </div>

      {/* Booking Mode */}
      <div>
        <label className="input-label-modern">Mode of Service *</label>
        <Controller
          name="booking_mode"
          control={control}
          rules={{ required: "Mode of service is required" }}
          render={({ field }) => (
            <Select
              value={field.value ? bookingModes.find(m => m.value === field.value) || null : null}
              onChange={option => {
                field.onChange(option ? option.value : null);
                setValue("skipTrucking", option?.value === "PIER_TO_PIER");
              }}
              options={bookingModes}
              placeholder="Select mode"
              isClearable
            />
          )}
        />
        {errors.booking_mode && <p className="error-message">{errors.booking_mode.message}</p>}
      </div>
    </div>
  );
};

export default BookingStep2;
