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
    const isPortToPort = bookingMode === "PIER_TO_PIER";

    // Update skipTrucking when booking mode changes
    useEffect(() => {
        setValue("skipTrucking", isPortToPort);
    }, [isPortToPort, setValue]);

    useEffect(() => {
        if (isOpen) fetchPartners();
    }, [isOpen, fetchPartners]);

    const handleClose = () => {
        reset();
        setCurrentStep(1);
        modalClose();
        onClose();
    };

    // Simple step validation
    const stepValidationFields = {
        1: ["shipper", "consignee"],
        2: ["shipping_line_id", "quantity", "commodity", "origin_port", "destination_port", "booking_mode"],
        3: isPortToPort ? [] : ["pickup_trucker_id", "delivery_trucker_id"],
        4: isPortToPort ? [] : ["pickup_province", "pickup_city", "pickup_barangay"],
        5: isPortToPort ? [] : ["delivery_province", "delivery_city", "delivery_barangay"],
        6: [] // No validation for review step
    };

    const onSubmit = async data => {
        try {
            setIsLoading(true);

            // Clean data for Port-to-Port
            const cleanedData = {
                ...data,
                ship_id: data.ship_id === "" ? null : data.ship_id,
                pickup_trucker_id: data.pickup_trucker_id === "" ? null : data.pickup_trucker_id,
                pickup_truck_id: data.pickup_truck_id === "" ? null : data.pickup_truck_id,
                delivery_trucker_id: data.delivery_trucker_id === "" ? null : data.delivery_trucker_id,
                delivery_truck_id: data.delivery_truck_id === "" ? null : data.delivery_truck_id,
                
                // For Port-to-Port: set all address fields to null
                pickup_province: isPortToPort ? null : data.pickup_province || null,
                pickup_city: isPortToPort ? null : data.pickup_city || null,
                pickup_barangay: isPortToPort ? null : data.pickup_barangay || null,
                pickup_street: isPortToPort ? null : data.pickup_street || null,
                delivery_province: isPortToPort ? null : data.delivery_province || null,
                delivery_city: isPortToPort ? null : data.delivery_city || null,
                delivery_barangay: isPortToPort ? null : data.delivery_barangay || null,
                delivery_street: isPortToPort ? null : data.delivery_street || null,

                // Clean contact fields
                first_name: data.first_name || null,
                last_name: data.last_name || null,
                phone: data.phone || null,
                consignee_name: data.consignee_name || null,
                consignee_phone: data.consignee_phone || null
            };

            // Remove skipTrucking before sending to backend
            delete cleanedData.skipTrucking;

            console.log("Submitting booking data:", cleanedData);

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

    const handleNext = async () => {
        // Validate current step
        const fieldsToValidate = stepValidationFields[currentStep];
        if (fieldsToValidate?.length > 0) {
            const isValid = await trigger(fieldsToValidate);
            if (!isValid) {
                toast.error("Please fill in all required fields");
                return;
            }
        }

        // Simple step progression
        if (currentStep === 2 && isPortToPort) {
            // Port-to-Port: skip to review
            setCurrentStep(6);
        } else if (currentStep < 6) {
            // Normal progression
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrev = () => {
        if (currentStep === 6 && isPortToPort) {
            // From review back to step 2 for Port-to-Port
            setCurrentStep(2);
        } else if (currentStep > 1) {
            // Normal back
            setCurrentStep(currentStep - 1);
        }
    };

    // Step components
    const stepComponents = {
        1: <BookingStep1 register={register} control={control} errors={errors} />,
        2: <BookingStep2 register={register} control={control} errors={errors} partners={partners} setValue={setValue} watch={watch} />,
        3: <BookingStep3 register={register} control={control} errors={errors} partners={partners} setValue={setValue} watch={watch} />,
        4: <BookingStep4PL register={register} control={control} errors={errors} setValue={setValue} getValues={getValues} />,
        5: <BookingStep4DL register={register} control={control} errors={errors} setValue={setValue} getValues={getValues} />,
        6: <BookingStep5 control={control} partners={partners} watch={watch} />
    };

    const getTotalSteps = () => isPortToPort ? 3 : 6;
    const getDisplayStep = () => {
        if (isPortToPort) {
            return currentStep === 6 ? 3 : currentStep;
        }
        return currentStep;
    };

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
                    { text: `Step ${getDisplayStep()} of ${getTotalSteps()}` },
                    isPortToPort 
                        ? { text: "Port-to-Port mode: No trucking or addresses needed" }
                        : { text: "Door-to-Door mode: Includes trucking and addresses" }
                ]
            }}
            footer={
                <div className="flex justify-between w-full">
                    <button
                        type="button"
                        onClick={handlePrev}
                        disabled={currentStep === 1 || isLoading}
                        className="btn-secondary-modern"
                    >
                        Previous
                    </button>

                    {currentStep === 6 ? (
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary-modern"
                        >
                            {isLoading ? "Creating..." : "Create Booking"}
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleNext}
                            disabled={isLoading}
                            className="btn-primary-modern"
                        >
                            Next
                        </button>
                    )}
                </div>
            }
        >
            {stepComponents[currentStep]}
        </FormModal>
    );
};

export default AddBooking;