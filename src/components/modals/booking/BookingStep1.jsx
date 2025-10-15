import { Controller } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import Datetime from "react-datetime";
import "react-phone-number-input/style.css";
import "react-datetime/css/react-datetime.css";
import { Calendar } from "lucide-react";

const BookingStep1 = ({ register, control, errors }) => {
  return (
    <div className="space-y-6">
      {/* Shipper Section */}
      <div>
        <h4 className="font-semibold text-slate-800 mb-4 text-lg">
          Shipper Information
        </h4>

        {/* Shipper */}
        <div className="input-container mb-4">
          <label className="input-label-modern">Shipper *</label>
          <input
            {...register("shipper", { required: "Shipper is required" })}
            placeholder="Enter shipper name"
            className={`input-field-modern ${errors.shipper ? "input-error" : ""}`}
          />
          {errors.shipper && (
            <p className="error-message">{errors.shipper.message}</p>
          )}
        </div>

        {/* Contact Person */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="input-label-modern">First Name</label>
            <input
              {...register("first_name")}
              placeholder="e.g. Juan"
              className={`input-field-modern ${errors.first_name ? "input-error" : ""}`}
            />
            {errors.first_name && (
              <p className="error-message">{errors.first_name.message}</p>
            )}
          </div>
          <div>
            <label className="input-label-modern">Last Name</label>
            <input
              {...register("last_name")}
              placeholder="e.g. Dela Cruz"
              className={`input-field-modern ${errors.last_name ? "input-error" : ""}`}
            />
            {errors.last_name && (
              <p className="error-message">{errors.last_name.message}</p>
            )}
          </div>
        </div>

        {/* Contact Number */}
        <div className="input-container mb-2">
          <label className="input-label-modern">Phone Number</label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <PhoneInput
                {...field}
                defaultCountry="PH"
                placeholder="Enter phone number (e.g., +639123456789)"
                className="input-field-modern"
                international
                withCountryCallingCode
              />
            )}
          />
          {errors.phone && (
            <p className="error-message">{errors.phone.message}</p>
          )}
        </div>
      </div>

      {/* Consignee Section */}
      <div>
        <h4 className="font-semibold text-slate-800 mb-4 text-lg">
          Consignee Information
        </h4>

        {/* Consignee */}
        <div className="input-container mb-4">
          <label className="input-label-modern">Consignee *</label>
          <input
            {...register("consignee", { required: "Consignee is required" })}
            placeholder="Enter consignee name"
            className={`input-field-modern ${errors.consignee ? "input-error" : ""}`}
          />
          {errors.consignee && (
            <p className="error-message">{errors.consignee.message}</p>
          )}
        </div>

        {/* Consignee Contact Name */}
        <div className="input-container mb-4">
          <label className="input-label-modern">Consignee Contact Name</label>
          <input
            {...register("consignee_name")}
            placeholder="Enter contact person name"
            className={`input-field-modern ${errors.consignee_name ? "input-error" : ""}`}
          />
          {errors.consignee_name && (
            <p className="error-message">{errors.consignee_name.message}</p>
          )}
        </div>

        {/* Consignee Phone */}
        <div className="input-container">
          <label className="input-label-modern">Consignee Phone Number</label>
          <Controller
            name="consignee_phone"
            control={control}
            render={({ field }) => (
              <PhoneInput
                {...field}
                defaultCountry="PH"
                placeholder="Enter consignee phone number"
                className="input-field-modern"
                international
                withCountryCallingCode
              />
            )}
          />
          {errors.consignee_phone && (
            <p className="error-message">{errors.consignee_phone.message}</p>
          )}
        </div>
      </div>

      {/* Booking Date Section */}
      <div>
        <h4 className="font-semibold text-slate-800 mb-4 text-lg">
          Booking Details
        </h4>
        <div className="input-container">
          <label className="input-label-modern">Booking Date</label>
          <div className="relative">
            <Controller
              name="booking_date"
              control={control}
              render={({ field }) => (
                <Datetime
                  {...field}
                  timeFormat={false}
                  dateFormat="YYYY-MM-DD"
                  closeOnSelect={true}
                  inputProps={{
                    className: `input-field-modern pr-10 cursor-pointer ${
                      errors.booking_date ? "input-error" : ""
                    }`,
                    placeholder: "Select booking date",
                  }}
                  onChange={(val) =>
                    field.onChange(val && val.format ? val.format("YYYY-MM-DD") : "")
                  }
                  value={field.value || ""}
                />
              )}
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
          </div>
          {errors.booking_date && (
            <p className="error-message">{errors.booking_date.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingStep1;
