// components/modals/ap/APStep3.jsx
import { useState, useRef } from "react";
import { Controller } from "react-hook-form";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import { Info } from "lucide-react";
import { NumericFormat } from "react-number-format";

const APStep3 = ({ register, control, errors }) => {
  const [activeTab, setActiveTab] = useState("origin");
  const scrollPositions = useRef({ origin: 0, destination: 0 });
  const containerRef = useRef(null);

  const tabs = [
    { id: "origin", label: "Origin Charges" },
    { id: "destination", label: "Destination Charges" },
  ];

  const originCharges = [
    { key: "crainage", label: "Crainage" },
    { key: "arrastre_origin", label: "Arrastre" },
    { key: "wharfage_origin", label: "Wharfage" },
    { key: "labor_origin", label: "Labor" },
  ];

  const destinationCharges = [
    { key: "arrastre_dest", label: "Arrastre" },
    { key: "wharfage_dest", label: "Wharfage" },
    { key: "labor_dest", label: "Labor" },
  ];

  const handleTabSwitch = (tabId) => {
    // Save scroll position of current tab
    if (containerRef.current) {
      scrollPositions.current[activeTab] = containerRef.current.scrollTop;
    }
    
    // Switch tab
    setActiveTab(tabId);
    
    // Restore scroll position of the new tab
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollTop = scrollPositions.current[tabId] || 0;
      }
    }, 0);
  };

  const ChargeForm = ({ charges }) => (
    <div className="space-y-8 pt-3">
      {charges.map((charge) => (
        <div key={charge.key} className="space-y-5">
          {/* Section Header */}
          <div className="info-box-modern">
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <Info className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-slate-800 mb-1">
                  {charge.label}
                </h4>
                <p className="text-xs text-slate-600">
                  Enter payee and billing details for this charge.
                </p>
              </div>
            </div>
          </div>

          {/* Payee */}
          <div className="input-container">
            <label className="input-label-modern">Payee</label>
            <input
              type="text"
              {...register(`${charge.key}_payee`)}
              placeholder="Enter payee name"
              className="input-field-modern"
            />
            {errors[`${charge.key}_payee`] && (
              <p className="error-message">{errors[`${charge.key}_payee`].message}</p>
            )}
          </div>

          {/* Amount + Voucher Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Amount */}
            <div className="input-container">
              <label className="input-label-modern">Amount *</label>
              <Controller
                control={control}
                name={`${charge.key}_amount`}
                render={({ field }) => (
                  <NumericFormat
                    value={
                      field.value === "" || field.value === null || field.value === 0
                        ? ""
                        : field.value
                    }
                    thousandSeparator
                    prefix="₱ "
                    decimalScale={2}
                    allowNegative={false}
                    placeholder="₱ 0.00"
                    className={`input-field-modern ${
                      errors[`${charge.key}_amount`] ? "input-error" : ""
                    }`}
                    onValueChange={(values) => {
                      const val = values.value;
                      field.onChange(val === "" ? "" : Number(val));
                    }}
                    onBlur={field.onBlur}
                  />
                )}
              />
              {errors[`${charge.key}_amount`] && (
                <p className="error-message">{errors[`${charge.key}_amount`].message}</p>
              )}
            </div>

            {/* Voucher Number */}
            <div className="input-container">
              <label className="input-label-modern">Voucher Number</label>
              <input
                type="text"
                {...register(`${charge.key}_voucher`)}
                placeholder="Voucher number"
                className={`input-field-modern ${
                  errors[`${charge.key}_voucher`] ? "input-error" : ""
                }`}
              />
              {errors[`${charge.key}_voucher`] && (
                <p className="error-message">{errors[`${charge.key}_voucher`].message}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="relative flex flex-col h-full">
      {/* Sticky Tabs - Higher z-index to stay on top */}
      <div className="sticky top-1 z-20 my-3 bg-white pb-2">
        <div className="flex justify-center">
          <div className="inline-flex p-1 rounded-lg bg-slate-100">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabSwitch(tab.id)}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-600 hover:text-gray-800 hover:bg-white"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scrollable Form Container - Lower z-index */}
      <div
        ref={containerRef}
        className="overflow-y-auto flex-1 px-1 relative"
        style={{ zIndex: 1 }}
      >
        <div className={activeTab === "origin" ? "block" : "hidden"}>
          <ChargeForm charges={originCharges} />
        </div>
        <div className={activeTab === "destination" ? "block" : "hidden"}>
          <ChargeForm charges={destinationCharges} />
        </div>
      </div>
    </div>
  );
};

export default APStep3;