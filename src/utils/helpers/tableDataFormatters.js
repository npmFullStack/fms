// utils/helpers/tableDataFormatters.js

export const toCaps = value => {
    if (!value) return "—";
    return String(value).toUpperCase();
};

export const getStatusBadge = status => {
    const statusMap = {
        PICKUP_SCHEDULED: {
            label: "PICKUP",
            bg: "bg-yellow-100",
            text: "text-yellow-700 border-yellow-700"
        },
        LOADED_TO_TRUCK: {
            label: "LOADED TRUCK",
            bg: "bg-orange-100",
            text: "text-orange-700 border-orange-700"
        },
        ARRIVED_ORIGIN_PORT: {
            label: "ORIGIN PORT",
            bg: "bg-indigo-100",
            text: "text-indigo-700 border-indigo-700"
        },
        LOADED_TO_SHIP: {
            label: "LOADED SHIP",
            bg: "bg-sky-100",
            text: "text-sky-700 border-sky-700"
        },
        IN_TRANSIT: {
            label: "TRANSIT",
            bg: "bg-purple-100",
            text: "text-purple-700 border-purple-700"
        },
        ARRIVED_DESTINATION_PORT: {
            label: "DEST. PORT",
            bg: "bg-pink-100",
            text: "text-pink-700 border-pink-700"
        },
        OUT_FOR_DELIVERY: {
            label: "DELIVERY",
            bg: "bg-teal-100",
            text: "text-teal-700 border-teal-700"
        },
        DELIVERED: {
            label: "DELIVERED",
            bg: "bg-green-100",
            text: "text-green-700 border-green-700"
        }
    };

    return (
        statusMap[status] || {
            label: status?.toUpperCase() || "UNKNOWN",
            bg: "bg-gray-100",
            text: "text-gray-700 border-gray-700"
        }
    );
};

export const getModeBadge = mode => {
    const modeMap = {
        DOOR_TO_DOOR: {
            label: "DOOR-DOOR",
            bg: "bg-sky-100",
            text: "text-sky-700 border-sky-700"
        },
        PIER_TO_PIER: {
            label: "PORT-PORT",
            bg: "bg-blue-100",
            text: "text-blue-700 border-blue-700"
        },
        CY_TO_DOOR: {
            label: "CY-DOOR",
            bg: "bg-amber-100",
            text: "text-amber-700 border-amber-700"
        },
        DOOR_TO_CY: {
            label: "DOOR-CY",
            bg: "bg-emerald-100",
            text: "text-emerald-700 border-emerald-700"
        },
        CY_TO_CY: {
            label: "CY-CY",
            bg: "bg-rose-100",
            text: "text-rose-700 border-rose-700"
        }
    };

    return (
        modeMap[mode] || {
            label: mode?.toUpperCase() || "UNKNOWN",
            bg: "bg-gray-100",
            text: "text-gray-700 border-gray-700"
        }
    );
};
