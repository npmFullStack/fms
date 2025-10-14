import React from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../utils/store/useAuthStore";
import Loading from "../../components/Loading";

// Role-based dashboards
import McDashboard from "./mcDashboard";
import AfDashboard from "./afDashboard";
import GmDashboard from "./gmDashboard";

const Dashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  if (!user) return <Loading />;

  const renderDashboard = () => {
    switch (user.role) {
      case "marketing_coordinator":
        return <McDashboard />;
      case "admin_finance":
        return <AfDashboard />;
      case "general_manager":
        return <GmDashboard />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-gray-700">
            <h1 className="text-3xl font-semibold text-blue-600">Welcome!</h1>
            <p className="text-gray-500 mt-2">
              Your dashboard overview will appear here soon.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">
              Welcome back, {user?.first_name || user?.email || "User"} 👋🏻
            </p>
          </div>

          <div className="flex items-center gap-3">
            {user?.profile_picture ? (
              <img
                src={user.profile_picture}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border border-blue-200"
              />
            ) : (
              <div className="p-2 rounded-full bg-blue-100 border border-blue-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M5.121 17.804A4 4 0 019 16h6a4 4 0 013.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Role-specific dashboard */}
        {renderDashboard()}
      </div>
    </div>
  );
};

export default Dashboard;
