// components/BulkActionBar
import { Edit2, Printer, Trash2, Download } from "lucide-react";
import { useState, useEffect } from "react";

const BulkActionBar = ({ selected, onEdit, onPrint, onDownload, onDelete }) => {
    const multiple = selected.length > 1;
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (selected.length > 0) {
            setVisible(true);
        } else {
            setTimeout(() => setVisible(false), 300);
        }
    }, [selected]);

    return (
        <div
            className={` 
        fixed left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300
        ${selected.length > 0 ? "bottom-6 opacity-100" : "-bottom-20 opacity-0"}
      `}
        >
            {visible && (
                <div
                    className="flex flex-col sm:flex-row items-stretch sm:items-center
        gap-3 bg-white shadow-xl rounded-2xl px-4 py-2 border border-slate-200
        w-[90vw] sm:w-auto"
                >
                    {/* Selected count */}
                    <div className="text-xs sm:text-sm font-medium text-center sm:text-left">
                        {selected.length} item{selected.length > 1 ? "s" : ""}{" "}
                        selected
                    </div>

                    <div className="h-px sm:h-6 sm:w-px bg-slate-200"></div>

                    {/* Buttons */}
                    <div className="grid grid-cols-4 sm:flex sm:flex-row gap-2 w-full sm:w-auto">
                        {/* Edit */}
                        <button
                            onClick={() => !multiple && onEdit(selected[0])}
                            disabled={multiple}
                            className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 px-2 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors text-center
                ${
                    multiple
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-300"
                        : "bg-emerald-100 text-emerald-500 border border-emerald-500 hover:bg-emerald-200"
                }`}
                        >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                        </button>

                        {/* Print */}
                        <button
                            onClick={() => onPrint(selected)}
                            className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 px-2 py-2 rounded-lg text-xs sm:text-sm font-medium bg-blue-100 text-blue-500 border border-blue-500 hover:bg-blue-200 text-center"
                        >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Print</span>
                        </button>

                        {/* Download */}
                        <button
                            onClick={() => onDownload(selected)}
                            className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 px-2 py-2 rounded-lg text-xs sm:text-sm font-medium bg-indigo-100 text-indigo-500 border border-indigo-500 hover:bg-indigo-200 text-center"
                        >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download</span>
                        </button>

                        {/* Delete */}
                        <button
                            onClick={() => onDelete(selected)}
                            className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 px-2 py-2 rounded-lg text-xs sm:text-sm font-medium bg-red-100 text-red-500 border border-red-500 hover:bg-red-200 text-center"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BulkActionBar;
