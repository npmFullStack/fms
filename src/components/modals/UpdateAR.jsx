// components/modals/UpdateAR.jsx
import { useEffect, useMemo } from "react";
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
import { Calendar, Clock, DollarSign, AlertTriangle } from "lucide-react";

const UpdateAR = ({ isOpen, onClose, arId, arRecord }) => {
  const { updateARRecord } = useFinanceStore();
  const { isLoading, setIsLoading, handleClose: modalClose } = useModal(() => {
    reset();
  });

  // Helper for placeholder values
  const formatAmount = (val) =>
    val === null || val === undefined ? "" : val.toString();

  // ✅ Calculate current collectible amount
  const currentCollectibleAmount = useMemo(() => {
    return parseFloat(arRecord?.collectible_amount || arRecord?.gross_income || 0);
  }, [arRecord]);

  // ✅ Check if collectible amount is 0
  const isFullyPaid = currentCollectibleAmount <= 0;

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setError,
    clearErrors,
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

  // Watch amount_paid for real-time validation
  const amountPaid = watch("amount_paid");

  // ✅ Validate amount paid doesn't exceed collectible amount
  useEffect(() => {
    if (amountPaid && !isNaN(amountPaid)) {
      const paidAmount = parseFloat(amountPaid);
      
      if (paidAmount > currentCollectibleAmount) {
        setError("amount_paid", {
          type: "manual",
          message: `Payment cannot exceed collectible amount of ₱${currentCollectibleAmount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`
        });
      } else {
        clearErrors("amount_paid");
      }
    }
  }, [amountPaid, currentCollectibleAmount, setError, clearErrors]);

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
      // ✅ Final validation before submission
      const paidAmount = parseFloat(data.amount_paid) || 0;
      
      if (isFullyPaid && paidAmount > 0) {
        toast.error("Cannot accept payment - collectible amount is already 0");
        return;
      }
      
      if (paidAmount > currentCollectibleAmount) {
        toast.error(`Payment cannot exceed collectible amount of ₱${currentCollectibleAmount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`);
        return;
      }

      setIsLoading(true);

      const formattedData = {
        amount_paid: paidAmount,
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

  // ✅ UPDATED: Collectible Amount field with fully paid status
  const renderCollectibleAmountField = () => (
    <div className="input-container">
      <label className="input-label-modern">Current Collectible Amount</label>
      <div className="relative">
        <NumericFormat
          value={currentCollectibleAmount}
          thousandSeparator
          prefix="₱ "
          decimalScale={2}
          allowNegative={false}
          placeholder="₱ 0.00"
          className={`input-field-modern bg-gray-50 text-gray-600 cursor-not-allowed ${
            isFullyPaid ? 'border-green-200 bg-green-50' : ''
          }`}
          readOnly
          disabled
        />
        <DollarSign className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none w-5 h-5 ${
          isFullyPaid ? 'text-green-500' : 'text-slate-400'
        }`} />
      </div>
      {isFullyPaid ? (
        <div className="flex items-center gap-2 mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
          <AlertTriangle className="w-4 h-4 text-green-600" />
          <p className="text-sm text-green-700 font-medium">
            ✅ Fully Paid - No further payments can be accepted
          </p>
        </div>
      ) : (
        <p className="text-sm text-gray-500 mt-1">
          This amount will be reduced by the payment you enter below
        </p>
      )}
    </div>
  );

  // ✅ UPDATED: Amount Paid field with validation
  const renderAmountField = () => (
    <div className="input-container">
      <label className="input-label-modern">
        Amount Paid {!isFullyPaid && "*"}
      </label>
      <Controller
        control={control}
        name="amount_paid"
        render={({ field }) => (
          <div className="relative">
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
              placeholder={isFullyPaid ? "Fully Paid" : "₱ 0.00"}
              className={`input-field-modern pr-10 ${
                errors.amount_paid ? "input-error" : ""
              } ${
                isFullyPaid ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
              onValueChange={(values) => {
                if (!isFullyPaid) {
                  field.onChange(values.value || "");
                }
              }}
              onBlur={field.onBlur}
              readOnly={isFullyPaid}
              disabled={isFullyPaid}
            />
            <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none w-5 h-5" />
          </div>
        )}
      />
      
      {/* ✅ Show validation errors */}
      {errors.amount_paid && (
        <div className="flex items-center gap-2 mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
          <AlertTriangle className="w-4 h-4 text-red-600" />
          <p className="text-sm text-red-700">{errors.amount_paid.message}</p>
        </div>
      )}
      
      {/* ✅ Show remaining balance info */}
      {amountPaid && !errors.amount_paid && !isFullyPaid && (
        <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex justify-between text-sm">
            <span className="text-blue-700 font-medium">Remaining after payment:</span>
            <span className="font-bold text-blue-800">
              ₱{(currentCollectibleAmount - parseFloat(amountPaid)).toLocaleString('en-PH', { 
                minimumFractionDigits: 2 
              })}
            </span>
          </div>
        </div>
      )}

      {isFullyPaid ? (
        <p className="text-sm text-gray-500 mt-1">
          This record is fully paid and cannot accept additional payments
        </p>
      ) : (
        <p className="text-sm text-gray-500 mt-1">
          Maximum payment: ₱{currentCollectibleAmount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
        </p>
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
                className: `input-field-modern pr-10 cursor-pointer ${
                  isFullyPaid ? "bg-gray-100 cursor-not-allowed" : ""
                }`,
                placeholder: "Select date",
                disabled: isFullyPaid
              }}
              onChange={(val) => {
                if (!isFullyPaid) {
                  field.onChange(val && val.format ? val.format("YYYY-MM-DD") : "");
                }
              }}
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
              } ${
                isFullyPaid ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
              disabled={isFullyPaid}
            />
          )}
        />
        <Clock className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none w-5 h-5" />
      </div>
      {errors.terms && <p className="error-message">{errors.terms.message}</p>}
    </div>
  );

  // ✅ UPDATED: Tips with payment validation info
  const tipsBox = {
    title: "Payment Rules",
    items: [
      { text: "Current Collectible Amount shows the remaining balance" },
      { text: "Payments cannot exceed the Collectible Amount" },
      { text: "When Collectible Amount reaches 0, no more payments can be accepted" },
    ],
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Update Payment"
      isLoading={isLoading}
      isSubmitting={isSubmitting}
      onSubmit={isFullyPaid ? () => toast.error("Cannot update - fully paid") : handleSubmit(onSubmit)}
      fields={[
        { name: "collectible_amount", type: "custom", customRender: renderCollectibleAmountField },
        { name: "amount_paid", type: "custom", customRender: renderAmountField },
        { name: "payment_date", type: "custom", customRender: renderDateField },
        { name: "terms", type: "custom", customRender: renderTermsField },
      ]}
      infoBox={tipsBox}
      buttonText={isFullyPaid ? "Fully Paid" : "Update Payment"}
      submitDisabled={isFullyPaid}
    />
  );
};

export default UpdateAR;