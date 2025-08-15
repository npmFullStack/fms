import { useEffect, useState, useMemo } from "react";
import useUserStore from "../../utils/store/useUserStore";
import {
    EyeIcon,
    PencilSquareIcon,
    ArchiveBoxIcon,
    UserCircleIcon,
    UserPlusIcon,
    MagnifyingGlassIcon
} from "@heroicons/react/24/outline";
import Loading from "../../components/Loading";
import SearchBar from "../../components/SearchBar";
import AddUser from "../../components/modals/AddUser";
import ViewUser from "../../components/modals/ViewUser";
import UpdateUser from "../../components/modals/UpdateUser";
import { formatRole, formatName } from "../../utils/helpers/formatters";
import Select from "react-select";

const AccountManagement = () => {
    const {
        users,
        fetchUsers,
        loading,
        error,
        addUser,
        fetchUserById,
        updateUser,
        currentUser,
        clearCurrentUser
    } = useUserStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [isViewUserModalOpen, setIsViewUserModalOpen] = useState(false);
    const [isUpdateUserModalOpen, setIsUpdateUserModalOpen] = useState(false);

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch =
                formatName(user.first_name, user.last_name)
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesRole =
                roleFilter === "all" || user.role === roleFilter;

            return matchesSearch && matchesRole;
        });
    }, [users, searchTerm, roleFilter]);

    const roleOptions = [
        { value: "all", label: "All Roles" },
        { value: "customer", label: "Customer" },
        { value: "marketing_coordinator", label: "Marketing Coordinator" },
        { value: "admin_finance", label: "Admin Finance" },
        { value: "general_manager", label: "General Manager" }
    ];

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleAddUser = async userData => {
        const result = await addUser(userData);
        if (result.success) {
            setIsAddUserModalOpen(false);
        }
        return result;
    };

    const handleViewUser = async userId => {
        const result = await fetchUserById(userId);
        if (result.success) {
            setIsViewUserModalOpen(true);
        }
    };

    const handleEditUser = async userId => {
        const result = await fetchUserById(userId);
        if (result.success) {
            setIsUpdateUserModalOpen(true);
        }
    };

    const handleUpdateUser = async (userId, userData) => {
        const result = await updateUser(userId, userData);
        if (result.success) {
            setIsUpdateUserModalOpen(false);
            clearCurrentUser();
        }
        return result;
    };

    const handleCloseViewModal = () => {
        setIsViewUserModalOpen(false);
        clearCurrentUser();
    };

    const handleCloseUpdateModal = () => {
        setIsUpdateUserModalOpen(false);
        clearCurrentUser();
    };

    const StatCard = ({ title, value, color, icon: Icon, bgIcon }) => (
        <div
            className={`relative overflow-hidden rounded-2xl p-6 shadow-lg border-0 ${color} backdrop-blur-sm`}
        >
            {/* Background Icon */}
            <div className="absolute -right-4 -top-4 opacity-10">{bgIcon}</div>

            {/* Content */}
            <div className="relative z-10 flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium opacity-90 mb-1">
                        {title}
                    </p>
                    <p className="text-3xl font-bold">{value}</p>
                </div>
                <div className="flex-shrink-0">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                        <Icon className="h-6 w-6" />
                    </div>
                </div>
            </div>
        </div>
    );

    if (loading) return <Loading />;

    if (error) {
        return (
            <div className="page-container">
                <div className="max-w-md mx-auto">
                    <div className="error-message">{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="relative z-10 p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
                            Account Management
                        </h1>
                        <p className="text-slate-600 text-lg">
                            Manage user accounts and permissions with ease
                        </p>
                    </div>

                    {/* Enhanced Stats Cards - Only Essential Ones */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <StatCard
                            title="Total Users"
                            value={users.length}
                            color="bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                            icon={UserCircleIcon}
                            bgIcon={<UserCircleIcon className="h-24 w-24" />}
                        />

                        <StatCard
                            title="Active Users"
                            value={users.length}
                            color="bg-gradient-to-br from-green-500 to-emerald-600 text-white"
                            icon={UserCircleIcon}
                            bgIcon={<UserCircleIcon className="h-24 w-24" />}
                        />
                    </div>

                    {/* Filters and Actions */}
                    <div className="mb-8">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            <div className="flex flex-col sm:flex-row gap-4 flex-1">
                                {/* Enhanced Search Bar */}
                                <SearchBar
                                    searchTerm={searchTerm}
                                    onSearchChange={setSearchTerm}
                                    placeholder="Search by name or email..."
                                />

                                {/* Role Filter */}
                                <div className="w-full sm:w-48">
                                    <Select
                                        options={roleOptions}
                                        value={roleOptions.find(
                                            option =>
                                                option.value === roleFilter
                                        )}
                                        onChange={selected =>
                                            setRoleFilter(selected.value)
                                        }
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                        placeholder="Filter by role"
                                        isSearchable={false}
                                    />
                                </div>
                            </div>

                            <button
                                onClick={() => setIsAddUserModalOpen(true)}
                                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                            >
                                <UserPlusIcon className="h-5 w-5" />
                                Add New User
                            </button>
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200/50 bg-slate-50/50">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-slate-800">
                                    User Accounts
                                    {searchTerm && (
                                        <span className="ml-2 text-sm font-normal text-slate-500">
                                            ({filteredUsers.length} of{" "}
                                            {users.length})
                                        </span>
                                    )}
                                </h2>
                                <div className="text-sm text-slate-500">
                                    Showing {filteredUsers.length} users
                                </div>
                            </div>
                        </div>

                        {filteredUsers.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full divide-y divide-slate-200/50">
                                    <thead>
                                        <tr className="bg-slate-50/50">
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                                User
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                                Email
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                                Role
                                            </th>
                                            <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white/50 divide-y divide-slate-200/50">
                                        {filteredUsers.map(user => (
                                            <tr
                                                key={user.id}
                                                className="hover:bg-white/70 transition-all duration-200"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="flex-shrink-0">
                                                            {user.profile_picture ? (
                                                                <img
                                                                    src={
                                                                        user.profile_picture
                                                                    }
                                                                    alt="Profile"
                                                                    className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-md"
                                                                />
                                                            ) : (
                                                                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                                                                    <UserCircleIcon className="h-7 w-7 text-white" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <div className="font-semibold text-slate-900">
                                                                    {formatName(
                                                                        user.first_name,
                                                                        user.last_name
                                                                    )}
                                                                </div>
                                                                {/* Add the "You" indicator for current user - replace the condition with actual logic */}
                                                                {/* {user.is_current_user && (
                                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                                                        You
                                                                    </span>
                                                                )} */}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-slate-700">
                                                        {user.email || (
                                                            <span className="text-slate-400 italic">
                                                                No email
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                            user.role ===
                                                            "general_manager"
                                                                ? "bg-blue-100 text-blue-800 border border-blue-200"
                                                                : user.role ===
                                                                  "admin_finance"
                                                                ? "bg-purple-100 text-purple-800 border border-purple-200"
                                                                : user.role ===
                                                                  "marketing_coordinator"
                                                                ? "bg-green-100 text-green-800 border border-green-200"
                                                                : "bg-slate-100 text-slate-800 border border-slate-200"
                                                        }`}
                                                    >
                                                        {formatRole(user.role)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <div className="flex justify-end space-x-2">
                                                        <button
                                                            onClick={() =>
                                                                handleViewUser(
                                                                    user.id
                                                                )
                                                            }
                                                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all duration-200 shadow-sm hover:shadow-md"
                                                            title="View Details"
                                                        >
                                                            <EyeIcon className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleEditUser(
                                                                    user.id
                                                                )
                                                            }
                                                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-all duration-200 shadow-sm hover:shadow-md"
                                                            title="Edit User"
                                                        >
                                                            <PencilSquareIcon className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200 shadow-sm hover:shadow-md"
                                                            title="Archive User"
                                                        >
                                                            <ArchiveBoxIcon className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <UserCircleIcon className="mx-auto h-16 w-16 text-slate-400 mb-4" />
                                <h3 className="text-lg font-medium text-slate-900 mb-2">
                                    {searchTerm
                                        ? "No users found"
                                        : "No users available"}
                                </h3>
                                <p className="text-slate-500">
                                    {searchTerm
                                        ? "Try adjusting your search or filters."
                                        : "Get started by adding a new user account."}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add User Modal */}
            <AddUser
                isOpen={isAddUserModalOpen}
                onClose={() => setIsAddUserModalOpen(false)}
                onSubmit={handleAddUser}
            />

            {/* View User Modal */}
            <ViewUser
                isOpen={isViewUserModalOpen}
                onClose={handleCloseViewModal}
                user={currentUser}
            />

            {/* Update User Modal */}
            <UpdateUser
                isOpen={isUpdateUserModalOpen}
                onClose={handleCloseUpdateModal}
                user={currentUser}
                onSubmit={handleUpdateUser}
            />
        </div>
    );
};

export default AccountManagement;
