// components/modals/AddBooking.jsx
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
      // Step 1
      booking_date: "",
      shipper: "",
      first_name: "",
      last_name: "",
      phone: "",

      // Step 2
      shipping_line_id: "",
      ship_id: "",
      container_type: "20FT",
      quantity: 1,
      booking_mode: "DOOR_TO_DOOR",
      origin_port: "",
      destination_port: "",
      commodity: "",

      // Step 3
      pickup_trucker_id: "",
      pickup_truck_id: "",
      delivery_trucker_id: "",
      delivery_truck_id: "",

      // Step 4
      pickup_location: "",
      delivery_location: "",
      pickup_lat: undefined,
      pickup_lng: undefined,
      delivery_lat: undefined,
      delivery_lng: undefined,

      // Step 5
      preferred_departure: "",
      preferred_delivery: "",
      van_number: "",
      seal_number: "",
      status: "PENDING",

      // Helpers
      skipTrucking: false,
    },
  });

  const bookingMode = watch("booking_mode");
  const skipTrucking = watch("skipTrucking");

  useEffect(() => {
    if (isOpen) {
      fetchPartners();
    }
  }, [isOpen, fetchPartners]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      const cleanedData = {
        ...data,
        pickup_trucker_id: data.pickup_trucker_id || null,
        pickup_truck_id: data.pickup_truck_id || null,
        delivery_trucker_id: data.delivery_trucker_id || null,
        delivery_truck_id: data.delivery_truck_id || null,
        preferred_delivery: data.preferred_delivery || null,
        van_number: data.van_number || null,
        seal_number: data.seal_number || null,
      };

      const result = await createBooking(cleanedData);
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
    5: <BookingStep5 control={control} partners={partners} />,
  };

  const tooltips = {
    1: "Enter booking date, shipper and contact details",
    2: "Select shipping line, ship, ports, container, and service mode",
    3: "Choose trucking company and truck (if applicable)",
    4: "Set pickup and delivery locations with map",
    5: "Review all booking details before submission",
  };

  const handleNext = () => {
    if (currentStep === 2 && skipTrucking) {
      setCurrentStep(4);
    } else {
      setCurrentStep((s) => s + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep === 4 && skipTrucking) {
      setCurrentStep(2);
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
