import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TrackOrder from "./pages/TrackOrder";
import Dashboard from "./pages/Dashboard";

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path={"/"} element={<Home />} />
                    <Route path={"/login"} element={<Login />} />
                    <Route path={"/register"} element={<Register />} />
                    <Route path={"/track-order"} element={<TrackOrder />} />
                    <Route path={"/dashboard"} element={<Dashboard />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;