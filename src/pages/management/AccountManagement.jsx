import { useEffect, useState } from "react";
import useAuthStore from "../../utils/store/useAuthStore";
import { 
  EyeIcon,
  PencilSquareIcon,
  ArchiveBoxIcon,
  UserCircleIcon 
} from "@heroicons/react/24/outline";
import Loading from "../../components/Loading";
import { formatRole, formatName } from "../../utils/helpers/formatters";

const AccountManagement = () => {
    const { users, fetchUsers, loading: storeLoading } = useAuthStore();
    const [error, setError] = useState(null);

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

    if (storeLoading) return <Loading />;
    if (error) return <div className="alert alert-error max-w-md mx-auto mt-8">{error}</div>;

    return (
        <div className="p-6 min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
                    <p className="text-gray-600">Manage user accounts and permissions</p>
                </div>

                {/* Table Card */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-800">User Accounts</h2>
                            <div className="text-sm text-gray-500">
                                {users.length} total users
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-100 border-b border-gray-200">
                                    <th className="text-left py-4 px-6 font-semibold text-gray-700 uppercase text-xs tracking-wider">
                                        User
                                    </th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-700 uppercase text-xs tracking-wider">
                                        Email
                                    </th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-700 uppercase text-xs tracking-wider">
                                        Role
                                    </th>
                                    <th className="text-right py-4 px-6 font-semibold text-gray-700 uppercase text-xs tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {users.map((user, index) => (
                                    <tr 
                                        key={user.id} 
                                        className="hover:bg-gray-50 transition-colors duration-150"
                                    >
                                        <td className="py-4 px-6">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex-shrink-0">
                                                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-md">
                                                        {user.first_name && user.last_name ? (
                                                            <span className="text-sm">
                                                                {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                                                            </span>
                                                        ) : (
                                                            <UserCircleIcon className="w-6 h-6" />
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold text-gray-900">
                                                        {formatName(user.first_name, user.last_name)}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        ID: {user.id}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="text-sm text-gray-900">
                                                {user.email || <span className="text-gray-400 italic">No email</span>}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                                                user.role === 'admin' 
                                                    ? 'bg-red-100 text-red-800 border border-red-200'
                                                    : user.role === 'moderator'
                                                    ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                                    : 'bg-green-100 text-green-800 border border-green-200'
                                            }`}>
                                                {formatRole(user.role)}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex justify-end space-x-2">
                                                <button 
                                                    className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 border border-blue-200 hover:border-blue-300"
                                                    title="View Details"
                                                >
                                                    <EyeIcon className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 transition-all duration-200 border border-emerald-200 hover:border-emerald-300"
                                                    title="Edit User"
                                                >
                                                    <PencilSquareIcon className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-all duration-200 border border-red-200 hover:border-red-300"
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

                    {/* Empty state */}
                    {users.length === 0 && (
                        <div className="text-center py-12">
                            <UserCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
                            <p className="mt-1 text-sm text-gray-500">Get started by adding a new user account.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AccountManagement;