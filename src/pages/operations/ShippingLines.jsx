import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    PlusCircleIcon,
    ArrowLeftIcon,
    CubeIcon
} from "@heroicons/react/24/outline";
import Loading from "../../components/Loading";
import ShipTable from "../../components/tables/ShipTable";
import AddShip from "../../components/modals/AddShip";
import UpdateShip from "../../components/modals/UpdateShip";
import DeleteShip from "../../components/modals/DeleteShip";
import ViewShip from "../../components/modals/ViewShip";
import usePartnerStore from "../../utils/store/usePartnerStore";
import useShippingLineStore from "../../utils/store/useShippingLineStore";

const ShippingLines = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedShip, setSelectedShip] = useState(null);

    const {
        currentPartner,
        fetchPartnerById,
        clearCurrentPartner,
        loading: partnerLoading
    } = usePartnerStore();

    const {
        ships,
        fetchShips,
        loading: shipsLoading,
        error,
        addShip,
        fetchShipById,
        updateShip,
        clearCurrentShip,
        removeShip
    } = useShippingLineStore();

    useEffect(() => {
        if (id) {
            fetchPartnerById(id, "shipping");
            fetchShips(id);
        }
        return () => {
            clearCurrentPartner();
            clearCurrentShip();
        };
    }, [
        id,
        fetchPartnerById,
        clearCurrentPartner,
        fetchShips,
        clearCurrentShip
    ]);

    // --- CRUD handlers ---
    const handleAddShip = async shipData => {
        const result = await addShip({ ...shipData, shippingLineId: id });
        if (result.success) setIsAddModalOpen(false);
        return result;
    };

    const handleViewShip = async ship => {
        const result = await fetchShipById(ship.id);
        if (result.success) {
            setSelectedShip(ship);
            setIsViewModalOpen(true);
        }
    };

    const handleEditShip = async ship => {
        const result = await fetchShipById(ship.id);
        if (result.success) {
            setSelectedShip(ship);
            setIsUpdateModalOpen(true);
        }
    };

    const handleUpdateShip = async (shipId, shipData) => {
        const result = await updateShip(shipId, {
            ...shipData,
            shippingLineId: id
        });
        if (result.success) {
            setIsUpdateModalOpen(false);
            clearCurrentShip();
        }
        return result;
    };

    const handleDeleteClick = ship => {
        setSelectedShip(ship);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async shipId => {
        const result = await removeShip(shipId);
        if (result.success) {
            setIsDeleteModalOpen(false);
            setSelectedShip(null);
        }
    };

    const handleCloseUpdateModal = () => {
        setIsUpdateModalOpen(false);
        clearCurrentShip();
        setSelectedShip(null);
    };

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

    // --- Stat calculations ---
    const totalShips = ships?.length || 0;
    const totalContainers =
        ships?.reduce((acc, ship) => acc + (ship.containers?.length || 0), 0) ||
        0;
    const avgContainers = totalShips
        ? (totalContainers / totalShips).toFixed(1)
        : 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="relative z-10 p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-blue-600 hover:underline mb-6"
                    >
                        <ArrowLeftIcon className="w-4 h-4" /> Back
                    </button>

                    {/* Header */}
                    <div className="mb-8 flex items-center justify-between">
                        {/* Left: Title + partner meta */}
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
                                Ship Management
                            </h1>
                            <p className="text-slate-600 text-lg">
                                {currentPartner.name}
                            </p>
                            <p
                                className={`mt-1 inline-block px-2 py-1 text-xs rounded-lg ${
                                    currentPartner.is_active
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                }`}
                            >
                                {currentPartner.is_active
                                    ? "Active"
                                    : "Inactive"}
                            </p>
                        </div>

                        {/* Right: Logo/Image */}
                        <img
                            src={currentPartner.logo_url}
                            alt={currentPartner.name}
                            className="w-32 h-20 object-cover border rounded-md"
                        />
                    </div>

                    {/* Stat Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Total Ships */}
                        <div className="stat-card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                            <CubeIcon className="stat-icon-bg h-24 w-24" />
                            <div className="stat-content">
                                <div>
                                    <p className="stat-title">Total Ships</p>
                                    <p className="stat-value">{totalShips}</p>
                                </div>
                                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                    <CubeIcon className="h-6 w-6" />
                                </div>
                            </div>
                        </div>

                        {/* Total Containers */}
                        <div className="stat-card bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                            <CubeIcon className="stat-icon-bg h-24 w-24 opacity-10" />
                            <div className="stat-content">
                                <div>
                                    <p className="stat-title">
                                        Total Containers
                                    </p>
                                    <p className="stat-value">
                                        {totalContainers}
                                    </p>
                                </div>
                                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                    <CubeIcon className="h-6 w-6" />
                                </div>
                            </div>
                        </div>

                        {/* Avg Containers per Ship */}
                        <div className="stat-card bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
                            <CubeIcon className="stat-icon-bg h-24 w-24 opacity-10" />
                            <div className="stat-content">
                                <div>
                                    <p className="stat-title">
                                        Avg Containers per Ship
                                    </p>
                                    <p className="stat-value">
                                        {avgContainers}
                                    </p>
                                </div>
                                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                    <CubeIcon className="h-6 w-6" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ships Table */}
                    <ShipTable
                        data={ships}
                        onView={handleViewShip}
                        onEdit={handleEditShip}
                        onDelete={handleDeleteClick}
                        shippingLineId={id}
                        rightAction={
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="btn-primary"
                            >
                                <PlusCircleIcon className="h-5 w-5" />
                                Add Ship
                            </button>
                        }
                    />
                </div>
            </div>

            {/* Add Ship Modal */}
            <AddShip
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={handleAddShip}
                shippingLineId={id}
            />

            {/* View Ship Modal */}
            <ViewShip
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                ship={selectedShip}
            />

            {/* Update Ship Modal */}
            <UpdateShip
                isOpen={isUpdateModalOpen}
                onClose={handleCloseUpdateModal}
                onSubmit={handleUpdateShip}
                ship={selectedShip}
                shippingLineId={id}
            />

            {/* Delete Ship Modal */}
            <DeleteShip
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                ship={selectedShip}
            />
        </div>
    );
};

export default ShippingLines;
