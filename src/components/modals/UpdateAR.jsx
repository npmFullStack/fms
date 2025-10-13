// components/modals/UpdateAR.jsx
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateARFormSchema } from "../../schemas/arSchema";
import useFinanceStore from "../../utils/store/useFinanceStore";
import useModal from "../../utils/hooks/useModal";
import FormModal from "./FormModal";
import { toast } from "react-hot-toast";

// ✅ Same imports as APStep2
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import { NumericFormat } from "react-number-format";
import { Calendar, Info } from "lucide-react";

const UpdateAR = ({ isOpen, onClose, arId, arRecord }) => {
  const { updateARRecord } = useFinanceStore();
  const { isLoading, setIsLoading, handleClose: modalClose } = useModal(() => reset());

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(updateARFormSchema),
    mode: "onChange",
    defaultValues: {
      amount_paid: "",
      payment_date: "",
    },
  });

  // Populate form when modal opens
  useEffect(() => {
    if (arRecord && isOpen) {
      reset({
        amount_paid: arRecord.amount_paid !== null && arRecord.amount_paid !== undefined
          ? arRecord.amount_paid.toString()
          : "",
        payment_date: arRecord.payment_date || "",
      });
    }
  }, [arRecord, isOpen, reset]);

  const handleClose = () => {
    modalClose();
    onClose();
  };

  const handleFormSubmit = async (data) => {
    try {
      setIsLoading(true);

      const formattedData = {
        amount_paid: parseFloat(data.amount_paid) || 0,
        payment_date: data.payment_date || null,
      };

      const result = await updateARRecord(arId, formattedData);
      if (result.success) {
        toast.success("Payment updated successfully");
        handleClose();
        reset();
      } else {
        toast.error(result.error || "Failed to update payment. Please try again.");
      }
    } catch (error) {
      console.error("Error updating AR:", error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // Info Box
  const infoBox = {
    title: "Payment Information",
    items: [
      { text: `Client: ${arRecord?.client || "-"}` },
      { text: `HWB: ${arRecord?.hwb_number || "-"}` },
      {
        text: `Total Amount: P${arRecord?.pesos?.toLocaleString("en-PH") || "0"}`,
      },
      {
        text: `Current Balance: P${
          arRecord?.balance?.toLocaleString("en-PH") ||
          arRecord?.pesos?.toLocaleString("en-PH") ||
          "0"
        }`,
      },
    ],
  };

  // Form Fields - FIXED VERSION
  const fields = [
    {
      name: "amount_paid",
      label: "Amount Paid",
      type: "custom",
      required: true,
      error: errors.amount_paid?.message,
      controller: true,
      render: ({ field }) => (
        <div className="input-container">
          <label className="input-label-modern">Amount Paid *</label>
          <NumericFormat
            value={
              field.value === "" || field.value === null || field.value === 0
                ? ""
                : field.value
            }
            thousandSeparator
            prefix="₱ "
            decimalScale={2}
            allowNegative={false}
            placeholder="₱ 0.00"
            className={`input-field-modern w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-150 ${
              errors.amount_paid ? "border-red-500" : ""
            }`}
            onValueChange={(values) => {
              const val = values.value;
              field.onChange(val === "" ? "" : val);
            }}
            onBlur={field.onBlur}
          />
          {errors.amount_paid && (
            <p className="error-message text-red-500 text-sm mt-1">{errors.amount_paid.message}</p>
          )}
        </div>
      ),
    },
    {
      name: "payment_date",
      label: "Payment Date",
      type: "custom",
      error: errors.payment_date?.message,
      controller: true,
      render: ({ field }) => (
        <div className="input-container">
          <label className="input-label-modern">Payment Date</label>
          <div className="relative">
            <Datetime
              timeFormat={false}
              dateFormat="YYYY-MM-DD"
              closeOnSelect
              inputProps={{
                className: `input-field-modern w-full px-3 py-2 pr-10 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-150 cursor-pointer ${
                  errors.payment_date ? "border-red-500" : ""
                }`,
                placeholder: "Select date",
              }}
              onChange={(val) =>
                field.onChange(val && val.format ? val.format("YYYY-MM-DD") : "")
              }
              value={field.value || ""}
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none w-5 h-5" />
          </div>
          {errors.payment_date && (
            <p className="error-message text-red-500 text-sm mt-1">{errors.payment_date.message}</p>
          )}
        </div>
      ),
    },
  ];

  return (
    <FormModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Update Payment"
      isLoading={isLoading}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit(handleFormSubmit)}
      fields={fields}
      infoBox={infoBox}
      buttonText="Update Payment"
      control={control}
    />
  );
};

export default UpdateAR;