// src/components/modals/UpdateUser.jsx
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserSchema } from "../../schemas/userSchema";
import useUserStore from "../../utils/store/useUserStore"; 
import { ShieldCheck, Mail, Image, Trash2 } from "lucide-react";
import Select from "react-select";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import useImageUpload from "../../utils/hooks/useImageUpload";
import useModal from "../../utils/hooks/useModal";
import { toast } from "react-hot-toast";
import FormModal from "./FormModal";

const roles = [
  { value: "customer", label: "Customer" },
  { value: "marketing_coordinator", label: "Marketing Coordinator" },
  { value: "admin_finance", label: "Admin Finance" },
  { value: "general_manager", label: "General Manager" }
];

const UpdateUser = ({ isOpen, onClose, user }) => { // Remove onSubmit prop
  const updateUser = useUserStore(state => state.updateUser); // ADD THIS
  
  const { previewImage, selectedFile, handleImageChange, clearImage } =
    useImageUpload();

  const { setIsLoading, isLoading, handleClose: modalClose } = useModal(() => {
    reset();
    clearImage();
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(updateUserSchema),
    mode: "onChange",
    defaultValues: {
      role: roles[0].value,
      phone: ""
    }
  });

  useEffect(() => {
    if (user && isOpen) {
      reset({
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role || roles[0].value
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isOpen, reset]);

  const handleClose = () => {
    modalClose();
    onClose();
  };

  const clearSelectedImage = () => {
    clearImage();
    const fileInput = document.getElementById("profile_picture");
    if (fileInput) fileInput.value = "";
  };

  const onFormSubmit = async (data) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("email", data.email);
      formData.append("role", data.role);
      
      if (data.phone) formData.append("phone", data.phone);
      if (selectedFile) formData.append("profile_picture", selectedFile);

      // Use the store's updateUser function instead of passed onSubmit prop
      const result = await updateUser(user.id, formData);

      if (result.success) {
        toast.success("User updated successfully!");
        setTimeout(() => {
          handleClose();
          setIsLoading(false);
        }, 1200);
      } else {
        toast.error(result.error || "Failed to update user.");
        setIsLoading(false);
      }
    } catch (error) {
      toast.error(error.message || "An error occurred while updating user.");
      setIsLoading(false);
    }
  };

  if (!isOpen || !user) return null; // Fixed typo: luser -> !user

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
              <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
            ) : user.profile_picture ? (
              <img src={user.profile_picture} alt="Current" className="w-full h-full object-cover" />
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
              {user.profile_picture ? "Change Image" : "Choose Image"}
            </label>
            {(previewImage || user.profile_picture) && (
              <button 
                type="button" 
                onClick={clearSelectedImage} 
                className="ml-2 inline-flex items-center gap-2 px-3 py-1.5 bg-red-100 text-red-700 text-xs font-medium rounded-lg hover:bg-red-200 transition-colors"
              >
                <Trash2 className="h-3 w-3"/>
                Remove
              </button>
            )}
          </div>
        </div>
      )
    },
    {
      name: "firstName",
      label: "First Name",
      type: "text",
      register: register("firstName"),
      error: errors.firstName?.message,
      placeholder: "Enter first name"
    },
    {
      name: "lastName",
      label: "Last Name",
      type: "text",
      register: register("lastName"),
      error: errors.lastName?.message,
      placeholder: "Enter last name"
    },
    {
      name: "email",
      label: "Email Address",
      type: "email",
      register: register("email"),
      error: errors.email?.message,
      placeholder: "Enter email address"
    },
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
          defaultValue=""
          render={({ field }) => (
            <PhoneInput
              {...field}
              international
              defaultCountry="PH"
              placeholder="Enter phone number"
              className={`phone-input-modern ${errors.phone ? "input-error" : ""}`}
            />
          )}
        />
      )
    },
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
              options={roles}
              value={roles.find((r) => r.value === field.value) || null}
              onChange={(opt) => field.onChange(opt ? opt.value : null)}
              getOptionValue={(opt) => opt.value}
              getOptionLabel={(opt) => opt.label}
              className={`react-select-container ${errors.role ? "react-select-error" : ""}`}
              classNamePrefix="react-select"
            />
          )}
        />
      )
    }
  ];

  const infoBox = {
    title: "Update Information",
    items: [
      { icon: <Mail className="h-3 w-3 mt-0.5 text-blue-500 flex-shrink-0" />, text: "Email changes will affect user login credentials" },
      { icon: <Image className="h-3 w-3 mt-0.5 text-blue-500 flex-shrink-0" />, text: "Profile picture updates will reflect immediately" },
      { icon: <ShieldCheck className="h-3 w-3 mt-0.5 text-blue-500 flex-shrink-0" />, text: "Role changes affect user permissions" }
    ]
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit User Profile"
      isLoading={isLoading}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit(onFormSubmit)}
      fields={fields}
      infoBox={infoBox}
      buttonText="Update User"
    />
  );
};

export default UpdateUser;