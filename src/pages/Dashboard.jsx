import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "../config/axios";
import { useEffect, useState } from "react";

const Dashboard = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem("token");
            const storedUser = localStorage.getItem("user");
            
            // Immediately use stored user data if available
            if (storedUser) {
                setUserData(JSON.parse(storedUser));
            }

            // Still verify with backend
            if (token) {
                const response = await axios.get("/auth/me");
                setUserData(response.data.user);
                // Update localStorage with fresh data
                localStorage.setItem("user", JSON.stringify(response.data.user));
            } else {
                navigate("/login");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
        } finally {
            setLoading(false);
        }
    };

    fetchUserData();
}, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    if (loading) {
        return (
            <div className="max-w-md mx-auto mt-10">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto mt-10">
            <h2 className="text-2xl font-bold mb-5">Dashboard</h2>
            {userData && (
                <>
                    <p className="mb-2 text-green-600 font-semibold">
                        GWAPO SI NORWAY
                    </p>
                    <div className="mb-4 p-4 rounded">
                        <p className="font-medium">User Information:</p>
                        <p>
                            Username:{" "}
                            <span className="font-semibold">
                                {userData.username}
                            </span>
                        </p>
                        <p>
                            Email:{" "}
                            <span className="font-semibold">
                                {userData.email}
                            </span>
                        </p>
                    </div>
                </>
            )}
            <button
                onClick={handleLogout}
                className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 transition"
            >
                Logout
            </button>
        </div>
    );
};

export default Dashboard;
