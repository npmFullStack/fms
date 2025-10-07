// components/modals/ap/APStep3.jsx
const APStep3 = ({ register, control, errors, apRecord }) => {
    const portCharges = [
        { key: "crainage", label: "Crainage", color: "purple" },
        { key: "arrastre_origin", label: "Arrastre (Origin)", color: "blue" },
        { key: "arrastre_dest", label: "Arrastre (Destination)", color: "blue" },
        { key: "wharfage_origin", label: "Wharfage (Origin)", color: "indigo" },
        { key: "wharfage_dest", label: "Wharfage (Destination)", color: "indigo" },
        { key: "labor_origin", label: "Labor (Origin)", color: "teal" },
        { key: "labor_dest", label: "Labor (Destination)", color: "teal" }
    ];

    const getColorClasses = (color) => {
        const colors = {
            purple: "bg-purple-50 border-purple-200 text-purple-800",
            blue: "bg-blue-50 border-blue-200 text-blue-800",
            indigo: "bg-indigo-50 border-indigo-200 text-indigo-800",
            teal: "bg-teal-50 border-teal-200 text-teal-800"
        };
        return colors[color] || "bg-slate-50 border-slate-200 text-slate-800";
    };

    return (
        <div className="space-y-6">
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">Port Charges</h3>
                <p className="text-purple-700 text-sm">
                    Update all port-related charges and fees for both origin and destination.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {portCharges.map((charge) => (
                    <div key={charge.key} className="space-y-4">
                        <div className={`border rounded-xl p-4 ${getColorClasses(charge.color)}`}>
                            <h4 className="font-semibold">{charge.label}</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="form-label">Amount *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    {...register(`${charge.key}_amount`, { valueAsNumber: true })}
                                    className="form-input"
                                    placeholder="0.00"
                                />
                                {errors[`${charge.key}_amount`] && (
                                    <p className="error-message">{errors[`${charge.key}_amount`].message}</p>
                                )}
                            </div>

                            <div>
                                <label className="form-label">Check Date</label>
                                <input
                                    type="date"
                                    {...register(`${charge.key}_check_date`)}
                                    className="form-input"
                                />
                            </div>

                            <div>
                                <label className="form-label">Voucher Number</label>
                                <input
                                    type="text"
                                    {...register(`${charge.key}_voucher`)}
                                    className="form-input"
                                    placeholder="Voucher number"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default APStep3;