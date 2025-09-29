// pages/operations/ShippingLines

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  PlusCircleIcon,
  ArrowLeftIcon,
  CubeIcon,
  GlobeAltIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import Loading from "../../components/Loading";
import ShipTable from "../../components/tables/ShipTable";
import ContainerTable from "../../components/tables/ContainerTable";
import AddShip from "../../components/modals/AddShip";
import UpdateShip from "../../components/modals/UpdateShip";
import DeleteShip from "../../components/modals/DeleteShip";
import ViewShip from "../../components/modals/ViewShip";
import AddContainer from "../../components/modals/AddContainer";
import usePartnerStore from "../../utils/store/usePartnerStore";
import useShipStore from "../../utils/store/useShipStore";
import useContainerStore from "../../utils/store/useContainerStore";

const ShippingLines = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [activeTab, setActiveTab] = useState("ships");

  const [isAddShipOpen, setIsAddShipOpen] = useState(false);
  const [isUpdateShipOpen, setIsUpdateShipOpen] = useState(false);
  const [isDeleteShipOpen, setIsDeleteShipOpen] = useState(false);
  const [isViewShipOpen, setIsViewShipOpen] = useState(false);
  const [isAddContainerOpen, setIsAddContainerOpen] = useState(false);
  const [selectedShip, setSelectedShip] = useState(null);

  const {
    currentPartner,
    fetchPartnerById,
    clearCurrentPartner,
    loading: partnerLoading,
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
    removeShip,
  } = useShipStore();

  const {
    containers,
    allContainers, // New: all containers including in-use ones
    fetchContainersByLine,
    fetchAllContainersByLine, // New: fetch all containers function
    addContainer,
    removeContainer,
    updateContainer,
  } = useContainerStore();

  useEffect(() => {
    if (id) {
      fetchPartnerById(id, "shipping");
      fetchAllShips();
      fetchContainersByLine(id); // For booking selection
      fetchAllContainersByLine(id); // For management table
    }
    return () => {
      clearCurrentPartner();
      clearCurrentShip();
    };
  }, [id, fetchPartnerById, clearCurrentPartner, fetchAllShips, clearCurrentShip, fetchContainersByLine, fetchAllContainersByLine]);

  // CRUD Handlers for Ships
  const handleAddShip = async (shipData) => {
    console.log("🎯 handleAddShip called with:", shipData);
    const result = await addShip({ ...shipData, shippingLineId: id });
    console.log("🎯 handleAddShip result:", result);
    if (result.success) setIsAddShipOpen(false);
    return result;
  };

  const handleViewShip = async (ship) => {
    const result = await fetchShipById(ship.id);
    if (result.success) {
      setSelectedShip(ship);
      setIsViewShipOpen(true);
    }
  };

  const handleEditShip = async (ship) => {
    const result = await fetchShipById(ship.id);
    if (result.success) {
      setSelectedShip(ship);
      setIsUpdateShipOpen(true);
    }
  };

  const handleUpdateShip = async (shipId, shipData) => {
    const result = await updateShip(shipId, { ...shipData, shippingLineId: id });
    if (result.success) {
      setIsUpdateShipOpen(false);
      clearCurrentShip();
    }
    return result;
  };

  const handleDeleteShip = (ship) => {
    setSelectedShip(ship);
    setIsDeleteShipOpen(true);
  };

  const handleConfirmDeleteShip = async (shipId) => {
    const result = await removeShip(shipId);
    if (result.success) {
      setIsDeleteShipOpen(false);
      setSelectedShip(null);
    }
  };

  // CRUD Handler for Containers
  const handleAddContainer = async (containerData) => {
    const result = await addContainer({ ...containerData, shippingLineId: id });
    if (result.success) setIsAddContainerOpen(false);
    return result;
  };

  if (partnerLoading || shipsLoading) return <Loading />;

  if (!currentPartner) {
    return <div className="p-6 text-slate-600">No shipping line found.</div>;
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

  // Stats
  const totalShips = ships?.filter((s) => s.shipping_line_id === id)?.length || 0;
  const totalContainers = allContainers?.length || 0;
  const inUseContainers = allContainers?.filter(container => !container.is_returned)?.length || 0;
  const returnedContainers = allContainers?.filter(container => container.is_returned)?.length || 0;

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
          <div className="mb-8 flex items-center gap-4">
            <img
              src={currentPartner.logo_url}
              alt={currentPartner.name}
              className="w-24 h-24 object-cover border rounded-md"
            />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              {currentPartner.name}
            </h1>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="stat-card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <GlobeAltIcon className="stat-icon-bg h-24 w-24 opacity-10" />
              <div className="stat-content">
                <div>
                  <p className="stat-title">Total Ships</p>
                  <p className="stat-value">{totalShips}</p>
                </div>
              </div>
            </div>
            <div className="stat-card bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
              <CubeIcon className="stat-icon-bg h-24 w-24 opacity-10" />
              <div className="stat-content">
                <div>
                  <p className="stat-title">Total Containers</p>
                  <p className="stat-value">{totalContainers}</p>
                </div>
              </div>
            </div>
            <div className="stat-card bg-gradient-to-br from-amber-500 to-amber-600 text-white">
              <ExclamationTriangleIcon className="stat-icon-bg h-24 w-24 opacity-10" />
              <div className="stat-content">
                <div>
                  <p className="stat-title">In Use Containers</p>
                  <p className="stat-value">{inUseContainers}</p>
                </div>
              </div>
            </div>
            <div className="stat-card bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CubeIcon className="stat-icon-bg h-24 w-24 opacity-10" />
              <div className="stat-content">
                <div>
                  <p className="stat-title">Available Containers</p>
                  <p className="stat-value">{returnedContainers}</p>
                </div>
              </div>
            </div>
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
              <GlobeAltIcon className="h-5 w-5" />
              Ships
            </button>
            <button
              onClick={() => setActiveTab("containers")}
              className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === "containers"
                  ? "text-emerald-600 border-b-2 border-emerald-600"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <CubeIcon className="h-5 w-5" />
              Containers
            </button>
          </div>

          {/* Conditional Rendering */}
          {activeTab === "ships" ? (
            <ShipTable
              data={ships.filter((s) => s.shipping_line_id === id)}
              onView={handleViewShip}
              onEdit={handleEditShip}
              onDelete={handleDeleteShip}
              rightAction={
                <button
                  onClick={() => setIsAddShipOpen(true)}
                  className="btn-primary"
                >
                  <PlusCircleIcon className="h-5 w-5" /> Add Ship
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
      <PlusCircleIcon className="h-5 w-5" /> Add Container
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
      <ViewShip
        isOpen={isViewShipOpen}
        onClose={() => setIsViewShipOpen(false)}
        ship={selectedShip}
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