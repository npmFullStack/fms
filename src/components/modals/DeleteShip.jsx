import { X, AlertTriangle, Trash2, Ship } from "lucide-react";

const DeleteShip = ({ isOpen, onClose, onConfirm, ship }) => {
    if (!isOpen || !ship) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal container */}
            <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
                <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
                    {/* Header */}
                    <div className="relative bg-gradient-to-r from-red-600 to-red-700 rounded-t-2xl px-6 py-3 text-center">
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-2 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        {/* Icon and title */}
                        <div className="flex flex-col items-center">
                            <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm mb-2">
                                <Ship className="h-6 w-6 text-white" />
                            </div>
                            <h2 className="text-xl font-bold text-white">
                                Remove Ship
                            </h2>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 text-center space-y-4">
                        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />

                        <div className="space-y-2">
                            <p className="text-slate-700">
                                Are you sure you want to{" "}
                                <span className="font-semibold">remove</span>{" "}
                                <span className="font-bold">{ship.name}</span>?
                            </p>

                            {ship.vessel_number && (
                                <p className="text-sm text-slate-500">
                                    Vessel Number:{" "}
                                    <span className="font-medium">
                                        {ship.vessel_number}
                                    </span>
                                </p>
                            )}

                            {ship.capacity_teu && (
                                <p className="text-sm text-slate-500">
                                    Capacity:{" "}
                                    <span className="font-medium">
                                        {ship.capacity_teu?.toLocaleString()}{" "}
                                        TEU
                                    </span>
                                </p>
                            )}
                        </div>

                        <p className="text-sm text-slate-500">
                            This action will permanently remove this ship from
                            the system.
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="btn-secondary-modern"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => onConfirm(ship.id)}
                            className="btn-primary-modern bg-red-600 hover:bg-red-700 text-white"
                        >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove Ship
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteShip;
