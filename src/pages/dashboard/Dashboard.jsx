import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios";
import Loading from "../../components/Loading";
import useAuthStore from "../../utils/store/useAuthStore";

const Dashboard = () => {
    const navigate = useNavigate();
    const { user, loading, fetchUser } = useAuthStore();

    useEffect(() => {
        fetchUser(navigate);
    }, [fetchUser, navigate]);

    if (loading) return <Loading />;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Welcome, {user?.email}!</h1>

            <p className="text-gray-700">GWAPO SI NORWAY!!!</p>
        </div>
    );
};

export default Dashboard;
