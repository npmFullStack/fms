// utils/helpers/tableDataFormatters.js

export const toCaps = value => {
    if (!value) return "—";
    return String(value).toUpperCase();
};

export const getStatusBadge = status => {
    const statusMap = {
        PICKUP_SCHEDULED: {
            label: "PICKUP",
            bg: "bg-yellow-500",
            text: "text-white border-yellow-700"
        },
        LOADED_TO_TRUCK: {
            label: "LOADED TRUCK",
            bg: "bg-orange-500",
            text: "text-white border-orange-700"
        },
        ARRIVED_ORIGIN_PORT: {
            label: "ORIGIN PORT",
            bg: "bg-indigo-500",
            text: "text-white border-indigo-700"
        },
        LOADED_TO_SHIP: {
            label: "LOADED SHIP",
            bg: "bg-sky-500",
            text: "text-white border-sky-700"
        },
        IN_TRANSIT: {
            label: "TRANSIT",
            bg: "bg-purple-500",
            text: "text-white border-purple-700"
        },
        ARRIVED_DESTINATION_PORT: {
            label: "DEST. PORT",
            bg: "bg-pink-500",
            text: "text-white border-pink-700"
        },
        OUT_FOR_DELIVERY: {
            label: "DELIVERY",
            bg: "bg-teal-500",
            text: "text-white border-teal-700"
        },
        DELIVERED: {
            label: "DELIVERED",
            bg: "bg-green-500",
            text: "text-white border-green-700"
        }
    };

    return (
        statusMap[status] || {
            label: status?.toUpperCase() || "UNKNOWN",
            bg: "bg-gray-500",
            text: "text-white border-gray-700"
        }
    );
};

export const getModeBadge = mode => {
    const modeMap = {
        DOOR_TO_DOOR: {
            label: "DOOR-DOOR",
            bg: "bg-sky-500",
            text: "text-white border-sky-700"
        },
        PIER_TO_PIER: {
            label: "PORT-PORT",
            bg: "bg-blue-500",
            text: "text-white border-blue-700"
        },
        CY_TO_DOOR: {
            label: "CY-DOOR",
            bg: "bg-amber-500",
            text: "text-white border-amber-700"
        },
        DOOR_TO_CY: {
            label: "DOOR-CY",
            bg: "bg-emerald-500",
            text: "text-white border-emerald-700"
        },
        CY_TO_CY: {
            label: "CY-CY",
            bg: "bg-rose-500",
            text: "text-white border-rose-700"
        }
    };

    return (
        modeMap[mode] || {
            label: mode?.toUpperCase() || "UNKNOWN",
            bg: "bg-gray-500",
            text: "text-white border-gray-700"
        }
    );
};
