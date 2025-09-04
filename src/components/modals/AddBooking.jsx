import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSchema } from "../../schemas/bookingSchema";
import useBookingStore from "../../utils/store/useBookingStore";
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
  const createBooking = useBookingStore(state => state.createBooking);

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
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(bookingSchema),
    mode: "onChange",
    defaultValues: {
      shipper: "",
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
      origin_lat: "",
      origin_lng: "",
      destination_lat: "",
      destination_lng: "",
      preferred_departure: "",
      preferred_delivery: "",
      commodity: "",
      quantity: 1,
      freight_charge: 0,
      trucking_charge: 0,
      total_amount: 0,
      van_number: "",
      seal_number: "",
      status: "PENDING",
      trucker_id: "",
    },
  });

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
    2: <BookingStep2 register={register} control={control} errors={errors} />,
    3: <BookingStep3 register={register} control={control} errors={errors} />,
    4: <BookingStep4 register={register} control={control} errors={errors} />,
    5: <BookingStep5 register={register} control={control} errors={errors} />,
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Booking"
      message={message}
      isLoading={isLoading}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit(onSubmit)}
      fields={[]} // each step manages its fields
      infoBox={{
        title: "Booking Info",
        items: [{ text: `Step ${currentStep} of 5` }],
      }}
      buttonText={currentStep < 5 ? "Next" : "Create Booking"}
    >
      {stepComponents[currentStep]}
      {/* Navigation */}
      <div className="flex justify-between mt-6 pt-4 border-t">
        <button
          type="button"
          onClick={() => setCurrentStep((s) => s - 1)}
          disabled={currentStep === 1}
          className="btn-secondary-modern"
        >
          Previous
        </button>
        <button
          type={currentStep < 5 ? "button" : "submit"}
          onClick={currentStep < 5 ? () => setCurrentStep((s) => s + 1) : undefined}
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
    </FormModal>
  );
};

export default AddBooking;
