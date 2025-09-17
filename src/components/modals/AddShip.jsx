import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { shipSchema } from "../../schemas/shipSchema";
import useModal from "../../utils/hooks/useModal";
import FormModal from "./FormModal";

const AddShip = ({ isOpen, onClose, onSave, shippingLineId }) => {
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
      shipName: "",
      vesselNumber: "",
      remarks: ""
    }
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const result = await onSave({ ...data, shippingLineId });

      if (result.success) {
        setSuccessMessage("Ship added successfully");
        setTimeout(() => {
          handleClose();
        }, 1500);
      } else {
        setErrorMessage(result.error || "Failed to add ship. Please try again.");
      }
    } catch (err) {
      console.error("Error submitting ship:", err);
      setErrorMessage(err.message || "Failed to add ship. Please try again.");
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
      name: "shipName",
      label: "Ship Name",
      type: "text",
      register: register("shipName"),
      error: errors.shipName?.message,
      placeholder: "Enter ship name"
    },
    {
      name: "vesselNumber",
      label: "Vessel Number",
      type: "text",
      register: register("vesselNumber"),
      error: errors.vesselNumber?.message,
      placeholder: "Enter vessel number"
    },
    {
      name: "remarks",
      label: "Remarks",
      type: "textarea",
      register: register("remarks"),
      error: errors.remarks?.message,
      placeholder: "Optional remarks..."
    }
  ];

  return (
    <FormModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add Ship"
      message={
        message.text
          ? { type: message.type, text: message.text }
          : null
      }
      isLoading={isLoading}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit(onSubmit)}
      fields={fields}
      buttonText="Add"
    />
  );
};

export default AddShip;
