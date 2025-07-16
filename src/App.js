import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import TrackOrder from "./pages/TrackOrder";

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path={"/"} element={<Home />} />
                    <Route path={"/login"} element={<Login />} />
                    <Route path={"/track-order"} element={<TrackOrder />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
