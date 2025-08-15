import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useUserStore from "../../utils/store/useUserStore";
import { userSchema } from "../../schemas/userSchema";
import { UserPlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Select from "react-select";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const AddUser = ({ isOpen, onClose }) => {
    const [message, setMessage] = useState("");
    const [previewImage, setPreviewImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const addUser = useUserStore((state) => state.addUser);

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
        resolver: zodResolver(userSchema),
        mode: "onChange",
        defaultValues: {
            role: roles[0],
            phone: ""
        }
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                setMessage("File size too large. Maximum 5MB allowed.");
                return;
            }

            // Validate file type
            if (!file.type.startsWith('image/')) {
                setMessage("Only image files are allowed.");
                return;
            }

            // Create preview URL
            const previewUrl = URL.createObjectURL(file);
            setPreviewImage(previewUrl);
            setSelectedFile(file);
            setMessage(""); // Clear any previous error messages
        } else {
            setPreviewImage(null);
            setSelectedFile(null);
        }
    };

    const onSubmit = async (data) => {
        try {
            setIsUploading(true);
            setMessage("Uploading image...");

            // Create FormData for file upload
            const formData = new FormData();
            
            // Append form fields
            formData.append('firstName', data.firstName);
            formData.append('lastName', data.lastName);
            formData.append('email', `${data.firstName.toLowerCase()}.${data.lastName.toLowerCase()}@example.com`);
            formData.append('role', data.role.value);
            formData.append('password', 'password');
            
            if (data.phone) {
                formData.append('phone', data.phone);
            }
            
            if (selectedFile) {
                formData.append('profile_picture', selectedFile);
            }

            const result = await addUser(formData);
            
            if (result.success) {
                setMessage("User added successfully");
                reset();
                setPreviewImage(null);
                setSelectedFile(null);
                onClose();
            } else {
                setMessage(result.error || "Failed to add user. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            setMessage(error.message || "Failed to add user. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleClose = () => {
        reset();
        setPreviewImage(null);
        setSelectedFile(null);
        setMessage("");
        onClose();
    };

    // Cleanup preview URL when component unmounts or image changes
    useEffect(() => {
        return () => {
            if (previewImage) {
                URL.revokeObjectURL(previewImage);
            }
        };
    }, [previewImage]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={handleClose}
            ></div>

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <UserPlusIcon className="h-6 w-6 text-blue-600" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Add New User
                            </h2>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        >
                            <XMarkIcon className="h-5 w-5 text-gray-400" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                        {message && (
                            <div
                                className={`mb-4 p-3 rounded-lg ${
                                    message.includes("successful")
                                        ? "bg-green-50 border border-green-200 text-green-700"
                                        : "bg-red-50 border border-red-200 text-red-700"
                                }`}
                            >
                                {message}
                            </div>
                        )}

                        {/* Name Fields */}
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label htmlFor="firstName" className="block text-left text-sm font-medium text-gray-700 mb-1">
                                    First Name
                                </label>
                                <input
                                    id="firstName"
                                    type="text"
                                    {...register("firstName")}
                                    placeholder="First name"
                                    className={`input-field ${errors.firstName ? "input-error" : ""}`}
                                />
                                {errors.firstName && (
                                    <p className="error-message">
                                        {errors.firstName.message}
                                    </p>
                                )}
                            </div>
                            <div className="flex-1">
                                <label htmlFor="lastName" className="block text-left text-sm font-medium text-gray-700 mb-1">
                                    Last Name
                                </label>
                                <input
                                    id="lastName"
                                    type="text"
                                    {...register("lastName")}
                                    placeholder="Last name"
                                    className={`input-field ${errors.lastName ? "input-error" : ""}`}
                                />
                                {errors.lastName && (
                                    <p className="error-message">
                                        {errors.lastName.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Phone Field */}
                        <div>
                            <label htmlFor="phone" className="block text-left text-sm font-medium text-gray-700 mb-1">
                                Phone Number
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
                                        className={`phone-input ${errors.phone ? "input-error" : ""}`}
                                    />
                                )}
                            />
                        </div>

                        {/* Profile Picture Field */}
                        <div>
                            <label htmlFor="profile_picture" className="block text-left text-sm font-medium text-gray-700 mb-1">
                                Profile Picture
                            </label>
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    {previewImage ? (
                                        <>
                                            <img
                                                src={previewImage}
                                                alt="Preview"
                                                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                                                onLoad={() => console.log("Image loaded successfully")}
                                                onError={(e) => {
                                                    console.error("Image failed to load:", e);
                                                    console.log("Image src:", previewImage);
                                                }}
                                            />
                                            <div className="absolute -top-2 -right-2">
                                                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                                    <span className="text-white text-xs">✓</span>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                                            <span className="text-gray-400 text-xs">No image</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <input
                                        id="profile_picture"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100 cursor-pointer"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        Max file size: 5MB. Supported formats: JPEG, PNG, GIF
                                    </p>

                                    {/* Clear button for selected image */}
                                    {previewImage && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setPreviewImage(null);
                                                setSelectedFile(null);
                                                document.getElementById("profile_picture").value = "";
                                            }}
                                            className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
                                        >
                                            Remove image
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Role Field */}
                        <div>
                            <label htmlFor="role" className="block text-left text-sm font-medium text-gray-700 mb-1">
                                Role
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
                                    />
                                )}
                            />
                            {errors.role && (
                                <p className="error-message">
                                    {errors.role.message}
                                </p>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 transition-all duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || isUploading}
                                className="flex-1 px-4 py-2 text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                {isUploading ? "Uploading..." : isSubmitting ? "Creating..." : "Create User"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddUser;