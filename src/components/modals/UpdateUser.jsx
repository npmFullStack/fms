import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { XMarkIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { formatName } from "../../utils/helpers/formatters";

const updateUserSchema = z.object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    role: z.enum(["customer", "marketing_coordinator", "admin_finance", "general_manager"])
});

const UpdateUser = ({ isOpen, onClose, user, onSubmit }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(updateUserSchema),
        mode: "onChange"
    });

    useEffect(() => {
        if (user && isOpen) {
            reset({
                first_name: user.first_name || "",
                last_name: user.last_name || "",
                email: user.email || "",
                role: user.role || "customer"
            });
        }
    }, [user, isOpen, reset]);

    const handleFormSubmit = async (data) => {
        setIsSubmitting(true);
        setSubmitMessage({ type: '', text: '' });
        
        try {
            const result = await onSubmit(user.id, data);
            if (result.success) {
                setSubmitMessage({ type: 'success', text: 'User updated successfully!' });
                setTimeout(() => {
                    onClose();
                    setSubmitMessage({ type: '', text: '' });
                }, 1500);
            } else {
                setSubmitMessage({ type: 'error', text: result.error || "Failed to update user" });
            }
        } catch (error) {
            setSubmitMessage({ type: 'error', text: "An error occurred while updating the user" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        reset();
        setSubmitMessage({ type: '', text: '' });
        onClose();
    };

    if (!isOpen || !user) return null;

    const roles = [
        { value: "customer", label: "Customer" },
        { value: "marketing_coordinator", label: "Marketing Coordinator" },
        { value: "admin_finance", label: "Admin Finance" },
        { value: "general_manager", label: "General Manager" }
    ];

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={handleClose}></div>
            
            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <UserCircleIcon className="h-6 w-6 text-blue-600" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900">Edit User</h2>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        >
                            <XMarkIcon className="h-5 w-5 text-gray-400" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4">
                        {submitMessage.text && (
                            <div className={`p-3 rounded-lg ${
                                submitMessage.type === 'success' 
                                    ? 'bg-green-50 border border-green-200' 
                                    : 'bg-red-50 border border-red-200'
                            }`}>
                                <p className={`text-sm ${
                                    submitMessage.type === 'success' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    {submitMessage.text}
                                </p>
                            </div>
                        )}

                        {/* Profile Picture Section */}
                        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                            <div className="flex-shrink-0">
                                {user.profile_picture ? (
                                    <img 
                                        src={user.profile_picture} 
                                        alt="Profile" 
                                        className="h-16 w-16 rounded-full object-cover border-2 border-gray-200"
                                    />
                                ) : (
                                    <UserCircleIcon className="h-16 w-16 text-gray-400" />
                                )}
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">
                                    {formatName(user.first_name, user.last_name)}
                                </h3>
                                <p className="text-sm text-gray-500">{user.role ? roles.find(r => r.value === user.role)?.label : ''}</p>
                            </div>
                        </div>

                        {/* Name Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    First Name *
                                </label>
                                <input
                                    type="text"
                                    {...register("first_name")}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                                        errors.first_name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter first name"
                                />
                                {errors.first_name && (
                                    <p className="text-xs text-red-600 mt-1">{errors.first_name.message}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Last Name *
                                </label>
                                <input
                                    type="text"
                                    {...register("last_name")}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                                        errors.last_name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter last name"
                                />
                                {errors.last_name && (
                                    <p className="text-xs text-red-600 mt-1">{errors.last_name.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address *
                            </label>
                            <input
                                type="email"
                                {...register("email")}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                                    errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                }`}
                                placeholder="Enter email address"
                            />
                            {errors.email && (
                                <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Role */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Role
                            </label>
                            <select
                                {...register("role")}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            >
                                {roles.map(role => (
                                    <option key={role.value} value={role.value}>
                                        {role.label}
                                    </option>
                                ))}
                            </select>
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
                                {isSubmitting ? 'Updating...' : 'Update User'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateUser;