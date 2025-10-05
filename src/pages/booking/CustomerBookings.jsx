import { useEffect, useState, useMemo } from "react";
import useBookingStore from "../../utils/store/useBookingStore";
import { CreditCard, File } from "lucide-react";
import Loading from "../../components/Loading";
import StatCard from "../../components/cards/StatCard";
import AddBookingPayment from "../../components/modals/AddBookingPayment";

const CustomerBookings = () => {
  const { bookings, fetchBookings, loading, error, clearError } = useBookingStore();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const safeBookings = useMemo(() => Array.isArray(bookings) ? bookings : [], [bookings]);

  const formattedBookings = useMemo(() => {
    return safeBookings.map(b => ({
      ...b,
      customer_name: `${b.first_name ?? ""} ${b.last_name ?? ""}`.trim(),
      route: `${b.origin_port ?? "-"} → ${b.destination_port ?? "-"}`,
    }));
  }, [safeBookings]);

  const countByStatus = status =>
    safeBookings.filter(b => b.payment_status === status).length;

  const statsConfig = [
    {
      key: "TOTAL",
      title: "Total Bookings",
      value: safeBookings.length,
      color: "bg-gradient-to-br from-blue-500 to-blue-600 text-white",
      icon: File,
    },
    {
      key: "UNPAID",
      title: "Unpaid",
      value: countByStatus("PENDING"),
      color: "bg-gradient-to-br from-red-500 to-red-600 text-white",
      icon: CreditCard,
    },
    {
      key: "PAID",
      title: "Paid",
      value: countByStatus("PAID"),
      color: "bg-gradient-to-br from-green-500 to-green-600 text-white",
      icon: CreditCard,
    },
  ];

  // Opens the AddBookingPayment modal
  const handleOpenPayment = (booking = null) => {
    setSelectedBooking(booking || { id: "new", total_amount: 0 });
    setIsPaymentModalOpen(true);
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="page-container text-center">
        <div className="error-message mb-3">{error}</div>
        <button onClick={clearError} className="btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="relative z-10 p-6 max-w-5xl mx-auto">
        <h1 className="page-title mb-2">My Bookings</h1>
        <p className="page-subtitle mb-6">
          View and pay for your freight bookings
        </p>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {statsConfig.map(stat => (
            <StatCard key={stat.key} {...stat} />
          ))}
        </div>

        {/* Book Now Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => handleOpenPayment()}
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2 rounded-lg transition-all shadow-md"
          >
            🚚 Book Now!
          </button>
        </div>

        {/* Bookings List */}
        <div className="bg-white shadow-md rounded-2xl p-4 divide-y">
          {formattedBookings.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No bookings found.</p>
          ) : (
            formattedBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4"
              >
                <div className="space-y-1">
                  <p className="font-semibold text-gray-800">
                    {booking.booking_number || "Booking"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Route: {booking.route}
                  </p>
                  <p className="text-sm text-gray-600">
                    Status:{" "}
                    <span
                      className={`font-medium ${
                        booking.payment_status === "PAID"
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {booking.payment_status || "PENDING"}
                    </span>
                  </p>
                </div>

                {booking.payment_status === "PENDING" && (
                  <button
                    onClick={() => handleOpenPayment(booking)}
                    className="mt-3 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
                  >
                    <CreditCard size={18} />
                    Pay Now
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {isPaymentModalOpen && (
        <AddBookingPayment
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          booking={selectedBooking}
        />
      )}
    </div>
  );
};

export default CustomerBookings;
