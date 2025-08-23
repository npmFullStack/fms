import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import usePartnerStore from "../../utils/store/usePartnerStore";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const TruckingCompanies = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Expecting /trucking-companies/:id route
  const { currentPartner, fetchPartnerById, clearCurrentPartner, loading } =
    usePartnerStore();

  useEffect(() => {
    if (id) fetchPartnerById(id, "trucking");
    return () => clearCurrentPartner();
  }, [id, fetchPartnerById, clearCurrentPartner]);

  if (loading) {
    return <div className="p-6 text-slate-600">Loading trucking company...</div>;
  }

  if (!currentPartner) {
    return <div className="p-6 text-slate-600">No trucking company found.</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-blue-600 hover:underline"
      >
        <ArrowLeftIcon className="w-4 h-4" /> Back
      </button>

      <div className="flex gap-6 items-center">
        <img
          src={currentPartner.logo_url}
          alt={currentPartner.name}
          className="w-32 h-20 object-cover border rounded-md"
        />
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            {currentPartner.name}
          </h1>
          <p className="text-slate-500">Type: Trucking Company</p>
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
      </div>
    </div>
  );
};

export default TruckingCompanies;
