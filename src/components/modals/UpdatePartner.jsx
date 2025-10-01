import { useForm } from "react-hook-form";
import { partnerSchema } from "../../schemas/partnerSchema";
import usePartnerStore from "../../utils/store/usePartnerStore";
import { zodResolver } from "@hookform/resolvers/zod";
import useImageUpload from "../../utils/hooks/useImageUpload";
import useModal from "../../utils/hooks/useModal";
import { X } from "lucide-react";
import { useEffect } from "react";

const UpdatePartner = ({ isOpen, onClose, partner }) => {
    const {
        previewImage,
        selectedFile,
        error: imageError,
        handleImageChange,
        clearImage,
        setPreviewImage
    } = useImageUpload();

    const {
        message,
        isLoading,
        setIsLoading,
        setSuccessMessage,
        setErrorMessage,
        handleClose: modalClose
    } = useModal(() => {
        reset();
        clearImage();
    });

    const updatePartner = usePartnerStore(state => state.updatePartner);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(partnerSchema),
        mode: "onChange"
    });

    useEffect(() => {
        if (partner) {
            setValue("name", partner.name);
            if (partner.logo_url) {
                setPreviewImage(partner.logo_url);
            }
        }
    }, [partner, setValue, setPreviewImage]);

    const onSubmit = async data => {
        try {
            setIsLoading(true);
            setSuccessMessage("Updating partner...");

            const formData = new FormData();
            formData.append("name", data.name);

            if (selectedFile) {
                formData.append("logo", selectedFile);
            }

            const result = await updatePartner(
                partner.id,
                formData,
                partner.type
            );

            if (result.success) {
                setSuccessMessage(
                    `${
                        partner.type === "shipping"
                            ? "Shipping line"
                            : "Trucking company"
                    } updated successfully`
                );
                setTimeout(() => {
                    handleClose();
                }, 1500);
            } else {
                setErrorMessage(
                    result.error ||
                        `Failed to update ${
                            partner.type === "shipping"
                                ? "shipping line"
                                : "trucking company"
                        }. Please try again.`
                );
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            setErrorMessage(
                error.message ||
                    `Failed to update ${
                        partner.type === "shipping"
                            ? "shipping line"
                            : "trucking company"
                    }. Please try again.`
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        modalClose();
        onClose();
    };

    const clearSelectedImage = () => {
        clearImage();
        document.getElementById("logo").value = "";
    };

    if (!isOpen || !partner) return null;

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
                    <div
                        className={`relative bg-gradient-to-r ${
                            partner.type === "shipping"
                                ? "from-blue-600 to-blue-700"
                                : "from-orange-600 to-orange-700"
                        } rounded-t-2xl px-6 py-3 text-center`}
                    >
                        <button
                            onClick={handleClose}
                            className="absolute top-2 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <h2 className="text-xl font-bold text-white">
                            Update{" "}
                            {partner.type === "shipping"
                                ? "Shipping Line"
                                : "Trucking Company"}
                        </h2>
                    </div>

                    {/* Form Content */}
                    <div className="p-5 max-h-[calc(95vh-120px)] overflow-y-auto">
                        <div className="space-y-5">
                            {/* Message Display */}
                            {(message.text || imageError) && (
                                <div
                                    className={`p-3 rounded-xl border text-sm ${
                                        message.type === "success"
                                            ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                            : "bg-red-50 border-red-200 text-red-700"
                                    }`}
                                >
                                    {message.text || imageError}
                                </div>
                            )}

                            {/* Logo Upload */}
                            <div className="input-container">
                                <label className="input-label-modern">
                                    Company Logo
                                </label>

                                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
                                    <div className="relative w-12 h-12 rounded-full bg-white border-2 border-white shadow-md overflow-hidden flex items-center justify-center">
                                        {previewImage ? (
                                            <img
                                                src={previewImage}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-slate-400 text-xs font-bold text-center">
                                                No Logo
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex-1 space-y-1">
                                        <input
                                            id="logo"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                        <label
                                            htmlFor="logo"
                                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                                        >
                                            Choose Image
                                        </label>
                                        {previewImage && (
                                            <button
                                                type="button"
                                                onClick={clearSelectedImage}
                                                className="ml-2 inline-flex items-center gap-2 px-3 py-1.5 bg-red-100 text-red-700 text-xs font-medium rounded-lg hover:bg-red-200 transition-colors"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Name Field */}
                            <div className="input-container">
                                <label
                                    htmlFor="name"
                                    className="input-label-modern"
                                >
                                    Company Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    {...register("name")}
                                    placeholder={`Enter ${
                                        partner.type === "shipping"
                                            ? "shipping line"
                                            : "trucking company"
                                    } name`}
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
                                    onClick={handleSubmit(onSubmit)}
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
                                        `Update ${
                                            partner.type === "shipping"
                                                ? "Shipping Line"
                                                : "Trucking Company"
                                        }`
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

export default UpdatePartner;
