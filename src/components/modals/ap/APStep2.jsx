// components/modals/ap/APStep2.jsx
import { useState, useRef } from "react";
import { Controller } from "react-hook-form";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import { Calendar, Info } from "lucide-react";
import { NumericFormat } from "react-number-format";

const APStep2 = ({ register, control, errors, apRecord }) => {
  const [activeTab, setActiveTab] = useState("origin");
  const scrollPositions = useRef({ origin: 0, destination: 0 });
  const containerRef = useRef(null);

  const tabs = [
    { id: "origin", label: "Origin Trucking" },
    { id: "destination", label: "Destination Trucking" },
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

  const TruckingForm = ({ type }) => {
    const isOrigin = type === "origin";
    const prefix = isOrigin ? "origin" : "dest";
    const payee = isOrigin ? apRecord?.trucking_origin_payee : apRecord?.trucking_dest_payee;
    const location = isOrigin ? "from the origin location" : "to the destination";

    return (
      <div className="space-y-5 pt-3">
        {/* Header */}
        <div className="info-box-modern">
          <div className="flex items-start gap-3">
            <div className="p-1.5 bg-blue-100 rounded-lg">
              <Info className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1 ">
              <h4 className="text-sm font-semibold text-slate-800 mb-1">
                {isOrigin ? "Origin" : "Destination"} Trucking Charges
              </h4>
              <p className="text-xs text-slate-600">
                Update {isOrigin ? "pickup" : "delivery"} trucking expenses {location}.
              </p>
            </div>
          </div>
        </div>

        {/* Payee */}
        <div className="input-container">
          <label className="input-label-modern">Payee</label>
          <input
            type="text"
            value={payee || ""}
            readOnly
            className="input-field-modern bg-gray-100 cursor-not-allowed"
            placeholder="Payee not found"
          />
        </div>

        {/* Amount + Check Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="input-container">
            <label className="input-label-modern">Amount *</label>
            <Controller
              control={control}
              name={`trucking_${prefix}_amount`}
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
                    errors[`trucking_${prefix}_amount`] ? "input-error" : ""
                  }`}
                  onValueChange={(values) => {
                    const val = values.value;
                    field.onChange(val === "" ? "" : Number(val));
                  }}
                  onBlur={field.onBlur}
                />
              )}
            />
            {errors[`trucking_${prefix}_amount`] && (
              <p className="error-message">
                {errors[`trucking_${prefix}_amount`].message}
              </p>
            )}
          </div>

          {/* Check Date */}
          <div className="input-container">
            <label className="input-label-modern">Check Date</label>
            <div className="relative">
              <Controller
                control={control}
                name={`trucking_${prefix}_check_date`}
                render={({ field }) => (
                  <Datetime
                    {...field}
                    timeFormat={false}
                    dateFormat="YYYY-MM-DD"
                    closeOnSelect={true}
                    inputProps={{
                      className: "input-field-modern pr-10 cursor-pointer",
                      placeholder: "Select date",
                    }}
                    onChange={(val) =>
                      field.onChange(val && val.format ? val.format("YYYY-MM-DD") : "")
                    }
                    value={field.value || ""}
                  />
                )}
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Voucher */}
        <div className="input-container">
          <label className="input-label-modern">Voucher Number</label>
          <input
            type="text"
            {...register(`trucking_${prefix}_voucher`)}
            placeholder="Voucher number"
            className={`input-field-modern ${
              errors[`trucking_${prefix}_voucher`] ? "input-error" : ""
            }`}
          />
          {errors[`trucking_${prefix}_voucher`] && (
            <p className="error-message">
              {errors[`trucking_${prefix}_voucher`].message}
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="relative flex flex-col mb-2 h-full">
      {/* Sticky Tabs */}
      <div className="sticky top-0 z-10 my-3 bg-white space-y-8">
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

      {/* Scrollable Form Container */}
      <div
        ref={containerRef}
        className="overflow-y-auto max-h-[55vh] px-1 transition-all duration-300"
      >
        <div className={activeTab === "origin" ? "block" : "hidden"}>
          <TruckingForm type="origin" />
        </div>
        <div className={activeTab === "destination" ? "block" : "hidden"}>
          <TruckingForm type="destination" />
        </div>
      </div>
    </div>
  );
};

export default APStep2;
