import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";


function VerifyOtp(){

const location = useLocation();
const navigate = useNavigate();

const email = location.state?.email;

const [otp,setOtp] = useState("");

const verifyOtp = async ()=>{

try {
  const res = await API.post("/auth/verify-otp", { email, otp });
  alert("Email verified. You can login now.");
  navigate("/login");
} catch (error) {
  alert(error.response?.data?.message || "Verification failed");
}

};

const resendOtp = async ()=>{

try {
  const res = await API.post("/auth/resend-otp", { email });
  alert("OTP resent to your email");
} catch (error) {
  alert(error.response?.data?.message || "Failed to resend OTP");
}

};

return(

<div className="min-h-screen flex justify-center items-center px-4
bg-gradient-to-br from-white via-blue-50 to-purple-100
dark:from-gray-950 dark:via-gray-900 dark:to-black
text-gray-900 dark:text-white">

<div className="w-full max-w-md bg-white/80 dark:bg-white/5 backdrop-blur-2xl border border-gray-200 dark:border-white/10 p-10 rounded-[2rem] shadow-xl">

<div className="text-center mb-8">
<h2 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500 mb-2">
VERIFY OTP
</h2>
<p className="text-gray-500 dark:text-white/50">
OTP sent to <span className="text-purple-500">{email}</span>
</p>
</div>

<div className="space-y-6">

<input
placeholder="Enter OTP"
value={otp}
onChange={(e)=>setOtp(e.target.value)}
className="w-full bg-white dark:bg-black/40 border border-gray-300 dark:border-white/10 rounded-xl py-4 px-4 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500"
/>

<button
onClick={verifyOtp}
className="w-full py-4 rounded-xl font-bold tracking-wider uppercase
bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white"
>
Verify OTP
</button>

<button
onClick={resendOtp}
className="w-full py-3 rounded-xl border border-gray-300 dark:border-white/10 text-gray-600 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/5 transition"
>
Resend OTP
</button>

</div>

</div>

</div>

)

}

export default VerifyOtp;