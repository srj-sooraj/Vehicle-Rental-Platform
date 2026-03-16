import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Copy, CalendarClock, CreditCard, Ban, ShieldCheck, Clock, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

function MyBookings() {
const [bookings, setBookings] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
const token = localStorage.getItem("token");
fetch("http://localhost:5000/api/bookings/my", {
    headers: { Authorization: `Bearer ${token}` }
})
    .then(res => res.json())
    .then(data => {
        setBookings(data);
        setLoading(false);
    });
}, []);

async function cancelBooking(id) {
if (!window.confirm("Are you sure you want to cancel this booking?")) return;
const token = localStorage.getItem("token");

await fetch(`http://localhost:5000/api/bookings/cancel/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` }
});

setBookings(prev =>
    prev.map(b =>
        b._id === id ? { ...b, status: "cancelled" } : b
    )
);
}

if (loading) {
return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-purple-100 dark:from-gray-950 dark:via-gray-900 dark:to-black flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full shadow-lg" />
    </div>
);
}

return (
<div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-purple-100 dark:from-gray-950 dark:via-gray-900 dark:to-black text-gray-900 dark:text-gray-100 pt-28 pb-20 font-sans relative overflow-hidden">

{/* Background effects */}
<div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-400/10 dark:bg-blue-700/20 rounded-full blur-[120px] pointer-events-none -z-10" />
<div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-purple-400/10 dark:bg-purple-700/20 rounded-full blur-[150px] pointer-events-none -z-10" />

<div className="max-w-5xl mx-auto px-6 relative z-10">
<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
<h1 className="text-4xl md:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-2">My Bookings</h1>
<p className="text-gray-600 text-lg font-medium mb-12">Manage your active and past vehicle reservations securely.</p>
</motion.div>

{bookings.length === 0 ? (
<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 bg-white/70 dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 shadow-xl rounded-[3rem] backdrop-blur-xl">
<Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
<h2 className="text-2xl font-black text-gray-900 mb-2">No Active Bookings</h2>
<p className="text-gray-500 font-medium mb-8">Looks like you haven't booked any vehicles yet.</p>
<Link to="/vehicles" className="inline-block px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg hover:shadow-purple-500/30 font-bold hover:scale-105 transition-all text-white">
Explore Fleet
</Link>
</motion.div>
) : (
<div className="space-y-8">
{bookings.map((booking, idx) => {
const vehicle = booking.vehicle;
const isCancelled = booking.status === "cancelled";
const isActive = booking.status === "booked";

return (
<motion.div
initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: idx * 0.1 }}
key={booking._id}
className={`relative rounded-[2.5rem] overflow-hidden border backdrop-blur-xl shadow-xl transition-all duration-300 group
${
isCancelled
    ? 'bg-gray-50 dark:bg-gray-900/70 border-gray-200 dark:border-gray-800 opacity-80 filter grayscale hover:grayscale-0'
    : 'bg-white/80 dark:bg-gray-900/80 border-gray-200/80 dark:border-gray-800 hover:shadow-purple-500/20 hover:-translate-y-1'
}`}
>
<div className="flex flex-col md:flex-row p-6 md:p-8 gap-8 items-start md:items-stretch relative">

{/* Status Badge */}
<div className="absolute top-6 right-6 flex items-center gap-2">
    <span className={`px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase border shadow-sm
        ${isActive ? 'bg-green-100 border-green-200 text-green-700' : 'bg-red-100 border-red-200 text-red-700'}
    `}>
        {booking.status}
    </span>
</div>

{/* Car Image Placeholder or Real Image */}
<div className="w-full md:w-72 h-48 md:h-auto bg-gray-100 dark:bg-gray-800 rounded-3xl overflow-hidden flex-shrink-0 border border-gray-200 dark:border-gray-700 relative group-hover:shadow-inner transition-all">
    {vehicle?.images?.[0] ? (
        <img
            src={`http://localhost:5000/uploads/${vehicle.images[0]}`}
            alt={vehicle.name}
            className={`w-full h-full object-cover transition-transform duration-700 ${!isCancelled && 'group-hover:scale-110'}`}
        />
    ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 font-bold">
            No Image
        </div>
    )}
</div>

{/* Booking Details */}
<div className="flex-1 w-full space-y-6 flex flex-col justify-between py-2">

    <div>
        <h3 className="text-3xl font-black tracking-tight text-gray-900 mb-2 truncate">
            {vehicle?.name || "Vehicle Unavailable"}
        </h3>
        {vehicle?.city && <p className="text-gray-500 text-sm font-medium flex items-center gap-1.5"><MapPin className="w-4 h-4 text-purple-500" /> {vehicle.city}</p>}
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] gap-6 bg-white dark:bg-gray-950/60 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex flex-col gap-1.5">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold flex items-center gap-1"><CalendarClock className="w-3.5 h-3.5 text-purple-500" /> Rental Period</span>
            <span className="text-gray-800 font-bold text-sm">
                {new Date(booking.startDate).toLocaleDateString()}
                <span className="text-purple-400 mx-2">→</span>
                <br className="lg:hidden" />
                {new Date(booking.endDate).toLocaleDateString()}
            </span>
        </div>

        <div className="flex flex-col gap-1.5">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold flex items-center gap-1"><CreditCard className="w-3.5 h-3.5 text-blue-500" /> Total Payment</span>
            <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">₹{booking.totalPrice}</span>
        </div>

        <div className="flex flex-col gap-1.5">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-cyan-500" /> Payment Status</span>
            <span className={`text-sm font-bold uppercase ${booking.paymentStatus === 'paid' ? 'text-green-600' : 'text-amber-500'}`}>
                {booking.paymentStatus?.toUpperCase() || 'UNKNOWN'}
            </span>
        </div>

        <div className="flex flex-col gap-1.5">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold flex items-center gap-1"><Copy className="w-3.5 h-3.5 text-pink-500" /> Order ID</span>
            <span className="text-gray-600 dark:text-gray-300 font-mono text-xs font-bold bg-gray-50 dark:bg-gray-900 px-2 py-1 rounded inline-block w-max border border-gray-200 dark:border-gray-700">
                {booking._id?.slice(-8).toUpperCase()}
            </span>
        </div>
    </div>

    {/* Action Buttons */}
    {isActive && (
        <div className="pt-2 flex justify-end">
            <button
                onClick={() => cancelBooking(booking._id)}
                className="px-6 py-3 rounded-xl bg-red-100 border border-red-200 hover:bg-red-500 hover:text-white text-red-600 font-bold shadow-sm tracking-wide transition-all hover:shadow-lg flex items-center gap-2 text-sm uppercase"
            >
                <Ban className="w-4 h-4" /> Cancel Reservation
            </button>
        </div>
    )}
</div>

</div>
</motion.div>
);
})}
</div>
)}
</div>
</div>
);
}

export default MyBookings;