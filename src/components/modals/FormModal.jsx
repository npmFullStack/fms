// components/modals/FormModal.jsx
import { useState, useRef } from "react";
import {
    XMarkIcon,
    QuestionMarkCircleIcon,
    InformationCircleIcon
} from "@heroicons/react/24/outline";

const FormModal = ({
    isOpen,
    onClose,
    title,
    message,
    isLoading,
    isSubmitting,
    onSubmit,
    fields,
    infoBox,
    buttonText = "Add" // Default button text
}) => {
    const [activeTooltip, setActiveTooltip] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

    const handleTooltipMouseEnter = (tooltipText, event) => {
        const rect = event.target.getBoundingClientRect();
        setTooltipPosition({
            x: rect.left + rect.width / 2,
            y: rect.top - 10
        });
        setActiveTooltip(tooltipText);
    };

    const handleTooltipMouseLeave = () => {
        setActiveTooltip(null);
    };
    if (!isOpen) return null;

    return (
        <>
            {/* Tooltip Portal - renders outside modal */}
            {activeTooltip && (
                <div
                    className="fixed bg-slate-800 text-white text-xs rounded-md py-2 px-3 whitespace-nowrap shadow-lg pointer-events-none"
                    style={{
    left: `${tooltipPosition.x}px`,
    top: `${tooltipPosition.y - 20}px`, // This adds 20px margin bottom
    transform: "translateX(-50%)",
    zIndex: 99999
}}
                >
                    {activeTooltip}
                </div>
            )}

            <div className="fixed inset-0 z-50 overflow-y-auto">
                {/* Backdrop */}
                <div
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
                    onClick={onClose}
                />

                {/* Modal */}
                <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[95vh] overflow-hidden">
                        {/* Header */}
                        <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-2xl px-6 py-3 text-center">
                            <button
                                onClick={onClose}
                                className="absolute top-2 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg"
                            >
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                            <h2 className="text-xl font-bold text-white">
                                {title}
                            </h2>
                        </div>

                        {/* Content */}
                        <div className="p-5 max-h-[calc(95vh-120px)] overflow-y-auto space-y-5">
                            {/* Message */}
                            {message && (
                                <div
                                    className={`p-3 rounded-xl border text-sm ${
                                        message.type === "success"
                                            ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                            : "bg-red-50 border-red-200 text-red-700"
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <InformationCircleIcon className="h-4 w-4" />
                                        {message.text}
                                    </div>
                                </div>
                            )}

                            {/* Fields */}
                            {fields.map(f => (
                                <div key={f.name} className="input-container">
                                    <label className="input-label-modern">
                                        {f.label}
                                        {f.withTooltip && (
                                            <QuestionMarkCircleIcon
                                                className="tooltip-icon ml-1"
                                                onMouseEnter={e =>
                                                    handleTooltipMouseEnter(
                                                        f.tooltipText,
                                                        e
                                                    )
                                                }
                                                onMouseLeave={
                                                    handleTooltipMouseLeave
                                                }
                                            />
                                        )}
                                    </label>

                                    {f.type === "custom" && f.customRender ? (
                                        f.customRender()
                                    ) : f.type === "textarea" ? (
                                        <textarea
                                            {...f.register}
                                            placeholder={f.placeholder}
                                            className={`input-field-modern ${
                                                f.error ? "input-error" : ""
                                            }`}
                                        />
                                    ) : (
                                        <input
                                            type={f.type}
                                            {...f.register}
                                            placeholder={f.placeholder}
                                            className={`input-field-modern ${
                                                f.error ? "input-error" : ""
                                            }`}
                                        />
                                    )}

                                    {f.error && (
                                        <p className="error-message">
                                            {f.error}
                                        </p>
                                    )}
                                </div>
                            ))}

                            {/* Info Box */}
                            {infoBox && (
                                <div className="info-box-modern">
                                    <div className="flex items-start gap-3">
                                        <div className="p-1.5 bg-blue-100 rounded-lg">
                                            <InformationCircleIcon className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-semibold text-slate-800 mb-2">
                                                {infoBox.title}
                                            </h4>
                                            <div className="space-y-1.5 text-xs text-slate-600">
                                                {infoBox.items.map(
                                                    (item, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="flex items-start gap-2"
                                                        >
                                                            {item.icon}
                                                            <span>
                                                                {item.text}
                                                            </span>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={onClose}
                                    type="button"
                                    className="btn-secondary-modern"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={onSubmit}
                                    disabled={isSubmitting || isLoading}
                                    className="btn-primary-modern"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            "Uploading..."
                                        </>
                                    ) : isSubmitting ? (
                                        <>
                                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            "Creating..."
                                        </>
                                    ) : (
                                        buttonText
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FormModal;
