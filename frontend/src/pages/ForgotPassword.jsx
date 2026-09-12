import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function ForgotPassword(){

const [email,setEmail] = useState("");
const navigate = useNavigate();

const sendReset = async ()=>{

try {
  const res = await API.post("/auth/forgot-password", { email });
  const data = res.data;
  alert(data.message);
  navigate("/reset-password",{state:{email}});
} catch (error) {
  alert(error.response?.data?.message || "Failed to send reset code");
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
RESET PASSWORD
</h2>

<p className="text-gray-500 dark:text-white/50">
Enter your email to receive reset code
</p>

</div>

<div className="space-y-6">

<input
type="email"
placeholder="Email Address"
value={email}
onChange={(e)=>setEmail(e.target.value)}
className="w-full bg-white dark:bg-black/40 border border-gray-300 dark:border-white/10 rounded-xl py-4 px-4 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500"
/>

<button
onClick={sendReset}
className="w-full py-4 rounded-xl font-bold uppercase
bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white"
>
Send Reset Code
</button>

</div>

</div>

</div>

)

}

export default ForgotPassword;