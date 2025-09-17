import {
    PencilIcon,
    PrinterIcon,
    TrashIcon,
    ArrowDownTrayIcon
} from "@heroicons/react/24/outline";
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
                <div className="flex items-center gap-4 bg-white shadow-xl rounded-3xl px-6 py-3 border border-slate-200">
                    {/* Edit */}
                    <button
                        onClick={() => !multiple && onEdit(selected[0])}
                        disabled={multiple}
                        className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium transition-colors ${
                            multiple
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                : "bg-emerald-600 text-white hover:bg-emerald-700"
                        }`}
                    >
                        <PencilIcon className="w-4 h-4" />
                        Edit
                    </button>

                    <div className="h-6 w-px bg-slate-200"></div>

                    {/* Print */}
                    <button
                        onClick={() => onPrint(selected)}
                        className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
                    >
                        <PrinterIcon className="w-4 h-4" />
                        Print
                    </button>

                    <div className="h-6 w-px bg-slate-200"></div>

                    {/* Download */}
                    <button
                        onClick={() => onDownload(selected)}
                        className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700"
                    >
                        <ArrowDownTrayIcon className="w-4 h-4" />
                        Download
                    </button>

                    <div className="h-6 w-px bg-slate-200"></div>

                    {/* Delete */}
                    <button
                        onClick={() => onDelete(selected)}
                        className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium bg-red-600 text-white hover:bg-red-700"
                    >
                        <TrashIcon className="w-4 h-4" />
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
};

export default BulkActionBar;
