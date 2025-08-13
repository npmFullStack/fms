import { useEffect, useState, useMemo } from "react";
import useAuthStore from "../../utils/store/useAuthStore";
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
import { formatRole, formatName } from "../../utils/helpers/formatters";

const AccountManagement = () => {
    const { users, fetchUsers, loading: storeLoading } = useAuthStore();
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

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

    useEffect(() => {
        const loadUsers = async () => {
            try {
                await fetchUsers();
            } catch (err) {
                setError(err.message);
            }
        };
        loadUsers();
    }, [fetchUsers]);

    const handleAddUser = async (userData) => {
        // Here you would typically call an API to create the user
        console.log("Creating user:", userData);
        // For now, just close the modal
        // In a real app, you'd call something like: await createUser(userData);
        // Then refetch users: await fetchUsers();
    };

    if (storeLoading) return <Loading />;
    if (error) {
        return (
            <div className="p-6 min-h-screen bg-gray-50">
                <div className="max-w-md mx-auto">
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Management</h1>
                    <p className="text-gray-600">Manage user accounts and permissions</p>
                </div>

                {/* Filters and Actions */}
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex flex-col sm:flex-row gap-4 flex-1">
                        <SearchBar 
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                            placeholder="Search by name or email..."
                        />
                        
                        <div className="relative">
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="appearance-none bg-white pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            >
                                {roles.map(role => (
                                    <option key={role.value} value={role.value}>
                                        {role.label}
                                    </option>
                                ))}
                            </select>
                            <FunnelIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    <button
                        onClick={() => setIsAddUserModalOpen(true)}
                        className="inline-flex items-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        <UserPlusIcon className="h-5 w-5 mr-2" />
                        Add New User
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <UserCircleIcon className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Users</p>
                                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <div className="w-6 h-6 bg-green-600 rounded-full"></div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Active</p>
                                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <div className="w-6 h-6 bg-purple-600 rounded-full"></div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Admins</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {users.filter(u => u.role !== 'customer').length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <div className="w-6 h-6 bg-orange-600 rounded-full"></div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Customers</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {users.filter(u => u.role === 'customer').length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-800">
                                User Accounts
                                {searchTerm && (
                                    <span className="ml-2 text-sm font-normal text-gray-500">
                                        ({filteredUsers.length} of {users.length})
                                    </span>
                                )}
                            </h2>
                            <div className="text-sm text-gray-500">
                                Showing {filteredUsers.length} users
                            </div>
                        </div>
                    </div>

                    {filteredUsers.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full divide-y divide-gray-200">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            User
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Role
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center space-x-3">
                                                    <div className="flex-shrink-0">
                                                        {user.profile_picture ? (
                                                            <img 
                                                                src={user.profile_picture} 
                                                                alt="Profile" 
                                                                className="h-10 w-10 rounded-full object-cover border-2 border-gray-200"
                                                            />
                                                        ) : (
                                                            <UserCircleIcon className="h-10 w-10 text-gray-400" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {formatName(user.first_name, user.last_name)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {user.email || <span className="text-gray-400 italic">No email</span>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
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
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="flex justify-end space-x-2">
                                                    <button 
                                                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all duration-200"
                                                        title="View Details"
                                                    >
                                                        <EyeIcon className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-all duration-200"
                                                        title="Edit User"
                                                    >
                                                        <PencilSquareIcon className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200"
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
                        <div className="text-center py-12">
                            <UserCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">
                                {searchTerm ? 'No users found' : 'No users available'}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
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
        </div>
    );
};

export default AccountManagement;