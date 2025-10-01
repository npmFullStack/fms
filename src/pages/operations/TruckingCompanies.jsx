// pages/partners/TruckingCompany.jsx
import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PlusCircle, ArrowLeft, Truck, PackageCheck } from "lucide-react";

import Loading from "../../components/Loading";
import TruckTable from "../../components/tables/TruckTable";
import AddTruck from "../../components/modals/AddTruck";
import UpdateTruck from "../../components/modals/UpdateTruck";
import DeleteTruck from "../../components/modals/DeleteTruck";
import usePartnerStore from "../../utils/store/usePartnerStore";
import useTruckStore from "../../utils/store/useTruckStore";
import StatCard from "../../components/cards/StatCard";

const TruckingCompany = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedTruck, setSelectedTruck] = useState(null);
    const [successBookings, setSuccessBookings] = useState(0);

    const {
        currentPartner,
        fetchPartnerById,
        clearCurrentPartner,
        fetchSuccessBookings,
        loading: partnerLoading
    } = usePartnerStore();

    const {
        trucks,
        fetchTrucks,
        loading: trucksLoading,
        error,
        addTruck,
        updateTruck,
        removeTruck,
        clearCurrentTruck
    } = useTruckStore();

    useEffect(() => {
        if (id) {
            fetchPartnerById(id, "trucking");
            fetchTrucks(id);

            // Fetch success bookings for trucking company
            const fetchSuccess = async () => {
                const total = await fetchSuccessBookings(id, "trucking");
                setSuccessBookings(total);
            };
            fetchSuccess();
        }
        return () => {
            clearCurrentPartner();
            clearCurrentTruck();
        };
    }, [
        id,
        fetchPartnerById,
        clearCurrentPartner,
        fetchTrucks,
        clearCurrentTruck,
        fetchSuccessBookings
    ]);

    // ✅ Stats
    const statsConfig = useMemo(() => {
        return [
            {
                key: "TRUCKS",
                title: "Total Trucks",
                value: trucks?.length || 0,
                color: "bg-gradient-to-br from-blue-500 to-blue-600 text-white",
                icon: Truck
            },
            {
                key: "SUCCESS",
                title: "Successful Deliveries",
                value: successBookings,
                color: "bg-gradient-to-br from-green-500 to-green-600 text-white",
                icon: PackageCheck
            }
        ];
    }, [trucks, successBookings]);

    // Handlers
    const handleAddTruck = async truckData => {
        const result = await addTruck({ ...truckData, truckingCompanyId: id });
        if (result.success) setIsAddModalOpen(false);
        return result;
    };

    const handleUpdateTruck = async (truckId, truckData) => {
        const result = await updateTruck(truckId, {
            ...truckData,
            truckingCompanyId: id
        });
        if (result.success) setIsUpdateModalOpen(false);
        return result;
    };

    const handleDeleteTruck = async truckId => {
        const result = await removeTruck(truckId);
        if (result.success) setIsDeleteModalOpen(false);
        return result;
    };

    if (partnerLoading || trucksLoading) return <Loading />;

    if (!currentPartner) {
        return (
            <div className="p-6 text-slate-600">No trucking company found.</div>
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
                                Manage trucks for this trucking company
                            </p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {statsConfig.map(stat => (
                            <StatCard key={stat.key} {...stat} />
                        ))}
                    </div>

                    {/* Truck Table */}
                    <TruckTable
                        data={trucks}
                        onEdit={truck => {
                            setSelectedTruck(truck);
                            setIsUpdateModalOpen(true);
                        }}
                        onDelete={truck => {
                            setSelectedTruck(truck);
                            setIsDeleteModalOpen(true);
                        }}
                        truckingCompanyId={id}
                        rightAction={
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="btn-primary"
                            >
                                <PlusCircle className="h-5 w-5" /> Add Truck
                            </button>
                        }
                    />
                </div>
            </div>

            {/* Modals */}
            <AddTruck
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={handleAddTruck}
                truckingCompanyId={id}
            />
            <UpdateTruck
                isOpen={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                onSubmit={handleUpdateTruck}
                truck={selectedTruck}
                truckingCompanyId={id}
            />
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
