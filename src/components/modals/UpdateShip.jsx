import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { shipSchema } from "../../schemas/shipSchema";
import useModal from "../../utils/hooks/useModal";
import { X, Info, Ship } from "lucide-react";
import { useEffect } from "react";

const UpdateShip = ({ isOpen, onClose, onSubmit, ship, shippingLineId }) => {
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
        setValue,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(shipSchema),
        mode: "onChange"
    });

    useEffect(() => {
        if (ship) {
            setValue("name", ship.name);
            setValue("vesselNumber", ship.vessel_number || "");
            setValue("imoNumber", ship.imo_number || "");
            setValue("capacityTeu", ship.capacity_teu || "");
            setValue("shippingLineId", shippingLineId);
        }
    }, [ship, shippingLineId, setValue]);

    const onFormSubmit = async data => {
        try {
            setIsLoading(true);
            setSuccessMessage("Updating ship...");

            const result = await onSubmit(ship.id, data);

            if (result.success) {
                setSuccessMessage("Ship updated successfully");
                setTimeout(() => {
                    handleClose();
                }, 1500);
            } else {
                setErrorMessage(
                    result.error || "Failed to update ship. Please try again."
                );
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            setErrorMessage(
                error.message || "Failed to update ship. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        modalClose();
        onClose();
    };

    if (!isOpen || !ship) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
                onClick={handleClose}
            />

            {/* Modal container */}
            <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
                <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 max-h-[95vh] overflow-hidden">
                    {/* Header */}
                    <div className="relative bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-t-2xl px-6 py-3 text-center">
                        <button
                            onClick={handleClose}
                            className="absolute top-2 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        <div className="flex flex-col items-center">
                            <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm mb-2">
                                <Ship className="h-6 w-6 text-white" />
                            </div>
                            <h2 className="text-xl font-bold text-white">
                                Update Ship
                            </h2>
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
                                        <Info className="h-4 w-4" />
                                        {message.text}
                                    </div>
                                </div>
                            )}

                            {/* Ship Name Field */}
                            <div className="input-container">
                                <label
                                    htmlFor="name"
                                    className="input-label-modern"
                                >
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
                                    <p className="error-message">
                                        {errors.name.message}
                                    </p>
                                )}
                            </div>

                            {/* Vessel Number Field */}
                            <div className="input-container">
                                <label
                                    htmlFor="vesselNumber"
                                    className="input-label-modern"
                                >
                                    Vessel Number
                                    <span className="text-slate-400 text-sm ml-1">
                                        (Optional)
                                    </span>
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

                            {/* IMO Number Field */}
                            <div className="input-container">
                                <label
                                    htmlFor="imoNumber"
                                    className="input-label-modern"
                                >
                                    IMO Number
                                    <span className="text-slate-400 text-sm ml-1">
                                        (Optional)
                                    </span>
                                </label>
                                <input
                                    id="imoNumber"
                                    type="text"
                                    {...register("imoNumber")}
                                    placeholder="Enter IMO number"
                                    className={`input-field-modern ${
                                        errors.imoNumber ? "input-error" : ""
                                    }`}
                                />
                                {errors.imoNumber && (
                                    <p className="error-message">
                                        {errors.imoNumber.message}
                                    </p>
                                )}
                            </div>

                            {/* Capacity TEU Field */}
                            <div className="input-container">
                                <label
                                    htmlFor="capacityTeu"
                                    className="input-label-modern"
                                >
                                    Capacity (TEU)
                                    <span className="text-slate-400 text-sm ml-1">
                                        (Optional)
                                    </span>
                                </label>
                                <input
                                    id="capacityTeu"
                                    type="number"
                                    {...register("capacityTeu")}
                                    placeholder="Enter capacity in TEU"
                                    className={`input-field-modern ${
                                        errors.capacityTeu ? "input-error" : ""
                                    }`}
                                />
                                {errors.capacityTeu && (
                                    <p className="error-message">
                                        {errors.capacityTeu.message}
                                    </p>
                                )}
                            </div>

                            {/* Hidden field for shipping line ID */}
                            <input
                                type="hidden"
                                {...register("shippingLineId")}
                            />

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
                                    className={`btn-primary-modern ${
                                        isLoading ? "opacity-70" : ""
                                    }`}
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Updating...
                                        </>
                                    ) : (
                                        "Update Ship"
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

export default UpdateShip;
