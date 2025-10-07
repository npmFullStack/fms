// components/modals/ap/APStep2.jsx
const APStep2 = ({ register, control, errors, apRecord }) => {
    return (
        <div className="space-y-8">
            {/* Origin Trucking */}
            <div className="space-y-4">
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-orange-800 mb-2">
                        Origin Trucking Charges
                    </h3>
                    <p className="text-orange-700 text-sm">
                        Update pickup trucking expenses from origin location.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="form-label">Origin Amount *</label>
                        <input
                            type="number"
                            step="0.01"
                            {...register("trucking_origin_amount", { valueAsNumber: true })}
                            className="form-input"
                            placeholder="0.00"
                        />
                        {errors.trucking_origin_amount && (
                            <p className="error-message">{errors.trucking_origin_amount.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="form-label">Check Date</label>
                        <input
                            type="date"
                            {...register("trucking_origin_check_date")}
                            className="form-input"
                        />
                    </div>

                    <div>
                        <label className="form-label">Voucher Number</label>
                        <input
                            type="text"
                            {...register("trucking_origin_voucher")}
                            className="form-input"
                            placeholder="Voucher number"
                        />
                    </div>
                </div>

                {apRecord?.trucking_origin_payee && (
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                        <p className="text-sm text-slate-700">
                            <span className="font-semibold">Payee:</span> {apRecord.trucking_origin_payee}
                        </p>
                    </div>
                )}
            </div>

            {/* Destination Trucking */}
            <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">
                        Destination Trucking Charges
                    </h3>
                    <p className="text-green-700 text-sm">
                        Update delivery trucking expenses to destination.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="form-label">Destination Amount *</label>
                        <input
                            type="number"
                            step="0.01"
                            {...register("trucking_dest_amount", { valueAsNumber: true })}
                            className="form-input"
                            placeholder="0.00"
                        />
                        {errors.trucking_dest_amount && (
                            <p className="error-message">{errors.trucking_dest_amount.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="form-label">Check Date</label>
                        <input
                            type="date"
                            {...register("trucking_dest_check_date")}
                            className="form-input"
                        />
                    </div>

                    <div>
                        <label className="form-label">Voucher Number</label>
                        <input
                            type="text"
                            {...register("trucking_dest_voucher")}
                            className="form-input"
                            placeholder="Voucher number"
                        />
                    </div>
                </div>

                {apRecord?.trucking_dest_payee && (
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                        <p className="text-sm text-slate-700">
                            <span className="font-semibold">Payee:</span> {apRecord.trucking_dest_payee}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default APStep2;