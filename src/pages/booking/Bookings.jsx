// pages/booking/Bookings.jsx
import { useEffect, useState, useMemo } from "react";
import useBookingStore from "../../utils/store/useBookingStore";
import { PlusIcon, CubeIcon, TruckIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
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

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Always ensure bookings is an array
  const safeBookings = Array.isArray(bookings) ? bookings : [];

  // Format bookings for table
  const formattedBookings = useMemo(() => {
    return safeBookings.map((booking) => ({
      ...booking,
      customer_name: `${booking.first_name ?? ""} ${booking.last_name ?? ""}`,
      route: `${booking.origin_port ?? "-"} → ${booking.destination_port ?? "-"}`,
    }));
  }, [safeBookings]);

  // Count bookings by status safely
  const countByStatus = (status) =>
    safeBookings.filter((b) => b.status === status).length;

  const totalBookings = safeBookings.length;

  const handleAddBooking = () => setIsAddBookingModalOpen(true);
  const handleViewBooking = (id) => console.log("View booking:", id);
  const handleEditBooking = (id) => console.log("Edit booking:", id);
  const handleDeleteBooking = async (booking) => {
    if (window.confirm(`Delete booking #${booking.id.slice(0, 8)}?`)) {
      await deleteBooking(booking.id);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-md">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="h-6 w-6 text-white" />
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-1">Booking Management</h1>
            <p className="text-slate-600">Manage and track all freight bookings</p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard title="Total" value={totalBookings} icon={CubeIcon} color="bg-blue-500" />
            <StatCard title="Pending" value={countByStatus("PENDING")} icon={TruckIcon} color="bg-yellow-500" />
            <StatCard title="In Transit" value={countByStatus("IN_TRANSIT")} icon={TruckIcon} color="bg-purple-500" />
            <StatCard
              title="Completed"
              value={countByStatus("DELIVERED") + countByStatus("COMPLETED")}
              icon={CheckCircleIcon}
              color="bg-green-600"
            />
          </div>

          {/* Bookings Table */}
          <BookingTable
            data={formattedBookings}
            onView={handleViewBooking}
            onEdit={handleEditBooking}
            onDelete={handleDeleteBooking}
            rightAction={
              <button onClick={handleAddBooking} className="btn-primary flex items-center gap-2">
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
