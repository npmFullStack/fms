// components/modals/UpdateAP.jsx
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateAPFormSchema } from "../../schemas/apSchema";
import useFinanceStore from "../../utils/store/useFinanceStore";
import useModal from "../../utils/hooks/useModal";
import FormModal from "./FormModal";
import { toast } from "react-hot-toast";

// Steps
import APStep1 from "./ap/APStep1";
import APStep2 from "./ap/APStep2";
import APStep3 from "./ap/APStep3";
import APStep4 from "./ap/APStep4";
import APStep5 from "./ap/APStep5";

const UpdateAP = ({ isOpen, onClose, apId, apRecord }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const { updateAPRecord, loading: financeLoading } = useFinanceStore();

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
        resolver: zodResolver(updateAPFormSchema),
        mode: "onChange",
        defaultValues: {
            // Freight
            freight_amount: 0,
            freight_check_date: "",
            freight_voucher: "",

            // Trucking Origin
            trucking_origin_amount: 0,
            trucking_origin_check_date: "",
            trucking_origin_voucher: "",

            // Trucking Destination
            trucking_dest_amount: 0,
            trucking_dest_check_date: "",
            trucking_dest_voucher: "",

            // Port Charges
            crainage_amount: 0,
            crainage_check_date: "",
            crainage_voucher: "",

            arrastre_origin_amount: 0,
            arrastre_origin_check_date: "",
            arrastre_origin_voucher: "",

            arrastre_dest_amount: 0,
            arrastre_dest_check_date: "",
            arrastre_dest_voucher: "",

            wharfage_origin_amount: 0,
            wharfage_origin_check_date: "",
            wharfage_origin_voucher: "",

            wharfage_dest_amount: 0,
            wharfage_dest_check_date: "",
            wharfage_dest_voucher: "",

            labor_origin_amount: 0,
            labor_origin_check_date: "",
            labor_origin_voucher: "",

            labor_dest_amount: 0,
            labor_dest_check_date: "",
            labor_dest_voucher: "",

            // Misc Charges
            rebates_amount: 0,
            rebates_check_date: "",
            rebates_voucher: "",

            storage_amount: 0,
            storage_check_date: "",
            storage_voucher: "",

            facilitation_amount: 0,
            facilitation_check_date: "",
            facilitation_voucher: ""
        }
    });

    // Populate form with existing data when modal opens or record changes
    useEffect(() => {
        if (apRecord && isOpen) {
            const formData = {
                // Freight
                freight_amount: apRecord.freight_amount || 0,
                freight_check_date: apRecord.freight_check_date || "",
                freight_voucher: apRecord.freight_voucher || "",

                // Trucking Origin
                trucking_origin_amount: apRecord.trucking_origin_amount || 0,
                trucking_origin_check_date: apRecord.trucking_origin_check_date || "",
                trucking_origin_voucher: apRecord.trucking_origin_voucher || "",

                // Trucking Destination
                trucking_dest_amount: apRecord.trucking_dest_amount || 0,
                trucking_dest_check_date: apRecord.trucking_dest_check_date || "",
                trucking_dest_voucher: apRecord.trucking_dest_voucher || "",

                // Port Charges
                crainage_amount: apRecord.crainage_amount || 0,
                crainage_check_date: apRecord.crainage_check_date || "",
                crainage_voucher: apRecord.crainage_voucher || "",

                arrastre_origin_amount: apRecord.arrastre_origin_amount || 0,
                arrastre_origin_check_date: apRecord.arrastre_origin_check_date || "",
                arrastre_origin_voucher: apRecord.arrastre_origin_voucher || "",

                arrastre_dest_amount: apRecord.arrastre_dest_amount || 0,
                arrastre_dest_check_date: apRecord.arrastre_dest_check_date || "",
                arrastre_dest_voucher: apRecord.arrastre_dest_voucher || "",

                wharfage_origin_amount: apRecord.wharfage_origin_amount || 0,
                wharfage_origin_check_date: apRecord.wharfage_origin_check_date || "",
                wharfage_origin_voucher: apRecord.wharfage_origin_voucher || "",

                wharfage_dest_amount: apRecord.wharfage_dest_amount || 0,
                wharfage_dest_check_date: apRecord.wharfage_dest_check_date || "",
                wharfage_dest_voucher: apRecord.wharfage_dest_voucher || "",

                labor_origin_amount: apRecord.labor_origin_amount || 0,
                labor_origin_check_date: apRecord.labor_origin_check_date || "",
                labor_origin_voucher: apRecord.labor_origin_voucher || "",

                labor_dest_amount: apRecord.labor_dest_amount || 0,
                labor_dest_check_date: apRecord.labor_dest_check_date || "",
                labor_dest_voucher: apRecord.labor_dest_voucher || "",

                // Misc Charges
                rebates_amount: apRecord.rebates_amount || 0,
                rebates_check_date: apRecord.rebates_check_date || "",
                rebates_voucher: apRecord.rebates_voucher || "",

                storage_amount: apRecord.storage_amount || 0,
                storage_check_date: apRecord.storage_check_date || "",
                storage_voucher: apRecord.storage_voucher || "",

                facilitation_amount: apRecord.facilitation_amount || 0,
                facilitation_check_date: apRecord.facilitation_check_date || "",
                facilitation_voucher: apRecord.facilitation_voucher || ""
            };

            // Set all form values
            Object.entries(formData).forEach(([key, value]) => {
                setValue(key, value);
            });
        }
    }, [apRecord, isOpen, setValue]);

    const handleClose = () => {
        reset();
        setCurrentStep(1);
        modalClose();
        onClose();
    };

    // Step validation fields
    const stepValidationFields = {
        1: ["freight_amount", "freight_voucher"],
        2: ["trucking_origin_amount", "trucking_dest_amount"],
        3: [
            "crainage_amount",
            "arrastre_origin_amount",
            "arrastre_dest_amount",
            "wharfage_origin_amount",
            "wharfage_dest_amount",
            "labor_origin_amount",
            "labor_dest_amount"
        ],
        4: ["rebates_amount", "storage_amount", "facilitation_amount"],
        5: [] // No validation for review step
    };

    const onSubmit = async (data) => {
        try {
            setIsLoading(true);

            console.log("Submitting AP data:", data);

            // Format data for API
            const formattedData = {
                // Convert empty strings to null for dates
                freight_check_date: data.freight_check_date || null,
                trucking_origin_check_date: data.trucking_origin_check_date || null,
                trucking_dest_check_date: data.trucking_dest_check_date || null,
                crainage_check_date: data.crainage_check_date || null,
                arrastre_origin_check_date: data.arrastre_origin_check_date || null,
                arrastre_dest_check_date: data.arrastre_dest_check_date || null,
                wharfage_origin_check_date: data.wharfage_origin_check_date || null,
                wharfage_dest_check_date: data.wharfage_dest_check_date || null,
                labor_origin_check_date: data.labor_origin_check_date || null,
                labor_dest_check_date: data.labor_dest_check_date || null,
                rebates_check_date: data.rebates_check_date || null,
                storage_check_date: data.storage_check_date || null,
                facilitation_check_date: data.facilitation_check_date || null,

                // Convert empty strings to null for vouchers
                freight_voucher: data.freight_voucher || null,
                trucking_origin_voucher: data.trucking_origin_voucher || null,
                trucking_dest_voucher: data.trucking_dest_voucher || null,
                crainage_voucher: data.crainage_voucher || null,
                arrastre_origin_voucher: data.arrastre_origin_voucher || null,
                arrastre_dest_voucher: data.arrastre_dest_voucher || null,
                wharfage_origin_voucher: data.wharfage_origin_voucher || null,
                wharfage_dest_voucher: data.wharfage_dest_voucher || null,
                labor_origin_voucher: data.labor_origin_voucher || null,
                labor_dest_voucher: data.labor_dest_voucher || null,
                rebates_voucher: data.rebates_voucher || null,
                storage_voucher: data.storage_voucher || null,
                facilitation_voucher: data.facilitation_voucher || null,

                // Keep amounts as numbers
                freight_amount: data.freight_amount,
                trucking_origin_amount: data.trucking_origin_amount,
                trucking_dest_amount: data.trucking_dest_amount,
                crainage_amount: data.crainage_amount,
                arrastre_origin_amount: data.arrastre_origin_amount,
                arrastre_dest_amount: data.arrastre_dest_amount,
                wharfage_origin_amount: data.wharfage_origin_amount,
                wharfage_dest_amount: data.wharfage_dest_amount,
                labor_origin_amount: data.labor_origin_amount,
                labor_dest_amount: data.labor_dest_amount,
                rebates_amount: data.rebates_amount,
                storage_amount: data.storage_amount,
                facilitation_amount: data.facilitation_amount
            };

            const result = await updateAPRecord(apId, formattedData);

            if (result.success) {
                toast.success("Accounts Payable updated successfully");
                handleClose();
            } else {
                toast.error(result.error || "Failed to update AP. Please try again.");
            }
        } catch (err) {
            console.error("Submit error:", err);
            toast.error(err.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    const handleNext = async (e) => {
        e?.preventDefault();

        // Validate current step
        const fieldsToValidate = stepValidationFields[currentStep];
        
        if (fieldsToValidate?.length > 0) {
            const isValid = await trigger(fieldsToValidate);
            
            if (!isValid) {
                toast.error("Please fill in all required fields correctly");
                return;
            }
        }

        if (currentStep < 5) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrev = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    // Step components
    const stepComponents = {
        1: (
            <APStep1
                register={register}
                control={control}
                errors={errors}
                apRecord={apRecord}
            />
        ),
        2: (
            <APStep2
                register={register}
                control={control}
                errors={errors}
                apRecord={apRecord}
            />
        ),
        3: (
            <APStep3
                register={register}
                control={control}
                errors={errors}
                apRecord={apRecord}
            />
        ),
        4: (
            <APStep4
                register={register}
                control={control}
                errors={errors}
                apRecord={apRecord}
            />
        ),
        5: (
            <APStep5
                control={control}
                watch={watch}
                apRecord={apRecord}
            />
        )
    };

    const getStepTitle = () => {
        const titles = {
            1: "Freight Charges",
            2: "Trucking Charges",
            3: "Port Charges",
            4: "Miscellaneous Charges",
            5: "Review & Update"
        };
        return titles[currentStep];
    };

    const getStepDescription = () => {
        const descriptions = {
            1: "Update freight expenses and payment details",
            2: "Update origin and destination trucking charges",
            3: "Update all port-related charges and fees",
            4: "Update miscellaneous expenses and other charges",
            5: "Review all changes before updating"
        };
        return descriptions[currentStep];
    };

    return (
        <FormModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Update Booking"
            isLoading={isLoading}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit(onSubmit)}
            fields={[]}
            infoBox={{
                title: "AP Update Info",
                items: [
                    { text: `Step ${currentStep} of 5` },
                    { text: getStepDescription() },
                    apRecord && { 
                        text: `Booking: ${apRecord.booking_number} | HWB: ${apRecord.hwb_number}` 
                    }
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

                    {currentStep === 5 ? (
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary-modern"
                        >
                            {isLoading ? "Updating..." : "Update AP"}
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

export default UpdateAP;