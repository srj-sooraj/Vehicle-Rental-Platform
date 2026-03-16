import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Lock, Mail, ArrowRight } from "lucide-react";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        const res = await fetch("http://localhost:5000/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await res.json();

        if (res.ok) {
            alert(data.message);
            navigate("/verify-otp", { state: { email } });
        } else {
            alert(data.message || "Registration failed");
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex justify-center items-center text-white relative overflow-hidden px-4">

            {/* Background effects */}
            <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-[2rem] shadow-[0_0_50px_rgba(59,130,246,0.15)] relative z-10"
            >
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-2">JOIN RIDEHUB</h2>
                    <p className="text-white/50">Create an account to access premium fleet</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-6">

                    <div className="space-y-4">
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500/50 focus:bg-white/5 transition-all outline-none"
                            />
                        </div>

                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500/50 focus:bg-white/5 transition-all outline-none"
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500/50 focus:bg-white/5 transition-all outline-none"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 rounded-xl font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 group
                        bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]"
                    >
                        Create Account <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <div className="text-center mt-6">
                        <p className="text-white/40 text-sm">
                            Already have an account? <span onClick={() => navigate('/login')} className="text-blue-400 hover:text-blue-300 font-semibold cursor-pointer transition-colors">Sign in back</span>
                        </p>
                    </div>

                </form>

            </motion.div>
        </div>
    );
}

export default Register;