import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows, useGLTF } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Search, Car, Bike, Truck, ShieldCheck, CreditCard, Wand2, ArrowRight, Zap, CheckCircle2, ChevronRight, Settings } from 'lucide-react';
import * as THREE from 'three';

// Pre-load the car model
useGLTF.preload('/ferrari.glb');

// Basic auto-rotating 3D car model
const RotatingCar = () => {
    const { scene } = useGLTF('/ferrari.glb');
    const group = React.useRef();

    useFrame((state, delta) => {
        if (group.current) {
            group.current.rotation.y += delta * 0.2; // slow rotation
        }
    });

React.useEffect(() => {
  scene.traverse((node) => {
    if (node.isMesh && node.material) {

      const name = node.material.name.toLowerCase();
      const mat = node.material.clone();

      // BODY - GLOSSY RED
      if (name.includes("body") || name.includes("paint")) {
        mat.color = new THREE.Color("#d90429");
        mat.metalness = 0.9;
        mat.roughness = 0.05;
        mat.clearcoat = 1;
        mat.clearcoatRoughness = 0.05;
      }

      // SEATS - BLACK
      if (name.includes("seat")) {
        mat.color = new THREE.Color("#050505");
        mat.roughness = 0.7;
      }

      // INTERIOR PANELS - RED
      if (name.includes("interior") || name.includes("dashboard")) {
        mat.color = new THREE.Color("#8b0000");
      }

      // STEERING - BLACK
      if (name.includes("steering")) {
        mat.color = new THREE.Color("#111111");
      }

      node.material = mat;
    }
  });
}, [scene]);
    return (
        <group ref={group} position={[0, -0.8, 0]}>
            <primitive object={scene} scale={1.8} />
        </group>
    );
};

