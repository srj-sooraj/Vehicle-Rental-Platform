import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar as CalendarIcon, ShieldCheck, CheckCircle2, AlertCircle, Fuel, Users, Settings } from "lucide-react";

function VehicleDetails() {
    const { id } = useParams();
    const [vehicle, setVehicle] = useState(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [date, setDate] = useState(new Date());
    const [phone, setPhone] = useState("");
    const [license, setLicense] = useState("");
    const [licenseFile, setLicenseFile] = useState(null);
    const [bookedDates, setBookedDates] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [message, setMessage] = useState("");
    const [agree, setAgree] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:5000/api/vehicles/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data && data._id) {
                    setVehicle(data);
                } else {
                    setVehicle({ error: true });
                }
            })
            .catch(() => setVehicle({ error: true }));

        fetch(`http://localhost:5000/api/bookings/vehicle/${id}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setBookedDates(data);
                } else {
                    setBookedDates([]);
                }
            })
            .catch(() => setBookedDates([]));
    }, [id]);

    useEffect(() => {
        if (startDate && endDate && vehicle) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

            if (days > 0) {
                setTotalPrice(days * vehicle.pricePerDay);
            }
        }
    }, [startDate, endDate, vehicle]);

    if (vehicle === null) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-purple-100 flex items-center justify-center">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    if (vehicle?.error || !vehicle?.name) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-purple-100 flex items-center justify-center text-gray-800 flex-col gap-4">
                <AlertCircle className="w-16 h-16 text-red-500" />
                <h2 className="text-3xl font-black">Vehicle Not Found</h2>
                <p className="text-gray-500 font-medium">The vehicle you are looking for does not exist or has been removed.</p>
            </div>
        );
    }

    function isDateBooked(date) {
        if (!Array.isArray(bookedDates)) return false;
        return bookedDates.some(function (booking) {
            const start = new Date(booking.startDate);
            const end = new Date(booking.endDate);
            return date >= start && date <= end;
        });
    }

    function isSelectedRangeBooked() {
        if (!startDate || !endDate) return false;
        return bookedDates.some(function (b) {
            const start = new Date(b.startDate);
            const end = new Date(b.endDate);
            return (
                new Date(startDate) <= end &&
                new Date(endDate) >= start
            );
        });
    }

    async function uploadLicense() {
        if (!licenseFile) return alert("Please select a file first");
        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("license", licenseFile);

        await fetch("http://localhost:5000/api/auth/upload-license", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData
        });

        alert("License uploaded successfully!");
    }

    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            const booked = isDateBooked(date);
            return booked
                ? "bg-red-100 text-red-500 rounded-full font-bold opacity-80 cursor-not-allowed line-through relative z-10"
                : "hover:bg-purple-100 hover:text-purple-700 rounded-full transition-colors font-semibold text-gray-700 relative z-10";
        }
    };

    const handlePayment = async () => {
        const token = localStorage.getItem("token");
        if (!startDate || !endDate) {
            alert("Please select dates");
            return;
        }

        if (!phone || !license) {
            alert("Please enter phone and license details");
            return;
        }

        try {
            const orderRes = await fetch("http://localhost:5000/api/payment/create-order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ amount: totalPrice })
            });

            const order = await orderRes.json();
            const options = {
                key: "rzp_test_SNqAlbJufxoBmT",
                amount: order.amount,
                currency: "INR",
                order_id: order.id,
                name: "RideHub",
                description: "Premium Vehicle Booking",
                theme: { color: '#7c3aed' },
                handler: async function (response) {
                    await fetch("http://localhost:5000/api/payment/verify", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify(response)
                    });

                    const res = await fetch("http://localhost:5000/api/bookings", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            vehicleId: id,
                            startDate,
                            endDate,
                            customerPhone: phone,
                            customerLicense: license
                        })
                    });

                    const data = await res.json();

                    if (res.ok) {
                        setMessage("Booking confirmed successfully. Thank you for choosing RideHub.");
                    } else {
                        setMessage(data.message || "Booking failed");
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error('Payment Error:', error);
            setMessage("Error initiating payment.");
        }
    };

    const mainImage = vehicle.images?.[0];

    // Minimal custom styling for react-calendar light mode
    const calendarStyles = `
        .react-calendar { font-family: inherit; border: none; background: transparent; width: 100%; border-radius: 1rem; }
        .react-calendar__navigation button { color: #374151; min-width: 44px; background: none; font-size: 16px; margin-top: 8px; font-weight: bold; }
        .react-calendar__navigation button:disabled { background-color: transparent; opacity: 0.5; }
        .react-calendar__navigation button:enabled:hover, .react-calendar__navigation button:enabled:focus { background-color: rgba(0,0,0,0.05); border-radius: 8px;}
        .react-calendar__month-view__weekdays { text-transform: uppercase; font-weight: 800; font-size: 0.75em; color: #9ca3af; margin-bottom: 8px;}
        .react-calendar__month-view__days__day--weekend { color: #f43f5e; }
        .react-calendar__tile { color: #4b5563; padding: 12px 6px; font-weight: 600;}
        .react-calendar__tile:disabled { color: #d1d5db !important; background-color: transparent !important; text-decoration: none;}
        .react-calendar__tile--now { background: #f3e8ff; border-radius: 50%; color: #7c3aed;}
        .react-calendar__tile--now:enabled:hover, .react-calendar__tile--now:enabled:focus { background: #e9d5ff; }
        .react-calendar__tile--active { background: #7c3aed !important; color: white !important; border-radius: 50%; box-shadow: 0 4px 10px rgba(124, 58, 237, 0.3);}
    `;

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-purple-100 dark:from-gray-950 dark:via-gray-900 dark:to-black text-gray-900 dark:text-gray-100 pt-28 pb-20 font-sans relative">
            <style>{calendarStyles}</style>

            <div className="max-w-7xl mx-auto px-6 relative z-10 mb-12">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-10">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-4">
                        {vehicle.name?.toUpperCase() || "VEHICLE DETAILS"}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-gray-600">
                        <span className="px-4 py-1.5 rounded-full bg-white shadow-sm border border-gray-200 text-sm font-bold shadow-gray-200 uppercase">{vehicle.brand || 'Brand'}</span>
                        <span className="px-4 py-1.5 rounded-full bg-white shadow-sm border border-gray-200 text-sm font-bold shadow-gray-200 uppercase">{vehicle.type || 'Type'}</span>
                        {vehicle.city && <span className="flex items-center gap-1.5 text-sm font-bold px-4 py-1.5 rounded-full bg-white shadow-sm border border-gray-200 shadow-gray-200"><MapPin className="w-4 h-4 text-purple-500" /> {vehicle.city}</span>}
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* Left Column: Images & Info */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="lg:col-span-2 space-y-10">

                        {/* Main Image */}
                        <div className="w-full h-[500px] md:h-[600px] rounded-[3rem] overflow-hidden relative group shadow-2xl shadow-blue-900/10 border border-white/50 bg-white">
                            <img
                                src={`http://localhost:5000/uploads/${mainImage}`}
                                alt={vehicle.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                            <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-lg border border-white">
                                <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                                    ₹{vehicle.pricePerDay} <span className="text-lg text-gray-500 font-bold">/ day</span>
                                </p>
                            </div>
                        </div>

                        {/* Thumbnails */}
                        {vehicle.images && vehicle.images.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar px-2">
                                {vehicle.images.slice(1).map((img, i) => (
                                    <div key={i} className="flex-shrink-0 w-48 h-32 rounded-2xl overflow-hidden relative cursor-pointer border-2 border-transparent hover:border-purple-400 transition-all shadow-md group bg-white">
                                        <img
                                            src={`http://localhost:5000/uploads/${img}`}
                                            alt={`${vehicle.name} thumbnail ${i}`}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Description & Specs */}
                        <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-gray-200 dark:border-gray-700 p-10 rounded-[3rem] shadow-xl shadow-gray-200/50">
                            <div className="flex justify-around items-center mb-10 pb-10 border-b border-gray-200">
                                <div className="text-center">
                                    <Fuel className="w-8 h-8 mx-auto text-blue-500 mb-2" />
                                    <span className="block text-sm text-gray-400 font-bold uppercase mb-1">Fuel</span>
                                    <span className="text-lg font-black text-gray-800">{vehicle.fuelType || 'Petrol'}</span>
                                </div>
                                <div className="w-px h-16 bg-gray-200"></div>
                                <div className="text-center">
                                    <Users className="w-8 h-8 mx-auto text-purple-500 mb-2" />
                                    <span className="block text-sm text-gray-400 font-bold uppercase mb-1">Seats</span>
                                    <span className="text-lg font-black text-gray-800">{vehicle.seats || '4'}</span>
                                </div>
                                <div className="w-px h-16 bg-gray-200"></div>
                                <div className="text-center">
                                    <Settings className="w-8 h-8 mx-auto text-cyan-500 mb-2" />
                                    <span className="block text-sm text-gray-400 font-bold uppercase mb-1">Trans</span>
                                    <span className="text-lg font-black text-gray-800 uppercase">{vehicle.transmission || 'Auto'}</span>
                                </div>
                            </div>

                            <h3 className="text-3xl font-black mb-4 text-gray-900">About this vehicle</h3>
                            <p className="text-gray-600 leading-relaxed text-lg font-medium">{vehicle.description}</p>
                        </div>

                    </motion.div>

                    {/* Right Column: Booking Panel */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="space-y-6">

<div className="sticky top-28 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-gray-200 dark:border-gray-700 p-8 rounded-[3rem] shadow-2xl shadow-purple-900/5">
                            <h3 className="text-2xl font-black mb-6 flex items-center gap-3 text-gray-900"><CalendarIcon className="w-6 h-6 text-purple-600" /> Reserve Dates</h3>

                            {/* Calendar */}
                            <div className="bg-white rounded-3xl p-4 mb-6 shadow-sm border border-gray-100">
                                <Calendar
                                    onChange={setDate}
                                    value={date}
                                    tileDisabled={({ date }) => {
                                        const today = new Date();
                                        today.setHours(0, 0, 0, 0);
                                        if (date < today) return true;
                                        return isDateBooked(date);
                                    }}
                                    tileClassName={tileClassName}
                                    className="w-full"
                                />
                            </div>

                            {/* Date Inputs */}
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-white rounded-2xl border border-gray-200 p-2 shadow-sm focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-400/20 transition-all">
                                    <label className="block text-[10px] text-gray-400 pl-3 pt-1 uppercase tracking-widest font-black">Start Date</label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full bg-transparent border-none px-3 pb-1 pt-0 focus:outline-none text-gray-800 font-bold text-sm"
                                    />
                                </div>
                                <div className="bg-white rounded-2xl border border-gray-200 p-2 shadow-sm focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-400/20 transition-all">
                                    <label className="block text-[10px] text-gray-400 pl-3 pt-1 uppercase tracking-widest font-black">End Date</label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        min={startDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full bg-transparent border-none px-3 pb-1 pt-0 focus:outline-none text-gray-800 font-bold text-sm"
                                    />
                                </div>
                            </div>

                            <hr className="border-gray-200 my-8" />

                            {/* User Details */}
                            <h3 className="text-2xl font-black mb-6 flex items-center gap-3 text-gray-900"><ShieldCheck className="w-6 h-6 text-purple-600" /> Verification</h3>

                            <div className="space-y-4 mb-8">
                                <input
                                    placeholder="Phone Number"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all font-medium text-gray-800 shadow-sm"
                                />
                                <input
                                    placeholder="Driving License Number"
                                    value={license}
                                    onChange={(e) => setLicense(e.target.value)}
                                    className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all font-medium text-gray-800 shadow-sm uppercase"
                                />

                                <div className="flex gap-2">
                                    <input
                                        type="file"
                                        id="license-upload"
                                        className="hidden"
                                        onChange={(e) => setLicenseFile(e.target.files[0])}
                                    />
                                    <label htmlFor="license-upload" className="flex-1 bg-gray-50 border border-gray-200 border-dashed rounded-2xl px-4 py-4 text-center cursor-pointer hover:bg-gray-100 transition-colors text-gray-500 font-bold text-sm shadow-inner">
                                        {licenseFile ? licenseFile.name : "Choose License File"}
                                    </label>
                                    <button
                                        onClick={uploadLicense}
                                        className="px-6 py-4 rounded-2xl bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 hover:scale-105 font-bold tracking-wide transition-all border border-purple-200"
                                    >
                                        Upload
                                    </button>
                                </div>
                            </div>

                            <label className="flex items-start gap-4 cursor-pointer mb-8 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-gray-200 transition-all">
                                <input
                                    type="checkbox"
                                    checked={agree}
                                    onChange={(e) => setAgree(e.target.checked)}
                                    className="mt-1 w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-600"
                                />
                                <span className="text-sm font-medium text-gray-600">I agree to the <span className="text-purple-600 font-bold">100% Refund Policy</span> if cancelled within 24h of pickup.</span>
                            </label>

                            {/* Total & Action */}
<div className="flex items-center justify-between mb-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">                                <span className="text-gray-500 font-bold uppercase tracking-widest text-sm">Total Due</span>
                                <span className="text-4xl font-black text-gray-900 dark:text-gray-100">₹{totalPrice}</span>
                            </div>

                            <button
                                onClick={handlePayment}
                                disabled={!startDate || !endDate || isSelectedRangeBooked() || !agree}
                                className="w-full py-5 rounded-2xl font-black tracking-widest uppercase transition-all flex items-center justify-center gap-3 group
                                disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none
                                shadow-xl shadow-purple-500/30 hover:scale-105 hover:shadow-purple-500/50 bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                            >
                                {isSelectedRangeBooked() ? 'Dates Unavailable' : 'Confirm & Pay'}
                            </button>

                            {/* Messages */}
                            <AnimatePresence>
                                {message && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                                        className={`mt-6 p-4 rounded-2xl flex items-center gap-3 font-bold shadow-md ${message.includes("success") ? 'bg-green-100 border border-green-200 text-green-700' : 'bg-red-100 border border-red-200 text-red-700'}`}
                                    >
                                        {message.includes("success") ? <CheckCircle2 className="w-6 h-6 flex-shrink-0" /> : <AlertCircle className="w-6 h-6 flex-shrink-0" />}
                                        <p className="text-sm">{message}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                        </div>
                    </motion.div>

                </div>
            </div>
            <style>{`.custom-scrollbar::-webkit-scrollbar { height: 8px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; } .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.2); }`}</style>
        </div>
    );
}

export default VehicleDetails;