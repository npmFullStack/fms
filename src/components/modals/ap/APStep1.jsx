// components/modals/ap/APStep1.jsx
const APStep1 = ({ register, control, errors, apRecord }) => {
    return (
        <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Freight Charges</h3>
                <p className="text-blue-700 text-sm">
                    Update shipping line freight expenses and payment details.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="form-label">Freight Amount *</label>
                    <input
                        type="number"
                        step="0.01"
                        {...register("freight_amount", { valueAsNumber: true })}
                        className="form-input"
                        placeholder="0.00"
                    />
                    {errors.freight_amount && (
                        <p className="error-message">{errors.freight_amount.message}</p>
                    )}
                </div>

                <div>
                    <label className="form-label">Check Date</label>
                    <input
                        type="date"
                        {...register("freight_check_date")}
                        className="form-input"
                    />
                    {errors.freight_check_date && (
                        <p className="error-message">{errors.freight_check_date.message}</p>
                    )}
                </div>

                <div>
                    <label className="form-label">Voucher Number</label>
                    <input
                        type="text"
                        {...register("freight_voucher")}
                        className="form-input"
                        placeholder="Voucher number"
                    />
                    {errors.freight_voucher && (
                        <p className="error-message">{errors.freight_voucher.message}</p>
                    )}
                </div>
            </div>

            {apRecord?.freight_payee && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                    <p className="text-sm text-slate-700">
                        <span className="font-semibold">Payee:</span> {apRecord.freight_payee}
                    </p>
                </div>
            )}
        </div>
    );
};

export default APStep1;