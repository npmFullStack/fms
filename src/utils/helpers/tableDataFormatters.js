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


// New function to get route abbreviation (3 letters only)
export const getRouteAbbreviation = (originPort, destinationPort) => {
    const portAbbreviations = {
        'Manila': 'MLA',
        'Subic': 'SBC',
        'Batangas': 'BTG',
        'Cebu': 'CEB',
        'Iloilo': 'ILO',
        'Bacolod': 'BCD',
        'Davao': 'DVO',
        'Cagayan-de-Oro': 'CDO',
        'General-Santos': 'GES',
        'Zamboanga': 'ZAM'
    };
    
    const origin = portAbbreviations[originPort] || '---';
    const destination = portAbbreviations[destinationPort] || '---';
    
    return `${origin}-${destination}`;
};

// New function to format volume (quantity X size)
export const formatVolume = (quantity, size) => {
    if (!quantity || !size) return "---";
    return `${quantity}X${size}`;
};