import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { partnerSchema } from "../../schemas/partnerSchema";
import usePartnerStore from "../../utils/store/usePartnerStore";
import useImageUpload from "../../utils/hooks/useImageUpload";
import useModal from "../../utils/hooks/useModal";
import FormModal from "./FormModal";
import {
    PhotoIcon,
    TrashIcon
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";

const AddPartner = ({ isOpen, onClose, type }) => {
    const {
        previewImage,
        selectedFile,
        handleImageChange,
        clearImage
    } = useImageUpload();

    const {
        isLoading,
        setIsLoading,
        handleClose: modalClose
    } = useModal(() => {
        reset();
        clearImage();
    });

    const addPartner = usePartnerStore(state => state.addPartner);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(partnerSchema),
        mode: "onChange"
    });

    const onSubmit = async data => {
        try {
            setIsLoading(true);

            const formData = new FormData();
            formData.append("name", data.name);

            if (selectedFile) {
                formData.append("logo", selectedFile);
            }

            const result = await addPartner(formData, type);

            if (result.success) {
                toast.success(
                    `${
                        type === "shipping"
                            ? "Shipping line"
                            : "Trucking company"
                    } added successfully`
                );
                handleClose();
                reset();
                clearImage();
            } else {
                toast.error(
                    result.error ||
                        `Failed to add ${
                            type === "shipping"
                                ? "shipping line"
                                : "trucking company"
                        }. Please try again.`
                );
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error(
                error.message ||
                    `Failed to add ${
                        type === "shipping"
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

    const fields = [
        // Logo Upload
        {
            name: "logo",
            label: "Company Logo",
            type: "custom",
            withTooltip: true,
            tooltipText: "Max 5MB, JPEG/PNG/GIF formats",
            customRender: () => (
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
                    <div className="relative w-12 h-12 rounded-full bg-white border-2 border-white shadow-md overflow-hidden">
                        {previewImage ? (
                            <img
                                src={previewImage}
                                alt="Preview"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                                <PhotoIcon className="h-5 w-5 text-slate-400" />
                            </div>
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
                            <PhotoIcon className="h-3 w-3" />
                            Choose Logo
                        </label>
                        {previewImage && (
                            <button
                                type="button"
                                onClick={clearSelectedImage}
                                className="ml-2 inline-flex items-center gap-2 px-3 py-1.5 bg-red-100 text-red-700 text-xs font-medium rounded-lg hover:bg-red-200 transition-colors"
                            >
                                <TrashIcon className="h-3 w-3" />
                                Remove
                            </button>
                        )}
                    </div>
                </div>
            )
        },
        // Company Name
        {
            name: "name",
            label: "Company Name",
            type: "text",
            register: register("name"),
            error: errors.name?.message,
            placeholder: `Enter ${
                type === "shipping" ? "shipping line" : "trucking company"
            } name`
        }
    ];

    return (
        <FormModal
            isOpen={isOpen}
            onClose={handleClose}
            title={`Add ${
                type === "shipping" ? "Shipping Line" : "Trucking Company"
            }`}
            isLoading={isLoading}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit(onSubmit)}
            fields={fields}
            buttonText="Add"
        />
    );
};

export default AddPartner;
