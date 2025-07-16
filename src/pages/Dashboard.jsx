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
                if (!token) {
                    navigate("/login");
                    return;
                }

                const response = await axios.get("/auth/me"); // You'll need to create this endpoint
                setUserData(response.data.user);
            } catch (error) {
                console.error("Error fetching user data:", error);
                localStorage.removeItem("token");
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
                    <div className="mb-4 p-4 bg-gray-100 rounded">
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
