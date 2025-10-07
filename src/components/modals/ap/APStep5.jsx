// components/modals/ap/APStep5.jsx
const APStep5 = ({ control, watch, apRecord }) => {
    const formData = watch();

    const calculateTotal = () => {
        const amounts = [
            formData.freight_amount || 0,
            formData.trucking_origin_amount || 0,
            formData.trucking_dest_amount || 0,
            formData.crainage_amount || 0,
            formData.arrastre_origin_amount || 0,
            formData.arrastre_dest_amount || 0,
            formData.wharfage_origin_amount || 0,
            formData.wharfage_dest_amount || 0,
            formData.labor_origin_amount || 0,
            formData.labor_dest_amount || 0,
            formData.rebates_amount || 0,
            formData.storage_amount || 0,
            formData.facilitation_amount || 0
        ];
        return amounts.reduce((sum, amount) => sum + amount, 0);
    };

    const totalExpenses = calculateTotal();
    const bir = totalExpenses * 0.12;
    const totalWithBIR = totalExpenses + bir;

    const formatCurrency = (amount) => {
        return `₱${amount.toLocaleString("en-PH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Not set";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    };

    const chargeGroups = [
        {
            title: "Freight Charges",
            charges: [
                { label: "Freight", amount: formData.freight_amount, date: formData.freight_check_date, voucher: formData.freight_voucher }
            ]
        },
        {
            title: "Trucking Charges",
            charges: [
                { label: "Origin Trucking", amount: formData.trucking_origin_amount, date: formData.trucking_origin_check_date, voucher: formData.trucking_origin_voucher },
                { label: "Destination Trucking", amount: formData.trucking_dest_amount, date: formData.trucking_dest_check_date, voucher: formData.trucking_dest_voucher }
            ]
        },
        {
            title: "Port Charges",
            charges: [
                { label: "Crainage", amount: formData.crainage_amount, date: formData.crainage_check_date, voucher: formData.crainage_voucher },
                { label: "Arrastre (Origin)", amount: formData.arrastre_origin_amount, date: formData.arrastre_origin_check_date, voucher: formData.arrastre_origin_voucher },
                { label: "Arrastre (Dest)", amount: formData.arrastre_dest_amount, date: formData.arrastre_dest_check_date, voucher: formData.arrastre_dest_voucher },
                { label: "Wharfage (Origin)", amount: formData.wharfage_origin_amount, date: formData.wharfage_origin_check_date, voucher: formData.wharfage_origin_voucher },
                { label: "Wharfage (Dest)", amount: formData.wharfage_dest_amount, date: formData.wharfage_dest_check_date, voucher: formData.wharfage_dest_voucher },
                { label: "Labor (Origin)", amount: formData.labor_origin_amount, date: formData.labor_origin_check_date, voucher: formData.labor_origin_voucher },
                { label: "Labor (Dest)", amount: formData.labor_dest_amount, date: formData.labor_dest_check_date, voucher: formData.labor_dest_voucher }
            ]
        },
        {
            title: "Miscellaneous Charges",
            charges: [
                { label: "Rebates/DENR", amount: formData.rebates_amount, date: formData.rebates_check_date, voucher: formData.rebates_voucher },
                { label: "Storage", amount: formData.storage_amount, date: formData.storage_check_date, voucher: formData.storage_voucher },
                { label: "Facilitation", amount: formData.facilitation_amount, date: formData.facilitation_check_date, voucher: formData.facilitation_voucher }
            ]
        }
    ];

    return (
        <div className="space-y-6">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-emerald-800 mb-2">Review & Confirm</h3>
                <p className="text-emerald-700 text-sm">
                    Please review all changes before updating the Accounts Payable record.
                </p>
            </div>

            {/* Booking Info */}
            {apRecord && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <h4 className="font-semibold text-slate-800 mb-3">Booking Information</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
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

            {/* Charges Summary */}
            <div className="space-y-4">
                {chargeGroups.map((group, groupIndex) => (
                    <div key={groupIndex} className="border border-slate-200 rounded-xl overflow-hidden">
                        <div className="bg-slate-100 px-4 py-3 border-b border-slate-200">
                            <h4 className="font-semibold text-slate-800">{group.title}</h4>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {group.charges.map((charge, chargeIndex) => (
                                <div key={chargeIndex} className="px-4 py-3 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                                    <div className="font-medium text-slate-800">{charge.label}</div>
                                    <div className="text-slate-700">{formatCurrency(charge.amount || 0)}</div>
                                    <div className="text-slate-600">{formatDate(charge.date)}</div>
                                    <div className="text-slate-600">{charge.voucher || "No voucher"}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Totals */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h4 className="font-semibold text-blue-800 mb-3">Financial Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                        <span className="text-blue-700">Total Expenses:</span>
                        <p className="font-bold text-blue-800 text-lg">{formatCurrency(totalExpenses)}</p>
                    </div>
                    <div>
                        <span className="text-blue-700">BIR (12%):</span>
                        <p className="font-bold text-blue-800 text-lg">{formatCurrency(bir)}</p>
                    </div>
                    <div>
                        <span className="text-blue-700">Total with BIR:</span>
                        <p className="font-bold text-blue-800 text-lg">{formatCurrency(totalWithBIR)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default APStep5;