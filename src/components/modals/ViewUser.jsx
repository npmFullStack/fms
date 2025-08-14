import { XMarkIcon, UserCircleIcon, EnvelopeIcon, PhoneIcon, CalendarIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import { formatRole, formatName } from "../../utils/helpers/formatters";

const ViewUser = ({ isOpen, onClose, user }) => {
    if (!isOpen || !user) return null;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">User Details</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <XMarkIcon className="h-5 w-5 text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Profile Section */}
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="flex-shrink-0">
                            {user.profile_picture ? (
                                <img 
                                    src={user.profile_picture} 
                                    alt="Profile" 
                                    className="h-20 w-20 rounded-full object-cover border-4 border-gray-200"
                                />
                            ) : (
                                <UserCircleIcon className="h-20 w-20 text-gray-400" />
                            )}
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">
                                {formatName(user.first_name, user.last_name)}
                            </h3>
                            <div className="mt-1">
                                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                                    user.role === 'general_manager' 
                                        ? 'bg-blue-100 text-blue-800'
                                        : user.role === 'admin_finance'
                                        ? 'bg-purple-100 text-purple-800'
                                        : user.role === 'marketing_coordinator'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-800'
                                }`}>
                                    {formatRole(user.role)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Contact Information */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Contact Information</h4>
                            
                            <div className="flex items-center space-x-3">
                                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Email</p>
                                    <p className="text-gray-900">{user.email || 'Not provided'}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <PhoneIcon className="h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Phone</p>
                                    <p className="text-gray-900">{user.phone || 'Not provided'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Account Information */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Account Information</h4>
                            
                            <div className="flex items-center space-x-3">
                                <CalendarIcon className="h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Created</p>
                                    <p className="text-gray-900">{formatDate(user.created_at)}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <ShieldCheckIcon className="h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Status</p>
                                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                        user.is_active 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {user.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <UserCircleIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">User ID</p>
                                    <p className="text-gray-900 font-mono text-sm break-all">{user.id}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 rounded-b-xl">
                    <div className="flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewUser;