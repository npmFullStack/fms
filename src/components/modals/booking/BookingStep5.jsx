import Select from "react-select";
import { Controller } from "react-hook-form";

const statusOptions = [
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "IN_TRANSIT", label: "In Transit" },
  { value: "ARRIVED", label: "Arrived" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "COMPLETED", label: "Completed" },
];

const BookingStep5 = ({ control, register, errors }) => {
  return (
    <div className="space-y-4">
      {/* Freight */}
      <div>
        <label className="input-label-modern">Freight Charge</label>
        <input
          type="number"
          step="0.01"
          {...register("freight_charge")}
          className="input-field-modern"
        />
      </div>

      {/* Trucking */}
      <div>
        <label className="input-label-modern">Trucking Charge</label>
        <input
          type="number"
          step="0.01"
          {...register("trucking_charge")}
          className="input-field-modern"
        />
      </div>

      {/* Total */}
      <div>
        <label className="input-label-modern">Total Amount</label>
        <input
          type="number"
          step="0.01"
          {...register("total_amount")}
          className="input-field-modern bg-gray-100"
          disabled
        />
      </div>

      {/* Status */}
      <div>
        <label className="input-label-modern">Status</label>
        <Controller
          name="status"
          control={control}
          rules={{ required: "Status is required" }}
          render={({ field }) => (
            <Select {...field} options={statusOptions} placeholder="Select status" />
          )}
        />
        {errors.status && <p className="error-message">{errors.status.message}</p>}
      </div>
    </div>
  );
};

export default BookingStep5;
