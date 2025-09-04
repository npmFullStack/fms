import { Controller } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

const BookingStep1 = ({ register, control, errors }) => {
  return (
    <div className="space-y-4">
      {/* Shipper, first_name, last_name, email same as before */}

      <div>
        <label className="input-label-modern">Phone Number</label>
        <Controller
          name="phone"
          control={control}
          rules={{
            required: "Phone number is required",
            validate: (value) =>
              value && (value.startsWith("+63") || value.startsWith("63"))
                ? true
                : "Philippine numbers should start with +63 or 63",
          }}
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
        {errors.phone && <p className="error-message">{errors.phone.message}</p>}
      </div>
    </div>
  );
};

export default BookingStep1;
