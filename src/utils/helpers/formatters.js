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