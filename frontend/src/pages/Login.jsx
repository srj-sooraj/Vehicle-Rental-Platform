import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Mail, ArrowRight } from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      alert("Login successful");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.reload();   // this refreshes Navbar
    } else {
      alert(data.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex justify-center items-center text-white relative overflow-hidden px-4">

      {/* Background effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[150px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-[2rem] shadow-[0_0_50px_rgba(168,85,247,0.15)] relative z-10"
      >
        <div className="text-center mb-8">
          <h2 className="text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 mb-2">WELCOME BACK</h2>
          <p className="text-white/50">Sign in to manage your premium rentals</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-purple-500/50 focus:bg-white/5 transition-all outline-none"
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
                className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-purple-500/50 focus:bg-white/5 transition-all outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 group
                        bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]"
          >
            Secure Login <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="text-center mt-6">
            <p className="text-white/40 text-sm">
              Don't have an account? <span onClick={() => navigate('/register')} className="text-purple-400 hover:text-purple-300 font-semibold cursor-pointer transition-colors">Apply now</span>
            </p>
          </div>

        </form>

      </motion.div>
    </div>
  );
}

export default Login;