import { Ship } from "lucide-react";

const Loading = () => {
    return (
        <div className="flex items-center justify-center h-screen w-full font-[Poppins]">
            {/* 🚢 Loader (Ship + Text) */}
            <div className="flex flex-col items-center gap-4">
                <Ship className="animate-rock h-12 w-12 text-blue-500" />
                <p className="text-slate-600 font-semibold text-sm animate-pulse">
                    LOADING...
                </p>
            </div>
        </div>
    );
};

export default Loading;
