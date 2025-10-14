// components/modals/UpdateAR.jsx
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateARFormSchema } from "../../schemas/arSchema";
import useFinanceStore from "../../utils/store/useFinanceStore";
import useModal from "../../utils/hooks/useModal";
import FormModal from "./FormModal";
import { toast } from "react-hot-toast";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import { NumericFormat } from "react-number-format";
import { Calendar, Clock } from "lucide-react";

const UpdateAR = ({ isOpen, onClose, arId, arRecord }) => {
  const { updateARRecord } = useFinanceStore();
  const { isLoading, setIsLoading, handleClose: modalClose } = useModal(() => {
    reset();
  });

  // Helper for placeholder values
  const formatAmount = (val) =>
    val === null || val === undefined ? "" : val.toString();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(updateARFormSchema),
    mode: "onChange",
    defaultValues: {
      amount_paid: "",
      payment_date: "",
      terms: "",
    },
  });

  // Populate with existing data
  useEffect(() => {
    if (arRecord && isOpen) {
      reset({
        amount_paid: formatAmount(arRecord.amount_paid),
        payment_date: arRecord.payment_date || "",
        terms: arRecord.terms?.toString() || "0",
      });
    }
  }, [arRecord, isOpen, reset]);

  const handleClose = () => {
    reset();
    modalClose();
    onClose();
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      const formattedData = {
        amount_paid: parseFloat(data.amount_paid) || 0,
        payment_date: data.payment_date || null,
        terms: parseInt(data.terms) || 0,
      };

      const result = await updateARRecord(arId, formattedData);
      if (result.success) {
        toast.success("Payment updated successfully");
        handleClose();
      } else {
        toast.error(result.error || "Failed to update payment. Please try again.");
      }
    } catch (err) {
      console.error("Submit error:", err);
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Fixed for zod string validation
  const renderAmountField = () => (
    <div className="input-container">
      <label className="input-label-modern">Amount Paid *</label>
      <Controller
        control={control}
        name="amount_paid"
        render={({ field }) => (
          <NumericFormat
            value={
              field.value === "" || field.value === null || field.value === "0"
                ? ""
                : field.value
            }
            thousandSeparator
            prefix="₱ "
            decimalScale={2}
            allowNegative={false}
            placeholder="₱ 0.00"
            className={`input-field-modern ${
              errors.amount_paid ? "input-error" : ""
            }`}
            onValueChange={(values) => {
              // ✅ Keep as string for Zod
              field.onChange(values.value || "");
            }}
            onBlur={field.onBlur}
          />
        )}
      />
      {errors.amount_paid && (
        <p className="error-message">{errors.amount_paid.message}</p>
      )}
    </div>
  );

  const renderDateField = () => (
    <div className="input-container">
      <label className="input-label-modern">Payment Date</label>
      <div className="relative">
        <Controller
          control={control}
          name="payment_date"
          render={({ field }) => (
            <Datetime
              {...field}
              timeFormat={false}
              dateFormat="YYYY-MM-DD"
              closeOnSelect={true}
              inputProps={{
                className: "input-field-modern pr-10 cursor-pointer",
                placeholder: "Select date",
              }}
              onChange={(val) =>
                field.onChange(val && val.format ? val.format("YYYY-MM-DD") : "")
              }
              value={field.value || ""}
            />
          )}
        />
        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none w-5 h-5" />
      </div>
      {errors.payment_date && (
        <p className="error-message">{errors.payment_date.message}</p>
      )}
    </div>
  );

  const renderTermsField = () => (
    <div className="input-container">
      <label className="input-label-modern">Payment Terms (Days)</label>
      <div className="relative">
        <Controller
          control={control}
          name="terms"
          render={({ field }) => (
            <input
              {...field}
              type="number"
              min="0"
              step="1"
              placeholder="0"
              className={`input-field-modern pr-10 ${
                errors.terms ? "input-error" : ""
              }`}
            />
          )}
        />
        <Clock className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none w-5 h-5" />
      </div>
      {errors.terms && <p className="error-message">{errors.terms.message}</p>}
    </div>
  );

  // ✅ Tips only toolbox
  const tipsBox = {
    title: "Tips",
    items: [
      { text: "Ensure all values are correct before saving." },
      { text: "Leave fields blank if not applicable." },
      { text: "Amount field uses a placeholder — no need to clear it." },
    ],
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Update Payment"
      isLoading={isLoading}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit(onSubmit)}
      fields={[
        { name: "amount_paid", type: "custom", customRender: renderAmountField },
        { name: "payment_date", type: "custom", customRender: renderDateField },
        { name: "terms", type: "custom", customRender: renderTermsField },
      ]}
      infoBox={tipsBox}
      buttonText="Update Payment"
    />
  );
};

export default UpdateAR;
