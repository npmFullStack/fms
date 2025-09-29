import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { shipSchema } from "../../schemas/shipSchema";
import useModal from "../../utils/hooks/useModal";
import FormModal from "./FormModal";
import { toast } from "react-hot-toast";

const AddShip = ({ isOpen, onClose, onSubmit, shippingLineId }) => {
    const {
        isLoading,
        setIsLoading,
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
        mode: "onChange"
    });

    const handleFormSubmit = async data => {
        try {
            setIsLoading(true);
            const result = await onSubmit(data);

            if (result.success) {
                toast.success("Ship added successfully");
                handleClose();
                reset();
            } else {
                toast.error(
                    result.error || "Failed to add ship. Please try again."
                );
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error(
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

    const fields = [
        {
            name: "name",
            label: "Ship Name",
            type: "text",
            register: register("name"),
            error: errors.name?.message,
            placeholder: "Enter ship name"
        },
        {
            name: "vesselNumber",
            label: "Vessel Number",
            type: "text",
            register: register("vesselNumber"),
            error: errors.vesselNumber?.message,
            placeholder: "Enter vessel number"
        }
    ];

    const infoBox = {
        title: "Ship Information",
        items: [
            { text: "Ship names must be unique within the shipping line." },
            { text: "Vessel numbers are used for tracking and identification." }
        ]
    };

    return (
        <FormModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Add Ship"
            isLoading={isLoading}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit(handleFormSubmit)}
            fields={fields}
            infoBox={infoBox}
            buttonText="Add Ship"
        />
    );
};

export default AddShip;