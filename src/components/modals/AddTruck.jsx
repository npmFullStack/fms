// components/modals/AddTruck.jsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { truckSchema } from "../../schemas/truckSchema";
import useModal from "../../utils/hooks/useModal";
import {
  XMarkIcon,
  InformationCircleIcon,
  TruckIcon,
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-100 max-h-[95vh] overflow-hidden">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-t-2xl px-6 py-3 text-center">
            <button
              onClick={handleClose}
              className="absolute top-2 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
            <div className="flex flex-col items-center">
              <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm mb-2">
                <TruckIcon className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Add Truck</h2>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 max-h-[calc(95vh-120px)] overflow-y-auto">
            <div className="space-y-5">
              {/* Message */}
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

              {/* Truck Name */}
              <div className="input-container">
                <label htmlFor="name" className="input-label-modern">
                  Truck Name
                </label>
                <input
                  id="name"
                  type="text"
                  {...register("name")}
                  placeholder="Enter truck name"
                  className={`input-field-modern ${
                    errors.name ? "input-error" : ""
                  }`}
                />
                {errors.name && (
                  <p className="error-message">{errors.name.message}</p>
                )}
              </div>

              {/* Plate Number */}
              <div className="input-container">
                <label htmlFor="plateNumber" className="input-label-modern">
                  Plate Number
                </label>
                <input
                  id="plateNumber"
                  type="text"
                  {...register("plateNumber")}
                  placeholder="Enter plate number"
                  className={`input-field-modern ${
                    errors.plateNumber ? "input-error" : ""
                  }`}
                />
                {errors.plateNumber && (
                  <p className="error-message">{errors.plateNumber.message}</p>
                )}
              </div>

              {/* Remarks */}
              <div className="input-container">
                <label htmlFor="remarks" className="input-label-modern">
                  Remarks
                </label>
                <textarea
                  id="remarks"
                  {...register("remarks")}
                  placeholder="Optional remarks"
                  className="input-field-modern"
                />
              </div>

              {/* Hidden trucking company ID */}
              <input type="hidden" {...register("truckingCompanyId")} />

              {/* Actions */}
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
                    "Add Truck"
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

export default AddTruck;
