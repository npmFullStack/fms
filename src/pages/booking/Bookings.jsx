// pages/booking/Bookings.jsx
import { useEffect, useState, useMemo } from "react";
import useBookingStore from "../../utils/store/useBookingStore";
import { PlusCircle, Ship, Truck, File } from "lucide-react";
import Loading from "../../components/Loading";
import AddBooking from "../../components/modals/AddBooking";
import UpdateBooking from "../../components/modals/UpdateBooking";
import DeleteBooking from "../../components/modals/DeleteBooking";
import BookingTable from "../../components/tables/BookingTable";
import BulkActionBar from "../../components/BulkActionBar";
import { printBookings } from "../../utils/helpers/printHelper";
import StatCard from "../../components/cards/StatCard";

const Bookings = () => {
    const {
        bookings,
        fetchBookings,
        loading,
        error,
        deleteBooking,
        clearError
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
        return safeBookings.map(booking => ({
            ...booking,
            customer_name: `${booking.first_name ?? ""} ${
                booking.last_name ?? ""
            }`.trim(),
            route: `${booking.origin_port ?? "-"} → ${
                booking.destination_port ?? "-"
            }`
        }));
    }, [safeBookings]);

    //  by status (enum-based)
    const countByBookingMode = booking_mode =>
        safeBookings.filter(b => b.booking_mode === booking_mode).length;

    const totalBookings = safeBookings.length;

    const statsConfig = [
        {
            key: "TOTAL",
            title: "Total",
            value: totalBookings,
            color: "bg-gradient-to-br from-blue-500 to-blue-600 text-white",
            icon: File
        },
        {
            key: "DOOR_TO_DOOR",
            title: "Door to Door",
            value: countByBookingMode("DOOR_TO_DOOR"),
            color: "bg-gradient-to-br from-sky-500 to-sky-600 text-white",
            icon: Truck
        },
        {
            key: "PIER_TO_PIER",
            title: "Port to Port",
            value: countByBookingMode("PIER_TO_PIER"),
            color: "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white",
            icon: Ship
        }
    ];

    // Handlers
    const handleAddBooking = () => setIsAddBookingModalOpen(true);

    const handleEditBooking = id => {
        setActiveBookingId(id);
        setIsUpdateBookingModalOpen(true);
    };

    const handleDeleteBooking = async booking => {
        if (window.confirm(`Delete booking #${booking.id.slice(0, 8)}?`)) {
            await deleteBooking(booking.id);
        }
    };

    const handleBulkDelete = ids => {
        setActiveBookingId(ids); // pass array of ids
        setIsDeleteBookingModalOpen(true);
    };

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
                        <h1 className="page-title">Booking Management</h1>
                        <p className="page-subtitle">
                            Manage and track all freight bookings
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {statsConfig.map(stat => (
                            <StatCard key={stat.key} {...stat} />
                        ))}
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
                                <PlusCircle className="h-5 w-5" />
                                New Booking
                            </button>
                        }
                    />

                    {/* Bulk Actions */}
                    <BulkActionBar
                        selected={selectedBookings}
                        onEdit={id => handleEditBooking(id)}
                        onPrint={ids => {
                            const records = formattedBookings.filter(b =>
                                ids.includes(b.id)
                            );
                            printBookings(records, "print");
                        }}
                        onDownload={ids => {
                            const records = formattedBookings.filter(b =>
                                ids.includes(b.id)
                            );
                            printBookings(records, "download");
                        }}
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
