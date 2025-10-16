import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { incidentSchema } from "../../schemas/incidentSchema";
import useModal from "../../utils/hooks/useModal";
import FormModal from "./FormModal";
import { toast } from "react-hot-toast";
import Select from "react-select";
import useBookingStore from "../../utils/store/useBookingStore";
import useIncidentStore from "../../utils/store/useIncidentStore";
import { useEffect } from "react";
import { NumericFormat } from "react-number-format";
import useImageUpload from "../../utils/hooks/useImageUpload";
import { Image, Trash2 } from "lucide-react";

const AddIncident = ({ isOpen, onClose }) => {
  const {
    isLoading,
    setIsLoading,
    handleClose: modalClose
  } = useModal(() => {
    reset();
    clearImage();
  });

  const { bookings, fetchBookings } = useBookingStore();
  const { createIncident } = useIncidentStore();
  
  const {
    previewImage,
    selectedFile,
    handleImageChange,
    clearImage
  } = useImageUpload();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(incidentSchema),
    mode: "onChange"
  });

  // Fetch bookings when component mounts
  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleFormSubmit = async (data) => {
    try {
      setIsLoading(true);
      
      const formData = {
        ...data,
        image: selectedFile ? [selectedFile] : null
      };

      const result = await createIncident(formData);

      if (result.success) {
        toast.success("Incident reported successfully");
        handleClose();
        reset();
        clearImage();
      } else {
        toast.error(
          result.error || "Failed to report incident. Please try again."
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        error.message || "Failed to report incident. Please try again."
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
    document.getElementById("incidentImage").value = "";
  };

  const incidentTypeOptions = [
    { value: "SEA", label: "Sea Incident" },
    { value: "LAND", label: "Land Incident" }
  ];

  // Format bookings for dropdown
  const bookingOptions = (bookings || []).map(booking => ({
    value: booking.id,
    label: `${booking.booking_number} - ${booking.shipper || 'Unknown Shipper'}`
  }));

  const fields = [
    {
      name: "type",
      label: "Incident Type",
      type: "custom",
      error: errors.type?.message,
      customRender: () => (
        <div>
          <label className="input-label-modern">Incident Type *</label>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value ? 
                  incidentTypeOptions.find(option => option.value === field.value) : null
                }
                onChange={(option) => field.onChange(option ? option.value : "")}
                options={incidentTypeOptions}
                placeholder="Select incident type"
                isClearable
                className="react-select-container"
                classNamePrefix="react-select"
              />
            )}
          />
          {errors.type && (
            <p className="error-message">{errors.type.message}</p>
          )}
        </div>
      )
    },
    {
      name: "bookingId",
      label: "Booking",
      type: "custom",
      error: errors.bookingId?.message,
      customRender: () => (
        <div>
          <label className="input-label-modern">Booking *</label>
          <Controller
            name="bookingId"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value ? 
                  bookingOptions.find(option => option.value === field.value) : null
                }
                onChange={(option) => field.onChange(option ? option.value : "")}
                options={bookingOptions}
                placeholder="Select booking"
                isClearable
                className="react-select-container"
                classNamePrefix="react-select"
              />
            )}
          />
          {errors.bookingId && (
            <p className="error-message">{errors.bookingId.message}</p>
          )}
        </div>
      )
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      register: register("description"),
      error: errors.description?.message,
      placeholder: "Enter incident description"
    },
    {
      name: "totalCost",
      label: "Total Cost",
      type: "custom",
      error: errors.totalCost?.message,
      customRender: () => (
        <div>
          <label className="input-label-modern">Total Cost *</label>
          <Controller
            control={control}
            name="totalCost"
            render={({ field }) => (
              <NumericFormat
                value={field.value === "" || field.value === null || field.value === 0 || field.value === "0" ? "" : field.value}
                thousandSeparator
                prefix="₱"
                decimalScale={2}
                allowNegative={false}
                placeholder="₱0.00"
                className={`input-field-modern ${
                  errors.totalCost ? "input-error" : ""
                }`}
                onValueChange={(values) => {
                  const val = values.value;
                  // Convert to number only if not empty
                  field.onChange(val === "" ? "" : Number(val));
                }}
                onBlur={field.onBlur}
              />
            )}
          />
          {errors.totalCost && (
            <p className="error-message">{errors.totalCost.message}</p>
          )}
        </div>
      )
    },
    {
      name: "image",
      label: "Incident Image",
      type: "custom",
      withTooltip: true,
      tooltipText: "Max 5MB, JPEG/PNG/GIF formats",
      customRender: () => (
        <div>
          <label className="input-label-modern">Incident Image</label>
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
            <div className="relative w-12 h-12 rounded-lg bg-white border-2 border-white shadow-md overflow-hidden">
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
                id="incidentImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <label
                htmlFor="incidentImage"
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
            </div>
          </div>
        </div>
      )
    }
  ];

  const infoBox = {
    title: "Incident Reporting",
    items: [
      { text: "Select SEA for ship-related incidents or LAND for truck-related incidents." },
      { text: "Provide a clear description of what happened." },
      { text: "Include any relevant images for documentation." },
      { text: "Cost should reflect damages or additional expenses incurred." }
    ]
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Report Incident"
      isLoading={isLoading}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit(handleFormSubmit)}
      fields={fields}
      infoBox={infoBox}
      buttonText="Report Incident"
    />
  );
};

export default AddIncident;