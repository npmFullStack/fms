// pages/bookings/CargoMonitoring.jsx
import { useEffect, useState, useMemo } from "react";
import useBookingStore from "../../utils/store/useBookingStore";
import {
    CubeIcon,
    TruckIcon,
    ArrowRightIcon,
    MapPinIcon
} from "@heroicons/react/24/outline";

import Loading from "../../components/Loading";
import CargoMonitoringTable from "../../components/tables/CargoMonitoringTable";
import BulkActionBar from "../../components/BulkActionBar";
import { printBookings } from "../../utils/helpers/printHelper";

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
            key: "ORIGIN",
            title: "Origin Port",
            value: safeBookings.filter(b => b.status === "ARRIVED_ORIGIN_PORT")
                .length,
            color: "bg-gradient-to-br from-blue-500 to-blue-600 text-white",
            icon: MapPinIcon
        },
        {
            key: "LOADED",
            title: "Loaded Ship",
            value: safeBookings.filter(b => b.status === "LOADED_TO_SHIP")
                .length,
            color: "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white",
            icon: CubeIcon
        },
        {
            key: "TRANSIT",
            title: "Transit",
            value: countByStatus("IN_TRANSIT"),
            color: "bg-gradient-to-br from-purple-500 to-purple-600 text-white",
            icon: ArrowRightIcon
        },
        {
            key: "DEST",
            title: "Dest. Port",
            value: safeBookings.filter(
                b => b.status === "ARRIVED_DESTINATION_PORT"
            ).length,
            color: "bg-gradient-to-br from-green-500 to-emerald-600 text-white",
            icon: TruckIcon
        }
    ];

    const handleBulkDelete = ids => {
        ids.forEach(async id => {
            await deleteBooking(id);
        });
    };

    const StatCard = ({ title, value, color, icon: Icon }) => (
        <div className={`relative overflow-hidden rounded-xl p-5 ${color}`}>
            <Icon className="absolute right-2 top-2 h-20 w-20 text-white/20" />
            <div className="relative flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-white/90">{title}</p>
                    <p className="text-2xl font-bold text-white">{value}</p>
                </div>
                <div className="p-1 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Icon className="h-6 w-6 text-white" />
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
                        rightAction={null} // Removed the New Record button
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
