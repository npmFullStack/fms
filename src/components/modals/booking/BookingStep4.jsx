import { Controller } from "react-hook-form";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";

const BookingStep4 = ({ control, errors }) => {
  return (
    <div className="space-y-6">
      {/* Departure */}
      <div>
        <label className="input-label-modern">Preferred Departure</label>
        <Controller
          name="preferred_departure"
          control={control}
          rules={{ required: "Departure date is required" }}
          render={({ field }) => (
            <Datetime
              {...field}
              onChange={(date) => field.onChange(date?.toISOString?.() || date)}
              value={field.value ? new Date(field.value) : ""}
              dateFormat="YYYY-MM-DD"
              timeFormat="HH:mm"
              className="input-field-modern"
            />
          )}
        />
        {errors.preferred_departure && (
          <p className="error-message">{errors.preferred_departure.message}</p>
        )}
      </div>

      {/* Delivery */}
      <div>
        <label className="input-label-modern">Preferred Delivery</label>
        <Controller
          name="preferred_delivery"
          control={control}
          render={({ field }) => (
            <Datetime
              {...field}
              onChange={(date) => field.onChange(date?.toISOString?.() || date)}
              value={field.value ? new Date(field.value) : ""}
              dateFormat="YYYY-MM-DD"
              timeFormat="HH:mm"
              className="input-field-modern"
            />
          )}
        />
      </div>

      {/* Commodity */}
      <div>
        <label className="input-label-modern">Commodity</label>
        <input
          {...control.register("commodity", { required: "Commodity is required" })}
          placeholder="e.g., Electronics, Furniture"
          className={`input-field-modern ${errors.commodity ? "input-error" : ""}`}
        />
        {errors.commodity && <p className="error-message">{errors.commodity.message}</p>}
      </div>

      {/* Quantity */}
      <div>
        <label className="input-label-modern">Quantity</label>
        <input
          type="number"
          min="1"
          {...control.register("quantity", { required: "Quantity is required" })}
          className={`input-field-modern ${errors.quantity ? "input-error" : ""}`}
        />
        {errors.quantity && <p className="error-message">{errors.quantity.message}</p>}
      </div>

      {/* Van + Seal */}
      <div>
        <label className="input-label-modern">Van Number</label>
        <input
          {...control.register("van_number")}
          placeholder="Enter container number"
          className="input-field-modern"
        />
      </div>

      <div>
        <label className="input-label-modern">Seal Number</label>
        <input
          {...control.register("seal_number")}
          placeholder="Enter seal number"
          className="input-field-modern"
        />
      </div>
    </div>
  );
};

export default BookingStep4;
