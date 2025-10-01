import { useState, useEffect } from "react";
import {
  PlusCircle,
  Users,
  Truck,
  Ship
} from "lucide-react";

import Loading from "../../components/Loading";
import AddPartner from "../../components/modals/AddPartner";
import UpdatePartner from "../../components/modals/UpdatePartner";
import DeletePartner from "../../components/modals/DeletePartner";
import PartnerTable from "../../components/tables/PartnerTable";
import usePartnerStore from "../../utils/store/usePartnerStore";

const Partners = () => {
    const [activeTab, setActiveTab] = useState("shipping");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedPartner, setSelectedPartner] = useState(null);
    // Removed previewImage state - let modals manage their own image state

    const {
        partners,
        fetchPartners,
        loading,
        error,
        addPartner,
        fetchPartnerById,
        updatePartner,
        clearCurrentPartner,
        removePartner
    } = usePartnerStore();

    useEffect(() => {
        fetchPartners();
    }, [fetchPartners]);

    const handleAddPartner = async partnerData => {
        const result = await addPartner(partnerData, activeTab);
        if (result.success) {
            setIsAddModalOpen(false);

        }
        return result;
    };


    const handleEditPartner = async partner => {
        const result = await fetchPartnerById(partner.id, partner.type);
        if (result.success) {
            setSelectedPartner(partner);
            setIsUpdateModalOpen(true);
        }
    };

    const handleUpdatePartner = async (partnerId, partnerData) => {
        const result = await updatePartner(partnerId, partnerData, activeTab);
        if (result.success) {
            setIsUpdateModalOpen(false);
            clearCurrentPartner();
            // Removed setPreviewImage(null) - modal handles this internally
        }
        return result;
    };

    const handleDeleteClick = partner => {
        setSelectedPartner(partner);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async (partnerId, type) => {
        const result = await removePartner(partnerId, type);
        if (result.success) {
            setIsDeleteModalOpen(false);
            setSelectedPartner(null);
        }
    };

    

    const handleCloseUpdateModal = () => {
        setIsUpdateModalOpen(false);
        clearCurrentPartner();
        setSelectedPartner(null);
    };

    if (loading) return <Loading />;

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
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
                            Partners Management
                        </h1>
                        <p className="text-slate-600 text-lg">
                            Manage shipping lines and trucking companies
                        </p>
                    </div>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Total Partners */}
                        <div className="stat-card bg-gradient-to-br from-blue-500 to-blue-600">
                            <Users className="stat-icon-bg h-24 w-24" />
                            <div className="stat-content">
                                <div>
                                    <p className="stat-label">Total Partners</p>
                                    <p className="stat-value">
                                        {partners.filter(
                                            p => p.type === "shipping"
                                        ).length +
                                            partners.filter(
                                                p => p.type === "trucking"
                                            ).length}
                                    </p>
                                </div>
                                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                    <Users className="h-6 w-6" />
                                </div>
                            </div>
                        </div>

                        {/* Total Shipping Lines */}
                        <div className="stat-card bg-gradient-to-br from-blue-400 to-blue-500">
                            <Ship className="stat-icon-bg h-24 w-24" />
                            <div className="stat-content">
                                <div>
                                    <p className="stat-label">
                                        Total Shipping Lines
                                    </p>
                                    <p className="stat-value">
                                        {
                                            partners.filter(
                                                p => p.type === "shipping"
                                            ).length
                                        }
                                    </p>
                                </div>
                                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                    <Ship className="h-6 w-6" />
                                </div>
                            </div>
                        </div>

                        {/* Total Trucking Companies */}
                        <div className="stat-card bg-gradient-to-br from-orange-500 to-orange-600">
                            <Truck className="stat-icon-bg h-24 w-24" />
                            <div className="stat-content">
                                <div>
                                    <p className="stat-label">
                                        Total Trucking Companies
                                    </p>
                                    <p className="stat-value">
                                        {
                                            partners.filter(
                                                p => p.type === "trucking"
                                            ).length
                                        }
                                    </p>
                                </div>
                                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                    <Truck className="h-6 w-6" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-slate-200 mb-6">
                        <button
                            onClick={() => setActiveTab("shipping")}
                            className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${
                                activeTab === "shipping"
                                    ? "text-blue-600 border-b-2 border-blue-600"
                                    : "text-slate-500 hover:text-slate-700"
                            }`}
                        >
                            <Users className="h-5 w-5" />
                            Shipping Lines
                        </button>
                        <button
                            onClick={() => setActiveTab("trucking")}
                            className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${
                                activeTab === "trucking"
                                    ? "text-orange-600 border-b-2 border-orange-600"
                                    : "text-slate-500 hover:text-slate-700"
                            }`}
                        >
                            <Truck className="h-5 w-5" />
                            Trucking Companies
                        </button>
                    </div>

                    {/* Partner Table */}
                    <PartnerTable
                        data={partners.filter(p => p.type === activeTab)}
                        
                        onEdit={handleEditPartner}
                        onDelete={handleDeleteClick}
                        type={activeTab}
                        rightAction={
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="btn-primary"
                            >
                                <PlusCircle className="h-5 w-5" />
                                Add{" "}
                                {activeTab === "shipping"
                                    ? "Shipping Line"
                                    : "Trucking Company"}
                            </button>
                        }
                    />
                </div>
            </div>

            {/* Add Partner Modal */}
            <AddPartner
                isOpen={isAddModalOpen}
                onClose={() => {
                    setIsAddModalOpen(false);
                }}
                onSubmit={handleAddPartner}
                type={activeTab}
            />

 

            {/* Update Partner Modal */}
            <UpdatePartner
                isOpen={isUpdateModalOpen}
                onClose={handleCloseUpdateModal}
                partner={selectedPartner}
                onSubmit={handleUpdatePartner}
            />

            {/* Delete Partner Modal */}
            <DeletePartner
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                partner={selectedPartner}
            />
        </div>
    );
};

export default Partners;
