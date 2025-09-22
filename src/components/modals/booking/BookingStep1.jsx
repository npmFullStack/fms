// src/components/modals/booking/BookingStep1.jsx
import { Controller } from "react-hook-form";
import PhoneInput from "react-phone-number-input";

const BookingStep1 = ({ register, control, errors }) => {
    return (
        <div className="space-y-4">
            {/* Shipper Section */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-700 mb-3">Shipper Information</h4>

                {/* Shipper */}
                <div className="mb-3">
                    <label className="input-label-modern">Shipper</label>
                    <input
                        {...register("shipper", {
                            required: "Shipper is required",
                        })}
                        placeholder="Enter shipper name"
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
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-700 mb-3">Consignee Information</h4>

                {/* Consignee */}
                <div className="mb-3">
                    <label className="input-label-modern">Consignee</label>
                    <input
                        {...register("consignee", {
                            required: "Consignee is required",
                        })}
                        placeholder="Enter consignee name"
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
        </div>
    );
};

export default BookingStep1;