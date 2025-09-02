// components/modals/AddBooking.jsx
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSchema } from "../../schemas/bookingSchema";
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
  QuestionMarkCircleIcon
} from "@heroicons/react/24/outline";
import Select from "react-select";
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
    getValues
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

  const handleShippingLineChange = async (selectedOption) => {
    setSelectedShippingLine(selectedOption);
    setSelectedShip(null);
    setValue("shipping_line_id", selectedOption?.value || "", { shouldValidate: true });
    setValue("ship_id", "", { shouldValidate: true });
    
    if (selectedOption) {
      await fetchShips(selectedOption.value);
    }
  };

  const handleShipChange = (selectedOption) => {
    setSelectedShip(selectedOption);
    setValue("ship_id", selectedOption?.value || "", { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      
      const bookingData = {
        ...data,
        preferred_departure: new Date(data.preferred_departure).toISOString(),
        preferred_delivery: data.preferred_delivery ? new Date(data.preferred_delivery).toISOString() : null
      };

      const result = await createBooking(bookingData);

      if (result.success) {
        setSuccessMessage("Booking created successfully");
        setTimeout(() => {
          handleClose();
        }, 1500);
      } else {
        setErrorMessage(result.error || "Failed to create booking. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrorMessage(error.message || "Failed to create booking. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    modalClose();
    onClose();
  };

  const nextStep = async () => {
    const fieldsToValidate = getStepFields(currentStep);
    const isValid = await trigger(fieldsToValidate, { shouldFocus: true });
    
    console.log("Next step validation:", isValid, fieldsToValidate);
    
    if (isValid) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const getStepFields = (step) => {
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
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 z-50 whitespace-nowrap">
        {text}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
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
      register: register("first_name", { required: "First name is required" }),
      error: errors.first_name?.message,
      placeholder: "Enter customer's first name"
    },
    {
      name: "last_name",
      label: "Last Name",
      type: "text",
      step: 1,
      register: register("last_name", { required: "Last name is required" }),
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
      type: "tel",
      step: 1,
      register: register("phone"),
      error: errors.phone?.message,
      placeholder: "Enter customer's phone number",
      withTooltip: true,
      tooltipText: "Optional - Customer's contact number for updates"
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
                      <img src={option.logo} alt="" className="w-6 h-6 rounded" />
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
            <p className="text-red-500 text-sm mt-1">{errors.shipping_line_id.message}</p>
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
                      <div className="text-sm text-gray-500">Vessel: {option.vessel}</div>
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
            <p className="text-red-500 text-sm mt-1">{errors.ship_id.message}</p>
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
            <p className="text-red-500 text-sm mt-1">{errors.container_type.message}</p>
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
            <p className="text-red-500 text-sm mt-1">{errors.booking_mode.message}</p>
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
      register: register("destination", { required: "Destination is required" }),
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
      register: register("preferred_departure", { required: "Departure date is required" }),
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
      register: register("commodity", { required: "Commodity is required" }),
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
        icon: <TruckIcon className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />,
        text: "All shipping details will be confirmed after booking"
      },
      {
        icon: <MapPinIcon className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />,
        text: "Trucking will be arranged based on booking mode"
      },
      {
        icon: <CalendarIcon className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />,
        text: "Dates are estimates and subject to change based on availability"
      }
    ]
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Booking"
      message={message}
      isLoading={isLoading}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit(onSubmit)}
      fields={currentStepFields}
      infoBox={infoBox}
      buttonText={currentStep === 5 ? "Create Booking" : "Next"}
      customFooter={(
        <div className="flex justify-between mt-6">
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
          
          {currentStep < 5 ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ml-auto"
            >
              Next
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors ml-auto"
            >
              Create Booking
            </button>
          )}
        </div>
      )}
    />
  );
};

export default AddBooking;