export const formatRole = role => {
    if (!role) return "Unknown";

    const roleMap = {
        customer: "Customer",
        marketing_coordinator: "Marketing Coordinator",
        admin_finance: "Admin Finance",
        general_manager: "General Manager"
    };

    return (
        roleMap[role.toLowerCase()] ||
        role.charAt(0).toUpperCase() + role.slice(1)
    );
};


export const formatName = (firstName, lastName) => {
    const first = firstName?.trim() || "";
    const last = lastName?.trim() || "";

    if (!first && !last) return "Unknown User";
    if (!first) return last;
    if (!last) return first;

    return `${first} ${last}`;
};


export const formatInitials = (firstName, lastName) => {
    const first = firstName?.trim()?.charAt(0)?.toUpperCase() || "";
    const last = lastName?.trim()?.charAt(0)?.toUpperCase() || "";

    if (!first && !last) return "?";
    return `${first}${last}`;
};


export const formatEmail = (email, maxLength = 30) => {
    if (!email) return "No email";
    if (email.length <= maxLength) return email;

    return email.substring(0, maxLength - 3) + "...";
};


export const formatDate = (date, format = "short") => {
    if (!date) return "No date";

    const dateObj = typeof date === "string" ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) return "Invalid date";

    const options = {
        short: { month: "short", day: "numeric", year: "numeric" },
        long: {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        },
        time: {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    };

    return dateObj.toLocaleDateString(
        "en-US",
        options[format] || options.short
    );
};
