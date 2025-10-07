// components/modals/ap/APStep3.jsx
import { Controller } from "react-hook-form";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";

const APStep3 = ({ register, control, errors }) => {
  const portCharges = [
    { key: "crainage", label: "Crainage", color: "purple" },
    { key: "arrastre_origin", label: "Arrastre (Origin)", color: "blue" },
    { key: "arrastre_dest", label: "Arrastre (Destination)", color: "blue" },
    { key: "wharfage_origin", label: "Wharfage (Origin)", color: "indigo" },
    { key: "wharfage_dest", label: "Wharfage (Destination)", color: "indigo" },
    { key: "labor_origin", label: "Labor (Origin)", color: "teal" },
    { key: "labor_dest", label: "Labor (Destination)", color: "teal" },
  ];

  const getColorIconClass = (color) => {
    const map = {
      purple: "bg-purple-100 text-purple-600",
      blue: "bg-blue-100 text-blue-600",
      indigo: "bg-indigo-100 text-indigo-600",
      teal: "bg-teal-100 text-teal-600",
    };
    return map[color] || "bg-slate-100 text-slate-600";
  };

  return (
    <div className="space-y-8">
      {/* 🧰 Header */}
      <div className="info-box-modern">
        <div className="flex items-start gap-3">
          <div className="p-1.5 bg-purple-100 rounded-lg">
            <span className="text-purple-600 text-sm font-semibold">i</span>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-slate-800 mb-1">
              Port Charges
            </h4>
            <p className="text-xs text-slate-600">
              Encode payee and billing information for all port-related charges.
            </p>
          </div>
        </div>
      </div>

      {/* Charges Loop */}
      {portCharges.map((charge) => (
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
              className="input-field-modern"
            />
            {errors[`${charge.key}_payee`] && (
              <p className="error-message">{errors[`${charge.key}_payee`].message}</p>
            )}
          </div>

          {/* Amount + Check Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

export default APStep3;
