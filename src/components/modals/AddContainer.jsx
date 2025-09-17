import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { containerSchema } from "../../schemas/containerSchema";
import useModal from "../../utils/hooks/useModal";
import FormModal from "./FormModal";
import Select from "react-select";

const AddContainer = ({ isOpen, onClose, onSubmit, shippingLineId }) => {
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
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(containerSchema),
    mode: "onChange",
    defaultValues: {
      shippingLineId,
      size: "",
      vanNumber: "",
      isReturned: true,
    },
  });

  const onFormSubmit = async (data) => {
    try {
      setIsLoading(true);
      setSuccessMessage("Adding container...");

      const result = await onSubmit({ ...data, shippingLineId });

      if (result.success) {
        setSuccessMessage("Container added successfully");
        setTimeout(() => {
          handleClose();
        }, 1500);
      } else {
        setErrorMessage(result.error || "Failed to add container. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrorMessage(error.message || "Failed to add container. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    modalClose();
    onClose();
  };

  // Options for container sizes
  const sizeOptions = [
    { value: "LCL", label: "LCL" },
    { value: "20FT", label: "20FT" },
    { value: "40FT", label: "40FT" },
  ];

  const fieldsConfig = [
    {
      name: "size",
      label: "Container Size",
      type: "custom",
      customRender: () => (
        <Controller
          name="size"
          control={control}
          rules={{ required: "Container size is required" }}
          render={({ field }) => (
            <Select
              value={
                field.value
                  ? sizeOptions.find((opt) => opt.value === field.value)
                  : null
              }
              onChange={(option) => field.onChange(option ? option.value : "")}
              options={sizeOptions}
              placeholder="Select container size"
              isClearable
            />
          )}
        />
      ),
      error: errors.size?.message,
    },
    {
      name: "vanNumber",
      label: "Van Number",
      type: "text",
      register: register("vanNumber"),
      error: errors.vanNumber?.message,
      placeholder: "Enter van number",
    },
  ];

  const infoBox = {
    title: "Container Information",
    items: [
      { text: "Container sizes must match actual van type (LCL, 20FT, 40FT)." },
    ],
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add Container"
      message={
        message.text
          ? {
              type: message.type,
              text: message.text,
            }
          : null
      }
      isLoading={isLoading}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit(onFormSubmit)}
      fields={fieldsConfig}
      infoBox={infoBox}
      buttonText="Add Container"
    />
  );
};

export default AddContainer;
