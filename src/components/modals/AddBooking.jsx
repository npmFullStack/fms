import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSchema } from "../../schemas/bookingSchema";
import useBookingStore from "../../utils/store/useBookingStore";
import usePartnerStore from "../../utils/store/usePartnerStore";
import useModal from "../../utils/hooks/useModal";
import FormModal from "./FormModal";

// Steps
import BookingStep1 from "./booking/BookingStep1";
import BookingStep2 from "./booking/BookingStep2";
import BookingStep3 from "./booking/BookingStep3";
import BookingStep4 from "./booking/BookingStep4";
import BookingStep5 from "./booking/BookingStep5";

// -- Generators --
const generateBookingNumber = () => {
  return "V000" + Math.floor(10000 + Math.random() * 90000);
};

let hwbCounter = 1;

const AddBooking = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const createBooking = useBookingStore((state) => state.createBooking);
  const { partners, fetchPartners } = usePartnerStore();

  const {
    message,
    isLoading,
    setIsLoading,
    setSuccessMessage,
    setErrorMessage,
    handleClose,
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
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(bookingSchema),
    mode: "onChange",
    defaultValues: {
      hwb_number: "",
      booking_number: "",
      shipper: "",
      first_name: "",
      last_name: "",
      phone: "",
      shipping_line_id: "",
      ship_id: "",
      container_type: "20FT",
      quantity: 1,
      booking_mode: "DOOR_TO_DOOR",
      origin_port: "",
      destination_port: "",
      origin_lat: "",
      origin_lng: "",
      destination_lat: "",
      destination_lng: "",
      pickup_stuffing_date: "",
      preferred_departure: "",
      preferred_delivery: "",
      commodity: "",
      van_number: "",
      seal_number: "",
      status: "PENDING",
      trucker_id: "",
      pickup_trucker_id: "",
      delivery_trucker_id: "",
      pickup_location: "",
      delivery_location: "",
      skipTrucking: false, // 👈 new field
    },
  });

  const bookingMode = watch("booking_mode");
  const skipTrucking = watch("skipTrucking");

  useEffect(() => {
    if (isOpen) {
      const newHwb = String(hwbCounter).padStart(4, "0");
      setValue("hwb_number", newHwb);
      hwbCounter += 1;
      setValue("booking_number", generateBookingNumber());
      fetchPartners();
    }
  }, [isOpen, setValue, fetchPartners]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const result = await createBooking(data);
      if (result.success) {
        setSuccessMessage("Booking created successfully");
        setTimeout(() => handleClose(), 1500);
      } else {
        setErrorMessage(result.error || "Failed to create booking");
      }
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
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
      <BookingStep4
        register={register}
        control={control}
        errors={errors}
        setValue={setValue}
        getValues={getValues}
      />
    ),
    5: <BookingStep5 control={control} />,
  };

  const tooltips = {
    1: "Enter shipper and contact details",
    2: "Select shipping line, ship, ports, container, and service mode",
    3: "Choose trucking company and truck (if applicable)",
    4: "Set pickup and delivery locations with map",
    5: "Review all booking details before submission",
  };

  const handleNext = () => {
    if (currentStep === 2 && skipTrucking) {
      setCurrentStep(4); // 👈 skip step 3 if PIER_TO_PIER
    } else {
      setCurrentStep((s) => s + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep === 4 && skipTrucking) {
      setCurrentStep(2); // 👈 go back directly to step 2
    } else {
      setCurrentStep((s) => s - 1);
    }
  };

  const footerButtons = (
    <div className="flex justify-between w-full">
      <button
        type="button"
        onClick={handlePrev}
        disabled={currentStep === 1}
        className="btn-secondary-modern"
      >
        Previous
      </button>
      <button
        type={currentStep < 5 ? "button" : "submit"}
        onClick={
          currentStep < 5
            ? handleNext
            : handleSubmit(onSubmit)
        }
        disabled={isLoading || isSubmitting}
        className="btn-primary-modern"
      >
        {currentStep < 5
          ? "Next"
          : isLoading || isSubmitting
          ? "Creating..."
          : "Create Booking"}
      </button>
    </div>
  );

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Booking"
      message={message}
      isLoading={isLoading}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit(onSubmit)}
      fields={[]}
      infoBox={{
        title: "Booking Info",
        items: [
          { text: `Step ${currentStep} of 5` },
          { text: tooltips[currentStep] },
          bookingMode === "PIER_TO_PIER"
            ? { text: "Skipping trucking step (Port-to-Port selected)" }
            : null,
        ].filter(Boolean),
      }}
      footer={footerButtons}
    >
      {stepComponents[currentStep]}
    </FormModal>
  );
};

export default AddBooking;
