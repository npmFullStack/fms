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
                <div className="flex items-center gap-4 bg-white shadow-xl rounded-3xl px-4 py-3 border border-slate-200">
                    {/* Selected count */}
                    <div className="text-sm font-medium min-w-[120px] text-center sm:text-left">
                        {selected.length} item{selected.length > 1 ? "s" : ""}{" "}
                        selected
                    </div>

                    <div className="h-6 w-px bg-slate-200"></div>

                    {/* Buttons container with fixed width */}
                    <div className="w-[400px] sm:w-[500px] flex gap-2">
                        <button
                            onClick={() => !multiple && onEdit(selected[0])}
                            disabled={multiple}
                            className={`flex-1 flex items-center justify-center gap-2 px-2 sm:px-4 py-2 rounded-xl text-sm font-medium transition-colors
                            ${
                                multiple
                                    ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-300"
                                    : "bg-emerald-100 text-emerald-500 border border-emerald-500 hover:bg-emerald-200"
                            }`}
                        >
                            <Edit2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Edit</span>
                        </button>

                        <button
                            onClick={() => onPrint(selected)}
                            className="flex-1 flex items-center justify-center gap-2 px-2 sm:px-4 py-2 rounded-xl text-sm font-medium bg-blue-100 text-blue-500 border border-blue-500 hover:bg-blue-200"
                        >
                            <Printer className="w-4 h-4" />
                            <span className="hidden sm:inline">Print</span>
                        </button>

                        <button
                            onClick={() => onDownload(selected)}
                            className="flex-1 flex items-center justify-center gap-2 px-2 sm:px-4 py-2 rounded-xl text-sm font-medium bg-indigo-100 text-indigo-500 border border-indigo-500 hover:bg-indigo-200"
                        >
                            <Download className="w-4 h-4" />
                            <span className="hidden sm:inline">Download</span>
                        </button>

                        <button
                            onClick={() => onDelete(selected)}
                            className="flex-1 flex items-center justify-center gap-2 px-2 sm:px-4 py-2 rounded-xl text-sm font-medium bg-red-100 text-red-500 border border-red-500 hover:bg-red-200"
                        >
                            <Trash2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Delete</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BulkActionBar;
