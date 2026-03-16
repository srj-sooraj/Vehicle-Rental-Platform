import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, MapPin, SlidersHorizontal, ChevronRight, Fuel, Users } from "lucide-react";
import { motion } from "framer-motion";

function Vehicles() {
    const [vehicles, setVehicles] = useState([]);
    const [search, setSearch] = useState("");
    const [type, setType] = useState("");
    const [loading, setLoading] = useState(true);
    const [city, setCity] = useState("");
    const [searchParams] = useSearchParams();

    useEffect(() => {
        // Pre-fill query passed from Home hero search
        const qCity = searchParams.get('location');
        const qType = searchParams.get('type');
        if (qCity) setCity(qCity);
        if (qType) setType(qType);

        fetch("http://localhost:5000/api/vehicles")
            .then(res => res.json())
            .then(data => {
                setVehicles(data);
                setLoading(false);
            });
    }, [searchParams]);

    const filteredVehicles = vehicles.filter(v => {
        return (
            v.name.toLowerCase().includes(search.toLowerCase()) &&
            (type ? v.type === type : true) &&
            (city ? v.city?.toLowerCase().includes(city.toLowerCase()) : true)
        );
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-purple-100 flex items-center justify-center">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full shadow-lg" />
            </div>
        );
    }

    return (
        <div className="min-h-[100vh] 
        bg-gradient-to-br 
        from-white via-blue-50 to-purple-100 
        dark:from-gray-950 dark:via-gray-900 dark:to-black
        text-gray-900 dark:text-gray-100 
        pt-28 pb-20 font-sans relative">
            {/* Background decorative blobs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-400/10 rounded-full blur-3xl pointer-events-none -z-10" />

            <div className="max-w-7xl mx-auto px-6 z-10 relative">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
                >
                    <div className="bg-white/50 dark:bg-gray-900/70 backdrop-blur-md px-8 py-6 rounded-3xl border border-white/60 dark:border-gray-700 shadow-lg inline-block w-full">
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-2">
                            Fleet Catalog
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">Select your next high-performance machine from our premium collection.</p>
                    </div>

                    <Link to="/ai-chat" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold shadow-lg hover:shadow-purple-500/30 hover:scale-105 transition-all w-max flex-shrink-0">
                        <ZapIcon className="w-5 h-5" /> Try AI Vehicle Finder
                    </Link>
                </motion.div>

                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                    className="p-4 rounded-3xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg border border-gray-200 dark:border-gray-700 mb-12 flex flex-col md:flex-row gap-4 shadow-xl"    >
                    <div className="flex-1 relative">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search by name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-white/50 border border-gray-200 rounded-2xl py-4 pl-14 pr-4 text-gray-800 font-medium shadow-sm focus:outline-none focus:border-purple-500 focus:bg-white transition-all"
                        />
                    </div>

                    <div className="flex-1 relative">
                        <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Enter city..."
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full bg-white/50 border border-gray-200 rounded-2xl py-4 pl-14 pr-4 text-gray-800 font-medium shadow-sm focus:outline-none focus:border-purple-500 focus:bg-white transition-all"
                        />
                    </div>

                    <div className="w-full md:w-64 relative">
                        <SlidersHorizontal className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full bg-white/50 border border-gray-200 rounded-2xl py-4 pl-14 pr-4 text-gray-800 font-medium shadow-sm focus:outline-none focus:border-purple-500 focus:bg-white transition-all appearance-none cursor-pointer"
                        >
                            <option value="">All Types</option>
                            <option value="car">Car</option>
                            <option value="bike">Bike</option>
                            <option value="suv">SUV</option>
                            <option value="van">Van</option>
                        </select>
                    </div>
                </motion.div>

                {/* Grid */}
                {filteredVehicles.length === 0 ? (
                    <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg border border-gray-200 dark:border-gray-700 p-16 rounded-3xl text-center shadow-lg">                        <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">No Vehicles Found</h3>
                        <p className="text-gray-500 font-medium">Try adjusting your filters to find what you're looking for.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredVehicles.map((v, idx) => {
                            const image = v.images?.[0];
                            return (
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                                    key={v._id}
                                    className="h-full"
                                >
                                    <Link to={`/vehicle/${v._id}`} className="block h-full cursor-pointer">
                                            <div className="h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border border-gray-200 dark:border-gray-700 rounded-[2rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col group hover:-translate-y-2">
                                            <div className="h-60 w-full relative overflow-hidden bg-gray-100">
                                                <img
                                                    src={`http://localhost:5000/uploads/${image}`}
                                                    alt={v.name}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur border border-white px-3 py-1.5 rounded-full text-xs font-bold text-gray-800 uppercase shadow-sm">
                                                    {v.type}
                                                </div>
                                            </div>

                                            <div className="p-8 flex flex-col flex-1">
                                                <h3 className="text-2xl font-bold text-gray-900 mb-2 truncate group-hover:text-purple-600 transition-colors">{v.name}</h3>
                                                {v.city && <p className="text-gray-500 text-sm font-medium mb-4 flex items-center gap-1.5"><MapPin className="w-4 h-4 text-purple-500" /> {v.city}</p>}

                                                <div className="flex gap-4 border-y border-gray-100 py-4 mb-6">
                                                    <div className="flex-1 flex gap-2 items-center text-gray-600 font-medium text-sm">
                                                        <Fuel className="w-4 h-4" /> {v.fuelType || 'Petrol'}
                                                    </div>
                                                    <div className="w-px bg-gray-200" />
                                                    <div className="flex-1 flex gap-2 items-center text-gray-600 font-medium text-sm">
                                                        <Users className="w-4 h-4" /> {v.seats || '4'} Seats
                                                    </div>
                                                </div>

                                                <div className="mt-auto flex items-end justify-between">
                                                    <div>
                                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Daily Rate</span>
                                                        <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">₹{v.pricePerDay}</p>
                                                    </div>
                                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-50 to-blue-50 border border-gray-200 flex items-center justify-center group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-blue-500 group-hover:text-white group-hover:border-transparent transition-all shadow-sm">
                                                        <ChevronRight className="w-6 h-6" />
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

// Helper icon
function ZapIcon(props) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
    )
}

export default Vehicles;
