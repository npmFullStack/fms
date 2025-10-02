// components/modals/AddBooking.jsx
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSchema } from "../../schemas/bookingSchema";
import useBookingStore from "../../utils/store/useBookingStore";
import usePartnerStore from "../../utils/store/usePartnerStore";
import useModal from "../../utils/hooks/useModal";
import FormModal from "./FormModal";
import { toast } from "react-hot-toast";

// Steps
import BookingStep1 from "./booking/BookingStep1";
import BookingStep2 from "./booking/BookingStep2";
import BookingStep3 from "./booking/BookingStep3";
import BookingStep4PL from "./booking/BookingStep4PL";
import BookingStep4DL from "./booking/BookingStep4DL";
import BookingStep5 from "./booking/BookingStep5";

const AddBooking = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const createBooking = useBookingStore(state => state.createBooking);
  const { partners, fetchPartners } = usePartnerStore();

  const {
    isLoading,
    setIsLoading,
    handleClose: modalClose
  } = useModal(() => {
    reset();
    setCurrentStep(1);
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    getValues,
    trigger,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(bookingSchema),
    mode: "onChange",
    defaultValues: {
      shipper: "",
      first_name: "",
      last_name: "",
      phone: "",
      consignee: "",
      consignee_name: "",
      consignee_phone: "",
      shipping_line_id: "",
      ship_id: "",
      container_ids: [],
      quantity: 1,
      booking_mode: "DOOR_TO_DOOR",
      origin_port: "",
      destination_port: "",
      commodity: "",
      pickup_trucker_id: "",
      pickup_truck_id: "",
      delivery_trucker_id: "",
      delivery_truck_id: "",
      pickup_province: "",
      pickup_city: "",
      pickup_barangay: "",
      pickup_street: "",
      delivery_province: "",
      delivery_city: "",
      delivery_barangay: "",
      delivery_street: "",
      status: "PICKUP_SCHEDULED",
      skipTrucking: false
    }
  });

  const bookingMode = watch("booking_mode");
  const skipTrucking = watch("skipTrucking");

  // Fetch partners on open
  useEffect(() => {
    if (isOpen) fetchPartners();
  }, [isOpen, fetchPartners]);

  const handleClose = () => {
    modalClose();
    onClose();
  };

  const onSubmit = async data => {
    console.log("🚀 Form submitted with data:", data);
    console.log("📝 Form errors:", errors);
    
    try {
      setIsLoading(true);
      
      // Clean empty strings to null for UUID fields
      const cleanedData = {
        ...data,
        ship_id: data.ship_id === "" ? null : data.ship_id,
        pickup_trucker_id: data.pickup_trucker_id === "" ? null : data.pickup_trucker_id,
        pickup_truck_id: data.pickup_truck_id === "" ? null : data.pickup_truck_id,
        delivery_trucker_id: data.delivery_trucker_id === "" ? null : data.delivery_trucker_id,
        delivery_truck_id: data.delivery_truck_id === "" ? null : data.delivery_truck_id,
        // Clean address fields
        pickup_province: data.pickup_province || null,
        pickup_city: data.pickup_city || null,
        pickup_barangay: data.pickup_barangay || null,
        pickup_street: data.pickup_street || null,
        delivery_province: data.delivery_province || null,
        delivery_city: data.delivery_city || null,
        delivery_barangay: data.delivery_barangay || null,
        delivery_street: data.delivery_street || null,
        first_name: data.first_name || null,
        last_name: data.last_name || null,
        phone: data.phone || null,
        consignee_name: data.consignee_name || null,
        consignee_phone: data.consignee_phone || null
      };

      // Remove skipTrucking before sending to backend
      delete cleanedData.skipTrucking;

      console.log("✅ Cleaned data being sent:", cleanedData);

      const result = await createBooking(cleanedData);
      
      console.log("📦 Result from createBooking:", result);
      
      if (result.success) {
        toast.success("Booking created successfully");
        handleClose();
      } else {
        toast.error(result.error || "Failed to add booking. Please try again.");
      }
    } catch (err) {
      console.error("❌ Submit error:", err);
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // Step validation rules
  const stepValidationFields = {
    1: ["shipper", "consignee"],
    2: [
      "shipping_line_id",
      "quantity",
      "commodity",
      "origin_port",
      "destination_port",
      "booking_mode"
    ],
    3: [],
    4: [],
    5: [],
    6: []
  };

  const isPortToPort = bookingMode === "PIER_TO_PIER";

  const handleNext = async () => {
    const fieldsToValidate = stepValidationFields[currentStep];
    
    console.log(`📍 Step ${currentStep} - Validating fields:`, fieldsToValidate);
    
    if (fieldsToValidate?.length > 0) {
      const isValid = await trigger(fieldsToValidate);
      console.log(`✓ Validation result for step ${currentStep}:`, isValid);
      console.log("Current errors:", errors);
      
      if (!isValid) {
        toast.error("Please fill in all required fields");
        return;
      }
    }

    // Navigation logic
    if (currentStep === 2 && isPortToPort) {
      setCurrentStep(6);
    } else if (currentStep === 2 && skipTrucking) {
      setCurrentStep(6);
    } else if (currentStep === 5) {
      setCurrentStep(6);
    } else {
      setCurrentStep(s => s + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep === 6 && (isPortToPort || skipTrucking)) {
      setCurrentStep(2);
    } else {
      setCurrentStep(s => s - 1);
    }
  };

  // Step components
  const stepComponents = {
    1: (
      <BookingStep1
        register={register}
        control={control}
        errors={errors}
      />
    ),
    2: (
      <BookingStep2
        register={register}
        control={control}
        errors={errors}
        partners={partners}
        setValue={setValue}
        watch={watch}
      />
    ),
    3: (
      <BookingStep3
        register={register}
        control={control}
        errors={errors}
        partners={partners}
        setValue={setValue}
        watch={watch}
      />
    ),
    4: (
      <BookingStep4PL
        register={register}
        control={control}
        errors={errors}
        setValue={setValue}
        getValues={getValues}
      />
    ),
    5: (
      <BookingStep4DL
        register={register}
        control={control}
        errors={errors}
        setValue={setValue}
        getValues={getValues}
      />
    ),
    6: <BookingStep5 control={control} partners={partners} watch={watch} />
  };

  const tooltips = {
    1: "Enter shipper and consignee details",
    2: "Select shipping line, containers, ports, and service mode",
    3: "Choose trucking company and truck (if applicable)",
    4: "Set pickup location address",
    5: "Set delivery location address",
    6: "Review all booking details before submission"
  };

  // Footer navigation
  const footerButtons = (
    <div className="flex justify-between w-full">
      <button
        type="button"
        onClick={handlePrev}
        disabled={currentStep === 1 || isLoading}
        className="btn-secondary-modern"
      >
        Previous
      </button>
      <button
        type={currentStep === 6 ? "submit" : "button"}
        onClick={currentStep === 6 ? undefined : handleNext}
        disabled={isLoading || isSubmitting}
        className="btn-primary-modern"
      >
        {currentStep === 6
          ? isLoading || isSubmitting
            ? "Creating..."
            : "Create Booking"
          : "Next"}
      </button>
    </div>
  );

  return (
    <FormModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Booking"
      isLoading={isLoading}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit(onSubmit)}
      fields={[]}
      infoBox={{
        title: "Booking Info",
        items: [
          { text: `Step ${currentStep} of 6` },
          { text: tooltips[currentStep] },
          isPortToPort
            ? { text: "Skipping trucking steps (Port-to-Port selected)" }
            : null
        ].filter(Boolean)
      }}
      footer={footerButtons}
    >
      {stepComponents[currentStep]}
    </FormModal>
  );
};

export default AddBooking;