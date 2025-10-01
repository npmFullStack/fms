// components/cards/StatCard.jsx
import React from "react";

const StatCard = ({ title, value, color, icon: Icon }) => {
    return (
        <div className={`relative overflow-hidden rounded-xl p-5 ${color}`}>
            {/* Large background icon */}
            <Icon className="absolute right-2 top-2 h-20 w-20 text-white/20" />

            <div className="relative flex items-center justify-between">
                {/* Title + Value */}
                <div>
                    <p className="text-sm font-semibold text-white/90">{title}</p>
                    <p className="text-2xl font-bold text-white">{value}</p>
                </div>

                {/* Small icon */}
                <div className="p-1 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Icon className="h-6 w-6 text-white" />
                </div>
            </div>
        </div>
    );
};

export default StatCard;
