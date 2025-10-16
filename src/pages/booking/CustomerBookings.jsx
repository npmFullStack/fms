// pages/booking/CustomerBookings.jsx

import maintenance from "../../assets/images/maintenance.png";

const CustomerBookings = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
            <div className="text-center p-6">
                <img
                    src={maintenance}
                    alt="Maintenance"
                    className="mx-auto mb-6 w-64 h-auto"
                />
                <h1 className="page-title">Page Unavailable</h1>
                <p className="page-subtitle">
                    This page is not available at the moment. Please check back later.
                </p>
            </div>
        </div>
    );
};

export default CustomerBookings;
