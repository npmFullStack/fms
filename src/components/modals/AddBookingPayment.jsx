// src/components/modals/AddBookingPayment.jsx
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import FormModal from "./FormModal";
import Select from "react-select";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import toast from "react-hot-toast";
import { z } from "zod";
import usePaymentStore from "../../utils/store/usePaymentStore";
import api from "../../config/axios";

// ✅ Validation schema
const bookingSchema = z.object({
  commodity: z.string().min(1, "Commodity is required"),
  pickup_location: z.string().min(1, "Pickup location is required"),
  booking_mode: z.string().min(1, "Booking mode is required"),
  consignee_name: z.string().min(1, "Consignee name is required"),
  phone: z.string().min(1, "Phone number is required"),
  amount: z.string().min(1, "Amount is required"),
});

const AddBookingPayment = ({ isOpen, onClose, booking }) => {
  const { createPayment, loading } = usePaymentStore();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const bookingModes = [
    { value: "Door to Door", label: "Door to Door" },
    { value: "Port to Port", label: "Port to Port" },
  ];

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bookingSchema),
    mode: "onChange",
  });

  // ✅ Handles both booking + payment
  const handleBookNow = async (data) => {
    try {
      setIsRedirecting(true);

      // 1️⃣ Create booking (customer endpoint)
      const res = await api.post("/customer/bookings", {
        commodity: data.commodity,
        pickup_location: data.pickup_location,
        booking_mode: data.booking_mode,
        consignee_name: data.consignee_name,
        phone: data.phone,
        total_amount: parseFloat(data.amount),
      });

      const result = res.data;

      if (!result.success) {
        toast.error(result.error || "Failed to create booking");
        setIsRedirecting(false);
        return;
      }

      const bookingId = result.data?.id;
      if (!bookingId) {
        toast.error("Booking ID not returned");
        setIsRedirecting(false);
        return;
      }

      // 2️⃣ Proceed to PayMongo payment
      const paymentResult = await createPayment({
        booking_id: bookingId,
        amount: parseFloat(data.amount),
        method: "GCash",
      });

      if (paymentResult.success) {
        const { client_key } = paymentResult.data;
        toast.success("Redirecting to PayMongo...");
        window.location.href = `https://paymongo.page.link/${client_key}`;
      } else {
        toast.error(paymentResult.error || "Failed to initialize payment");
      }
    } catch (err) {
      console.error("Booking error:", err.response?.data || err.message);
      toast.error("Something went wrong while processing booking");
    } finally {
      setIsRedirecting(false);
      reset();
    }
  };

  const fields = [
    {
      name: "commodity",
      label: "Commodity",
      type: "text",
      register: register("commodity"),
      error: errors.commodity?.message,
      placeholder: "Enter commodity type",
    },
    {
      name: "pickup_location",
      label: "Pickup Location",
      type: "text",
      register: register("pickup_location"),
      error: errors.pickup_location?.message,
      placeholder: "Enter pickup location",
    },
    {
      name: "booking_mode",
      label: "Booking Mode",
      type: "custom",
      error: errors.booking_mode?.message,
      customRender: () => (
        <Controller
          name="booking_mode"
          control={control}
          defaultValue={bookingModes[0].value}
          render={({ field }) => (
            <Select
              {...field}
              options={bookingModes}
              getOptionValue={(opt) => opt.value}
              getOptionLabel={(opt) => opt.label}
              value={bookingModes.find((m) => m.value === field.value)}
              onChange={(opt) => field.onChange(opt.value)}
              classNamePrefix="react-select"
              className={`react-select-container ${
                errors.booking_mode ? "react-select-error" : ""
              }`}
            />
          )}
        />
      ),
    },
    {
      name: "consignee_name",
      label: "Consignee Name",
      type: "text",
      register: register("consignee_name"),
      error: errors.consignee_name?.message,
      placeholder: "Enter consignee full name",
    },
    {
      name: "phone",
      label: "Phone Number",
      type: "custom",
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
      ),
    },
    {
      name: "amount",
      label: "Amount (₱)",
      type: "number",
      register: register("amount"),
      error: errors.amount?.message,
      placeholder: "Enter amount",
    },
  ];

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Book & Pay"
      isLoading={loading || isRedirecting}
      onSubmit={handleSubmit(handleBookNow)}
      fields={fields}
      buttonText="Book Now!"
    />
  );
};

export default AddBookingPayment;
