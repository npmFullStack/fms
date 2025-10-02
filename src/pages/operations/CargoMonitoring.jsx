// pages/booking/CargoMonitoring.jsx
import { useEffect, useState, useMemo } from "react";
import useBookingStore from "../../utils/store/useBookingStore";
import { Ship, Truck, MapPin, CheckCircle, Loader2 } from "lucide-react";
import Loading from "../../components/Loading";
import CargoMonitoringTable from "../../components/tables/CargoMonitoringTable";
import BulkActionBar from "../../components/BulkActionBar";
import { printBookings } from "../../utils/helpers/printHelper";
import StatCard from "../../components/cards/StatCard";

const CargoMonitoring = () => {
  const {
    bookings,
    fetchBookings,
    loading,
    error,
    clearError,
    deleteBooking
  } = useBookingStore();
  
  const [selectedBookings, setSelectedBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const safeBookings = useMemo(
    () => (Array.isArray(bookings) ? bookings : []),
    [bookings]
  );

  const formattedBookings = useMemo(() => {
    return safeBookings.map(b => ({
      ...b,
      route: `${b.origin_port ?? "-"} -> ${b.destination_port ?? "-"}`
    }));
  }, [safeBookings]);

  const countByStatus = status =>
    safeBookings.filter(b => b.status === status).length;

  const statsConfig = [
    {
      key: "PICKUP_SCHEDULED",
      title: "Pickup",
      value: countByStatus("PICKUP_SCHEDULED"),
      color: "bg-gradient-to-br from-yellow-500 to-yellow-600 text-white",
      icon: Truck
    },
    {
      key: "LOADED_TO_TRUCK",
      title: "Loaded Truck",
      value: countByStatus("LOADED_TO_TRUCK"),
      color: "bg-gradient-to-br from-orange-500 to-orange-600 text-white",
      icon: Truck
    },
    {
      key: "ARRIVED_ORIGIN_PORT",
      title: "Origin Port",
      value: countByStatus("ARRIVED_ORIGIN_PORT"),
      color: "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white",
      icon: MapPin
    },
    {
      key: "LOADED_TO_SHIP",
      title: "Loaded Ship",
      value: countByStatus("LOADED_TO_SHIP"),
      color: "bg-gradient-to-br from-sky-500 to-sky-600 text-white",
      icon: Ship
    },
    {
      key: "IN_TRANSIT",
      title: "Transit",
      value: countByStatus("IN_TRANSIT"),
      color: "bg-gradient-to-br from-purple-500 to-purple-600 text-white",
      icon: Loader2
    },
    {
      key: "ARRIVED_DESTINATION_PORT",
      title: "Dest. Port",
      value: countByStatus("ARRIVED_DESTINATION_PORT"),
      color: "bg-gradient-to-br from-pink-500 to-pink-600 text-white",
      icon: MapPin
    },
    {
      key: "OUT_FOR_DELIVERY",
      title: "Delivery",
      value: countByStatus("OUT_FOR_DELIVERY"),
      color: "bg-gradient-to-br from-teal-500 to-teal-600 text-white",
      icon: Truck
    },
    {
      key: "DELIVERED",
      title: "Delivered",
      value: countByStatus("DELIVERED"),
      color: "bg-gradient-to-br from-green-500 to-emerald-600 text-white",
      icon: CheckCircle
    }
  ];

  const handleBulkDelete = ids => {
    ids.forEach(async id => {
      await deleteBooking(id);
    });
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
            <h1 className="page-title">Cargo Monitoring</h1>
            <p className="page-subtitle">
              Track shipments end-to-end with detailed timeline
            </p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsConfig.map(stat => (
              <StatCard key={stat.key} {...stat} />
            ))}
          </div>

          {/* Table */}
          <CargoMonitoringTable
            data={formattedBookings}
            onSelectionChange={setSelectedBookings}
            rightAction={null}
          />

          {/* Bulk Action Bar */}
          <BulkActionBar
            selected={selectedBookings}
            onEdit={id => console.log("Edit", id)}
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
    </div>
  );
};

export default CargoMonitoring;