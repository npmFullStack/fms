// src/components/modals/AddBooking.jsx
import { useState, useEffect } from "react";
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

// --- Generators ---
const generateBookingNumber = () => {
    return "V000" + Math.floor(10000 + Math.random() * 90000); // V000 + 5 random digits
};

// HWB counter (frontend only, should come from DB in real-world)
let hwbCounter = 1;

const AddBooking = ({ isOpen, onClose }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const createBooking = useBookingStore(state => state.createBooking);

    const {
        message,
        isLoading,
        setIsLoading,
        setSuccessMessage,
        setErrorMessage,
        handleClose
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
        formState: { errors, isSubmitting }
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
            origin: "",
            destination: "",
            origin_lat: "",
            origin_lng: "",
            destination_lat: "",
            destination_lng: "",
            pickup_stuffing_date: "",
            preferred_departure: "",
            preferred_delivery: "",
            commodity: "",
            freight_charge: 0,
            trucking_charge: 0,
            total_amount: 0,
            van_number: "",
            seal_number: "",
            status: "PENDING",
            trucker_id: ""
        }
    });

    // Auto-generate numbers when modal opens
    useEffect(() => {
        if (isOpen) {
            // Generate padded HWB number (0001, 0002, …)
            const newHwb = String(hwbCounter).padStart(4, "0");
            setValue("hwb_number", newHwb);
            hwbCounter += 1;

            // Generate booking number (V000xxxxx)
            setValue("booking_number", generateBookingNumber());
        }
    }, [isOpen, setValue]);

    const onSubmit = async data => {
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

    // stepComponents
const stepComponents = {
  1: <BookingStep1 register={register} control={control} errors={errors} />,
  2: (
    <BookingStep2
      register={register}
      control={control}
      errors={errors}
    />
  ),
  3: (
    <BookingStep3
      register={register}
      control={control}
      errors={errors}
      setValue={setValue}
      getValues={getValues}
    />
  ),
  4: <BookingStep4 register={register} control={control} errors={errors} />,
  5: <BookingStep5 register={register} control={control} errors={errors} />,
};


    const footerButtons = (
        <div className="flex justify-between w-full">
            <button
                type="button"
                onClick={() => setCurrentStep(s => s - 1)}
                disabled={currentStep === 1}
                className="btn-secondary-modern"
            >
                Previous
            </button>
            <button
                type={currentStep < 5 ? "button" : "submit"}
                onClick={
                    currentStep < 5
                        ? () => setCurrentStep(s => s + 1)
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
            fields={[]} // each step manages its fields
            infoBox={{
                title: "Booking Info",
                items: [{ text: `Step ${currentStep} of 5` }]
            }}
            footer={footerButtons}
        >
            {stepComponents[currentStep]}
        </FormModal>
    );
};

export default AddBooking;
