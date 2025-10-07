// components/modals/ap/APStep5.jsx
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
      <div className="info-box-modern">
        <div className="flex items-start gap-3">
          <div className="p-1.5 bg-emerald-100 rounded-lg">
            <span className="text-emerald-600 text-sm font-semibold">i</span>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-slate-800 mb-1">Review & Confirm</h4>
            <p className="text-xs text-slate-600">
              Please review all details before submitting the Accounts Payable update.
            </p>
          </div>
        </div>
      </div>

      {/* Booking Info */}
      {apRecord && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm">
          <h4 className="font-semibold text-slate-800 mb-2">Booking Information</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <span className="text-slate-600">Booking #:</span>
              <p className="font-medium">{apRecord.booking_number}</p>
            </div>
            <div>
              <span className="text-slate-600">HWB #:</span>
              <p className="font-medium">{apRecord.hwb_number}</p>
            </div>
            <div>
              <span className="text-slate-600">Route:</span>
              <p className="font-medium">{apRecord.route}</p>
            </div>
            <div>
              <span className="text-slate-600">Commodity:</span>
              <p className="font-medium">{apRecord.commodity}</p>
            </div>
          </div>
        </div>
      )}

      {/* Charge Groups */}
      {groups.map((group, idx) => (
        <div key={idx} className="border border-slate-200 rounded-xl">
          <div className="bg-slate-100 px-4 py-2 border-b border-slate-200">
            <h4 className="text-sm font-semibold text-slate-800">{group.title}</h4>
          </div>
          <div className="divide-y divide-slate-100 text-sm">
            {group.charges.map((c, i) => (
              <div key={i} className="px-4 py-2 grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="font-medium text-slate-800">{c.label}</div>
                <div className="text-slate-700">{c.payee || "—"}</div>
                <div>{formatCurrency(c.amount)}</div>
                <div className="text-slate-600">{formatDate(c.date)}</div>
                <div className="text-slate-600">{c.voucher || "No voucher"}</div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Totals */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm">
        <h4 className="font-semibold text-blue-800 mb-2">Financial Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <span className="text-blue-700">Total Expenses:</span>
            <p className="font-bold text-blue-800 text-lg">{formatCurrency(total)}</p>
          </div>
          <div>
            <span className="text-blue-700">BIR (12%):</span>
            <p className="font-bold text-blue-800 text-lg">{formatCurrency(bir)}</p>
          </div>
          <div>
            <span className="text-blue-700">Total with BIR:</span>
            <p className="font-bold text-blue-800 text-lg">{formatCurrency(grandTotal)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APStep5;
