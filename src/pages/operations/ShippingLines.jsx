// pages/operations/ShippingLines.jsx
import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    PlusCircle,
    ArrowLeft,
    Ship,
    Cuboid,
    AlertTriangle,
    PackageCheck
} from "lucide-react";

import Loading from "../../components/Loading";
import ShipTable from "../../components/tables/ShipTable";
import ContainerTable from "../../components/tables/ContainerTable";
import AddShip from "../../components/modals/AddShip";
import UpdateShip from "../../components/modals/UpdateShip";
import DeleteShip from "../../components/modals/DeleteShip";
import AddContainer from "../../components/modals/AddContainer";
import usePartnerStore from "../../utils/store/usePartnerStore";
import useShipStore from "../../utils/store/useShipStore";
import useContainerStore from "../../utils/store/useContainerStore";
import StatCard from "../../components/cards/StatCard";

const ShippingLines = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    // 🔹 Local state
    const [activeTab, setActiveTab] = useState("ships");
    const [isAddShipOpen, setIsAddShipOpen] = useState(false);
    const [isUpdateShipOpen, setIsUpdateShipOpen] = useState(false);
    const [isDeleteShipOpen, setIsDeleteShipOpen] = useState(false);
    const [isAddContainerOpen, setIsAddContainerOpen] = useState(false);
    const [selectedShip, setSelectedShip] = useState(null);
    const [successBookings, setSuccessBookings] = useState(0);

    // 🔹 Stores
    const {
        currentPartner,
        fetchPartnerById,
        clearCurrentPartner,
        fetchSuccessBookings,
        loading: partnerLoading
    } = usePartnerStore();

    const {
        ships,
        fetchAllShips,
        loading: shipsLoading,
        error,
        addShip,
        fetchShipById,
        updateShip,
        clearCurrentShip,
        removeShip
    } = useShipStore();

    const {
        allContainers,
        fetchContainersByLine,
        fetchAllContainersByLine,
        addContainer
    } = useContainerStore();

    // 🔹 Fetch partner + ships + containers
    useEffect(() => {
        if (id) {
            fetchPartnerById(id, "shipping");
            fetchAllShips();
            fetchContainersByLine(id);
            fetchAllContainersByLine(id);

            // Fetch success deliveries
            const fetchSuccess = async () => {
                const total = await fetchSuccessBookings(id);
                setSuccessBookings(total);
            };
            fetchSuccess();
        }
        return () => {
            clearCurrentPartner();
            clearCurrentShip();
        };
    }, [
        id,
        fetchPartnerById,
        clearCurrentPartner,
        fetchAllShips,
        clearCurrentShip,
        fetchContainersByLine,
        fetchAllContainersByLine,
        fetchSuccessBookings
    ]);

    // 🔹 Stats Config
    const statsConfig = useMemo(() => {
        const totalShips =
            ships?.filter(s => s.shipping_line_id === id)?.length || 0;
        const totalContainers = allContainers?.length || 0;
        const inUseContainers =
            allContainers?.filter(c => !c.is_returned)?.length || 0;
        const returnedContainers =
            allContainers?.filter(c => c.is_returned)?.length || 0;

        return [
            {
                key: "SHIPS",
                title: "Total Ships",
                value: totalShips,
                color: "bg-gradient-to-br from-blue-500 to-blue-600 text-white",
                icon: Ship
            },
            {
                key: "CONTAINERS",
                title: "Total Containers",
                value: totalContainers,
                color: "bg-gradient-to-br from-sky-500 to-sky-600 text-white",
                icon: Cuboid
            },
            {
                key: "AVAILABLE",
                title: "Available Containers",
                value: returnedContainers,
                color: "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white",
                icon: Cuboid
            },
            {
                key: "IN_USE",
                title: "In Use Containers",
                value: inUseContainers,
                color: "bg-gradient-to-br from-red-500 to-red-600 text-white",
                icon: AlertTriangle
            },
            {
                key: "SUCCESS",
                title: "Successful Deliveries",
                value: successBookings,
                color: "bg-gradient-to-br from-green-500 to-green-600 text-white",
                icon: PackageCheck
            }
        ];
    }, [ships, allContainers, id, successBookings]);

    // 🔹 CRUD handlers (ships)
    const handleAddShip = async shipData => {
        const result = await addShip({ ...shipData, shippingLineId: id });
        if (result.success) setIsAddShipOpen(false);
        return result;
    };

    const handleEditShip = async ship => {
        const result = await fetchShipById(ship.id);
        if (result.success) {
            setSelectedShip(ship);
            setIsUpdateShipOpen(true);
        }
    };

    const handleUpdateShip = async (shipId, shipData) => {
        const result = await updateShip(shipId, {
            ...shipData,
            shippingLineId: id
        });
        if (result.success) {
            setIsUpdateShipOpen(false);
            clearCurrentShip();
        }
        return result;
    };

    const handleDeleteShip = ship => {
        setSelectedShip(ship);
        setIsDeleteShipOpen(true);
    };

    const handleConfirmDeleteShip = async shipId => {
        const result = await removeShip(shipId);
        if (result.success) {
            setIsDeleteShipOpen(false);
            setSelectedShip(null);
        }
    };

    // 🔹 Container handlers
    const handleAddContainer = async containerData => {
        const result = await addContainer({
            ...containerData,
            shippingLineId: id
        });
        if (result.success) setIsAddContainerOpen(false);
        return result;
    };

    // 🔹 Conditional rendering
    if (partnerLoading || shipsLoading) return <Loading />;

    if (!currentPartner) {
        return (
            <div className="p-6 text-slate-600">No shipping line found.</div>
        );
    }

    if (error) {
        return (
            <div className="page-container">
                <div className="max-w-md mx-auto">
                    <div className="error-message">{error}</div>
                </div>
            </div>
        );
    }

    // 🔹 Render UI
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="relative z-10 p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-blue-600 hover:underline mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back
                    </button>

                    {/* Header */}
                    <div className="mb-8 flex items-center gap-4">
                        <img
                            src={currentPartner.logo_url}
                            alt={currentPartner.name}
                            className="w-20 h-20 object-cover border rounded-md"
                        />
                        <div>
                            <h1 className="page-title">
                                {currentPartner.name}
                            </h1>
                            <p className="page-subtitle">
                                Manage ships and containers for this shipping
                                line
                            </p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {statsConfig.map(stat => (
                            <StatCard key={stat.key} {...stat} />
                        ))}
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-slate-200 mb-6">
                        <button
                            onClick={() => setActiveTab("ships")}
                            className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${
                                activeTab === "ships"
                                    ? "text-blue-600 border-b-2 border-blue-600"
                                    : "text-slate-500 hover:text-slate-700"
                            }`}
                        >
                            <Ship className="h-5 w-5" />
                            Ships
                        </button>
                        <button
                            onClick={() => setActiveTab("containers")}
                            className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${
                                activeTab === "containers"
                                    ? "text-sky-600 border-b-2 border-sky-600"
                                    : "text-slate-500 hover:text-slate-700"
                            }`}
                        >
                            <Cuboid className="h-5 w-5" />
                            Containers
                        </button>
                    </div>

                    {/* Table Views */}
                    {activeTab === "ships" ? (
                        <ShipTable
                            data={ships.filter(s => s.shipping_line_id === id)}
                            onEdit={handleEditShip}
                            onDelete={handleDeleteShip}
                            rightAction={
                                <button
                                    onClick={() => setIsAddShipOpen(true)}
                                    className="btn-primary"
                                >
                                    <PlusCircle className="h-5 w-5" /> Add Ship
                                </button>
                            }
                        />
                    ) : (
                        <ContainerTable
                            data={allContainers}
                            rightAction={
                                <button
                                    onClick={() => setIsAddContainerOpen(true)}
                                    className="btn-primary"
                                >
                                    <PlusCircle className="h-5 w-5" /> Add
                                    Container
                                </button>
                            }
                        />
                    )}
                </div>
            </div>

            {/* Modals */}
            <AddShip
                isOpen={isAddShipOpen}
                onClose={() => setIsAddShipOpen(false)}
                onSubmit={handleAddShip}
                shippingLineId={id}
            />
            <UpdateShip
                isOpen={isUpdateShipOpen}
                onClose={() => setIsUpdateShipOpen(false)}
                onSubmit={handleUpdateShip}
                ship={selectedShip}
                shippingLineId={id}
            />
            <DeleteShip
                isOpen={isDeleteShipOpen}
                onClose={() => setIsDeleteShipOpen(false)}
                onConfirm={handleConfirmDeleteShip}
                ship={selectedShip}
            />
            <AddContainer
                isOpen={isAddContainerOpen}
                onClose={() => setIsAddContainerOpen(false)}
                onSubmit={handleAddContainer}
                shippingLineId={id}
            />
        </div>
    );
};

export default ShippingLines;
