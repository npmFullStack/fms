// Fixed AddShip.jsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { shipSchema } from "../../schemas/shipSchema";
import useModal from "../../utils/hooks/useModal";
import FormModal from "./FormModal";
import {
    QuestionMarkCircleIcon,
    InformationCircleIcon,
    CubeIcon,
    DocumentTextIcon
} from "@heroicons/react/24/outline";

const AddShip = ({ isOpen, onClose, onSubmit, shippingLineId }) => {
    const {
        message,
        isLoading,
        setIsLoading,
        setSuccessMessage,
        setErrorMessage,
        handleClose: modalClose
    } = useModal(() => {
        reset();
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(shipSchema),
        mode: "onChange",
        defaultValues: {
            shippingLineId, // ← ADD THIS! Same as AddContainer
            shipName: "",
            vesselNumber: "",
            remarks: ""
        }
    });

    // Use the same pattern as AddContainer
    const onFormSubmit = async data => {
        try {
            setIsLoading(true);
            setSuccessMessage("Adding ship...");

            console.log("🚢 Form data being submitted:", data);

            const result = await onSubmit({ ...data, shippingLineId });

            if (result.success) {
                setSuccessMessage("Ship added successfully");
                setTimeout(() => {
                    handleClose();
                }, 1500);
            } else {
                setErrorMessage(
                    result.error || "Failed to add ship. Please try again."
                );
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            setErrorMessage(
                error.message || "Failed to add ship. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        modalClose();
        onClose();
    };

    // Fields with tooltips
    const fields = [
        {
            name: "shipName",
            label: "Ship Name",
            type: "text",
            register: register("shipName"),
            error: errors.shipName?.message,
            placeholder: "Enter ship name",
            withTooltip: true,
            tooltipText: "The registered name of the vessel"
        },
        {
            name: "vesselNumber",
            label: "Vessel Number",
            type: "text",
            register: register("vesselNumber"),
            error: errors.vesselNumber?.message,
            placeholder: "Enter vessel number",
            withTooltip: true,
            tooltipText: "Unique identifier assigned to the ship"
        },
        {
            name: "remarks",
            label: "Remarks",
            type: "textarea",
            register: register("remarks"),
            error: errors.remarks?.message,
            placeholder: "Optional remarks...",
            withTooltip: true,
            tooltipText: "Add any extra notes about this ship"
        }
    ];

    // Info box like AddUser
    const infoBox = {
        title: "Ship Information Guidelines",
        items: [
            {
                icon: (
                    <CubeIcon className="h-3 w-3 mt-0.5 text-blue-500 flex-shrink-0" />
                ),
                text: "Each ship must belong to an existing shipping line"
            },
            {
                icon: (
                    <DocumentTextIcon className="h-3 w-3 mt-0.5 text-blue-500 flex-shrink-0" />
                ),
                text: "Vessel number should be unique per shipping line"
            },
            {
                icon: (
                    <InformationCircleIcon className="h-3 w-3 mt-0.5 text-blue-500 flex-shrink-0" />
                ),
                text: "Remarks field is optional for additional notes"
            }
        ]
    };

    return (
        <FormModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Add Ship"
            message={
                message.text ? { type: message.type, text: message.text } : null
            }
            isLoading={isLoading}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit(onFormSubmit)} 
            fields={fields}
            infoBox={infoBox}
            buttonText="Add Ship" 
        />
    );
};

export default AddShip;
