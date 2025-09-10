// pages/booking/Bookings.jsx
import { useEffect, useState, useMemo } from "react";
import useBookingStore from "../../utils/store/useBookingStore";
import { PlusIcon, CubeIcon } from "@heroicons/react/24/outline";
import Loading from "../../components/Loading";
import AddBooking from "../../components/modals/AddBooking";
import BookingTable from "../../components/tables/BookingTable";

const Bookings = () => {
  const {
    bookings,
    fetchBookings,
    loading,
    error,
    deleteBooking,
    clearError,
  } = useBookingStore();

  const [isAddBookingModalOpen, setIsAddBookingModalOpen] = useState(false);

  // Format bookings for table
  const formattedBookings = useMemo(() => {
    if (!Array.isArray(bookings)) return [];
    return bookings.map((booking) => ({
      ...booking,
      customer_name: `${booking.customer_first_name ?? ""} ${
        booking.customer_last_name ?? ""
      }`,
      route: `${booking.origin ?? "-"} → ${booking.destination ?? "-"}`,
    }));
  }, [bookings]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleAddBooking = () => {
    setIsAddBookingModalOpen(true);
  };

  const handleViewBooking = (bookingId) => {
    console.log("View booking:", bookingId);
  };

  const handleEditBooking = (bookingId) => {
    console.log("Edit booking:", bookingId);
  };

  const handleDeleteBooking = async (booking) => {
    if (
      window.confirm(
        `Are you sure you want to delete booking #${booking.id.slice(0, 8)}?`
      )
    ) {
      const result = await deleteBooking(booking.id);
      if (result.success) {
        console.log("Booking deleted successfully");
      }
    }
  };

  const StatCard = ({ title, value, color, icon: Icon, bgIcon }) => (
    <div className={`stat-card ${color}`}>
      <div className="stat-icon-bg">{bgIcon}</div>
      <div className="stat-content">
        <div>
          <p className="stat-title">{title}</p>
          <p className="stat-value">{value}</p>
        </div>
        <div className="flex-shrink-0">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) return <Loading />;
  if (error) {
    return (
      <div className="page-container">
        <div className="max-w-md mx-auto">
          <div className="error-message">{error}</div>
          <button onClick={clearError} className="btn-primary mt-4">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ✅ Only count total bookings (based on your backend)
  const totalBookings = Array.isArray(bookings) ? bookings.length : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
              Booking Management
            </h1>
            <p className="text-slate-600 text-lg">
              Manage and track all your freight bookings in one place
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              title="Total Bookings"
              value={totalBookings}
              color="bg-gradient-to-br from-blue-500 to-blue-600 text-white"
              icon={CubeIcon}
              bgIcon={<CubeIcon className="h-24 w-24" />}
            />
          </div>

          {/* Bookings Table */}
          <BookingTable
            data={formattedBookings}
            onView={handleViewBooking}
            onEdit={handleEditBooking}
            onDelete={handleDeleteBooking}
            rightAction={
              <button onClick={handleAddBooking} className="btn-primary">
                <PlusIcon className="h-5 w-5" />
                New Booking
              </button>
            }
          />
        </div>
      </div>

      {/* Add Booking Modal */}
      <AddBooking
        isOpen={isAddBookingModalOpen}
        onClose={() => setIsAddBookingModalOpen(false)}
      />
    </div>
  );
};

export default Bookings;
