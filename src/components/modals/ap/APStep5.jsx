import { Controller } from "react-hook-form";
import { Info, Calculator } from "lucide-react";
import { NumericFormat } from "react-number-format";
import { useEffect } from "react";

const APStep5 = ({ register, control, errors, watch, setValue, apRecord }) => {
  // Watch form values for real-time calculations
  const formData = watch();
  
  // Calculate total expenses from all charges (same as APStep6)
  const calculateTotalExpenses = () => {
    const amounts = [
      formData.freight_amount,
      formData.trucking_origin_amount,
      formData.trucking_dest_amount,
      formData.crainage_amount,
      formData.arrastre_origin_amount,
      formData.arrastre_dest_amount,
      formData.wharfage_origin_amount,
      formData.wharfage_dest_amount,
      formData.labor_origin_amount,
      formData.labor_dest_amount,
      formData.rebates_amount,
      formData.storage_amount,
      formData.facilitation_amount,
    ];
    return amounts.reduce((sum, val) => sum + (Number(val) || 0), 0);
  };

  const totalExpenses = calculateTotalExpenses();
  const birPercentage = formData.bir_percentage || 0;
  const netRevenuePercentage = formData.net_revenue_percentage || 0;
  
  // Calculate derived values
  const birAmount = totalExpenses * (birPercentage / 100);
  const totalPayables = totalExpenses + birAmount;
  const netRevenueAmount = totalPayables * (netRevenuePercentage / 100);
  const calculatedGrossIncome = totalPayables + netRevenueAmount;

  // ✅ AUTO-SET FORM VALUES WHEN CALCULATIONS CHANGE
  useEffect(() => {
    // Always set total_expenses (it's calculated from charges)
    setValue("total_expenses", totalExpenses, { shouldValidate: true });
    
    // Always set total_payables (it's calculated from expenses + BIR)
    setValue("total_payables", totalPayables, { shouldValidate: true });
    
    // Auto-set gross_income when net revenue % is set
    if (netRevenuePercentage > 0) {
      setValue("gross_income", calculatedGrossIncome, { shouldValidate: true });
    }
  }, [totalExpenses, totalPayables, calculatedGrossIncome, netRevenuePercentage, setValue]);

  // Determine if gross income should be auto-calculated or manual
  const isAutoCalculated = netRevenuePercentage > 0;
  const displayGrossIncome = isAutoCalculated ? calculatedGrossIncome : (formData.gross_income || 0);

  // Handle net revenue percentage change
  const handleNetRevenueChange = (value) => {
    if (value > 0) {
      // Auto-calculate gross income when net revenue % is set
      setValue("gross_income", calculatedGrossIncome, { shouldValidate: true });
    }
    // If net revenue % is cleared, keep the current gross income value (manual mode)
  };

  // Handle gross income manual input (only when not auto-calculated)
  const handleGrossIncomeChange = (value) => {
    if (!isAutoCalculated) {
      setValue("gross_income", value === "" ? "" : Number(value), { shouldValidate: true });
    }
  };

  return (
    <div className="space-y-5">
      {/* 🧰 Header */}
      <div className="info-box-modern">
        <div className="flex items-start gap-3">
          <div className="p-1.5 bg-blue-100 rounded-lg">
            <Calculator className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-slate-800 mb-1">
              Financial Calculations
            </h4>
            <p className="text-xs text-slate-600">
              Configure BIR tax percentage and net revenue to calculate gross income.
            </p>
          </div>
        </div>
      </div>

      {/* 📊 Total Expenses Display (Read-only) */}
      <div className="input-container">
        <label className="input-label-modern">Total Expenses</label>
        <NumericFormat
          value={totalExpenses}
          thousandSeparator
          prefix="₱"
          decimalScale={2}
          displayType="text"
          className="input-field-modern bg-gray-100 cursor-not-allowed"
          readOnly
        />
        <p className="text-xs text-slate-500 mt-1">
          Sum of all charges from previous steps
        </p>
      </div>

      {/* 💰 BIR Percentage + Total Payables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 💰 BIR Percentage */}
        <div className="input-container">
          <label className="input-label-modern">BIR (%)</label>
          <Controller
            control={control}
            name="bir_percentage"
            render={({ field }) => (
              <NumericFormat
                value={field.value === "" || field.value === null || field.value === 0 || field.value === "0" ? "" : field.value}
                thousandSeparator={false}
                suffix="%"
                decimalScale={2}
                allowNegative={false}
                placeholder="0.00%"
                className={`input-field-modern ${
                  errors.bir_percentage ? "input-error" : ""
                }`}
                onValueChange={(values) => {
                  const val = values.value;
                  field.onChange(val === "" ? "" : Number(val));
                }}
                onBlur={field.onBlur}
              />
            )}
          />
          {errors.bir_percentage && (
            <p className="error-message">{errors.bir_percentage.message}</p>
          )}
        </div>

        {/* 💰 Total Payables (Read-only) */}
        <div className="input-container">
          <label className="input-label-modern">Total Payables</label>
          <NumericFormat
            value={totalPayables}
            thousandSeparator
            prefix="₱"
            decimalScale={2}
            displayType="text"
            className="input-field-modern bg-gray-100 cursor-not-allowed"
            readOnly
          />
          <p className="text-xs text-slate-500 mt-1">
            Total Expenses + BIR Tax
          </p>
        </div>
      </div>

      {/* 💰 Net Revenue Percentage + Gross Income */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 💰 Net Revenue Percentage (Optional) */}
        <div className="input-container">
          <label className="input-label-modern">
            Net Revenue (%) <span className="text-xs text-slate-400">Optional</span>
          </label>
          <Controller
            control={control}
            name="net_revenue_percentage"
            render={({ field }) => (
              <NumericFormat
                value={field.value === "" || field.value === null || field.value === 0 || field.value === "0" ? "" : field.value}
                thousandSeparator={false}
                suffix="%"
                decimalScale={2}
                allowNegative={false}
                placeholder="0.00%"
                className={`input-field-modern ${
                  errors.net_revenue_percentage ? "input-error" : ""
                }`}
                onValueChange={(values) => {
                  const val = values.value;
                  field.onChange(val === "" ? "" : Number(val));
                  handleNetRevenueChange(Number(val) || 0);
                }}
                onBlur={field.onBlur}
              />
            )}
          />
          {errors.net_revenue_percentage && (
            <p className="error-message">{errors.net_revenue_percentage.message}</p>
          )}
        </div>

        {/* 💰 Gross Income (Auto-calculated or Manual) */}
        <div className="input-container">
          <label className="input-label-modern">Gross Income</label>
          <Controller
            control={control}
            name="gross_income"
            render={({ field }) => (
              <NumericFormat
                value={isAutoCalculated ? calculatedGrossIncome : (field.value === "" || field.value === null || field.value === 0 || field.value === "0" ? "" : field.value)}
                thousandSeparator
                prefix="₱"
                decimalScale={2}
                allowNegative={false}
                placeholder="₱0.00"
                className={`input-field-modern ${
                  errors.gross_income ? "input-error" : ""
                } ${
                  isAutoCalculated ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
                onValueChange={(values) => {
                  if (!isAutoCalculated) {
                    const val = values.value;
                    handleGrossIncomeChange(val);
                  }
                }}
                onBlur={field.onBlur}
                readOnly={isAutoCalculated}
              />
            )}
          />
          {errors.gross_income && (
            <p className="error-message">{errors.gross_income.message}</p>
          )}
          <p className="text-xs text-slate-500 mt-1">
            {isAutoCalculated 
              ? `Auto-calculated: Total Payables + Net Revenue (${netRevenuePercentage}%)` 
              : "Enter manually or set Net Revenue % above"
            }
          </p>
        </div>
      </div>

      {/* 📈 Calculation Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
        <h5 className="text-sm font-semibold text-slate-800 mb-3">Calculation Summary</h5>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600">Total Expenses:</span>
            <span className="font-medium text-slate-800">₱{totalExpenses.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">BIR Tax ({birPercentage}%):</span>
            <span className="font-medium text-slate-800">₱{birAmount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between border-t border-blue-200 pt-2">
            <span className="font-semibold text-slate-800">Total Payables:</span>
            <span className="font-semibold text-slate-800">₱{totalPayables.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          {netRevenuePercentage > 0 && (
            <div className="flex justify-between">
              <span className="text-slate-600">Net Revenue ({netRevenuePercentage}%):</span>
              <span className="font-medium text-slate-800">₱{netRevenueAmount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-blue-200 pt-2">
            <span className="font-semibold text-slate-800 text-base">Gross Income:</span>
            <span className="font-semibold text-slate-800 text-base">₱{displayGrossIncome.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APStep5;