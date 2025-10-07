// components/modals/ap/APStep1.jsx
import { Controller } from "react-hook-form";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";

const APStep1 = ({ register, control, errors, apRecord }) => {
  return (
    <div className="space-y-5">
      {/* 🧰 Header styled like tooltip/info box */}
      <div className="info-box-modern">
        <div className="flex items-start gap-3">
          <div className="p-1.5 bg-blue-100 rounded-lg">
            <span className="text-blue-600 text-sm font-semibold">i</span>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-slate-800 mb-1">
              Freight Charges
            </h4>
            <p className="text-xs text-slate-600">
              Update shipping line freight expenses and payment details.
            </p>
          </div>
        </div>
      </div>

      {/* 🧍 Payee (top) */}
      <div className="input-container">
        <label className="input-label-modern">Payee (Shipping Line)</label>
        <input
          type="text"
          value={apRecord?.freight_payee || ""}
          readOnly
          className="input-field-modern bg-gray-100 cursor-not-allowed"
          placeholder="Payee not found"
        />
      </div>

      {/* 💰 Freight Amount + 📅 Check Date in one row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Freight Amount */}
        <div className="input-container">
          <label className="input-label-modern">Freight Amount *</label>
          <input
            type="number"
            step="0.01"
            {...register("freight_amount", { valueAsNumber: true })}
            placeholder="0.00"
            className={`input-field-modern ${
              errors.freight_amount ? "input-error" : ""
            }`}
          />
          {errors.freight_amount && (
            <p className="error-message">{errors.freight_amount.message}</p>
          )}
        </div>

        {/* Check Date */}
        <div className="input-container">
          <label className="input-label-modern">Check Date</label>
          <Controller
            control={control}
            name="freight_check_date"
            render={({ field }) => (
              <Datetime
                {...field}
                timeFormat={false}
                dateFormat="YYYY-MM-DD"
                className="input-field-modern"
                onChange={(val) =>
                  field.onChange(
                    val && val.format ? val.format("YYYY-MM-DD") : ""
                  )
                }
                value={field.value || ""}
              />
            )}
          />
          {errors.freight_check_date && (
            <p className="error-message">{errors.freight_check_date.message}</p>
          )}
        </div>
      </div>

      {/* Voucher Number */}
      <div className="input-container">
        <label className="input-label-modern">Voucher Number</label>
        <input
          type="text"
          {...register("freight_voucher")}
          placeholder="Voucher number"
          className={`input-field-modern ${
            errors.freight_voucher ? "input-error" : ""
          }`}
        />
        {errors.freight_voucher && (
          <p className="error-message">{errors.freight_voucher.message}</p>
        )}
      </div>
    </div>
  );
};

export default APStep1;
