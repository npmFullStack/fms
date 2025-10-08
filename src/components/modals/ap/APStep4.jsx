// components/modals/ap/APStep4.jsx
import { Controller } from "react-hook-form";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import { Info, Calendar } from "lucide-react";
import { NumericFormat } from "react-number-format";

const APStep4 = ({ register, control, errors }) => {
  const miscCharges = [
    { key: "rebates", label: "Rebates / DENR", color: "yellow" },
    { key: "storage", label: "Storage", color: "orange" },
    { key: "facilitation", label: "Facilitation", color: "red" },
  ];

  const getColorIconClass = (color) => {
    const map = {
      yellow: "bg-blue-100",
      orange: "bg-blue-100",
      red: "bg-blue-100",
    };
    return map[color] || "bg-slate-100";
  };

  const getIconColorClass = (color) => {
    const map = {
      yellow: "text-blue-600",
      orange: "text-blue-600",
      red: "text-blue-600",
    };
    return map[color] || "text-slate-600";
  };

  return (
    <div className="space-y-8 pt-3">
      {/* 🧰 Header */}
      <div className="info-box-modern">
        <div className="flex items-start gap-3">
          <div className="p-1.5 bg-blue-100 rounded-lg">
            <Info className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-slate-800 mb-1">
              Miscellaneous Charges
            </h4>
            <p className="text-xs text-slate-600">
              Encode payee and billing information for additional charges.
            </p>
          </div>
        </div>
      </div>

      {/* Charges Loop */}
      {miscCharges.map((charge) => (
        <div key={charge.key} className="space-y-5">
          {/* Section Header */}
          <div className="info-box-modern">
            <div className="flex items-start gap-3">
              <div className={`p-1.5 rounded-lg ${getColorIconClass(charge.color)}`}>
                <Info className={`w-4 h-4 ${getIconColorClass(charge.color)}`} />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-slate-800 mb-1">
                  {charge.label}
                </h4>
                <p className="text-xs text-slate-600">
                  Enter payee and billing details for this charge.
                </p>
              </div>
            </div>
          </div>

          {/* Payee */}
          <div className="input-container">
            <label className="input-label-modern">Payee</label>
            <input
              type="text"
              {...register(`${charge.key}_payee`)}
              placeholder="Enter payee name"
              className={`input-field-modern ${
                errors[`${charge.key}_payee`] ? "input-error" : ""
              }`}
            />
            {errors[`${charge.key}_payee`] && (
              <p className="error-message">
                {errors[`${charge.key}_payee`].message}
              </p>
            )}
          </div>

          {/* Amount + Check Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Amount */}
            <div className="input-container">
              <label className="input-label-modern">Amount *</label>
              <Controller
                control={control}
                name={`${charge.key}_amount`}
                render={({ field }) => (
                  <NumericFormat
                    value={
                      field.value === "" || field.value === null || field.value === 0
                        ? ""
                        : field.value
                    }
                    thousandSeparator
                    prefix="₱ "
                    decimalScale={2}
                    allowNegative={false}
                    placeholder="₱ 0.00"
                    className={`input-field-modern ${
                      errors[`${charge.key}_amount`] ? "input-error" : ""
                    }`}
                    onValueChange={(values) => {
                      const val = values.value;
                      field.onChange(val === "" ? "" : Number(val));
                    }}
                    onBlur={field.onBlur}
                  />
                )}
              />
              {errors[`${charge.key}_amount`] && (
                <p className="error-message">
                  {errors[`${charge.key}_amount`].message}
                </p>
              )}
            </div>

            {/* Check Date */}
            <div className="input-container">
              <label className="input-label-modern">Check Date</label>
              <div className="relative">
                <Controller
                  control={control}
                  name={`${charge.key}_check_date`}
                  render={({ field }) => (
                    <Datetime
                      {...field}
                      timeFormat={false}
                      dateFormat="YYYY-MM-DD"
                      closeOnSelect={true}
                      inputProps={{
                        className: "input-field-modern pr-10 cursor-pointer",
                        placeholder: "Select date",
                      }}
                      onChange={(val) =>
                        field.onChange(val && val.format ? val.format("YYYY-MM-DD") : "")
                      }
                      value={field.value || ""}
                    />
                  )}
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Voucher */}
          <div className="input-container">
            <label className="input-label-modern">Voucher Number</label>
            <input
              type="text"
              {...register(`${charge.key}_voucher`)}
              placeholder="Voucher number"
              className={`input-field-modern ${
                errors[`${charge.key}_voucher`] ? "input-error" : ""
              }`}
            />
            {errors[`${charge.key}_voucher`] && (
              <p className="error-message">
                {errors[`${charge.key}_voucher`].message}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default APStep4;