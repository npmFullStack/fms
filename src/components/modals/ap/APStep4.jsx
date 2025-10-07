// components/modals/ap/APStep4.jsx
import { Controller } from "react-hook-form";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";

const APStep4 = ({ register, control, errors }) => {
  const miscCharges = [
    { key: "rebates", label: "Rebates / DENR", color: "yellow" },
    { key: "storage", label: "Storage", color: "orange" },
    { key: "facilitation", label: "Facilitation", color: "red" },
  ];

  const getColorIconClass = (color) => {
    const map = {
      yellow: "bg-yellow-100 text-yellow-600",
      orange: "bg-orange-100 text-orange-600",
      red: "bg-red-100 text-red-600",
    };
    return map[color] || "bg-slate-100 text-slate-600";
  };

  return (
    <div className="space-y-8">
      {/* 🧰 Header */}
      <div className="info-box-modern">
        <div className="flex items-start gap-3">
          <div className="p-1.5 bg-yellow-100 rounded-lg">
            <span className="text-yellow-600 text-sm font-semibold">i</span>
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
                <span className="text-sm font-semibold">i</span>
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

          {/* Payee - now editable */}
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
              <input
                type="number"
                step="0.01"
                {...register(`${charge.key}_amount`, { valueAsNumber: true })}
                placeholder="0.00"
                className={`input-field-modern ${
                  errors[`${charge.key}_amount`] ? "input-error" : ""
                }`}
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
              <Controller
                control={control}
                name={`${charge.key}_check_date`}
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
