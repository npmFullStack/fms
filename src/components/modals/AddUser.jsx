import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useUserStore from "../../utils/store/useUserStore";
import { addUserSchema } from "../../schemas/userSchema";
import {
    XMarkIcon,
    QuestionMarkCircleIcon,
    InformationCircleIcon,
    ShieldCheckIcon,
    EnvelopeIcon,
    KeyIcon,
    UserCircleIcon,
    UserPlusIcon,
    PhotoIcon,
    TrashIcon
} from "@heroicons/react/24/outline";
import Select from "react-select";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import useImageUpload from "../../utils/hooks/useImageUpload";
import useModal from "../../utils/hooks/useModal";

const AddUser = ({ isOpen, onClose }) => {
    const {
        previewImage,
        selectedFile,
        error: imageError,
        handleImageChange,
        clearImage
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

    const addUser = useUserStore(state => state.addUser);

    const roles = [
        { value: "customer", label: "Customer" },
        { value: "marketing_coordinator", label: "Marketing Coordinator" },
        { value: "admin_finance", label: "Admin Finance" },
        { value: "general_manager", label: "General Manager" }
    ];

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(addUserSchema),
        mode: "onChange",
        defaultValues: {
            role: roles[0],
            phone: ""
        }
    });

    const onSubmit = async data => {
        try {
            setIsLoading(true);
            setSuccessMessage("Uploading image...");

            const formData = new FormData();
            formData.append("firstName", data.firstName);
            formData.append("lastName", data.lastName);
            formData.append(
                "email",
                `${data.firstName.toLowerCase()}.${data.lastName.toLowerCase()}@example.com`
            );
            formData.append("role", data.role.value);
            formData.append("password", "password");

            if (data.phone) {
                formData.append("phone", data.phone);
            }

            if (selectedFile) {
                formData.append("profile_picture", selectedFile);
            }

            const result = await addUser(formData);

            if (result.success) {
                setSuccessMessage("User added successfully");
                setTimeout(() => {
                    handleClose();
                }, 1500);
            } else {
                setErrorMessage(
                    result.error || "Failed to add user. Please try again."
                );
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            setErrorMessage(
                error.message || "Failed to add user. Please try again."
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
        document.getElementById("profile_picture").value = "";
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Enhanced backdrop with blur effect */}
            <div
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
                onClick={handleClose}
            />

            {/* Modal container */}
            <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
                <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 max-h-[95vh] overflow-hidden">
                    
                    {/* Redesigned Header - Clean and minimal */}
                    <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-2xl px-6 py-6 text-center">
                        {/* Close button */}
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                        
                        {/* Icon and title */}
                        <div className="flex flex-col items-center">
                            <div className="p-2.5 bg-white/10 rounded-xl mb-3 backdrop-blur-sm">
                                <UserPlusIcon className="h-6 w-6 text-white" />
                            </div>
                            <h2 className="text-xl font-bold text-white mb-1">
                                Add New User
                            </h2>
                            <p className="text-blue-100 text-xs">
                                Create a new team member account
                            </p>
                        </div>
                    </div>

                    {/* Form content */}
                    <div className="p-5 max-h-[calc(95vh-120px)] overflow-y-auto">
                        <div className="space-y-5">
                            
                            {/* Message Display */}
                            {(message.text || imageError) && (
                                <div className={`p-3 rounded-xl border text-sm ${
                                    message.type === "success"
                                        ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                        : "bg-red-50 border-red-200 text-red-700"
                                }`}>
                                    <div className="flex items-center gap-2">
                                        <InformationCircleIcon className="h-4 w-4" />
                                        {message.text || imageError}
                                    </div>
                                </div>
                            )}

                            {/* Profile Picture Upload */}
                            <div className="input-container">
                                <label className="input-label-modern">
                                    Profile Picture
                                    <div className="group relative">
                                        <QuestionMarkCircleIcon className="tooltip-icon" />
                                        <div className="tooltip">
                                            Max 5MB, JPEG/PNG/GIF formats
                                        </div>
                                    </div>
                                </label>
                                
                                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
                                    {/* Avatar preview */}
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

                                    {/* Upload controls */}
                                    <div className="flex-1 space-y-1">
                                        <input
                                            id="profile_picture"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                        <label
                                            htmlFor="profile_picture"
                                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                                        >
                                            <PhotoIcon className="h-3 w-3" />
                                            Choose Image
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
                            </div>

                            {/* Name Fields */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="input-container">
                                    <label htmlFor="firstName" className="input-label-modern">
                                        First Name
                                    </label>
                                    <input
                                        id="firstName"
                                        type="text"
                                        {...register("firstName")}
                                        placeholder="Enter first name"
                                        className={`input-field-modern ${
                                            errors.firstName ? "input-error" : ""
                                        }`}
                                    />
                                    {errors.firstName && (
                                        <p className="error-message">
                                            {errors.firstName.message}
                                        </p>
                                    )}
                                </div>
                                
                                <div className="input-container">
                                    <label htmlFor="lastName" className="input-label-modern">
                                        Last Name
                                    </label>
                                    <input
                                        id="lastName"
                                        type="text"
                                        {...register("lastName")}
                                        placeholder="Enter last name"
                                        className={`input-field-modern ${
                                            errors.lastName ? "input-error" : ""
                                        }`}
                                    />
                                    {errors.lastName && (
                                        <p className="error-message">
                                            {errors.lastName.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Phone and Role */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="input-container">
                                    <label className="input-label-modern">
                                        Phone Number
                                        <div className="group relative">
                                            <QuestionMarkCircleIcon className="tooltip-icon" />
                                            <div className="tooltip">
                                                Optional field, international format
                                            </div>
                                        </div>
                                    </label>
                                    <Controller
                                        name="phone"
                                        control={control}
                                        render={({ field }) => (
                                            <PhoneInput
                                                {...field}
                                                international
                                                defaultCountry="PH"
                                                placeholder="Enter phone number"
                                                className={`phone-input-modern ${
                                                    errors.phone ? "input-error" : ""
                                                }`}
                                            />
                                        )}
                                    />
                                    {errors.phone && (
                                        <p className="error-message">
                                            {errors.phone.message}
                                        </p>
                                    )}
                                </div>

                                <div className="input-container">
                                    <label className="input-label-modern">
                                        Role
                                        <div className="group relative">
                                            <QuestionMarkCircleIcon className="tooltip-icon" />
                                            <div className="tooltip">
                                                Select user permission level
                                            </div>
                                        </div>
                                    </label>
                                    <Controller
                                        name="role"
                                        control={control}
                                        defaultValue={roles[0]}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                options={roles}
                                                className="react-select-container"
                                                classNamePrefix="react-select"
                                                styles={{
                                                    control: provided => ({
                                                        ...provided,
                                                        minHeight: "40px",
                                                        fontSize: "0.875rem",
                                                        borderRadius: "0.75rem",
                                                        borderColor: errors.role ? "#fca5a5" : "#cbd5e1",
                                                        "&:hover": {
                                                            borderColor: errors.role ? "#fca5a5" : "#94a3b8"
                                                        }
                                                    }),
                                                    option: provided => ({
                                                        ...provided,
                                                        fontSize: "0.875rem",
                                                        padding: "6px 12px"
                                                    }),
                                                    menu: provided => ({
                                                        ...provided,
                                                        zIndex: 20,
                                                        borderRadius: "0.75rem"
                                                    })
                                                }}
                                            />
                                        )}
                                    />
                                    {errors.role && (
                                        <p className="error-message">
                                            {errors.role.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Information Box */}
                            <div className="info-box-modern">
                                <div className="flex items-start gap-3">
                                    <div className="p-1.5 bg-blue-100 rounded-lg">
                                        <InformationCircleIcon className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-semibold text-slate-800 mb-2">
                                            Account Setup Information
                                        </h4>
                                        <div className="space-y-1.5 text-xs text-slate-600">
                                            <div className="flex items-start gap-2">
                                                <EnvelopeIcon className="h-3 w-3 mt-0.5 text-blue-500 flex-shrink-0" />
                                                <span>Email generated as: firstname.lastname@example.com</span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <KeyIcon className="h-3 w-3 mt-0.5 text-blue-500 flex-shrink-0" />
                                                <span>Default password set to "password"</span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <ShieldCheckIcon className="h-3 w-3 mt-0.5 text-blue-500 flex-shrink-0" />
                                                <span>User can change password after first login</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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
                                    className="btn-primary-modern"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            "Uploading..."
                                        </>
                                    ) : isSubmitting ? (
                                        <>
                                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            "Creating..."
                                        </>
                                    ) : (
                                        <>
                                            <UserPlusIcon className="h-4 w-4" />
                                            Create User
                                        </>
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

export default AddUser;