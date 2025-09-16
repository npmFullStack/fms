// pages/booking/Bookings.jsx
import { useEffect, useState, useMemo } from "react";
import useBookingStore from "../../utils/store/useBookingStore";
import {
  PlusIcon,
  CubeIcon,
  TruckIcon,
  CheckCircleIcon,
  BuildingLibraryIcon,
} from "@heroicons/react/24/outline";

import Loading from "../../components/Loading";
import AddBooking from "../../components/modals/AddBooking";
import UpdateBooking from "../../components/modals/UpdateBooking";
import DeleteBooking from "../../components/modals/DeleteBooking";
import BookingTable from "../../components/tables/BookingTable";
import BulkActionBar from "../../components/BulkActionBar";

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
  const [isUpdateBookingModalOpen, setIsUpdateBookingModalOpen] =
    useState(false);
  const [isDeleteBookingModalOpen, setIsDeleteBookingModalOpen] =
    useState(false);

  const [selectedBookings, setSelectedBookings] = useState([]);
  const [activeBookingId, setActiveBookingId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Safe array
  const safeBookings = useMemo(
    () => (Array.isArray(bookings) ? bookings : []),
    [bookings]
  );

  // Format bookings for table
  const formattedBookings = useMemo(() => {
    return safeBookings.map((booking) => ({
      ...booking,
      customer_name: `${booking.first_name ?? ""} ${
        booking.last_name ?? ""
      }`.trim(),
      route: `${booking.origin_port ?? "-"} → ${
        booking.destination_port ?? "-"
      }`,
    }));
  }, [safeBookings]);

  // Count by status (enum-based)
  const countByStatus = (status) =>
    safeBookings.filter((b) => b.status === status).length;

  const totalBookings = safeBookings.length;

  // Handlers
  const handleAddBooking = () => setIsAddBookingModalOpen(true);

  const handleEditBooking = (id) => {
    setActiveBookingId(id);
    setIsUpdateBookingModalOpen(true);
  };

  const handleDeleteBooking = async (booking) => {
    if (window.confirm(`Delete booking #${booking.id.slice(0, 8)}?`)) {
      await deleteBooking(booking.id);
    }
  };

  const handleBulkDelete = (ids) => {
    setActiveBookingId(ids); // pass array of ids
    setIsDeleteBookingModalOpen(true);
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
              Manage and track all freight bookings
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <StatCard
              title="Total Bookings"
              value={totalBookings}
              color="bg-gradient-to-br from-blue-500 to-blue-600 text-white"
              icon={CubeIcon}
              bgIcon={<CubeIcon className="h-24 w-24" />}
            />

            <StatCard
              title="Pending"
              value={countByStatus("PENDING")}
              color="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white"
              icon={TruckIcon}
              bgIcon={<TruckIcon className="h-24 w-24" />}
            />

            <StatCard
              title="Pickup"
              value={countByStatus("PICKUP")}
              color="bg-gradient-to-br from-orange-500 to-orange-600 text-white"
              icon={TruckIcon}
              bgIcon={<TruckIcon className="h-24 w-24" />}
            />

            <StatCard
              title="In Transit"
              value={countByStatus("IN_TRANSIT")}
              color="bg-gradient-to-br from-purple-500 to-purple-600 text-white"
              icon={BuildingLibraryIcon}
              bgIcon={<BuildingLibraryIcon className="h-24 w-24" />}
            />

            <StatCard
              title="Delivered"
              value={countByStatus("DELIVERED")}
              color="bg-gradient-to-br from-green-500 to-emerald-600 text-white"
              icon={CheckCircleIcon}
              bgIcon={<CheckCircleIcon className="h-24 w-24" />}
            />
          </div>

          {/* Table */}
          <BookingTable
            data={formattedBookings}
            onEdit={handleEditBooking}
            onDelete={handleDeleteBooking}
            onSelectionChange={setSelectedBookings}
            rightAction={
              <button
                onClick={handleAddBooking}
                className="btn-primary flex items-center gap-2"
              >
                <PlusIcon className="h-5 w-5" />
                New Booking
              </button>
            }
          />

          {/* Bulk Actions */}
          <BulkActionBar
            selected={selectedBookings}
            onEdit={(id) => handleEditBooking(id)}
            onPrint={(ids) => console.log("Print:", ids)}
            onDelete={handleBulkDelete}
          />
        </div>
      </div>

      {/* Add Booking Modal */}
      <AddBooking
        isOpen={isAddBookingModalOpen}
        onClose={() => setIsAddBookingModalOpen(false)}
      />

      {/* Update Booking Modal */}
      <UpdateBooking
        isOpen={isUpdateBookingModalOpen}
        onClose={() => setIsUpdateBookingModalOpen(false)}
        bookingId={activeBookingId}
      />

      {/* Delete Booking Modal */}
      <DeleteBooking
        isOpen={isDeleteBookingModalOpen}
        onClose={() => setIsDeleteBookingModalOpen(false)}
        bookingIds={activeBookingId}
      />
    </div>
  );
};

export default Bookings;
