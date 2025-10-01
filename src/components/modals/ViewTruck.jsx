import { X, Truck, Hash, Info } from "lucide-react";

const ViewTruck = ({ isOpen, onClose, truck }) => {
    if (!isOpen || !truck) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal container */}
            <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
                <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-100 max-h-[95vh] overflow-hidden">
                    {/* Header */}
                    <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-2xl px-6 py-3 text-center">
                        <button
                            onClick={onClose}
                            className="absolute top-2 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        <div className="flex flex-col items-center">
                            <h2 className="text-xl font-bold text-white">
                                Truck Details
                            </h2>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 max-h-[calc(95vh-120px)] overflow-y-auto space-y-6">
                        {/* Basic Info */}
                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                            <div className="flex-shrink-0 h-14 w-14 rounded-xl bg-blue-100 flex items-center justify-center">
                                <Truck className="h-7 w-7 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">
                                    {truck.name}
                                </h3>
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <Hash className="h-4 w-4 text-slate-400" />
                                    <span>
                                        {truck.plate_number ||
                                            "No plate number"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Company Info */}
                        <div className="info-box-modern">
                            <div className="flex items-start gap-3">
                                <div className="p-1.5 bg-blue-100 rounded-lg">
                                    <Info className="h-4 w-4 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-semibold text-slate-800 mb-1">
                                        Company
                                    </h4>
                                    <p className="text-slate-600">
                                        {truck.trucking_company_name || "N/A"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Remarks */}
                        <div className="info-box-modern">
                            <h4 className="text-sm font-semibold text-slate-800 mb-1">
                                Remarks
                            </h4>
                            <p className="text-slate-600 text-sm">
                                {truck.remarks || "No remarks"}
                            </p>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="btn-secondary-modern"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewTruck;
