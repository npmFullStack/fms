import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useUserStore from "../../utils/store/useUserStore";
import { userSchema } from "../../schemas/userSchema";
import { UserPlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Select from "react-select";

const AddUser = ({ isOpen, onClose }) => {
    const [message, setMessage] = useState("");
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
            role: roles[0]
        }
    });

    const onSubmit = async (data) => {
        try {
            const userData = {
                firstName: data.firstName,
                lastName: data.lastName,
                email: `${data.firstName.toLowerCase()}.${data.lastName.toLowerCase()}@example.com`,
                role: data.role.value,
                password: "password",
                phone: data.phone || null,
                profile_picture: data.profile_picture || null
            };

            await addUser(userData);
            setMessage("User added successfully");
            reset();
            onClose();
        } catch (error) {
            setMessage(error.message || "Failed to add user. Please try again.");
        }
    };

    const handleClose = () => {
        reset();
        setMessage("");
        onClose();
    };

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
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="p-6 space-y-6"
                    >
                        {message && (
                            <div
                                className={`mb-4 p-3 rounded-lg ${
                                    message.includes("successful")
                                        ? "bg-green-50 border border-green-200 text-green-700"
                                        : "error-message"
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
                            <input
                                id="phone"
                                type="text"
                                {...register("phone")}
                                placeholder="e.g. +63 912 345 6789"
                                className="input-field"
                            />
                        </div>

                        {/* Profile Picture Field */}
                        <div>
                            <label htmlFor="profile_picture" className="block text-left text-sm font-medium text-gray-700 mb-1">
                                Profile Picture URL
                            </label>
                            <input
                                id="profile_picture"
                                type="text"
                                {...register("profile_picture")}
                                placeholder="https://example.com/photo.jpg"
                                className="input-field"
                            />
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
                                disabled={isSubmitting}
                                className="flex-1 px-4 py-2 text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                {isSubmitting ? "Creating..." : "Create User"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddUser;
