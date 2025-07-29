import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/axios";
import Loading from "../components/Loading";

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get("/auth/profile");
                setUser(res.data.user);
            } catch (error) {
                console.log("Not authorized", error.response?.data?.message);
                navigate("/login");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [navigate]);

    if (loading) return <Loading />;

    return (
        <div>
<h1 className="text-2xl font-bold mb-4">Welcome, {user?.username}!</h1>

            <p className="text-gray-700">GWAPO SI NORWAY!!!</p>
        </div>
    );
};

export default Dashboard;
