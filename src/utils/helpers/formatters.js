// utils/helpers/formatters

export const formatRole = role => {
    if (!role) return "Unknown";

    const roleMap = {
        customer: "Customer",
        marketing_coordinator: "Marketing Coordinator",
        admin_finance: "Admin Finance",
        general_manager: "General Manager"
    };

    return roleMap[role.toLowerCase()] || role.charAt(0).toUpperCase() + role.slice(1);
};

export const formatName = (firstName, lastName) => {
    const first = firstName?.trim() || "";
    const last = lastName?.trim() || "";

    if (!first && !last) return "Unknown User";
    if (!first) return last;
    if (!last) return first;

    return `${first} ${last}`;
};

export const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    
    try {
        return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (e) {
        console.error("Error formatting date:", e);
        return "Invalid date";
    }
};