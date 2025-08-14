import { useEffect, useState, useMemo } from "react";
import useUserStore from "../../utils/store/useUserStore";
import { 
  EyeIcon,
  PencilSquareIcon,
  ArchiveBoxIcon,
  UserCircleIcon,
  UserPlusIcon,
  FunnelIcon
} from "@heroicons/react/24/outline";
import Loading from "../../components/Loading";
import SearchBar from "../../components/SearchBar";
import AddUser from "../../components/modals/AddUser";
import ViewUser from "../../components/modals/ViewUser";
import UpdateUser from "../../components/modals/UpdateUser";
import { formatRole, formatName } from "../../utils/helpers/formatters";
// In your AccountManagement.jsx
import Select from 'react-select';

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

    // Filter users based on search term and role filter
    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch = 
                formatName(user.first_name, user.last_name).toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesRole = roleFilter === "all" || user.role === roleFilter;
            
            return matchesSearch && matchesRole;
        });
    }, [users, searchTerm, roleFilter]);

    const roles = [
        { value: "all", label: "All Roles" },
        { value: "customer", label: "Customer" },
        { value: "marketing_coordinator", label: "Marketing Coordinator" },
        { value: "admin_finance", label: "Admin Finance" },
        { value: "general_manager", label: "General Manager" }
    ];

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

    const handleAddUser = async (userData) => {
        const result = await addUser(userData);
        if (result.success) {
            setIsAddUserModalOpen(false);
        }
        return result;
    };

    const handleViewUser = async (userId) => {
        const result = await fetchUserById(userId);
        if (result.success) {
            setIsViewUserModalOpen(true);
        }
    };

    const handleEditUser = async (userId) => {
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

    if (loading) return <Loading />;
    
    if (error) {
        return (
            <div className="page-container">
                <div className="max-w-md mx-auto">
                    <div className="error-message">
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            {/* Background Grid */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"></div>
            
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="page-title">Account Management</h1>
                    <p className="page-subtitle">Manage user accounts and permissions</p>
                </div>

                {/* Filters and Actions */}
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex flex-col sm:flex-row gap-4 flex-1">
                        <SearchBar 
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                            placeholder="Search by name or email..."
                        />
                        
                        <div className="w-full sm:w-48">
                            <Select
                                options={roleOptions}
                                value={roleOptions.find(option => option.value === roleFilter)}
                                onChange={(selected) => setRoleFilter(selected.value)}
                                className="react-select-container"
                                classNamePrefix="react-select"
                                placeholder="Filter by role"
                                isSearchable={false}
                            />
                        </div>
                    </div>

                    <button
                        onClick={() => setIsAddUserModalOpen(true)}
                        className="btn-primary"
                    >
                        <UserPlusIcon className="h-5 w-5" />
                        Add New User
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="stat-card bg-blue-50">
                        <div className="stat-icon bg-blue-100 text-blue-600">
                            <UserCircleIcon className="h-6 w-6" />
                        </div>
                        <div className="ml-4">
                            <p className="stat-label">Total Users</p>
                            <p className="stat-value">{users.length}</p>
                        </div>
                    </div>
                    
                    <div className="stat-card bg-green-50">
                        <div className="stat-icon bg-green-100 text-green-600">
                            <div className="w-6 h-6 bg-green-600 rounded-full"></div>
                        </div>
                        <div className="ml-4">
                            <p className="stat-label">Active</p>
                            <p className="stat-value">{users.length}</p>
                        </div>
                    </div>

                    <div className="stat-card bg-purple-50">
                        <div className="stat-icon bg-purple-100 text-purple-600">
                            <div className="w-6 h-6 bg-purple-600 rounded-full"></div>
                        </div>
                        <div className="ml-4">
                            <p className="stat-label">Admins</p>
                            <p className="stat-value">
                                {users.filter(u => u.role !== 'customer').length}
                            </p>
                        </div>
                    </div>

                    <div className="stat-card bg-orange-50">
                        <div className="stat-icon bg-orange-100 text-orange-600">
                            <div className="w-6 h-6 bg-orange-600 rounded-full"></div>
                        </div>
                        <div className="ml-4">
                            <p className="stat-label">Customers</p>
                            <p className="stat-value">
                                {users.filter(u => u.role === 'customer').length}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between">
                            <h2 className="table-header">
                                User Accounts
                                {searchTerm && (
                                    <span className="table-subheader">
                                        ({filteredUsers.length} of {users.length})
                                    </span>
                                )}
                            </h2>
                            <div className="table-count">
                                Showing {filteredUsers.length} users
                            </div>
                        </div>
                    </div>

                    {filteredUsers.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full divide-y divide-gray-200">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="table-th">User</th>
                                        <th className="table-th">Email</th>
                                        <th className="table-th">Role</th>
                                        <th className="table-th text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-150">
                                            <td className="table-td">
                                                <div className="flex items-center space-x-3">
                                                    <div className="flex-shrink-0">
                                                        {user.profile_picture ? (
                                                            <img 
                                                                src={user.profile_picture} 
                                                                alt="Profile" 
                                                                className="user-avatar"
                                                            />
                                                        ) : (
                                                            <UserCircleIcon className="user-avatar-placeholder" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="user-name">
                                                            {formatName(user.first_name, user.last_name)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="table-td">
                                                <div className="user-email">
                                                    {user.email || <span className="text-gray-400 italic">No email</span>}
                                                </div>
                                            </td>
                                            <td className="table-td">
                                                <span className={`role-badge ${
                                                    user.role === 'general_manager' 
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : user.role === 'admin_finance'
                                                        ? 'bg-purple-100 text-purple-800'
                                                        : user.role === 'marketing_coordinator'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {formatRole(user.role)}
                                                </span>
                                            </td>
                                            <td className="table-td text-right">
                                                <div className="flex justify-end space-x-2">
                                                    <button 
                                                        onClick={() => handleViewUser(user.id)}
                                                        className="action-btn bg-blue-50 text-blue-600 hover:bg-blue-100"
                                                        title="View Details"
                                                    >
                                                        <EyeIcon className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleEditUser(user.id)}
                                                        className="action-btn bg-green-50 text-green-600 hover:bg-green-100"
                                                        title="Edit User"
                                                    >
                                                        <PencilSquareIcon className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        className="action-btn bg-red-50 text-red-600 hover:bg-red-100"
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
                        <div className="empty-state">
                            <UserCircleIcon className="empty-state-icon" />
                            <h3 className="empty-state-title">
                                {searchTerm ? 'No users found' : 'No users available'}
                            </h3>
                            <p className="empty-state-description">
                                {searchTerm 
                                    ? 'Try adjusting your search or filters.' 
                                    : 'Get started by adding a new user account.'
                                }
                            </p>
                        </div>
                    )}
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