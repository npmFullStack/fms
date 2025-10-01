import { useEffect, useState, useMemo } from "react";
import useUserStore from "../../utils/store/useUserStore";
import { UserCircle, UserPlus } from "lucide-react";
import Loading from "../../components/Loading";
import AddUser from "../../components/modals/AddUser";
import ViewUser from "../../components/modals/ViewUser";
import UpdateUser from "../../components/modals/UpdateUser";
import RestrictUser from "../../components/modals/RestrictUser";
import { formatName, formatRole } from "../../utils/helpers/formatters";
import UserTable from "../../components/tables/UserTable";

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
    clearCurrentUser,
    restrictUser,
    unrestrictUser,
  } = useUserStore();

  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isViewUserModalOpen, setIsViewUserModalOpen] = useState(false);
  const [isUpdateUserModalOpen, setIsUpdateUserModalOpen] = useState(false);
  const [isRestrictModalOpen, setIsRestrictModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const formattedUsers = useMemo(() => {
    return users.map((user) => ({
      ...user,
      fullName: formatName(user.first_name, user.last_name),
      role: user.role,
      displayRole: formatRole(user.role),
    }));
  }, [users]);

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

  const handleRestrictClick = (user) => {
    setSelectedUser(user);
    setIsRestrictModalOpen(true);
  };

  const handleConfirmRestrict = async () => {
    if (!selectedUser) return;

    const result = selectedUser.is_active
      ? await restrictUser(selectedUser.id)
      : await unrestrictUser(selectedUser.id);

    if (result.success) {
      setIsRestrictModalOpen(false);
      setSelectedUser(null);
    }
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
    <div className={`stat-card ${color}`}>
      <div className="stat-icon-bg">{bgIcon}</div>
      <div className="stat-content">
        <div>
          <p className="stat-title">{title}</p>
          <p className="stat-value">{value}</p>
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

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              title="Total Users"
              value={users.length}
              color="bg-gradient-to-br from-blue-500 to-blue-600 text-white"
              icon={UserCircle}
              bgIcon={<UserCircle className="h-24 w-24" />}
            />

            <StatCard
              title="Active Users"
              value={users.filter((u) => u.is_active).length}
              color="bg-gradient-to-br from-green-500 to-emerald-600 text-white"
              icon={UserCircle}
              bgIcon={<UserCircle className="h-24 w-24" />}
            />

            <StatCard
              title="Restricted Users"
              value={users.filter((u) => !u.is_active).length}
              color="bg-gradient-to-br from-red-500 to-red-600 text-white"
              icon={UserCircle}
              bgIcon={<UserCircle className="h-24 w-24" />}
            />
          </div>

          {/* Users Table */}
          <UserTable
            data={formattedUsers}
            onView={handleViewUser}
            onEdit={handleEditUser}
            onRestrict={handleRestrictClick}
            rightAction={
              <button
                onClick={() => setIsAddUserModalOpen(true)}
                className="btn-primary"
              >
                <UserPlus className="h-5 w-5" />
                Add New User
              </button>
            }
          />
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

      {/* Restrict User Modal */}
      <RestrictUser
        isOpen={isRestrictModalOpen}
        onClose={() => setIsRestrictModalOpen(false)}
        onConfirm={handleConfirmRestrict}
        user={selectedUser}
      />
    </div>
  );
};

export default AccountManagement;
