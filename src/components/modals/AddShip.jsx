import { useFieldArray, useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { zodResolver } from "@hookform/resolvers/zod";
import { shipSchema } from "../../schemas/shipSchema";
import useModal from "../../utils/hooks/useModal";
import {
  XMarkIcon,
  InformationCircleIcon,
  CubeIcon,
  PlusCircleIcon,
  TrashIcon
} from "@heroicons/react/24/outline";
import { PH_PORTS } from "../../utils/helpers/shipRoutes";

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
      name: "",
      vesselNumber: "",
      routes: []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "routes"
  });

  const handleAddRoute = () => {
    append({
      origin: null,
      destination: null,
      pricing: [
        { type: "LCL", price: "" },
        { type: "20FT", price: "" },
        { type: "40FT", price: "" }
      ]
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
        setErrorMessage(result.error || "Failed to add ship. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrorMessage(error.message || "Failed to add ship. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    modalClose();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Modal container */}
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 scale-100 max-h-[95vh] overflow-hidden">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-2xl px-6 py-3 text-center">
            <button
              onClick={handleClose}
              className="absolute top-2 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
            <div className="flex flex-col items-center">
              <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm mb-2">
                <CubeIcon className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Add Ship</h2>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-5 max-h-[calc(95vh-120px)] overflow-y-auto">
            <div className="space-y-5">
              {/* Message Display */}
              {message.text && (
                <div
                  className={`p-3 rounded-xl border text-sm ${
                    message.type === "success"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                      : "bg-red-50 border-red-200 text-red-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <InformationCircleIcon className="h-4 w-4" />
                    {message.text}
                  </div>
                </div>
              )}

              {/* Ship Name Field */}
              <div className="input-container">
                <label htmlFor="name" className="input-label-modern">
                  Ship Name
                </label>
                <input
                  id="name"
                  type="text"
                  {...register("name")}
                  placeholder="Enter ship name"
                  className={`input-field-modern ${
                    errors.name ? "input-error" : ""
                  }`}
                />
                {errors.name && (
                  <p className="error-message">{errors.name.message}</p>
                )}
              </div>

              {/* Vessel Number Field */}
              <div className="input-container">
                <label htmlFor="vesselNumber" className="input-label-modern">
                  Vessel Number
                </label>
                <input
                  id="vesselNumber"
                  type="text"
                  {...register("vesselNumber")}
                  placeholder="Enter vessel number"
                  className={`input-field-modern ${
                    errors.vesselNumber ? "input-error" : ""
                  }`}
                />
                {errors.vesselNumber && (
                  <p className="error-message">
                    {errors.vesselNumber.message}
                  </p>
                )}
              </div>

              {/* Routes Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-slate-700 text-lg">
                    Routes & Pricing
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddRoute}
                    className="flex items-center gap-2 text-blue-600 hover:underline"
                  >
                    <PlusCircleIcon className="w-5 h-5" /> Add Route
                  </button>
                </div>

                {fields.length === 0 && (
                  <p className="text-sm text-slate-500">No routes added yet.</p>
                )}

                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="border rounded-lg p-4 mb-4 bg-slate-50"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-slate-700">
                        Route {index + 1}
                      </h4>
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Origin and Destination */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <label className="input-label-modern">Origin</label>
                        <Controller
                          name={`routes.${index}.origin`}
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              options={PH_PORTS}
                              placeholder="Select origin port"
                              className="react-select-modern"
                            />
                          )}
                        />
                      </div>
                      <div>
                        <label className="input-label-modern">Destination</label>
                        <Controller
                          name={`routes.${index}.destination`}
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              options={PH_PORTS}
                              placeholder="Select destination port"
                              className="react-select-modern"
                            />
                          )}
                        />
                      </div>
                    </div>

                    {/* Pricing Section */}
                    {["LCL", "20FT", "40FT"].map((type, priceIndex) => (
                      <div key={type} className="mb-2">
                        <label className="input-label-modern">{type} Price</label>
                        <input
                          type="number"
                          {...register(`routes.${index}.pricing.${priceIndex}.price`)}
                          className="input-field-modern"
                          placeholder={`Enter ${type} price`}
                        />
                        <input
                          type="hidden"
                          value={type}
                          {...register(`routes.${index}.pricing.${priceIndex}.type`)}
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Hidden shipping line ID */}
              <input type="hidden" {...register("shippingLineId")} />

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="btn-secondary-modern"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit(onFormSubmit)}
                  disabled={isSubmitting || isLoading}
                  className={`btn-primary-modern ${isLoading ? "opacity-70" : ""}`}
                >
                  {isLoading ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Adding...
                    </>
                  ) : (
                    "Add Ship"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddShip;
