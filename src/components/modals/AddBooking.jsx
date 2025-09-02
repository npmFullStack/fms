// components/modals/AddBooking.jsx
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSchema } from "../../schemas/bookingSchema";
import { stepSchemas } from "../../schemas/bookingSchema";
import useBookingStore from "../../utils/store/useBookingStore";
import usePartnerStore from "../../utils/store/usePartnerStore";
import useShippingLineStore from "../../utils/store/useShippingLineStore";
import useTruckStore from "../../utils/store/useTruckStore";
import FormModal from "./FormModal";
import {
  MapPinIcon,
  TruckIcon,
  CubeIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  QuestionMarkCircleIcon,
  XMarkIcon,
  InformationCircleIcon
} from "@heroicons/react/24/outline";
import Select from "react-select";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import useModal from "../../utils/hooks/useModal";
import { useEffect, useState } from "react";

const AddBooking = ({ isOpen, onClose }) => {
  const {
    message,
    isLoading,
    setIsLoading,
    setSuccessMessage,
    setErrorMessage,
    handleClose: modalClose
  } = useModal(() => {
    reset();
    setCurrentStep(1);
    setSelectedShippingLine(null);
    setSelectedShip(null);
  });

  const createBooking = useBookingStore(state => state.createBooking);
  const { partners, fetchPartners } = usePartnerStore();
  const { ships, fetchShips } = useShippingLineStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedShippingLine, setSelectedShippingLine] = useState(null);
  const [selectedShip, setSelectedShip] = useState(null);

  const containerTypes = [
    { value: "LCL", label: "LCL" },
    { value: "20FT", label: "20FT" },
    { value: "40FT", label: "40FT" }
  ];

  const bookingModes = [
    { value: "DOOR_TO_DOOR", label: "Door to Door" },
    { value: "PIER_TO_PIER", label: "Pier to Pier" },
    { value: "CY_TO_DOOR", label: "CY to Door" },
    { value: "DOOR_TO_CY", label: "Door to CY" },
    { value: "CY_TO_CY", label: "CY to CY" }
  ];

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isValid, isSubmitting },
    watch,
    setValue,
    trigger,
    getValues,
    setError,
    clearErrors
  } = useForm({
    resolver: zodResolver(bookingSchema),
    mode: "onChange",
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      shipping_line_id: "",
      ship_id: "",
      container_type: "20FT",
      booking_mode: "DOOR_TO_DOOR",
      origin: "",
      destination: "",
      preferred_departure: "",
      preferred_delivery: "",
      commodity: "",
      quantity: 1,
      freight_charge: 0,
      trucking_charge: 0,
      total_amount: 0
    }
  });

  useEffect(() => {
    if (isOpen) {
      fetchPartners();
    }
  }, [isOpen, fetchPartners]);

  useEffect(() => {
    const freight = watch("freight_charge") || 0;
    const trucking = watch("trucking_charge") || 0;
    const total = Number(freight) + Number(trucking);
    setValue("total_amount", total);
  }, [watch("freight_charge"), watch("trucking_charge"), setValue]);

  const shippingLines = partners.filter(p => p.type === "shipping");

  const handleShippingLineChange = async selectedOption => {
    setSelectedShippingLine(selectedOption);
    setSelectedShip(null);
    setValue("shipping_line_id", selectedOption?.value || "", {
      shouldValidate: true
    });
    setValue("ship_id", "", { shouldValidate: true });
    if (selectedOption) {
      await fetchShips(selectedOption.value);
    }
  };

  const handleShipChange = selectedOption => {
    setSelectedShip(selectedOption);
    setValue("ship_id", selectedOption?.value || "", {
      shouldValidate: true
    });
  };

  const onSubmit = async data => {
    try {
      setIsLoading(true);

      const bookingData = {
        ...data,
        preferred_departure: new Date(data.preferred_departure).toISOString(),
        preferred_delivery: data.preferred_delivery
          ? new Date(data.preferred_delivery).toISOString()
          : null
      };

      const result = await createBooking(bookingData);
      if (result.success) {
        setSuccessMessage("Booking created successfully");
        setTimeout(() => {
          handleClose();
        }, 1500);
      } else {
        setErrorMessage(
          result.error || "Failed to create booking. Please try again."
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrorMessage(
        error.message || "Failed to create booking. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    modalClose();
    onClose();
  };

  const nextStep = async (e) => {
    e?.preventDefault(); // Prevent form submission
    e?.stopPropagation(); // Stop event bubbling
    
    console.log("Next step clicked, current step:", currentStep);
    
    // Clear previous errors
    clearErrors();
    
    // Get current step fields
    const stepFields = getStepFields(currentStep);
    console.log("Step fields:", stepFields);
    
    // Trigger validation for current step fields only
    const isStepValid = await trigger(stepFields);
    console.log("Is step valid:", isStepValid);
    console.log("Current errors:", errors);
    
    if (!isStepValid) {
      console.log("Validation failed, current errors:", errors);
      return;
    }

    // Additional validation using step schema
    const currentSchema = stepSchemas[currentStep - 1];
    const values = getValues();
    
    // Filter values to only include fields for current step
    const stepValues = {};
    stepFields.forEach(field => {
      stepValues[field] = values[field];
    });
    
    console.log("Step values for validation:", stepValues);
    
    const result = currentSchema.safeParse(stepValues);
    console.log("Schema validation result:", result);
    
    if (!result.success) {
      console.log("Schema validation errors:", result.error.errors);
      // Show validation errors in RHF
      result.error.errors.forEach(err => {
        setError(err.path[0], { message: err.message });
      });
      return;
    }

    console.log("Moving to next step");
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const getStepFields = step => {
    switch (step) {
      case 1:
        return ["first_name", "last_name", "email", "phone"];
      case 2:
        return ["shipping_line_id", "ship_id", "container_type", "booking_mode"];
      case 3:
        return ["origin", "destination", "preferred_departure", "preferred_delivery"];
      case 4:
        return ["commodity", "quantity"];
      case 5:
        return ["freight_charge", "trucking_charge"];
      default:
        return [];
    }
  };

  // Tooltip component
  const TooltipIcon = ({ text }) => (
    <div className="relative group inline-block ml-2">
      <QuestionMarkCircleIcon className="h-4 w-4 text-gray-400 cursor-help" />
      <div
        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden
          group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 z-50
          whitespace-nowrap"
      >
        {text}
        <div
          className="absolute top-full left-1/2 transform -translate-x-1/2 border-4
            border-transparent border-t-gray-800"
        ></div>
      </div>
    </div>
  );

  const fields = [
    // Step 1: Customer Details
    {
      name: "first_name",
      label: "First Name",
      type: "text",
      step: 1,
      register: register("first_name", {
        required: "First name is required"
      }),
      error: errors.first_name?.message,
      placeholder: "Enter customer's first name"
    },
    {
      name: "last_name",
      label: "Last Name",
      type: "text",
      step: 1,
      register: register("last_name", {
        required: "Last name is required"
      }),
      error: errors.last_name?.message,
      placeholder: "Enter customer's last name"
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      step: 1,
      register: register("email"),
      error: errors.email?.message,
      placeholder: "Enter customer's email",
      withTooltip: true,
      tooltipText: "Optional - Customer's email for notifications"
    },
    {
      name: "phone",
      label: "Phone Number",
      type: "custom",
      step: 1,
      error: errors.phone?.message,
      withTooltip: true,
      tooltipText: "Optional - Customer's contact number for updates",
      customRender: () => (
        <div>
          <div className="flex items-center mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <TooltipIcon text="Optional - Customer's contact number for updates" />
          </div>
          <Controller
            name="phone"
            control={control}
            render={({ field: { onChange, value } }) => (
              <PhoneInput
                value={value}
                onChange={onChange}
                defaultCountry="PH"
                className="input-field-modern"
                placeholder="Enter phone number"
              />
            )}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">
              {errors.phone.message}
            </p>
          )}
        </div>
      )
    },
    // Step 2: Shipping Details
    {
      name: "shipping_line_id",
      label: "Shipping Line",
      type: "custom",
      step: 2,
      error: errors.shipping_line_id?.message,
      withTooltip: true,
      tooltipText: "Select the shipping line that will handle the cargo",
      customRender: () => (
        <div>
          <div className="flex items-center mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Shipping Line
            </label>
            <TooltipIcon text="Select the shipping line that will handle the cargo" />
          </div>
          <Controller
            name="shipping_line_id"
            control={control}
            rules={{ required: "Shipping line is required" }}
            render={({ field }) => (
              <Select
                {...field}
                options={shippingLines.map(sl => ({
                  value: sl.id,
                  label: sl.name,
                  logo: sl.logo_url
                }))}
                value={selectedShippingLine}
                onChange={handleShippingLineChange}
                getOptionLabel={option => (
                  <div className="flex items-center gap-2">
                    {option.logo && (
                      <img
                        src={option.logo}
                        alt=""
                        className="w-6 h-6 rounded"
                      />
                    )}
                    <span>{option.label}</span>
                  </div>
                )}
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder="Select shipping line"
              />
            )}
          />
          {errors.shipping_line_id && (
            <p className="text-red-500 text-sm mt-1">
              {errors.shipping_line_id.message}
            </p>
          )}
        </div>
      )
    },
    {
      name: "ship_id",
      label: "Ship",
      type: "custom",
      step: 2,
      error: errors.ship_id?.message,
      withTooltip: true,
      tooltipText: "Select the specific vessel for this booking",
      customRender: () => (
        <div>
          <div className="flex items-center mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Ship
            </label>
            <TooltipIcon text="Select the specific vessel for this booking" />
          </div>
          <Controller
            name="ship_id"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={ships.map(ship => ({
                  value: ship.id,
                  label: ship.name,
                  vessel: ship.vessel_number
                }))}
                value={selectedShip}
                onChange={handleShipChange}
                getOptionLabel={option => (
                  <div>
                    <div className="font-medium">{option.label}</div>
                    {option.vessel && (
                      <div className="text-sm text-gray-500">
                        Vessel: {option.vessel}
                      </div>
                    )}
                  </div>
                )}
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder="Select ship"
                isDisabled={!selectedShippingLine}
              />
            )}
          />
          {errors.ship_id && (
            <p className="text-red-500 text-sm mt-1">
              {errors.ship_id.message}
            </p>
          )}
        </div>
      )
    },
    {
      name: "container_type",
      label: "Container Type",
      type: "custom",
      step: 2,
      error: errors.container_type?.message,
      withTooltip: true,
      tooltipText: "Choose the appropriate container size for your cargo",
      customRender: () => (
        <div>
          <div className="flex items-center mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Container Type
            </label>
            <TooltipIcon text="Choose the appropriate container size for your cargo" />
          </div>
          <Controller
            name="container_type"
            control={control}
            rules={{ required: "Container type is required" }}
            render={({ field }) => (
              <Select
                {...field}
                options={containerTypes}
                value={containerTypes.find(ct => ct.value === field.value)}
                onChange={opt => field.onChange(opt.value)}
                className="react-select-container"
                classNamePrefix="react-select"
              />
            )}
          />
          {errors.container_type && (
            <p className="text-red-500 text-sm mt-1">
              {errors.container_type.message}
            </p>
          )}
        </div>
      )
    },
    {
      name: "booking_mode",
      label: "Booking Mode",
      type: "custom",
      step: 2,
      error: errors.booking_mode?.message,
      withTooltip: true,
      tooltipText: "Select the service type for your shipment",
      customRender: () => (
        <div>
          <div className="flex items-center mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Booking Mode
            </label>
            <TooltipIcon text="Select the service type for your shipment" />
          </div>
          <Controller
            name="booking_mode"
            control={control}
            rules={{ required: "Booking mode is required" }}
            render={({ field }) => (
              <Select
                {...field}
                options={bookingModes}
                value={bookingModes.find(bm => bm.value === field.value)}
                onChange={opt => field.onChange(opt.value)}
                className="react-select-container"
                classNamePrefix="react-select"
              />
            )}
          />
          {errors.booking_mode && (
            <p className="text-red-500 text-sm mt-1">
              {errors.booking_mode.message}
            </p>
          )}
        </div>
      )
    },
    // Step 3: Route & Dates
    {
      name: "origin",
      label: "Origin",
      type: "text",
      step: 3,
      register: register("origin", { required: "Origin is required" }),
      error: errors.origin?.message,
      placeholder: "e.g., Manila Port, Philippines",
      withTooltip: true,
      tooltipText: "Starting point of the shipment"
    },
    {
      name: "destination",
      label: "Destination",
      type: "text",
      step: 3,
      register: register("destination", {
        required: "Destination is required"
      }),
      error: errors.destination?.message,
      placeholder: "e.g., Singapore Port",
      withTooltip: true,
      tooltipText: "Final destination of the shipment"
    },
    {
      name: "preferred_departure",
      label: "Preferred Departure",
      type: "date",
      step: 3,
      register: register("preferred_departure", {
        required: "Departure date is required"
      }),
      error: errors.preferred_departure?.message,
      withTooltip: true,
      tooltipText: "Estimated date when cargo should depart"
    },
    {
      name: "preferred_delivery",
      label: "Preferred Delivery",
      type: "date",
      step: 3,
      register: register("preferred_delivery"),
      error: errors.preferred_delivery?.message,
      withTooltip: true,
      tooltipText: "Estimated date when cargo should be delivered"
    },
    // Step 4: Cargo Details
    {
      name: "commodity",
      label: "Commodity",
      type: "text",
      step: 4,
      register: register("commodity", {
        required: "Commodity is required"
      }),
      error: errors.commodity?.message,
      placeholder: "e.g., Electronics, Furniture, etc.",
      withTooltip: true,
      tooltipText: "Type of goods being shipped"
    },
    {
      name: "quantity",
      label: "Quantity",
      type: "number",
      step: 4,
      register: register("quantity", {
        required: "Quantity is required",
        valueAsNumber: true,
        min: { value: 1, message: "Quantity must be at least 1" }
      }),
      error: errors.quantity?.message,
      min: 1,
      withTooltip: true,
      tooltipText: "Number of containers or units"
    },
    // Step 5: Pricing
    {
      name: "freight_charge",
      label: "Freight Charge",
      type: "number",
      step: 5,
      register: register("freight_charge", {
        valueAsNumber: true,
        min: { value: 0, message: "Freight charge cannot be negative" }
      }),
      error: errors.freight_charge?.message,
      step: "0.01",
      withTooltip: true,
      tooltipText: "Cost for ocean freight shipping"
    },
    {
      name: "trucking_charge",
      label: "Trucking Charge",
      type: "number",
      step: 5,
      register: register("trucking_charge", {
        valueAsNumber: true,
        min: { value: 0, message: "Trucking charge cannot be negative" }
      }),
      error: errors.trucking_charge?.message,
      step: "0.01",
      withTooltip: true,
      tooltipText: "Cost for land transportation"
    },
    {
      name: "total_amount",
      label: "Total Amount",
      type: "number",
      step: 5,
      register: register("total_amount", { valueAsNumber: true }),
      error: errors.total_amount?.message,
      step: "0.01",
      disabled: true,
      withTooltip: true,
      tooltipText: "Automatically calculated total cost"
    }
  ];

  const currentStepFields = fields.filter(field => field.step === currentStep);

  const infoBox = {
    title: "Booking Information",
    items: [
      {
        icon: (
          <TruckIcon className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
        ),
        text: "All shipping details will be confirmed after booking"
      },
      {
        icon: (
          <MapPinIcon className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
        ),
        text: "Trucking will be arranged based on booking mode"
      },
      {
        icon: (
          <CalendarIcon className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
        ),
        text: "Dates are estimates and subject to change based on availability"
      }
    ]
  };

  return (
    <>
      {/* Custom Modal instead of FormModal for better control */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={handleClose}
          />
          
          {/* Modal */}
          <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[95vh] overflow-hidden">
              {/* Header */}
              <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-2xl px-6 py-3 text-center">
                <button
                  onClick={handleClose}
                  className="absolute top-2 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
                <h2 className="text-xl font-bold text-white">Create New Booking</h2>
                <div className="text-white/80 text-sm mt-1">
                  Step {currentStep} of 5
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Content */}
                <div className="p-5 max-h-[calc(95vh-200px)] overflow-y-auto space-y-5">
                  {/* Message */}
                  {message && (
                    <div
                      className={`p-3 rounded-xl border text-sm ${
                        message.type === "success"
                          ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                          : "bg-red-50 border-red-200 text-red-700"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <InformationCircleIcon className="h-4 w-4" />
                        {message.text}
                      </div>
                    </div>
                  )}

                  {/* Fields */}
                  {currentStepFields.map(f => (
                    <div key={f.name} className="space-y-2">
                      {f.type === "custom" && f.customRender ? (
                        f.customRender()
                      ) : (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {f.label}
                            {f.withTooltip && (
                              <TooltipIcon text={f.tooltipText} />
                            )}
                          </label>
                          {f.type === "textarea" ? (
                            <textarea
                              {...f.register}
                              placeholder={f.placeholder}
                              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                f.error ? "border-red-300" : "border-gray-300"
                              }`}
                            />
                          ) : (
                            <input
                              type={f.type}
                              {...f.register}
                              placeholder={f.placeholder}
                              disabled={f.disabled}
                              min={f.min}
                              step={f.step}
                              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                f.error ? "border-red-300" : "border-gray-300"
                              } ${f.disabled ? "bg-gray-100" : ""}`}
                            />
                          )}
                          {f.error && (
                            <p className="text-red-500 text-sm mt-1">
                              {f.error}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Info Box */}
                  {infoBox && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-1.5 bg-blue-100 rounded-lg">
                          <InformationCircleIcon className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-slate-800 mb-2">
                            {infoBox.title}
                          </h4>
                          <div className="space-y-1.5 text-xs text-slate-600">
                            {infoBox.items.map((item, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                {item.icon}
                                <span>{item.text}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-gray-200">
                  <div className="flex justify-between">
                    {currentStep > 1 && (
                      <button
                        type="button"
                        onClick={prevStep}
                        className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <ArrowLeftIcon className="h-4 w-4" />
                        Previous
                      </button>
                    )}
                    
                    <div className="flex gap-3 ml-auto">
                      <button
                        type="button"
                        onClick={handleClose}
                        className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                      
                      {currentStep < 5 ? (
                        <button
                          type="button"
                          onClick={nextStep}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Next
                          <ArrowRightIcon className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={isSubmitting || isLoading}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                        >
                          {isLoading || isSubmitting ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              Creating...
                            </>
                          ) : (
                            "Create Booking"
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddBooking;