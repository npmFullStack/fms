// pages/partners/TruckingCompany.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  PlusCircle,
  ArrowLeft,
  Truck,
} from "lucide-react";
import Loading from "../../components/Loading";
import TruckTable from "../../components/tables/TruckTable";
import AddTruck from "../../components/modals/AddTruck";
import ViewTruck from "../../components/modals/ViewTruck";
import UpdateTruck from "../../components/modals/UpdateTruck";
import DeleteTruck from "../../components/modals/DeleteTruck";
import usePartnerStore from "../../utils/store/usePartnerStore";
import useTruckStore from "../../utils/store/useTruckStore";

const TruckingCompany = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedTruck, setSelectedTruck] = useState(null);

  const {
    currentPartner,
    fetchPartnerById,
    clearCurrentPartner,
    loading: partnerLoading,
  } = usePartnerStore();

  const {
    trucks,
    fetchTrucks,
    loading: trucksLoading,
    error,
    addTruck,
    updateTruck,
    removeTruck,
    clearCurrentTruck,
  } = useTruckStore();

  useEffect(() => {
    if (id) {
      fetchPartnerById(id, "trucking");
      fetchTrucks(id);
    }
    return () => {
      clearCurrentPartner();
      clearCurrentTruck();
    };
  }, [id, fetchPartnerById, clearCurrentPartner, fetchTrucks, clearCurrentTruck]);

  // Handlers
  const handleAddTruck = async (truckData) => {
    const result = await addTruck({ ...truckData, truckingCompanyId: id });
    if (result.success) setIsAddModalOpen(false);
    return result;
  };

  const handleUpdateTruck = async (truckId, truckData) => {
    const result = await updateTruck(truckId, { ...truckData, truckingCompanyId: id });
    if (result.success) setIsUpdateModalOpen(false);
    return result;
  };

  const handleDeleteTruck = async (truckId) => {
    const result = await removeTruck(truckId);
    if (result.success) setIsDeleteModalOpen(false);
    return result;
  };

  if (partnerLoading || trucksLoading) return <Loading />;

  if (!currentPartner) {
    return <div className="p-6 text-slate-600">No trucking company found.</div>;
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

  const totalTrucks = trucks?.length || 0;

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
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
                Truck Management
              </h1>
              <p className="text-slate-600 text-lg">{currentPartner.name}</p>
              <p
                className={`mt-1 inline-block px-2 py-1 text-xs rounded-lg ${
                  currentPartner.is_active
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {currentPartner.is_active ? "Active" : "Inactive"}
              </p>
            </div>
            <img
              src={currentPartner.logo_url}
              alt={currentPartner.name}
              className="w-32 h-20 object-cover border rounded-md"
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="stat-card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <Truck className="stat-icon-bg h-24 w-24" />
              <div className="stat-content">
                <div>
                  <p className="stat-title">Total Trucks</p>
                  <p className="stat-value">{totalTrucks}</p>
                </div>
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Truck className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>

          {/* Truck Table */}
          <TruckTable
            data={trucks}
            onView={(truck) => {
              setSelectedTruck(truck);
              setIsViewModalOpen(true);
            }}
            onEdit={(truck) => {
              setSelectedTruck(truck);
              setIsUpdateModalOpen(true);
            }}
            onDelete={(truck) => {
              setSelectedTruck(truck);
              setIsDeleteModalOpen(true);
            }}
            truckingCompanyId={id}
            rightAction={
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="btn-primary"
              >
                <PlusCircle className="h-5 w-5" />
                Add Truck
              </button>
            }
          />
        </div>
      </div>

      {/* Add Truck Modal */}
      <AddTruck
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddTruck}
        truckingCompanyId={id}
      />

      {/* View Truck Modal */}
      <ViewTruck
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        truck={selectedTruck}
      />

      {/* Update Truck Modal */}
      <UpdateTruck
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onSubmit={handleUpdateTruck}
        truck={selectedTruck}
        truckingCompanyId={id}
      />

      {/* Delete Truck Modal */}
      <DeleteTruck
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteTruck}
        truck={selectedTruck}
      />
    </div>
  );
};

export default TruckingCompany;
