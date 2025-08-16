import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { partnerSchema } from "../../schemas/partnerSchema";
import usePartnerStore from "../../utils/store/usePartnerStore";
import useImageUpload from "../../utils/hooks/useImageUpload";
import useModal from "../../utils/hooks/useModal";
import {
  XMarkIcon,
  QuestionMarkCircleIcon,
  InformationCircleIcon,
  PhotoIcon,
  TrashIcon,
  BuildingOfficeIcon,
  TruckIcon
} from "@heroicons/react/24/outline";
import Select from "react-select";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

const AddPartner = ({ isOpen, onClose, type }) => {
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

  const addPartner = usePartnerStore(state => state.addPartner);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(partnerSchema),
    mode: "onChange",
    defaultValues: {
      contactPhone: "",
      serviceRoutes: []
    }
  });

  const onSubmit = async data => {
    try {
      setIsLoading(true);
      setSuccessMessage("Uploading image...");

      const formData = new FormData();
      formData.append("name", data.name);
      
      if (data.contactEmail) {
        formData.append("contactEmail", data.contactEmail);
      }
      
      if (data.contactPhone) {
        formData.append("contactPhone", data.contactPhone);
      }
      
      if (data.website) {
        formData.append("website", data.website);
      }
      
      if (type === 'trucking' && data.serviceRoutes) {
        formData.append("serviceRoutes", JSON.stringify(data.serviceRoutes));
      }

      if (selectedFile) {
        formData.append("logo", selectedFile);
      }

      const result = await addPartner(formData, type);

      if (result.success) {
        setSuccessMessage(`${type === 'shipping' ? 'Shipping line' : 'Trucking company'} added successfully`);
        setTimeout(() => {
          handleClose();
        }, 1500);
      } else {
        setErrorMessage(result.error || `Failed to add ${type === 'shipping' ? 'shipping line' : 'trucking company'}. Please try again.`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrorMessage(error.message || `Failed to add ${type === 'shipping' ? 'shipping line' : 'trucking company'}. Please try again.`);
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
          <div className={`relative bg-gradient-to-r ${type === 'shipping' ? 'from-blue-600 to-blue-700' : 'from-orange-600 to-orange-700'} rounded-t-2xl px-6 py-3 text-center`}>
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-2 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>

            {/* Icon and title */}
            <div className="flex flex-col items-center">
              <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm mb-2">
                {type === 'shipping' ? (
                  <BuildingOfficeIcon className="h-6 w-6 text-white" />
                ) : (
                  <TruckIcon className="h-6 w-6 text-white" />
                )}
              </div>
              <h2 className="text-xl font-bold text-white">
                Add {type === 'shipping' ? 'Shipping Line' : 'Trucking Company'}
              </h2>
            </div>
          </div>

          {/* Form content */}
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
                  <div className="flex items-center gap-2">
                    <InformationCircleIcon className="h-4 w-4" />
                    {message.text || imageError}
                  </div>
                </div>
              )}

              {/* Logo Upload */}
              <div className="input-container">
                <label className="input-label-modern">
                  Logo
                  <div className="group relative">
                    <QuestionMarkCircleIcon className="tooltip-icon" />
                    <div className="tooltip">
                      Max 5MB, JPEG/PNG/GIF formats
                    </div>
                  </div>
                </label>

                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
                  {/* Logo preview */}
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
                  placeholder={`Enter ${type === 'shipping' ? 'shipping line' : 'trucking company'} name`}
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

              {/* Contact Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="input-container">
                  <label className="input-label-modern">
                    Contact Email
                  </label>
                  <input
                    id="contactEmail"
                    type="email"
                    {...register("contactEmail")}
                    placeholder="Enter contact email"
                    className={`input-field-modern ${
                      errors.contactEmail ? "input-error" : ""
                    }`}
                  />
                  {errors.contactEmail && (
                    <p className="error-message">
                      {errors.contactEmail.message}
                    </p>
                  )}
                </div>

                <div className="input-container">
                  <label className="input-label-modern">
                    Contact Phone
                    <div className="group relative">
                      <QuestionMarkCircleIcon className="tooltip-icon" />
                      <div className="tooltip">
                        Optional field, international format
                      </div>
                    </div>
                  </label>
                  <Controller
                    name="contactPhone"
                    control={control}
                    render={({ field }) => (
                      <PhoneInput
                        {...field}
                        international
                        defaultCountry="PH"
                        placeholder="Enter phone number"
                        className={`phone-input-modern ${
                          errors.contactPhone ? "input-error" : ""
                        }`}
                      />
                    )}
                  />
                  {errors.contactPhone && (
                    <p className="error-message">
                      {errors.contactPhone.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Website */}
              <div className="input-container">
                <label
                  htmlFor="website"
                  className="input-label-modern"
                >
                  Website
                </label>
                <input
                  id="website"
                  type="url"
                  {...register("website")}
                  placeholder="Enter company website"
                  className={`input-field-modern ${
                    errors.website ? "input-error" : ""
                  }`}
                />
                {errors.website && (
                  <p className="error-message">
                    {errors.website.message}
                  </p>
                )}
              </div>

              {/* Service Routes (for trucking companies) */}
              {type === 'trucking' && (
                <div className="input-container">
                  <label className="input-label-modern">
                    Service Routes
                    <div className="group relative">
                      <QuestionMarkCircleIcon className="tooltip-icon" />
                      <div className="tooltip">
                        Routes this trucking company serves
                      </div>
                    </div>
                  </label>
                  <Controller
                    name="serviceRoutes"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        isMulti
                        options={[]} // You'll need to fetch routes from your backend
                        placeholder="Select service routes..."
                        className="react-select-container"
                        classNamePrefix="react-select"
                        value={field.value}
                        onChange={value => field.onChange(value)}
                      />
                    )}
                  />
                  {errors.serviceRoutes && (
                    <p className="error-message">
                      {errors.serviceRoutes.message}
                    </p>
                  )}
                </div>
              )}

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
                  className={`btn-primary-modern ${isLoading ? 'opacity-70' : ''}`}
                >
                  {isLoading ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Adding...
                    </>
                  ) : (
                    `Add ${type === 'shipping' ? 'Shipping Line' : 'Trucking Company'}`
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

export default AddPartner;