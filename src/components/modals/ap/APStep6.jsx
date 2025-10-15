// components/modals/ap/APStep6.jsx
import { useState } from "react";
import { Info, FileText, Calculator } from "lucide-react";

const APStep6 = ({ watch, apRecord }) => {
  // ✅ Safely call watch only if it's a function
  const formData = typeof watch === "function" ? watch() : {};

  const [activeTab, setActiveTab] = useState("Freight Charges");

  // ✅ Currency formatter
  const formatCurrency = (num) =>
    `₱${(num || 0).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const formatDate = (date) => {
    if (!date) return "Not set";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // ✅ Calculate total expenses from all charges (same as APStep5)
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

  // ✅ Calculate everything dynamically like APStep5
  const totalExpenses = calculateTotalExpenses();
  const birPercentage = formData.bir_percentage || 0; // Use 0 if not set, not 12
  const birAmount = totalExpenses * (birPercentage / 100);
  const totalPayables = totalExpenses + birAmount;
  const netRevenuePercentage = formData.net_revenue_percentage || 0;
  const netRevenueAmount = totalPayables * (netRevenuePercentage / 100);
  
  // ✅ Use the form value if set, otherwise calculate it
  const grossIncome = formData.gross_income || (totalPayables + netRevenueAmount);

  const groups = [
    {
      title: "Freight Charges",
      charges: [
        {
          label: "Freight",
          payee: formData.freight_payee || apRecord?.freight_payee,
          amount: formData.freight_amount,
          date: formData.freight_check_date,
          voucher: formData.freight_voucher,
        },
      ],
    },
    {
      title: "Trucking Charges",
      charges: [
        {
          label: "Origin Trucking",
          payee: formData.trucking_origin_payee || apRecord?.trucking_origin_payee,
          amount: formData.trucking_origin_amount,
          date: formData.trucking_origin_check_date,
          voucher: formData.trucking_origin_voucher,
        },
        {
          label: "Destination Trucking",
          payee: formData.trucking_dest_payee || apRecord?.trucking_dest_payee,
          amount: formData.trucking_dest_amount,
          date: formData.trucking_dest_check_date,
          voucher: formData.trucking_dest_voucher,
        },
      ],
    },
    {
      title: "Port Charges",
      charges: [
        { label: "Crainage", payee: formData.crainage_payee, amount: formData.crainage_amount, date: formData.crainage_check_date, voucher: formData.crainage_voucher },
        { label: "Arrastre (Origin)", payee: formData.arrastre_origin_payee, amount: formData.arrastre_origin_amount, date: formData.arrastre_origin_check_date, voucher: formData.arrastre_origin_voucher },
        { label: "Arrastre (Dest)", payee: formData.arrastre_dest_payee, amount: formData.arrastre_dest_amount, date: formData.arrastre_dest_check_date, voucher: formData.arrastre_dest_voucher },
        { label: "Wharfage (Origin)", payee: formData.wharfage_origin_payee, amount: formData.wharfage_origin_amount, date: formData.wharfage_origin_check_date, voucher: formData.wharfage_origin_voucher },
        { label: "Wharfage (Dest)", payee: formData.wharfage_dest_payee, amount: formData.wharfage_dest_amount, date: formData.wharfage_dest_check_date, voucher: formData.wharfage_dest_voucher },
        { label: "Labor (Origin)", payee: formData.labor_origin_payee, amount: formData.labor_origin_amount, date: formData.labor_origin_check_date, voucher: formData.labor_origin_voucher },
        { label: "Labor (Dest)", payee: formData.labor_dest_payee, amount: formData.labor_dest_amount, date: formData.labor_dest_check_date, voucher: formData.labor_dest_voucher },
      ],
    },
    {
      title: "Miscellaneous Charges",
      charges: [
        { label: "Rebates/DENR", payee: formData.rebates_payee, amount: formData.rebates_amount, date: formData.rebates_check_date, voucher: formData.rebates_voucher },
        { label: "Storage", payee: formData.storage_payee, amount: formData.storage_amount, date: formData.storage_check_date, voucher: formData.storage_voucher },
        { label: "Facilitation", payee: formData.facilitation_payee, amount: formData.facilitation_amount, date: formData.facilitation_check_date, voucher: formData.facilitation_voucher },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Info Box */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 p-4 rounded-lg">
        <Info className="w-5 h-5 text-blue-600 mt-0.5" />
        <div className="text-sm text-slate-700">
          <p className="font-medium text-slate-800 mb-1">
            Please review all charge details carefully.
          </p>
          <p>
            Make sure that payee, amounts, dates, and vouchers are correct before finalizing.
          </p>
        </div>
      </div>

      {/* Booking Info */}
      {apRecord && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-blue-600" />
            <h4 className="font-semibold text-slate-800">Booking Information</h4>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-600">Booking #:</span>
              <p className="font-medium text-slate-800">{apRecord.booking_number}</p>
            </div>
            <div>
              <span className="text-slate-600">HWB #:</span>
              <p className="font-medium text-slate-800">{apRecord.hwb_number}</p>
            </div>
            <div>
              <span className="text-slate-600">Route:</span>
              <p className="font-medium text-slate-800">{apRecord.route}</p>
            </div>
            <div>
              <span className="text-slate-600">Commodity:</span>
              <p className="font-medium text-slate-800">{apRecord.commodity}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div>
        <div className="flex border-b border-blue-100 mb-4">
          {groups.map((g) => (
            <button
              key={g.title}
              type="button" // ✅ Prevent submit
              onClick={() => setActiveTab(g.title)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === g.title
                  ? "text-blue-700 border-b-2 border-blue-600"
                  : "text-slate-600 hover:text-blue-600"
              }`}
            >
              {g.title}
            </button>
          ))}
        </div>

        {groups.map(
          (group) =>
            activeTab === group.title && (
              <div key={group.title} className="space-y-4">
                {group.charges.map((charge, i) => (
                  <div
                    key={i}
                    className="border border-blue-100 rounded-lg p-4 bg-blue-50/30"
                  >
                    <p className="font-semibold text-slate-800 mb-2">{charge.label}</p>
                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                      <div>
                        <p className="text-slate-600">Payee</p>
                        <p className="text-slate-800 font-medium">{charge.payee || "—"}</p>
                      </div>
                      <div>
                        <p className="text-slate-600">Check Date</p>
                        <p className="text-slate-800 font-medium">{formatDate(charge.date)}</p>
                      </div>
                      <div>
                        <p className="text-slate-600">Voucher</p>
                        <p className="text-slate-800 font-medium">{charge.voucher || "—"}</p>
                      </div>
                      <div>
                        <p className="text-slate-600">Amount</p>
                        <p className="text-slate-800 font-semibold">{formatCurrency(charge.amount)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
        )}
      </div>

      {/* ✅ UPDATED: Financial Summary with dynamic calculations */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Calculator className="w-4 h-4 text-blue-600" />
          <h4 className="font-semibold text-slate-800">Financial Summary</h4>
        </div>
        <div className="space-y-2 text-sm">
          {/* Expenses Section */}
          <div className="flex justify-between">
            <span className="text-slate-600">Total Expenses:</span>
            <span className="font-semibold text-slate-800">{formatCurrency(totalExpenses)}</span>
          </div>
          
          {/* BIR Tax Section */}
          <div className="flex justify-between">
            <span className="text-slate-600">BIR Tax ({birPercentage}%):</span>
            <span className="font-semibold text-slate-800">{formatCurrency(birAmount)}</span>
          </div>
          
          {/* Total Payables */}
          <div className="flex justify-between border-t border-blue-200 pt-2">
            <span className="font-semibold text-slate-800">Total Payables:</span>
            <span className="font-semibold text-slate-800">{formatCurrency(totalPayables)}</span>
          </div>

          {/* Net Revenue Section (only show if percentage is set) */}
          {netRevenuePercentage > 0 && (
            <div className="flex justify-between">
              <span className="text-slate-600">Net Revenue ({netRevenuePercentage}%):</span>
              <span className="font-medium text-slate-800">{formatCurrency(netRevenueAmount)}</span>
            </div>
          )}

          {/* Gross Income */}
          <div className="flex justify-between border-t border-blue-200 pt-2">
            <span className="font-semibold text-slate-800 text-base">Gross Income:</span>
            <span className="font-semibold text-slate-800 text-lg">{formatCurrency(grossIncome)}</span>
          </div>

          {/* ✅ NEW: Calculation Breakdown Info */}
          <div className="mt-3 pt-3 border-t border-blue-200">
            <p className="text-xs text-slate-500">
              <strong>Calculation:</strong><br />
              • Total Payables = Total Expenses + BIR Tax<br />
              {netRevenuePercentage > 0 
                ? `• Gross Income = Total Payables + Net Revenue (${netRevenuePercentage}%)`
                : formData.gross_income 
                  ? "• Gross Income = Manually entered"
                  : "• Gross Income = Total Payables"
              }
            </p>
          </div>
        </div>
      </div>

      {/* ✅ NEW: Accounts Receivable Section for Gross Income */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Calculator className="w-4 h-4 text-green-600" />
          <h4 className="font-semibold text-slate-800">Accounts Receivable Summary</h4>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600">Gross Income:</span>
            <span className="font-semibold text-green-700">{formatCurrency(grossIncome)}</span>
          </div>
          {apRecord?.amount_paid > 0 && (
            <div className="flex justify-between">
              <span className="text-slate-600">Amount Paid:</span>
              <span className="font-medium text-slate-800">{formatCurrency(apRecord.amount_paid)}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-green-200 pt-2">
            <span className="font-semibold text-slate-800">Outstanding Balance:</span>
            <span className="font-semibold text-slate-800">
              {formatCurrency(grossIncome - (apRecord?.amount_paid || 0))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APStep6;