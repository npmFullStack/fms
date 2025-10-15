import { Controller } from "react-hook-form";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import { Calendar, Info } from "lucide-react";
import { NumericFormat } from "react-number-format";

const APStep1 = ({ register, control, errors, apRecord }) => {
  return (
    <div className="space-y-5">
      {/* 🧰 Header */}
      <div className="info-box-modern">
        <div className="flex items-start gap-3">
          <div className="p-1.5 bg-blue-100 rounded-lg">
            <Info className="w-4 h-4 text-blue-600" />
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

      {/* 🧍 Payee */}
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

      {/* 💰 Freight Amount + #️⃣ Voucher Number */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 💰 Freight Amount */}
        <div className="input-container">
          <label className="input-label-modern">Freight Amount *</label>
          <Controller
            control={control}
            name="freight_amount"
            render={({ field }) => (
              <NumericFormat
                value={field.value === "" || field.value === null || field.value === 0 || field.value === "0" ? "" : field.value}
                thousandSeparator
                prefix='₱'
                decimalScale={2}
                allowNegative={false}
                placeholder='₱0.00'
                className={`input-field-modern ${
                  errors.freight_amount ? "input-error" : ""
                }`}
                onValueChange={(values) => {
                  const val = values.value;
                  // Convert to number only if not empty
                  field.onChange(val === "" ? "" : Number(val));
                }}
                onBlur={field.onBlur}
              />
            )}
          />
          {errors.freight_amount && (
            <p className="error-message">{errors.freight_amount.message}</p>
          )}
        </div>

        {/* #️⃣ Voucher Number */}
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
    </div>
  );
};

export default APStep1;