import {
  XMarkIcon,
  BuildingOfficeIcon,
  TruckIcon
} from "@heroicons/react/24/outline";

const ViewPartner = ({ isOpen, onClose, partner }) => {
  if (!isOpen || !partner) return null;

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
          <div className={`relative bg-gradient-to-r ${partner.type === 'shipping' ? 'from-blue-600 to-blue-700' : 'from-orange-600 to-orange-700'} rounded-t-2xl px-6 py-3 text-center`}>
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-2 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>

            {/* Icon and title */}
            <div className="flex flex-col items-center">
              <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm mb-2">
                {partner.type === 'shipping' ? (
                  <BuildingOfficeIcon className="h-6 w-6 text-white" />
                ) : (
                  <TruckIcon className="h-6 w-6 text-white" />
                )}
              </div>
              <h2 className="text-xl font-bold text-white">
                {partner.name}
              </h2>
              <p className="text-white/80 text-sm mt-1">
                {partner.type === 'shipping' ? 'Shipping Line' : 'Trucking Company'}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-lg overflow-hidden">
                {partner.logo_url ? (
                  <img
                    src={partner.logo_url}
                    alt={partner.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                    {partner.type === 'shipping' ? (
                      <BuildingOfficeIcon className="h-10 w-10 text-slate-400" />
                    ) : (
                      <TruckIcon className="h-10 w-10 text-slate-400" />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                Status
              </h3>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  partner.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {partner.is_active ? 'Active' : 'Inactive'}
                </span>
                <span className="text-xs text-slate-500">
                  {new Date(partner.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-200 flex justify-end">
            <button
              onClick={onClose}
              className="btn-secondary-modern"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPartner;