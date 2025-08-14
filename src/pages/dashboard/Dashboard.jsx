import useAuthStore from "../../utils/store/useAuthStore";

const Dashboard = () => {
    const { user } = useAuthStore();

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Welcome, {user?.email}!</h1>
            <p className="text-gray-700">GWAPO SI NORWAY!!!</p>
        </div>
    );
};

export default Dashboard;