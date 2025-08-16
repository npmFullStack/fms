import {
    XMarkIcon,
    ExclamationTriangleIcon
} from "@heroicons/react/24/outline";

const RestrictUser = ({ isOpen, onClose, onConfirm, user }) => {
    if (!isOpen || !user) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
                <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
                    {/* Header */}
                    <div className="relative bg-gradient-to-r from-red-600 to-red-700 rounded-t-2xl px-6 py-3 text-center">
                        <button
                            onClick={onClose}
                            className="absolute top-2 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg"
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                        <div className="flex flex-col items-center">
                            <h2 className="text-xl font-bold text-white">
                                {user.is_active
                                    ? "Restrict User"
                                    : "Unrestrict User"}
                            </h2>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-6 text-center space-y-4">
                        <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto" />
                        <p className="text-slate-700">
                            Are you sure you want to{" "}
                            <span className="font-semibold">
                                {user.is_active ? "restrict" : "unrestrict"}
                            </span>{" "}
                            <span className="font-bold">{user.fullName}</span>?
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200">
                        <button
                            onClick={onClose}
                            className="btn-secondary-modern"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => onConfirm(user.id, user.is_active)}
                            className="btn-primary-modern bg-red-600 hover:bg-red-700 text-white"
                        >
                            {user.is_active ? "Restrict" : "Unrestrict"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RestrictUser;
