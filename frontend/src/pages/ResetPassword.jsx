import { useState } from "react";
import { useLocation } from "react-router-dom";

function ResetPassword(){

const location = useLocation();

const [email,setEmail] = useState(location.state?.email || "");
const [token,setToken] = useState("");
const [password,setPassword] = useState("");

const reset = async ()=>{

const res = await fetch("http://localhost:5000/api/auth/reset-password",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
email,
token,
newPassword:password
})
});

const data = await res.json();

alert(data.message);

};

return(

<div className="min-h-screen flex justify-center items-center px-4
bg-gradient-to-br from-white via-blue-50 to-purple-100
dark:from-gray-950 dark:via-gray-900 dark:to-black
text-gray-900 dark:text-white">

<div className="w-full max-w-md bg-white/80 dark:bg-white/5 backdrop-blur-2xl border border-gray-200 dark:border-white/10 p-10 rounded-[2rem] shadow-xl">

<div className="text-center mb-8">

<h2 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500 mb-2">
SET NEW PASSWORD
</h2>

<p className="text-gray-500 dark:text-white/50">
Enter reset code and new password
</p>

</div>

<div className="space-y-5">

<input
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
className="w-full bg-white dark:bg-black/40 border border-gray-300 dark:border-white/10 rounded-xl py-4 px-4 text-gray-900 dark:text-white"
/>

<input
placeholder="Reset Code"
value={token}
onChange={(e)=>setToken(e.target.value)}
className="w-full bg-white dark:bg-black/40 border border-gray-300 dark:border-white/10 rounded-xl py-4 px-4 text-gray-900 dark:text-white"
/>

<input
type="password"
placeholder="New Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
className="w-full bg-white dark:bg-black/40 border border-gray-300 dark:border-white/10 rounded-xl py-4 px-4 text-gray-900 dark:text-white"
/>

<button
onClick={reset}
className="w-full py-4 rounded-xl font-bold uppercase
bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white"
>
Reset Password
</button>

</div>

</div>

</div>

)

}

export default ResetPassword;