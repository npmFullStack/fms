// components/modals/ap/APStep4.jsx
const APStep4 = ({ register, control, errors, apRecord }) => {
    const miscCharges = [
        { key: "rebates", label: "Rebates/DENR", color: "yellow" },
        { key: "storage", label: "Storage", color: "orange" },
        { key: "facilitation", label: "Facilitation", color: "red" }
    ];

    const getColorClasses = (color) => {
        const colors = {
            yellow: "bg-yellow-50 border-yellow-200 text-yellow-800",
            orange: "bg-orange-50 border-orange-200 text-orange-800",
            red: "bg-red-50 border-red-200 text-red-800"
        };
        return colors[color] || "bg-slate-50 border-slate-200 text-slate-800";
    };

    return (
        <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">Miscellaneous Charges</h3>
                <p className="text-yellow-700 text-sm">
                    Update additional expenses and miscellaneous charges.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {miscCharges.map((charge) => (
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

export default APStep4;