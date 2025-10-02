// src/components/modals/AddUser.jsx
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addUserSchema } from "../../schemas/userSchema";
import useUserStore from "../../utils/store/useUserStore";
import FormModal from "./FormModal";
import { ShieldCheck, Mail, Key, Image, Trash2 } from "lucide-react";
import Select from "react-select";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import useImageUpload from "../../utils/hooks/useImageUpload";
import useModal from "../../utils/hooks/useModal";
import { toast } from "react-hot-toast";

// Helper to sanitize email
const sanitize = str =>
    str
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");

const AddUser = ({ isOpen, onClose }) => {
    const { previewImage, selectedFile, handleImageChange, clearImage } =
        useImageUpload();

    const {
        setIsLoading,
        isLoading,
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
            role: roles[0].value,
            phone: ""
        }
    });

    const onFormSubmit = async data => {
        try {
            setIsLoading(true);

            const formData = new FormData();
            formData.append("firstName", data.firstName);
            formData.append("lastName", data.lastName);
            formData.append(
                "email",
                `${sanitize(data.firstName)}.${sanitize(
                    data.lastName
                )}@example.com`
            );
            formData.append("role", data.role);
            formData.append("password", "password");

            if (data.phone) formData.append("phone", data.phone);
            if (selectedFile) formData.append("profile_picture", selectedFile);

            const result = await addUser(formData);

            if (result.success) {
                toast.success("User added successfully!");

                // Keep loading for 1.5s, then close modal and reset form
                setTimeout(() => {
                    handleClose();
                    setIsLoading(false);
                }, 1500);
            } else {
                toast.error(
                    result.error || "Failed to add user. Please try again."
                );
                setIsLoading(false);
            }
        } catch (error) {
            toast.error(
                error.message || "Failed to add user. Please try again."
            );
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        modalClose();
        onClose();
    };

    const clearSelectedImage = () => {
        clearImage();
        const fileInput = document.getElementById("profile_picture");
        if (fileInput) fileInput.value = "";
    };

    const fields = [
        {
            name: "profile_picture",
            label: "Profile Picture",
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
                                <Image className="h-5 w-5 text-slate-400" />
                            </div>
                        )}
                    </div>
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
                            <Image className="h-3 w-3" />
                            Choose Image
                        </label>
                        {previewImage && (
                            <button
                                type="button"
                                onClick={clearSelectedImage}
                                className="ml-2 inline-flex items-center gap-2 px-3 py-1.5 bg-red-100 text-red-700 text-xs font-medium rounded-lg hover:bg-red-200 transition-colors"
                            >
                                <Trash2 className="h-3 w-3" />
                                Remove
                            </button>
                        )}
                                          {" "}
                    </div>
                                  {" "}
                </div>
            )
        }, // First Name
        {
            name: "firstName",
            label: "First Name",
            type: "text",
            register: register("firstName"),
            error: errors.firstName?.message,
            placeholder: "Enter first name"
        }, // Last Name
        {
            name: "lastName",
            label: "Last Name",
            type: "text",
            register: register("lastName"),
            error: errors.lastName?.message,
            placeholder: "Enter last name"
        }, // Phone Number
        {
            name: "phone",
            label: "Phone Number",
            type: "custom",
            withTooltip: true,
            tooltipText: "Optional field, international format",
            error: errors.phone?.message,
            customRender: () => (
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
            )
        }, // Role
        {
            name: "role",
            label: "Role",
            type: "custom",
            withTooltip: true,
            tooltipText: "Select user permission level",
            error: errors.role?.message,
            customRender: () => (
                <Controller
                    name="role"
                    control={control}
                    defaultValue={roles[0].value}
                    render={({ field }) => (
                        <Select
                            {...field}
                            options={roles}
                            getOptionValue={opt => opt.value}
                            getOptionLabel={opt => opt.label}
                            value={roles.find(r => r.value === field.value)}
                            onChange={opt => field.onChange(opt.value)}
                            className={`react-select-container ${
                                errors.role ? "react-select-error" : ""
                            }`}
                            classNamePrefix="react-select"
                        />
                    )}
                />
            )
        }
    ];

    const infoBox = {
        title: "Account Setup Information",
        items: [
            {
                icon: (
                    <Mail className="h-3 w-3 mt-0.5 text-blue-500 flex-shrink-0" />
                ),
                text: "Email generated as: firstname.lastname@example.com"
            },
            {
                icon: (
                    <Key className="h-3 w-3 mt-0.5 text-blue-500 flex-shrink-0" />
                ),
                text: 'Default password set to "password"'
            },
            {
                icon: (
                    <ShieldCheck className="h-3 w-3 mt-0.5 text-blue-500 flex-shrink-0" />
                ),
                text: "User can change password after first login"
            }
        ]
    };

    return (
        <FormModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Add New User"
            isLoading={isLoading}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit(onFormSubmit)}
            fields={fields}
            infoBox={infoBox}
            buttonText="Add User"
        />
    );
};

export default AddUser;
