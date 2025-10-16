import { useEffect, useState, useMemo } from "react";
import useIncidentStore from "../../utils/store/useIncidentStore";
import { PlusCircle, AlertTriangle, Ship, Truck } from "lucide-react";
import Loading from "../../components/Loading";
import AddIncident from "../../components/modals/AddIncident";
import IncidentTable from "../../components/tables/IncidentTable";
import BulkActionBar from "../../components/BulkActionBar";
import StatCard from "../../components/cards/StatCard";

const IncidentReports = () => {
    const {
        incidents,
        fetchIncidents,
        loading,
        error,
        deleteIncident,
        clearError
    } = useIncidentStore();

    const [isAddIncidentModalOpen, setIsAddIncidentModalOpen] = useState(false);
    const [selectedIncidents, setSelectedIncidents] = useState([]);
    const [activeIncidentId, setActiveIncidentId] = useState(null);

    useEffect(() => {
        fetchIncidents();
    }, [fetchIncidents]);

    // Safe array
    const safeIncidents = useMemo(
        () => (Array.isArray(incidents) ? incidents : []),
        [incidents]
    );

    // Format incidents for table
    const formattedIncidents = useMemo(() => {
        return safeIncidents.map(incident => ({
            ...incident,
            booking_number: incident.booking_number || "—",
            description: incident.description || "No description",
            total_cost: incident.total_cost || 0,
            type: incident.type || "UNKNOWN"
        }));
    }, [safeIncidents]);

    // Count by incident type
    const countByIncidentType = type =>
        safeIncidents.filter(i => i.type === type).length;

    const totalIncidents = safeIncidents.length;
    const totalCost = safeIncidents.reduce((sum, incident) => sum + (parseFloat(incident.total_cost) || 0), 0);

const statsConfig = [
    {
        key: "TOTAL",
        title: "Total Incidents",
        value: totalIncidents,
        color: "bg-gradient-to-br from-red-500 to-red-600 text-white",
        icon: AlertTriangle
    },
    {
        key: "SEA",
        title: "Sea Incidents",
        value: countByIncidentType("SEA"),
        color: "bg-gradient-to-br from-blue-500 to-blue-600 text-white",
        icon: Ship
    },
    {
        key: "LAND",
        title: "Land Incidents",
        value: countByIncidentType("LAND"),
        color: "bg-gradient-to-br from-orange-500 to-orange-600 text-white",
        icon: Truck
    },
    {
        key: "COST",
        title: "Total Cost",
        value: `₱${totalCost.toLocaleString()}`,
        color: "bg-gradient-to-br from-purple-500 to-purple-600 text-white",
        icon: AlertTriangle
    }
];

    // Handlers
    const handleAddIncident = () => setIsAddIncidentModalOpen(true);

    const handleEditIncident = (id) => {
        console.log("Edit incident:", id);
        setActiveIncidentId(id);
    };

    const handleDeleteIncident = async (incident) => {
        if (window.confirm(`Delete incident #${incident.id.slice(0, 8)}?`)) {
            await deleteIncident(incident.id);
        }
    };

    const handleBulkDelete = (ids) => {
        console.log("Bulk delete:", ids);
        if (window.confirm(`Delete ${ids.length} selected incidents?`)) {
            ids.forEach(async (id) => {
                await deleteIncident(id);
            });
        }
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-50">
            <div className="relative z-10 p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="page-title">Incident Reports</h1>
                        <p className="page-subtitle">
                            Track and manage all cargo logistics incidents
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {statsConfig.map(stat => (
                            <StatCard key={stat.key} {...stat} />
                        ))}
                    </div>

                    {/* Table */}
                    <IncidentTable
                        data={formattedIncidents}
                        onEdit={handleEditIncident}
                        onDelete={handleDeleteIncident}
                        onSelectionChange={setSelectedIncidents}
                        rightAction={
                            <button
                                onClick={handleAddIncident}
                                className="btn-primary flex items-center gap-2"
                            >
                                <PlusCircle className="h-5 w-5" />
                                Report Incident
                            </button>
                        }
                    />

                    {/* Bulk Actions - REMOVED PRINT/DOWNLOAD FUNCTIONS */}
                    {selectedIncidents.length > 0 && (
                        <BulkActionBar
                            selected={selectedIncidents}
                            onEdit={(id) => handleEditIncident(id)}
                            onPrint={() => {
                                alert("Print functionality coming soon!");
                            }}
                            onDownload={() => {
                                alert("Download functionality coming soon!");
                            }}
                            onDelete={handleBulkDelete}
                        />
                    )}
                </div>
            </div>

            {/* Add Incident Modal */}
            <AddIncident
                isOpen={isAddIncidentModalOpen}
                onClose={() => setIsAddIncidentModalOpen(false)}
            />
        </div>
    );
};

export default IncidentReports;