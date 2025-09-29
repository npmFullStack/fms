import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { truckSchema } from "../../schemas/truckSchema";
import useModal from "../../utils/hooks/useModal";
import FormModal from "./FormModal";
import { toast } from "react-hot-toast";

const AddTruck = ({ isOpen, onClose, onSubmit, truckingCompanyId }) => {
  const {
    isLoading,
    setIsLoading,
    handleClose: modalClose,
  } = useModal(() => reset());

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(truckSchema),
    mode: "onChange",
  });

  const handleFormSubmit = async (data) => {
    try {
      setIsLoading(true);
      const result = await onSubmit(data);
      
      if (result.success) {
        toast.success("Truck added successfully");
        handleClose();
        reset();
      } else {
        toast.error(result.error || "Failed to add truck. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error.message || "Failed to add truck. Please try again.");
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
      label: "Truck Name",
      type: "text",
      register: register("name"),
      error: errors.name?.message,
      placeholder: "Enter truck name",
    },
    {
      name: "plateNumber",
      label: "Plate Number",
      type: "text",
      register: register("plateNumber"),
      error: errors.plateNumber?.message,
      placeholder: "Enter plate number",
    },
  ];

  const infoBox = {
    title: "Truck Information",
    items: [
      { text: "Truck name should be descriptive for easy identification" },
      { text: "Plate number must match the official registration documents" },
    ],
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add Truck"
      isLoading={isLoading}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit(handleFormSubmit)}
      fields={fields}
      infoBox={infoBox}
      buttonText="Add Truck"
    />
  );
};

export default AddTruck;