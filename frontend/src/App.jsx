import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VehicleDetails from "./pages/VehicleDetals";
import MyBookings from "./pages/MyBookings";
import Navbar from "./components/Navbar";
import AdminDashboard from "./pages/AdminDashboard";
import AddVehicle from "./pages/AddVehicle";
import AIChat from "./pages/AIChats"
import EditVehicle from "./pages/EditVehicles";
import AdminBookings from "./pages/AdminBookings";
import AdminVehicles from "./pages/AdminVehicle";
import ProtectedAdmin from "./pages/ProtectAdmin";
import VerifyOtp from "./pages/VerifyOtp";
import Vehicles from "./pages/Vehicles";

function App() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-purple-100 
    dark:from-gray-900 dark:via-gray-800 dark:to-black 
    text-gray-900 dark:text-gray-100">

        <BrowserRouter>

            <Navbar />

            <Routes>

                <Route path="/" element={<Home />} />
                <Route path="/vehicles" element={<Vehicles />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword/>}/>
                <Route path="/reset-password" element={<ResetPassword/>}/>
                <Route path="/verify-otp" element={<VerifyOtp />} />
                <Route path="/vehicle/:id" element={<VehicleDetails />} />
                <Route path="/my-bookings" element={<MyBookings />} />
                <Route path="/ai-chat" element={<AIChat />} />
                <Route path="/admin/add-vehicle" element={<ProtectedAdmin><AddVehicle /></ProtectedAdmin>} />
                <Route path="/admin/edit/:id" element={<ProtectedAdmin><EditVehicle /></ProtectedAdmin>} />
                <Route path="/admin/bookings" element={<ProtectedAdmin><AdminBookings /></ProtectedAdmin>} />
                <Route path="/admin" element={<ProtectedAdmin> <AdminDashboard /> </ProtectedAdmin>} />
                <Route path="/admin/vehicles" element={<ProtectedAdmin><AdminVehicles /></ProtectedAdmin>} />

            </Routes>

        </BrowserRouter>

</div>
    )
}

export default App;