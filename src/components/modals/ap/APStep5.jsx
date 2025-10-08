// components/modals/ap/APStep5.jsx
import { FileText, CheckCircle, Calculator } from "lucide-react";

const APStep5 = ({ watch, apRecord }) => {
  const formData = watch();

  const calculateTotal = () => {
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
    ].map((a) => a || 0);
    return amounts.reduce((sum, n) => sum + n, 0);
  };

  const total = calculateTotal();
  const bir = total * 0.12;
  const grandTotal = total + bir;

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
      title: "Trucking",
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
      title: "Miscellaneous",
      charges: [
        { label: "Rebates/DENR", payee: formData.rebates_payee, amount: formData.rebates_amount, date: formData.rebates_check_date, voucher: formData.rebates_voucher },
        { label: "Storage", payee: formData.storage_payee, amount: formData.storage_amount, date: formData.storage_check_date, voucher: formData.storage_voucher },
        { label: "Facilitation", payee: formData.facilitation_payee, amount: formData.facilitation_amount, date: formData.facilitation_check_date, voucher: formData.facilitation_voucher },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-blue-600" />
          <div>
            <h3 className="font-semibold text-slate-800">Review Accounts Payable</h3>
            <p className="text-sm text-slate-600">
              Review all expense details before finalizing.
            </p>
          </div>
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

      {/* Expense Groups */}
      <div className="space-y-4">
        {groups.map((group, idx) => (
          <div key={idx} className="border border-slate-200 rounded-xl">
            <div className="bg-slate-100 px-4 py-3 border-b border-slate-200">
              <h4 className="font-semibold text-slate-800">{group.title}</h4>
            </div>
            <div className="divide-y divide-slate-100">
              {group.charges.map((charge, i) => (
                <div key={i} className="px-4 py-3">
                  <div className="mb-2">
                    <span className="font-medium text-slate-800">{charge.label}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-slate-600 mb-2">
                    <div>
                      <span className="font-medium">Payee:</span> {charge.payee || "—"}
                    </div>
                    <div>
                      <span className="font-medium">Check Date:</span> {formatDate(charge.date)}
                    </div>
                    <div>
                      <span className="font-medium">Voucher:</span> {charge.voucher || "—"}
                    </div>
                  </div>
                  <div className="border-t border-slate-100 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-600">Amount:</span>
                      <span className="font-bold text-slate-800">{formatCurrency(charge.amount)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Financial Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Calculator className="w-4 h-4 text-blue-600" />
          <h4 className="font-semibold text-slate-800">Financial Summary</h4>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600">Total Expenses:</span>
            <span className="font-semibold text-slate-800">{formatCurrency(total)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">BIR Tax (12%):</span>
            <span className="font-semibold text-slate-800">{formatCurrency(bir)}</span>
          </div>
          <div className="flex justify-between border-t border-blue-200 pt-2">
            <span className="font-semibold text-slate-800">Grand Total:</span>
            <span className="font-bold text-slate-800 text-lg">{formatCurrency(grandTotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APStep5;