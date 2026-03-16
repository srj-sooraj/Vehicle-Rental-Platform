import { Link, useNavigate } from "react-router-dom";
import { User, LogOut, ShieldAlert, Car, MessageSquare, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "../components/ThemeToggle.jsx";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between backdrop-blur-lg bg-white/70 border-b border-gray-200 shadow-sm transition-all duration-300">

      {/* Brand */}
      <Link to="/" className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 tracking-tighter hover:scale-105 transition-transform">
        RideHub
      </Link>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center space-x-8 text-sm font-semibold">
        <Link to="/vehicles" className="text-gray-700 hover:text-purple-600 transition-colors flex items-center gap-2">
          Vehicles
        </Link>

        {user && (
          <Link to="/my-bookings" className="text-gray-700 hover:text-purple-600 transition-colors">
            My Bookings
          </Link>
        )}

        {user?.role === "admin" && (
          <Link to="/admin" className="text-orange-600 hover:text-orange-500 transition-colors flex items-center gap-2">
            <ShieldAlert size={16} /> Admin Dashboard
          </Link>
        )}

        <Link to="/ai-chat" className="text-gray-700 hover:text-purple-600 transition-colors flex items-center gap-2">
          AI Assistant
        </Link>
      </div>

      {/* Auth Section Desktop */}
      <div className="hidden md:flex items-center space-x-4 text-sm font-semibold">

  <ThemeToggle />

  {!user ? (
          <>
            <Link to="/login" className="text-gray-700 hover:text-purple-600 transition-colors">
              Login
            </Link>
            <Link to="/register" className="px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hover:scale-105 text-white shadow-md transition-all">
              Register
            </Link>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
              <User size={16} className="text-purple-500" /> {user.name}
            </span>
            <button
              onClick={handleLogout}
              className="p-2 rounded-full bg-red-50 hover:bg-red-100 text-red-500 border border-red-200 transition-all flex items-center justify-center"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden p-2 text-gray-700 hover:text-purple-600"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-200 flex flex-col p-6 space-y-4 md:hidden shadow-xl"
          >
            <Link to="/vehicles" className="text-gray-700 hover:text-purple-600 font-semibold transition-colors flex items-center gap-2 text-lg">
              Vehicles
            </Link>
            {user && (
              <Link to="/my-bookings" className="text-gray-700 hover:text-purple-600 font-semibold transition-colors text-lg">
                My Bookings
              </Link>
            )}
            {user?.role === "admin" && (
              <Link to="/admin" className="text-orange-600 hover:text-orange-500 font-semibold transition-colors flex items-center gap-2 text-lg">
                <ShieldAlert size={18} /> Admin Dashboard
              </Link>
            )}
            <Link to="/ai-chat" className="text-gray-700 hover:text-purple-600 font-semibold transition-colors flex items-center gap-2 text-lg">
              AI Assistant
            </Link>

            <div className="flex justify-start">
            <ThemeToggle />
          </div>

            <hr className="border-gray-200 my-4" />

            {!user ? (
              <div className="flex flex-col gap-4">
                <Link to="/login" className="text-gray-700 hover:text-purple-600 font-semibold transition-colors text-lg">
                  Login
                </Link>
                <Link to="/register" className="px-4 py-3 text-center rounded-xl font-semibold bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md">
                  Register
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <span className="flex items-center gap-2 text-gray-700 text-lg font-semibold border-b border-gray-100 pb-2">
                  <User size={18} className="text-purple-500" /> {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-3 rounded-xl bg-red-50 text-red-500 border border-red-200 font-semibold text-left transition-all flex items-center justify-center gap-2 hover:bg-red-100"
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </nav>
  );
}

export default Navbar;