import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, CubeIcon, BuildingOfficeIcon } from "@heroicons/react/24/outline";
import Loading from "../../../components/Loading";
import useShippingLineStore from "../../../utils/store/useShippingLineStore";

const Ship = () => {
  const navigate = useNavigate();
  const { shippingLineId, shipId } = useParams();
  
  const { 
    currentShip, 
    fetchShipById, 
    clearCurrentShip, 
    loading 
  } = useShippingLineStore();

  useEffect(() => {
    if (shipId) {
      fetchShipById(shipId);
    }
    return () => clearCurrentShip();
  }, [shipId, fetchShipById, clearCurrentShip]);

  if (loading) {
    return <Loading />;
  }

  if (!currentShip) {
    return <div className="p-6 text-slate-600">No ship found.</div>;
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
            <ArrowLeftIcon className="w-4 h-4" /> Back to Ships
          </button>

          {/* Header */}
          <div className="mb-8">
            <div className="flex gap-6 items-center">
              <div className="w-32 h-20 rounded-lg bg-slate-100 flex items-center justify-center">
                <CubeIcon className="h-12 w-12 text-slate-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
                  {currentShip.name}
                </h1>
                <p className="text-slate-600 text-lg">Ship Details</p>
                {currentShip.shipping_line_name && (
                  <p className="text-blue-600 font-medium">
                    {currentShip.shipping_line_name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Ship Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Vessel Number */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200/50 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <CubeIcon className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-sm font-medium text-slate-600">Vessel Number</h3>
              </div>
              <p className="text-xl font-semibold text-slate-800">
                {currentShip.vessel_number || "N/A"}
              </p>
            </div>

            {/* IMO Number */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200/50 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <BuildingOfficeIcon className="h-5 w-5 text-emerald-600" />
                </div>
                <h3 className="text-sm font-medium text-slate-600">IMO Number</h3>
              </div>
              <p className="text-xl font-semibold text-slate-800">
                {currentShip.imo_number || "N/A"}
              </p>
            </div>

            {/* Capacity (TEU) */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200/50 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <CubeIcon className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="text-sm font-medium text-slate-600">Capacity</h3>
              </div>
              <p className="text-xl font-semibold text-slate-800">
                {currentShip.capacity_teu ? `${currentShip.capacity_teu?.toLocaleString()} TEU` : "N/A"}
              </p>
            </div>

            {/* Shipping Line */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200/50 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <BuildingOfficeIcon className="h-5 w-5 text-orange-600" />
                </div>
                <h3 className="text-sm font-medium text-slate-600">Shipping Line</h3>
              </div>
              <p className="text-xl font-semibold text-slate-800">
                {currentShip.shipping_line_name || "N/A"}
              </p>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/50 p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">Ship Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-slate-600 mb-2">Ship Name</h3>
                <p className="text-slate-800">{currentShip.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-600 mb-2">Vessel Number</h3>
                <p className="text-slate-800">{currentShip.vessel_number || "Not specified"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-600 mb-2">IMO Number</h3>
                <p className="text-slate-800">{currentShip.imo_number || "Not specified"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-600 mb-2">Container Capacity</h3>
                <p className="text-slate-800">
                  {currentShip.capacity_teu ? `${currentShip.capacity_teu?.toLocaleString()} TEU` : "Not specified"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ship;