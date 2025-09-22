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
import BookingStep4PL from "./booking/BookingStep4PL";
import BookingStep4DL from "./booking/BookingStep4DL";
import BookingStep5 from "./booking/BookingStep5";

const AddBooking = ({ isOpen, onClose }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const createBooking = useBookingStore(state => state.createBooking);
    const { partners, fetchPartners } = usePartnerStore();

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
            // Consignee
            consignee: "",
            consignee_name: "",
            consignee_phone: "",
            // Step 2
            shipping_line_id: "",
            ship_id: "",
            container_ids: [],
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
            // Step 4 & 5 (addresses only, no lat/lng)
            pickup_province: "",
            pickup_city: "",
            pickup_barangay: "",
            pickup_street: "",
            delivery_province: "",
            delivery_city: "",
            delivery_barangay: "",
            delivery_street: "",
            // Step 6
            status: "PICKUP_SCHEDULED",
            // Helpers
            skipTrucking: false
        }
    });

    const bookingMode = watch("booking_mode");
    const skipTrucking = watch("skipTrucking");

    useEffect(() => {
        if (isOpen) {
            fetchPartners();
        }
    }, [isOpen, fetchPartners]);

    const onSubmit = async data => {
        try {
            setIsLoading(true);
            const normalize = val =>
                val === "" || val === undefined ? null : val;

            const cleanedData = {
                ...data,
                shipping_line_id: normalize(data.shipping_line_id),
                pickup_trucker_id: normalize(data.pickup_trucker_id),
                pickup_truck_id: normalize(data.pickup_truck_id),
                delivery_trucker_id: normalize(data.delivery_trucker_id),
                delivery_truck_id: normalize(data.delivery_truck_id),
                consignee_name: normalize(data.consignee_name),
                consignee_phone: normalize(data.consignee_phone),
                container_ids: data.container_ids || []
            };

            console.log("Submitting booking data:", cleanedData);
            const result = await createBooking(cleanedData);

            if (result.success) {
                setSuccessMessage("Booking created successfully");
                setTimeout(() => handleClose(), 1500);
            } else {
                setErrorMessage(result.error || "Failed to create booking");
            }
        } catch (err) {
            console.error("Submit error:", err);
            setErrorMessage(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Step validation mapping
    const stepValidationFields = {
        1: ["shipper", "consignee"],
        2: [
            "shipping_line_id",
            "ship_id",
            "container_ids",
            "quantity",
            "commodity",
            "origin_port",
            "destination_port"
        ],
        3: [], // optional
        4: [], // optional
        5: [], // optional
        6: []  // review only
    };

    const handleNext = async () => {
        const fieldsToValidate = stepValidationFields[currentStep];
        if (fieldsToValidate?.length > 0) {
            const isValid = await trigger(fieldsToValidate);
            if (!isValid) return;
        }

        if (currentStep === 2 && skipTrucking) {
            setCurrentStep(4); // Skip trucking
        } else if (currentStep === 5) {
            setCurrentStep(6); // Go to review step
        } else {
            setCurrentStep(s => s + 1);
        }
    };

    const handlePrev = () => {
        if (currentStep === 4 && skipTrucking) {
            setCurrentStep(2);
        } else {
            setCurrentStep(s => s - 1);
        }
    };

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
        6: <BookingStep5 control={control} partners={partners} />
    };

    const tooltips = {
        1: "Enter shipper and consignee details",
        2: "Select shipping line, containers, ports, and service mode",
        3: "Choose trucking company and truck (if applicable)",
        4: "Set pickup location address",
        5: "Set delivery location address",
        6: "Review all booking details before submission"
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
                type={currentStep < 6 ? "button" : "submit"}
                onClick={currentStep < 6 ? handleNext : handleSubmit(onSubmit)}
                disabled={isLoading || isSubmitting}
                className="btn-primary-modern"
            >
                {currentStep < 6
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
            fields={{}}
            infoBox={{
                title: "Booking Info",
                items: [
                    { text: `Step ${currentStep} of 6` },
                    { text: tooltips[currentStep] },
                    bookingMode === "PIER_TO_PIER"
                        ? { text: "Skipping trucking step (Port-to-Port selected)" }
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
