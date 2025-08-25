import {
    XMarkIcon,
    CubeIcon,
    HashtagIcon,
    InformationCircleIcon,
    ArrowRightIcon,
} from "@heroicons/react/24/outline";

const sizeColors = {
    LCL: "bg-indigo-100 text-indigo-800 border-indigo-200",
    "20FT": "bg-emerald-100 text-emerald-800 border-emerald-200",
    "40FT": "bg-rose-100 text-rose-800 border-rose-200",
    DEFAULT: "bg-slate-100 text-slate-800 border-slate-200"
};

const routeColors = [
    "bg-blue-50 border-blue-200",
    "bg-emerald-50 border-emerald-200",
    "bg-amber-50 border-amber-200",
    "bg-pink-50 border-pink-200",
    "bg-violet-50 border-violet-200"
];

const ViewShip = ({ isOpen, onClose, ship }) => {
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
                <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 scale-100 max-h-[95vh] overflow-hidden">
                    
                    {/* Header */}
                    <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-2xl px-6 py-3 text-center">
                        <button
                            onClick={onClose}
                            className="absolute top-2 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                        <div className="flex flex-col items-center">
                            <h2 className="text-xl font-bold text-white">
                                Ship Details
                            </h2>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 max-h-[calc(95vh-120px)] overflow-y-auto space-y-6">
                        
                        {/* Ship Basic Info */}
                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                            <div className="flex-shrink-0 h-14 w-14 rounded-xl bg-blue-100 flex items-center justify-center">
                                <CubeIcon className="h-7 w-7 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">
                                    {ship.name}
                                </h3>
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <HashtagIcon className="h-4 w-4 text-slate-400" />
                                    <span>{ship.vessel_number || "N/A"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Status Info */}
                        <div className="info-box-modern">
                            <div className="flex items-start gap-3">
                                <div className="p-1.5 bg-blue-100 rounded-lg">
                                    <InformationCircleIcon className="h-4 w-4 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-semibold text-slate-800 mb-2">
                                        Status
                                    </h4>
                                    <span
                                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            ship.is_active
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                        }`}
                                    >
                                        {ship.is_active ? "Active" : "Inactive"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Routes Section */}
                        <div>
                            <h4 className="text-sm font-semibold text-slate-800 mb-3">
                                Routes
                            </h4>
                            {ship.routes && ship.routes.length > 0 ? (
                                <div className="space-y-3">
                                    {ship.routes.map((r, i) => {
                                        const routeColor =
                                            routeColors[i % routeColors.length];
                                        return (
                                            <div
                                                key={i}
                                                className={`rounded-lg border px-4 py-3 ${routeColor}`}
                                            >
                                                <div className="flex items-center gap-2 font-semibold text-slate-700 uppercase mb-2">
                                                    <span>{r.origin}</span>
                                                    <ArrowRightIcon className="w-4 h-4 text-slate-500" />
                                                    <span>{r.destination}</span>
                                                </div>
                                                {r.pricing &&
                                                r.pricing.length > 0 ? (
                                                    <div className="flex flex-wrap gap-2">
                                                        {r.pricing.map(p => {
                                                            const color =
                                                                sizeColors[
                                                                    p.container_type
                                                                ] ||
                                                                sizeColors.DEFAULT;
                                                            return (
                                                                <span
                                                                    key={p.id}
                                                                    className={`px-2 py-0.5 rounded-md text-xs border ${color}`}
                                                                >
                                                                    {
                                                                        p.container_type
                                                                    }
                                                                    : ₱
                                                                    {p.price}
                                                                </span>
                                                            );
                                                        })}
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-400 text-xs">
                                                        No pricing available
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-slate-400 text-sm">
                                    No routes available
                                </p>
                            )}
                        </div>

                        {/* Footer Buttons */}
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

export default ViewShip;