export default function Home() {
    const navigate = useNavigate();
    const [vehicles, setVehicles] = useState([]);

    // Search form states
    const [pickupLocation, setPickupLocation] = useState("");
    const [pickupDate, setPickupDate] = useState("");
    const [returnDate, setReturnDate] = useState("");

    useEffect(() => {
        fetch("http://localhost:5000/api/vehicles")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    // Just take top 3 for popular section
                    setVehicles(data.slice(0, 3));
                }
            })
            .catch(err => console.error("Error fetching vehicles", err));
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        // Passing data via state or query params to Vehicles page
        navigate(`/vehicles?location=${pickupLocation}`);
    };

    return (
            <div className="min-h-screen 
                bg-gradient-to-br 
                from-white via-blue-50 to-purple-100
                dark:from-gray-950 dark:via-gray-900 dark:to-black">
            {/* 1. HERO SECTION */}
            <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left: Text & Search UI */}
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="z-10 relative">
                        <span className="inline-block py-1 px-3 rounded-full bg-purple-100 text-purple-700 font-bold text-sm mb-4 border border-purple-200 shadow-sm">
                            #1 Premium Vehicle Rental
                        </span>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-gray-900 mb-6 leading-tight">
                            Find Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Perfect Ride</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-lg leading-relaxed font-medium">
                            Rent Cars, Bikes, SUVs and More — Anytime, Anywhere. Experience luxury at your fingertips.
                        </p>

                        {/* Search Bar UI (Glassmorphism) */}
                        <form onSubmit={handleSearch} className="bg-white/70 backdrop-blur-xl border border-gray-200 rounded-3xl p-4 shadow-xl flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2 mb-1 block">Pick-up Location</label>
                                <input type="text" placeholder="City or Airport" value={pickupLocation} onChange={e => setPickupLocation(e.target.value)} className="w-full bg-transparent border-b border-gray-300 py-2 px-2 text-gray-800 focus:outline-none focus:border-purple-600 font-medium" />
                            </div>
                            <div className="flex-1 relative">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2 mb-1 block">Pick-up Date</label>
                                <input type="date" value={pickupDate} onChange={e => setPickupDate(e.target.value)} className="w-full bg-transparent border-b border-gray-300 py-2 px-2 text-gray-800 focus:outline-none focus:border-purple-600 font-medium" />
                            </div>
                            <div className="flex-1 relative">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2 mb-1 block">Return Date</label>
                                <input type="date" value={returnDate} onChange={e => setReturnDate(e.target.value)} className="w-full bg-transparent border-b border-gray-300 py-2 px-2 text-gray-800 focus:outline-none focus:border-purple-600 font-medium" />
                            </div>
                            <button type="submit" className="md:w-auto w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl px-8 py-4 font-bold shadow-lg hover:shadow-purple-500/30 hover:scale-105 transition-all flex items-center justify-center h-full self-end mt-2 md:mt-0">
                                <Search size={20} />
                            </button>
                        </form>
                    </motion.div>

                    {/* Right: 3D Canvas */}
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="h-[400px] md:h-[600px] w-full relative z-0">
                        {/* Decorative background blob */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-gradient-to-tr from-purple-400/20 to-blue-400/20 rounded-full blur-3xl -z-10" />

                        <Canvas camera={{ position: [0, 1.5, 6], fov: 45 }}>
                            <Environment preset="studio" />
                            <ambientLight intensity={1.5} />
                            <directionalLight position={[10, 10, 5]} intensity={2} castShadow />

                            <RotatingCar />

                            <ContactShadows resolution={1024} scale={15} blur={1.5} opacity={0.6} far={10} color="#000000" position={[0, -0.8, 0]} />
                        </Canvas>
                    </motion.div>

                </div>
            </section>

            {/* 2. CATEGORIES */}
            <section className="py-20 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">Browse by Category</h2>
                    <p className="text-gray-600 mt-4 font-medium text-lg">We have the perfect vehicle for every journey.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { title: "Cars", desc: "Economy to Premium", icon: Car, color: "text-blue-500", bg: "bg-blue-100", route: "/vehicles?type=car" },
                        { title: "Bikes", desc: "Cruisers & Sports", icon: Bike, color: "text-orange-500", bg: "bg-orange-100", route: "/vehicles?type=bike" },
                        { title: "SUVs", desc: "For Family Trips", icon: Truck, color: "text-purple-500", bg: "bg-purple-100", route: "/vehicles?type=suv" },
                        { title: "Vans", desc: "Group Travel", icon: Settings, color: "text-green-500", bg: "bg-green-100", route: "/vehicles?type=van" },
                    ].map((cat, i) => (
                        <Link to={cat.route} key={i}>
                            <motion.div whileHover={{ y: -10 }} className="bg-white/70 backdrop-blur-lg border border-gray-200 rounded-3xl p-8 cursor-pointer shadow-xl shadow-gray-200/50 text-center transition-all">
                                <div className={`w-20 h-20 ${cat.bg} rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm`}>
                                    <cat.icon size={36} className={cat.color} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">{cat.title}</h3>
                                <p className="text-gray-500 font-medium">{cat.desc}</p>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* 3. POPULAR VEHICLES */}
            <section className="py-20 px-6 max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">Popular Vehicles</h2>
                        <p className="text-gray-600 mt-4 font-medium text-lg">Top rented vehicles this week.</p>
                    </div>
                    <Link to="/vehicles" className="hidden md:flex items-center gap-2 text-purple-600 font-bold hover:text-purple-700 transition-colors">
                        View All Fleet <ArrowRight size={20} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {vehicles.length === 0 ? (
                        <div className="col-span-3 text-center text-gray-500 font-medium py-10">Loading featured fleet...</div>
                    ) : (
                        vehicles.map((v) => (
                            <motion.div whileHover={{ scale: 1.02 }} key={v._id} className="bg-white/80 backdrop-blur-lg border border-gray-200 rounded-[2rem] overflow-hidden shadow-xl shadow-gray-200/50 flex flex-col group">
                                <div className="h-60 relative overflow-hidden bg-gray-100">
                                    <img src={`http://localhost:5000/uploads/${v.images?.[0]}`} alt={v.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-800 border border-gray-200 shadow-sm uppercase">
                                        {v.type}
                                    </div>
                                </div>
                                <div className="p-8 flex flex-col flex-1">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{v.name}</h3>
                                    <p className="text-gray-500 text-sm font-medium mb-4">{v.brand} • {v.city || 'Anywhere'}</p>

                                    <div className="flex items-center gap-4 border-y border-gray-100 py-4 mb-6">
                                        <div className="flex-1 text-center border-r border-gray-100">
                                            <span className="block text-xs text-gray-400 font-bold uppercase mb-1">Fuel</span>
                                            <span className="font-semibold text-gray-700">{v.fuelType || 'Petrol'}</span>
                                        </div>
                                        <div className="flex-1 text-center">
                                            <span className="block text-xs text-gray-400 font-bold uppercase mb-1">Seats</span>
                                            <span className="font-semibold text-gray-700">{v.seats || '4'}</span>
                                        </div>
                                    </div>

                                    <div className="mt-auto flex items-center justify-between">
                                        <div>
                                            <span className="text-gray-400 text-sm font-bold">Daily Rate</span>
                                            <div className="text-2xl font-black text-gray-900">₹{v.pricePerDay}</div>
                                        </div>
                                        <Link to={`/vehicle/${v._id}`} className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:scale-105 transition-all">
                                            Book Now
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </section>

            {/* 4. HOW IT WORKS */}
            <section className="py-24 px-6 max-w-7xl mx-auto bg-white/40 backdrop-blur-xl border border-gray-100 shadow-xl shadow-purple-900/5 rounded-[3rem] my-20">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">How It Works</h2>
                    <p className="text-gray-600 mt-4 font-medium text-lg">Renting a luxury vehicle has never been this easy.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
                    <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-purple-200 via-blue-200 to-purple-200 -z-10" />

                    {[
                        { step: "1", title: "Choose Vehicle", desc: "Select your desired ride from our extensive premium fleet.", icon: Car },
                        { step: "2", title: "Select Dates", desc: "Pick your start and end dates with our easy-to-use calendar tool.", icon: CheckCircle2 },
                        { step: "3", title: "Confirm Booking", desc: "Make a secure payment and get ready for your journey.", icon: Zap }
                    ].map((item, i) => (
                        <div key={i} className="flex flex-col items-center text-center">
                            <div className="w-24 h-24 bg-white rounded-full shadow-xl border border-gray-100 flex items-center justify-center mb-6 relative">
                                <item.icon size={40} className="text-purple-600" />
                                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center shadow-md">
                                    {item.step}
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h3>
                            <p className="text-gray-600 font-medium leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 5. FEATURES */}
            <section className="py-20 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { title: "Instant Booking", icon: Zap, color: "text-amber-500" },
                        { title: "Secure Payment", icon: ShieldCheck, color: "text-green-500" },
                        { title: "Vast Fleet", icon: Car, color: "text-blue-500" },
                        { title: "AI Assistant", icon: Wand2, color: "text-purple-500" },
                    ].map((f, i) => (
                        <motion.div whileHover={{ y: -5 }} key={i} className="bg-white/80 backdrop-blur shadow-xl shadow-gray-200/50 rounded-2xl p-6 border border-gray-100 flex items-center gap-4">
                            <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center shadow-inner border border-gray-100">
                                <f.icon size={28} className={f.color} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">{f.title}</h3>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* 6. FOOTER */}
            <footer className="mt-32 border-t border-purple-200/50 pt-16 pb-8 bg-white/50 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
                    <div>
                        <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 tracking-tighter mb-4">RideHub</h3>
                        <p className="text-gray-600 font-medium">Your premium partner for exceptional travel experiences. Driving innovation in vehicle rentals.</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 mb-4 text-lg">Quick Links</h4>
                        <ul className="space-y-3 text-gray-600 font-medium">
                            <li><Link to="/vehicles" className="hover:text-purple-600 transition-colors">Browse Fleet</Link></li>
                            <li><Link to="/ai-chat" className="hover:text-purple-600 transition-colors">AI Assistant</Link></li>
                            <li><Link to="/login" className="hover:text-purple-600 transition-colors">Sign In</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 mb-4 text-lg">Support</h4>
                        <ul className="space-y-3 text-gray-600 font-medium">
                            <li className="hover:text-purple-600 cursor-pointer transition-colors">FAQ</li>
                            <li className="hover:text-purple-600 cursor-pointer transition-colors">Privacy Policy</li>
                            <li className="hover:text-purple-600 cursor-pointer transition-colors">Terms of Service</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 mb-4 text-lg">Contact</h4>
                        <ul className="space-y-3 text-gray-600 font-medium">
                            <li>support@ridehub.com</li>
                            <li>1-800-RIDE-HUB</li>
                            <li>123 Rental Avenue, Metropolis</li>
                        </ul>
                    </div>
                </div>
                <div className="text-center text-gray-500 font-medium border-t border-purple-200/50 pt-8 max-w-7xl mx-auto px-6">
                    &copy; {new Date().getFullYear()} RideHub Inc. All rights reserved. Premium UI Concept.
                </div>
            </footer>
        </div>
    );
}