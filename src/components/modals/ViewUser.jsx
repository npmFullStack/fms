import {
    XMarkIcon,
    UserCircleIcon,
    EnvelopeIcon,
    PhoneIcon,
    InformationCircleIcon
} from "@heroicons/react/24/outline";
import { formatRole, formatName } from "../../utils/helpers/formatters";

const ViewUser = ({ isOpen, onClose, user }) => {
    if (!isOpen || !user) return null;

    const formatDate = dateString => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal container */}
            <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
                <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 max-h-[95vh] overflow-hidden">
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
                                User Details
                            </h2>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 max-h-[calc(95vh-120px)] overflow-y-auto">
                        <div className="space-y-5">
                            {/* Profile Section */}
                            <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                                <div className="flex-shrink-0">
                                    {user.profile_picture ? (
                                        <img
                                            src={user.profile_picture}
                                            alt="Profile"
                                            className="h-16 w-16 rounded-full object-cover border-2 border-white shadow-md"
                                        />
                                    ) : (
                                        <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center">
                                            <UserCircleIcon className="h-8 w-8 text-slate-400" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800">
                                        {formatName(
                                            user.first_name,
                                            user.last_name
                                        )}
                                    </h3>
                                    <div className="mt-1">
                                        <span
                                            className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                user.role === "general_manager"
                                                    ? "bg-blue-100 text-blue-800"
                                                    : user.role ===
                                                      "admin_finance"
                                                    ? "bg-purple-100 text-purple-800"
                                                    : user.role ===
                                                      "marketing_coordinator"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-gray-100 text-gray-800"
                                            }`}
                                        >
                                            {formatRole(user.role)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Information Box */}
                            <div className="info-box-modern">
                                <div className="flex items-start gap-3">
                                    <div className="p-1.5 bg-blue-100 rounded-lg">
                                        <InformationCircleIcon className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-semibold text-slate-800 mb-2">
                                            Account Status
                                        </h4>
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    user.is_active
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                }`}
                                            >
                                                {user.is_active
                                                    ? "Active"
                                                    : "Inactive"}
                                            </span>
                                            <span className="text-xs text-slate-500">
                                                • Created on{" "}
                                                {formatDate(user.created_at)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="space-y-4">
                                {/* Email */}
                                <div className="input-container">
                                    <label className="input-label-modern">
                                        Email Address
                                    </label>
                                    <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                                        <EnvelopeIcon className="h-5 w-5 text-slate-400" />
                                        <span className="text-slate-800">
                                            {user.email || "Not provided"}
                                        </span>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="input-container">
                                    <label className="input-label-modern">
                                        Phone Number
                                    </label>
                                    <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                                        <PhoneIcon className="h-5 w-5 text-slate-400" />
                                        <span className="text-slate-800">
                                            {user.phone || "Not provided"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-2">
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
        </div>
    );
};

export default ViewUser;
