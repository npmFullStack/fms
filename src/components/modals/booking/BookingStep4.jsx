// src/components/modals/booking/BookingStep4.jsx
import { useEffect } from "react";
import { useWatch } from "react-hook-form";

const BookingStep4 = ({ control, register, errors, setValue }) => {
  const freight = useWatch({ control, name: "freight_charge" }) || 0;
  const trucking = useWatch({ control, name: "trucking_charge" }) || 0;

  // Auto-calc total
  useEffect(() => {
    const total = Number(freight) + Number(trucking);
    setValue("total_amount", total);
  }, [freight, trucking, setValue]);

  return (
    <div className="space-y-4">
      {/* Freight Charge */}
      <div>
        <label className="input-label-modern">Freight Charge (₱)</label>
        <input
          type="number"
          step="0.01"
          {...register("freight_charge", { valueAsNumber: true })}
          className="input-field-modern"
          placeholder="Enter freight charge"
        />
        {errors.freight_charge && (
          <p className="error-message">{errors.freight_charge.message}</p>
        )}
      </div>

      {/* Trucking Charge */}
      <div>
        <label className="input-label-modern">Trucking Charge (₱)</label>
        <input
          type="number"
          step="0.01"
          {...register("trucking_charge", { valueAsNumber: true })}
          className="input-field-modern"
          placeholder="Enter trucking charge"
        />
        {errors.trucking_charge && (
          <p className="error-message">{errors.trucking_charge.message}</p>
        )}
      </div>

      {/* Auto Total */}
      <div>
        <label className="input-label-modern font-semibold">Total Amount</label>
        <input
          type="number"
          {...register("total_amount", { valueAsNumber: true })}
          className="input-field-modern bg-gray-100"
          readOnly
        />
      </div>
    </div>
  );
};

export default BookingStep4;
