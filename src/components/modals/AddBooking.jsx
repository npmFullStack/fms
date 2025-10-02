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

  useEffect(() => {
    if (isOpen) fetchPartners();
  }, [isOpen, fetchPartners]);

  const handleClose = () => {
    modalClose();
    onClose();
  };

  const onSubmit = async data => {
    try {
      setIsLoading(true);

      const isPortToPort = data.booking_mode === "PIER_TO_PIER";

      const cleanedData = {
        ...data,
        ship_id: data.ship_id || null,
        pickup_trucker_id: data.pickup_trucker_id || null,
        pickup_truck_id: data.pickup_truck_id || null,
        delivery_trucker_id: data.delivery_trucker_id || null,
        delivery_truck_id: data.delivery_truck_id || null,

        // Port-to-Port clears addresses
        pickup_province: isPortToPort ? null : data.pickup_province || null,
        pickup_city: isPortToPort ? null : data.pickup_city || null,
        pickup_barangay: isPortToPort ? null : data.pickup_barangay || null,
        pickup_street: isPortToPort ? null : data.pickup_street || null,
        delivery_province: isPortToPort ? null : data.delivery_province || null,
        delivery_city: isPortToPort ? null : data.delivery_city || null,
        delivery_barangay: isPortToPort ? null : data.delivery_barangay || null,
        delivery_street: isPortToPort ? null : data.delivery_street || null,

        first_name: data.first_name || null,
        last_name: data.last_name || null,
        phone: data.phone || null,
        consignee_name: data.consignee_name || null,
        consignee_phone: data.consignee_phone || null
      };

      delete cleanedData.skipTrucking;

      const result = await createBooking(cleanedData);

      if (result.success) {
        toast.success("Booking created successfully");
        handleClose();
      } else {
        toast.error(result.error || "Failed to add booking. Please try again.");
      }
    } catch (err) {
      console.error("Submit error:", err);
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const stepValidationFields = {
    1: ["shipper", "consignee"],
    2: [
      "shipping_line_id",
      "quantity",
      "commodity",
      "origin_port",
      "destination_port",
      "booking_mode"
    ]
  };

  const isPortToPort = bookingMode === "PIER_TO_PIER";

  const handleNext = async () => {
    const fieldsToValidate = stepValidationFields[currentStep];
    if (fieldsToValidate?.length > 0) {
      const isValid = await trigger(fieldsToValidate);
      if (!isValid) {
        toast.error("Please fill in all required fields");
        return;
      }
    }

    if (currentStep === 2 && isPortToPort) {
      setCurrentStep(6); // jump straight to review
    } else if (currentStep === 2 && skipTrucking) {
      setCurrentStep(4); // skip trucking company, go to pickup address
    } else {
      setCurrentStep(s => s + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep === 6) {
      if (isPortToPort) setCurrentStep(2);
      else if (skipTrucking) setCurrentStep(5);
      else setCurrentStep(5);
    } else if (currentStep === 4 && skipTrucking) {
      setCurrentStep(2);
    } else {
      setCurrentStep(s => Math.max(1, s - 1));
    }
  };

  const stepComponents = {
    1: <BookingStep1 register={register} control={control} errors={errors} />,
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
    3: "Choose trucking company and truck",
    4: "Set pickup location address",
    5: "Set delivery location address",
    6: "Review all booking details before submission"
  };

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
          ? isLoading
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
            ? { text: "Port-to-Port mode: Skipping trucking/address steps" }
            : skipTrucking
            ? { text: "Skipping trucking company selection" }
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
