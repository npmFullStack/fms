// src/components/modals/booking/BookingStep1.jsx
import { Controller } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import Datetime from "react-datetime";
import "react-phone-number-input/style.css";
import "react-datetime/css/react-datetime.css";
import moment from "moment";

const BookingStep1 = ({ register, control, errors }) => {
  return (
    <div className="space-y-4">
      {/* Shipper Section */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-700 mb-3">Shipper Information</h4>
        
        {/* Shipper */}
        <div className="mb-3">
          <label className="input-label-modern">Shipper Company *</label>
          <input
            {...register("shipper", {
              required: "Shipper is required",
            })}
            placeholder="Enter shipper/company name"
            className={`input-field-modern ${
              errors.shipper ? "input-error" : ""
            }`}
          />
          {errors.shipper && (
            <p className="error-message">{errors.shipper.message}</p>
          )}
        </div>

        {/* Contact Person */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="input-label-modern">First Name</label>
            <input
              {...register("first_name")}
              placeholder="e.g. Juan"
              className={`input-field-modern ${
                errors.first_name ? "input-error" : ""
              }`}
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
              className={`input-field-modern ${
                errors.last_name ? "input-error" : ""
              }`}
            />
            {errors.last_name && (
              <p className="error-message">{errors.last_name.message}</p>
            )}
          </div>
        </div>

        {/* Contact Number */}
        <div>
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
      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <h4 className="font-semibold text-green-700 mb-3">Consignee Information</h4>
        
        {/* Consignee */}
        <div className="mb-3">
          <label className="input-label-modern">Consignee Company *</label>
          <input
            {...register("consignee", {
              required: "Consignee is required",
            })}
            placeholder="Enter consignee/company name"
            className={`input-field-modern ${
              errors.consignee ? "input-error" : ""
            }`}
          />
          {errors.consignee && (
            <p className="error-message">{errors.consignee.message}</p>
          )}
        </div>

        {/* Consignee Contact Person */}
        <div className="mb-3">
          <label className="input-label-modern">Consignee Contact Name</label>
          <input
            {...register("consignee_name")}
            placeholder="Enter contact person name"
            className={`input-field-modern ${
              errors.consignee_name ? "input-error" : ""
            }`}
          />
          {errors.consignee_name && (
            <p className="error-message">{errors.consignee_name.message}</p>
          )}
        </div>

        {/* Consignee Phone Number */}
        <div>
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

      {/* Preferred Dates */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="input-label-modern">Preferred Departure Date *</label>
          <Controller
            name="preferred_departure"
            control={control}
            rules={{ required: "Preferred departure date is required" }}
            render={({ field }) => (
              <Datetime
                {...field}
                value={field.value ? moment(field.value) : ""}
                onChange={(date) =>
                  field.onChange(moment(date).format("YYYY-MM-DD"))
                }
                timeFormat={false}
                closeOnSelect={true}
                inputProps={{
                  placeholder: "Select departure date",
                  className: `input-field-modern ${
                    errors.preferred_departure ? "input-error" : ""
                  }`,
                }}
                isValidDate={(currentDate) => {
                  // Only allow future dates
                  return currentDate.isAfter(moment().subtract(1, 'day'));
                }}
              />
            )}
          />
          {errors.preferred_departure && (
            <p className="error-message">{errors.preferred_departure.message}</p>
          )}
        </div>
        <div>
          <label className="input-label-modern">Preferred Delivery Date</label>
          <Controller
            name="preferred_delivery"
            control={control}
            render={({ field }) => (
              <Datetime
                {...field}
                value={field.value ? moment(field.value) : ""}
                onChange={(date) =>
                  field.onChange(date ? moment(date).format("YYYY-MM-DD") : "")
                }
                timeFormat={false}
                closeOnSelect={true}
                inputProps={{
                  placeholder: "Select delivery date (optional)",
                  className: "input-field-modern",
                }}
                isValidDate={(currentDate) => {
                  // Only allow future dates
                  return currentDate.isAfter(moment().subtract(1, 'day'));
                }}
              />
            )}
          />
          {errors.preferred_delivery && (
            <p className="error-message">{errors.preferred_delivery.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingStep1;