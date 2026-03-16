import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function AdminDashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const recentBookings = bookings.slice(0, 5);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:5000/api/vehicles")
      .then((res) => res.json())
      .then((data) => setVehicles(data));

    fetch("http://localhost:5000/api/bookings", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setBookings(data));
  }, []);

  const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-purple-100 dark:from-gray-950 dark:via-gray-900 dark:to-black text-gray-900 dark:text-gray-100 pt-28 pb-16 font-sans relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute -top-32 -left-10 w-[420px] h-[420px] bg-purple-400/15 dark:bg-purple-700/25 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-[520px] h-[520px] bg-blue-400/15 dark:bg-blue-700/25 blur-3xl rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="bg-white/80 dark:bg-gray-900/70 backdrop-blur-xl border border-gray-200/70 dark:border-gray-800 px-8 py-6 rounded-3xl shadow-lg shadow-purple-500/10 w-full">
            <p className="text-xs font-black tracking-[0.3em] uppercase text-purple-600 dark:text-purple-400 mb-2">
              Admin Control Center
            </p>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
              Dashboard Overview
            </h1>
            <p className="mt-3 text-sm md:text-base text-gray-600 dark:text-gray-400 font-medium">
              Monitor fleet, revenue and booking performance in real time.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              to="/admin/vehicles"
              className="inline-flex items-center justify-center px-5 py-3 rounded-2xl text-sm font-bold uppercase tracking-widest bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all"
            >
              Manage Vehicles
            </Link>
            <Link
              to="/admin/bookings"
              className="hidden md:inline-flex items-center justify-center px-5 py-3 rounded-2xl text-sm font-bold uppercase tracking-widest bg-white/80 dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 text-gray-800 dark:text-gray-100 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
              Manage Bookings
            </Link>
          </div>
        </header>

        {/* KPI Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/80 dark:border-gray-800 rounded-3xl p-6 shadow-md shadow-purple-500/10 flex flex-col justify-between">
            <p className="text-[11px] font-black tracking-[0.25em] uppercase text-gray-400 mb-2">
              Vehicles
            </p>
            <p className="text-3xl md:text-4xl font-black text-gray-900 dark:text-gray-50">
              {vehicles.length}
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Total active vehicles in your fleet
            </p>
          </div>

          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/80 dark:border-gray-800 rounded-3xl p-6 shadow-md shadow-purple-500/10 flex flex-col justify-between">
            <p className="text-[11px] font-black tracking-[0.25em] uppercase text-gray-400 mb-2">
              Bookings
            </p>
            <p className="text-3xl md:text-4xl font-black text-gray-900 dark:text-gray-50">
              {bookings.length}
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Total reservations recorded in the system
            </p>
          </div>

          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/80 dark:border-gray-800 rounded-3xl p-6 shadow-md shadow-purple-500/10 flex flex-col justify-between lg:col-span-2">
            <p className="text-[11px] font-black tracking-[0.25em] uppercase text-gray-400 mb-2">
              Total Revenue
            </p>
            <p className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-lime-400">
              ₹{totalRevenue}
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Gross revenue from all confirmed bookings
            </p>
          </div>
        </section>

        {/* Recent Bookings + Quick Actions */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Recent bookings list */}
          <div className="lg:col-span-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/80 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-xl shadow-purple-500/10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[11px] font-black tracking-[0.3em] uppercase text-purple-500 mb-1">
                  Activity
                </p>
                <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-gray-50">
                  Recent Bookings
                </h2>
              </div>
              <Link
                to="/admin/bookings"
                className="text-xs font-bold uppercase tracking-[0.25em] text-purple-600 dark:text-purple-400 hover:underline"
              >
                View All
              </Link>
            </div>

            {recentBookings.length === 0 ? (
              <div className="h-40 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
                No bookings yet. Once customers start reserving, their activity
                will show up here.
              </div>
            ) : (
              <ul className="space-y-4">
                {recentBookings.map((b) => (
                  <li
                    key={b._id}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 px-4 py-3 shadow-sm"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                        {b.vehicle?.name || "Vehicle"}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {b.user?.name || "Customer"} •{" "}
                        {new Date(b.startDate).toLocaleDateString()} -{" "}
                        {new Date(b.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-black text-emerald-600 dark:text-emerald-400">
                        ₹{b.totalPrice}
                      </p>
                      <p className="text-[11px] uppercase tracking-[0.2em] font-black text-gray-400">
                        {b.status || "booked"}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Quick admin shortcuts */}
          <div className="space-y-4">
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/80 dark:border-gray-800 rounded-3xl p-6 shadow-md shadow-purple-500/10">
              <h3 className="text-lg font-black text-gray-900 dark:text-gray-50 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link
                  to="/admin/add-vehicle"
                  className="block w-full px-4 py-3 rounded-2xl text-sm font-bold text-left bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-md hover:shadow-purple-500/40 hover:scale-105 transition-all"
                >
                  + Add New Vehicle
                </Link>
                <Link
                  to="/admin/vehicles"
                  className="block w-full px-4 py-3 rounded-2xl text-sm font-semibold text-gray-800 dark:text-gray-100 bg-gray-50/80 dark:bg-gray-800/80 border border-gray-200/80 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                >
                  View Fleet Inventory
                </Link>
                <Link
                  to="/admin/bookings"
                  className="block w-full px-4 py-3 rounded-2xl text-sm font-semibold text-gray-800 dark:text-gray-100 bg-gray-50/80 dark:bg-gray-800/80 border border-gray-200/80 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                >
                  Booking Management
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminDashboard;