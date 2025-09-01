// components/modals/AddTruck.jsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { truckSchema } from "../../schemas/truckSchema";
import useModal from "../../utils/hooks/useModal";
import FormModal from "./FormModal";
import {
  InformationCircleIcon,
  TruckIcon,
  QuestionMarkCircleIcon
} from "@heroicons/react/24/outline";

const AddTruck = ({ isOpen, onClose, onSubmit, truckingCompanyId }) => {
  const {
    message,
    isLoading,
    setIsLoading,
    setSuccessMessage,
    setErrorMessage,
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
    defaultValues: {
      truckingCompanyId,
      name: "",
      plateNumber: "",
      remarks: "",
    },
  });

  const onFormSubmit = async (data) => {
    try {
      setIsLoading(true);
      setSuccessMessage("Adding truck...");

      const result = await onSubmit(data);

      if (result.success) {
        setSuccessMessage("Truck added successfully");
        setTimeout(() => {
          handleClose();
        }, 1500);
      } else {
        setErrorMessage(result.error || "Failed to add truck. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrorMessage(error.message || "Failed to add truck. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    modalClose();
    onClose();
  };

  // Define fields for FormModal
  const fieldsConfig = [
    // Truck Name Field
    {
      name: "name",
      label: "Truck Name",
      type: "text",
      register: register("name"),
      error: errors.name?.message,
      placeholder: "Enter truck name",
      withTooltip: true,
      tooltipText: "Enter a descriptive name for the truck (e.g., 'Volvo FH16 - Main Hauler')"
    },
    // Plate Number Field
    {
      name: "plateNumber",
      label: "Plate Number",
      type: "text",
      register: register("plateNumber"),
      error: errors.plateNumber?.message,
      placeholder: "Enter plate number",
      withTooltip: true,
      tooltipText: "Enter the official license plate number of the truck"
    },
    // Remarks Field
    {
      name: "remarks",
      label: "Remarks",
      type: "textarea",
      register: register("remarks"),
      error: errors.remarks?.message,
      placeholder: "Optional remarks or additional information",
      withTooltip: true,
      tooltipText: "Add any additional information about the truck (e.g., special features, maintenance notes)"
    }
  ];

  // Info box for additional information
  const infoBox = {
    title: "Truck Information",
    items: [
      {
        icon: <QuestionMarkCircleIcon className="h-3 w-3 text-emerald-600" />,
        text: "Truck name should be descriptive for easy identification"
      },
      {
        icon: <QuestionMarkCircleIcon className="h-3 w-3 text-emerald-600" />,
        text: "Plate number must match the official registration documents"
      },
      {
        icon: <QuestionMarkCircleIcon className="h-3 w-3 text-emerald-600" />,
        text: "Remarks are optional but helpful for additional details"
      }
    ]
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add Truck"
      message={
        message.text
          ? {
              type: message.type,
              text: message.text
            }
          : null
      }
      isLoading={isLoading}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit(onFormSubmit)}
      fields={fieldsConfig}
      infoBox={infoBox}
      buttonText="Add Truck"
    />
  );
};

export default AddTruck;