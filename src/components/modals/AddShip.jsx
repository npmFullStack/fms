import { useFieldArray, useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { zodResolver } from "@hookform/resolvers/zod";
import { shipSchema } from "../../schemas/shipSchema";
import useModal from "../../utils/hooks/useModal";
import FormModal from "./FormModal";
import {
  PlusCircleIcon,
  TrashIcon,
  QuestionMarkCircleIcon
} from "@heroicons/react/24/outline";

const containerSizes = [
  { value: "LCL", label: "LCL" },
  { value: "20FT", label: "20FT" },
  { value: "40FT", label: "40FT" }
];

const AddShip = ({ isOpen, onClose, onSubmit, shippingLineId }) => {
  const {
    message,
    isLoading,
    setIsLoading,
    setSuccessMessage,
    setErrorMessage,
    handleClose: modalClose
  } = useModal(() => reset());

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(shipSchema),
    mode: "onChange",
    defaultValues: {
      shippingLineId,
      vesselNumber: "",
      containers: []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "containers"
  });

  const handleAddContainer = () => {
    append({
      size: null,
      vanNumber: ""
    });
  };

  const onFormSubmit = async (data) => {
    try {
      setIsLoading(true);
      setSuccessMessage("Adding ship...");

      const result = await onSubmit(data);

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

  // Define fields for FormModal
  const fieldsConfig = [
    // Vessel Number Field
    {
      name: "vesselNumber",
      label: "Vessel Number",
      type: "text",
      register: register("vesselNumber"),
      error: errors.vesselNumber?.message,
      placeholder: "Enter vessel number"
    },
    // Containers Section
    {
      name: "containers",
      label: "Containers",
      type: "custom",
      withTooltip: true,
      tooltipText: "Add containers with size and van number",
      customRender: () => (
        <div>
          {fields.length === 0 && (
            <p className="text-sm text-slate-500 mb-4">
              No containers added yet. Click "Add Container" below to create one.
            </p>
          )}

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="border rounded-lg p-4 mb-4 bg-slate-50"
            >
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-slate-700">
                  Container {index + 1}
                </h4>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="flex items-center gap-1 text-red-500 hover:text-red-700"
                >
                  <TrashIcon className="w-4 h-4" />
                  Remove
                </button>
              </div>

              {/* Container Size Select */}
              <div className="mb-4">
                <label className="input-label-modern">Container Size</label>
                <Controller
                  name={`containers.${index}.size`}
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={containerSizes}
                      getOptionValue={(opt) => opt.value}
                      getOptionLabel={(opt) => opt.label}
                      value={containerSizes.find(
                        (s) => s.value === field.value
                      )}
                      onChange={(opt) => field.onChange(opt.value)}
                      placeholder="Select container size"
                      className="react-select-modern"
                    />
                  )}
                />
              </div>

              {/* Van Number Input */}
              <div>
                <label className="input-label-modern">Van Number</label>
                <input
                  type="text"
                  {...register(`containers.${index}.vanNumber`)}
                  className="input-field-modern"
                  placeholder="Enter van number"
                />
              </div>
            </div>
          ))}

          {/* Add Container Button at the Bottom */}
          <div className="flex items-center justify-start mt-4">
            <button
              type="button"
              onClick={handleAddContainer}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusCircleIcon className="w-5 h-5" /> Add Container
            </button>
          </div>
        </div>
      )
    }
  ];

  const infoBox = {
    title: "Container Information",
    items: [
      {
        icon: <QuestionMarkCircleIcon className="h-3 w-3 text-blue-600" />,
        text: "Add one or more containers with size and van number"
      }
    ]
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add Ship"
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
      buttonText="Add Ship"
    />
  );
};

export default AddShip;
