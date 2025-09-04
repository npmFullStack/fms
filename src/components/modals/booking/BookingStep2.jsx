import Select from "react-select";
import { Controller } from "react-hook-form";

const containerTypes = [
  { value: "LCL", label: "LCL" },
  { value: "20FT", label: "20FT" },
  { value: "40FT", label: "40FT" },
  { value: "40FT_HC", label: "40FT High Cube" },
];

const bookingModes = [
  { value: "DOOR_TO_DOOR", label: "Door to Door" },
  { value: "PIER_TO_PIER", label: "Pier to Pier" },
  { value: "CY_TO_DOOR", label: "CY to Door" },
  { value: "DOOR_TO_CY", label: "Door to CY" },
  { value: "CY_TO_CY", label: "CY to CY" },
];

const BookingStep2 = ({ control, errors }) => {
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
              {...field}
              options={[
                { value: "101", label: "MV SuperFerry" },
                { value: "102", label: "MV Princess" },
              ]}
              placeholder="Select ship"
            />
          )}
        />
        {errors.ship_id && <p className="error-message">{errors.ship_id.message}</p>}
      </div>

      {/* Container Type */}
      <div>
        <label className="input-label-modern">Container Type</label>
        <Controller
          name="container_type"
          control={control}
          render={({ field }) => (
            <Select {...field} options={containerTypes} placeholder="Select container type" />
          )}
        />
      </div>

      {/* Booking Mode */}
      <div>
        <label className="input-label-modern">Booking Mode</label>
        <Controller
          name="booking_mode"
          control={control}
          render={({ field }) => (
            <Select {...field} options={bookingModes} placeholder="Select booking mode" />
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
              options={[
                { value: "t1", label: "Swift Trucking" },
                { value: "t2", label: "Matthaus Logistics" },
              ]}
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
