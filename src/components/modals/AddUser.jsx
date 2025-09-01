import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addUserSchema } from "../../schemas/userSchema";
import useUserStore from "../../utils/store/useUserStore";
import FormModal from "./FormModal";
import {
  QuestionMarkCircleIcon,
  InformationCircleIcon,
  ShieldCheckIcon,
  EnvelopeIcon,
  KeyIcon,
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
      role: roles[0].value,
      phone: ""
    }
  });

  const onSubmit = async (data) => {
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
      formData.append("role", data.role);
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

  const fields = [
    // Profile Picture Upload
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
                <PhotoIcon className="h-5 w-5 text-slate-400" />
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
      )
    },
    // First Name
    {
      name: "firstName",
      label: "First Name",
      type: "text",
      register: register("firstName"),
      error: errors.firstName?.message,
      placeholder: "Enter first name"
    },
    // Last Name
    {
      name: "lastName",
      label: "Last Name",
      type: "text",
      register: register("lastName"),
      error: errors.lastName?.message,
      placeholder: "Enter last name"
    },
    // Phone Number
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
    },
    // Role
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
              className={`react-select-container ${errors.role ? "react-select-error" : ""}`}
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
        icon: <EnvelopeIcon className="h-3 w-3 mt-0.5 text-blue-500 flex-shrink-0" />,
        text: "Email generated as: firstname.lastname@example.com"
      },
      {
        icon: <KeyIcon className="h-3 w-3 mt-0.5 text-blue-500 flex-shrink-0" />,
        text: 'Default password set to "password"'
      },
      {
        icon: <ShieldCheckIcon className="h-3 w-3 mt-0.5 text-blue-500 flex-shrink-0" />,
        text: "User can change password after first login"
      }
    ]
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New User"
      message={message.text || imageError ? {
        type: message.type || "error",
        text: message.text || imageError
      } : null}
      isLoading={isLoading}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit(onSubmit)}
      fields={fields}
      infoBox={infoBox}
      buttonText="Add"
    />
  );
};

export default AddUser;