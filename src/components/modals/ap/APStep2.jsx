// components/modals/ap/APStep2.jsx
import { Controller } from "react-hook-form";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";

const APStep2 = ({ register, control, errors, apRecord }) => {
  return (
    <div className="space-y-8">
      {/* 🚛 ORIGIN TRUCKING */}
      <div className="space-y-5">
        {/* Header */}
        <div className="info-box-modern">
          <div className="flex items-start gap-3">
            <div className="p-1.5 bg-orange-100 rounded-lg">
              <span className="text-orange-600 text-sm font-semibold">i</span>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-slate-800 mb-1">
                Origin Trucking Charges
              </h4>
              <p className="text-xs text-slate-600">
                Update pickup trucking expenses from the origin location.
              </p>
            </div>
          </div>
        </div>

        {/* Payee */}
        <div className="input-container">
          <label className="input-label-modern">Payee (Origin Trucking)</label>
          <input
            type="text"
            value={apRecord?.trucking_origin_payee || ""}
            readOnly
            className="input-field-modern bg-gray-100 cursor-not-allowed"
            placeholder="Payee not found"
          />
        </div>

        {/* Amount + Check Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Origin Amount */}
          <div className="input-container">
            <label className="input-label-modern">Origin Amount *</label>
            <input
              type="number"
              step="0.01"
              {...register("trucking_origin_amount", { valueAsNumber: true })}
              placeholder="0.00"
              className={`input-field-modern ${
                errors.trucking_origin_amount ? "input-error" : ""
              }`}
            />
            {errors.trucking_origin_amount && (
              <p className="error-message">
                {errors.trucking_origin_amount.message}
              </p>
            )}
          </div>

          {/* Origin Check Date */}
          <div className="input-container">
            <label className="input-label-modern">Check Date</label>
            <Controller
              control={control}
              name="trucking_origin_check_date"
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
            {...register("trucking_origin_voucher")}
            placeholder="Voucher number"
            className={`input-field-modern ${
              errors.trucking_origin_voucher ? "input-error" : ""
            }`}
          />
          {errors.trucking_origin_voucher && (
            <p className="error-message">
              {errors.trucking_origin_voucher.message}
            </p>
          )}
        </div>
      </div>

      {/* 🚚 DESTINATION TRUCKING */}
      <div className="space-y-5">
        {/* Header */}
        <div className="info-box-modern">
          <div className="flex items-start gap-3">
            <div className="p-1.5 bg-green-100 rounded-lg">
              <span className="text-green-600 text-sm font-semibold">i</span>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-slate-800 mb-1">
                Destination Trucking Charges
              </h4>
              <p className="text-xs text-slate-600">
                Update delivery trucking expenses to the destination.
              </p>
            </div>
          </div>
        </div>

        {/* Payee */}
        <div className="input-container">
          <label className="input-label-modern">Payee (Destination Trucking)</label>
          <input
            type="text"
            value={apRecord?.trucking_dest_payee || ""}
            readOnly
            className="input-field-modern bg-gray-100 cursor-not-allowed"
            placeholder="Payee not found"
          />
        </div>

        {/* Amount + Check Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Destination Amount */}
          <div className="input-container">
            <label className="input-label-modern">Destination Amount *</label>
            <input
              type="number"
              step="0.01"
              {...register("trucking_dest_amount", { valueAsNumber: true })}
              placeholder="0.00"
              className={`input-field-modern ${
                errors.trucking_dest_amount ? "input-error" : ""
              }`}
            />
            {errors.trucking_dest_amount && (
              <p className="error-message">
                {errors.trucking_dest_amount.message}
              </p>
            )}
          </div>

          {/* Destination Check Date */}
          <div className="input-container">
            <label className="input-label-modern">Check Date</label>
            <Controller
              control={control}
              name="trucking_dest_check_date"
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
            {...register("trucking_dest_voucher")}
            placeholder="Voucher number"
            className={`input-field-modern ${
              errors.trucking_dest_voucher ? "input-error" : ""
            }`}
          />
          {errors.trucking_dest_voucher && (
            <p className="error-message">
              {errors.trucking_dest_voucher.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default APStep2;
