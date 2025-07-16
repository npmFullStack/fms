import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-5">Dashboard</h2>
      <p className="mb-4">Welcome to your dashboard!</p>
      <button 
        onClick={handleLogout}
        className="w-full bg-red-500 text-white p-2 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;