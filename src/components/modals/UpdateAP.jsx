// components/modals/UpdateAP.jsx
import { useEffect, useState } from "react";
import { X } from "lucide-react";

const UpdateAP = ({ isOpen, onClose, apId }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Freight
    freight_amount: "",
    freight_check_date: "",
    freight_voucher: "",
    
    // Trucking Origin
    trucking_origin_amount: "",
    trucking_origin_check_date: "",
    trucking_origin_voucher: "",
    
    // Trucking Destination
    trucking_dest_amount: "",
    trucking_dest_check_date: "",
    trucking_dest_voucher: "",
    
    // Port Charges
    crainage_amount: "",
    crainage_check_date: "",
    crainage_voucher: "",
    
    arrastre_origin_amount: "",
    arrastre_origin_check_date: "",
    arrastre_origin_voucher: "",
    
    arrastre_dest_amount: "",
    arrastre_dest_check_date: "",
    arrastre_dest_voucher: "",
    
    wharfage_origin_amount: "",
    wharfage_origin_check_date: "",
    wharfage_origin_voucher: "",
    
    wharfage_dest_amount: "",
    wharfage_dest_check_date: "",
    wharfage_dest_voucher: "",
    
    labor_origin_amount: "",
    labor_origin_check_date: "",
    labor_origin_voucher: "",
    
    labor_dest_amount: "",
    labor_dest_check_date: "",
    labor_dest_voucher: "",
    
    // Misc Charges
    rebates_amount: "",
    rebates_check_date: "",
    rebates_voucher: "",
    
    storage_amount: "",
    storage_check_date: "",
    storage_voucher: "",
    
    facilitation_amount: "",
    facilitation_check_date: "",
    facilitation_voucher: ""
  });

  useEffect(() => {
    if (apId && isOpen) {
      fetchAPData(apId);
    }
  }, [apId, isOpen]);

  const fetchAPData = async (id) => {
    try {
      setLoading(true);
      // Add your API call here
      // const response = await getAPById(id);
      // setFormData(response.data);
    } catch (error) {
      console.error("Error fetching AP data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Add your update API call here
      // await updateAP(apId, formData);
      onClose();
    } catch (error) {
      console.error("Error updating AP:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const renderExpenseSection = (title, fields) => (
    <div className="space-y-4 p-4 border border-slate-200 rounded-lg">
      <h3 className="text-lg font-semibold text-slate-700">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {fields.map(field => (
          <div key={field.name}>
            <label className="form-label">{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              className="form-input"
              step={field.type === "number" ? "0.01" : undefined}
            />
          </div>
        ))}
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-slate-800">
            Update Accounts Payable
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Freight Section */}
          {renderExpenseSection("Freight Charges", [
            { name: "freight_amount", label: "Amount", type: "number" },
            { name: "freight_check_date", label: "Check Date", type: "date" },
            { name: "freight_voucher", label: "Voucher", type: "text" }
          ])}

          {/* Trucking Origin Section */}
          {renderExpenseSection("Trucking - Origin", [
            { name: "trucking_origin_amount", label: "Amount", type: "number" },
            { name: "trucking_origin_check_date", label: "Check Date", type: "date" },
            { name: "trucking_origin_voucher", label: "Voucher", type: "text" }
          ])}

          {/* Trucking Destination Section */}
          {renderExpenseSection("Trucking - Destination", [
            { name: "trucking_dest_amount", label: "Amount", type: "number" },
            { name: "trucking_dest_check_date", label: "Check Date", type: "date" },
            { name: "trucking_dest_voucher", label: "Voucher", type: "text" }
          ])}

          {/* Port Charges Sections */}
          {renderExpenseSection("Crainage", [
            { name: "crainage_amount", label: "Amount", type: "number" },
            { name: "crainage_check_date", label: "Check Date", type: "date" },
            { name: "crainage_voucher", label: "Voucher", type: "text" }
          ])}

          {renderExpenseSection("Arrastre - Origin", [
            { name: "arrastre_origin_amount", label: "Amount", type: "number" },
            { name: "arrastre_origin_check_date", label: "Check Date", type: "date" },
            { name: "arrastre_origin_voucher", label: "Voucher", type: "text" }
          ])}

          {renderExpenseSection("Arrastre - Destination", [
            { name: "arrastre_dest_amount", label: "Amount", type: "number" },
            { name: "arrastre_dest_check_date", label: "Check Date", type: "date" },
            { name: "arrastre_dest_voucher", label: "Voucher", type: "text" }
          ])}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? "Updating..." : "Update AP"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateAP;