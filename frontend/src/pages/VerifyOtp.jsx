import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function VerifyOtp(){

const location = useLocation();
const navigate = useNavigate();

const email = location.state?.email;

const [otp,setOtp] = useState("");

const verifyOtp = async ()=>{

const res = await fetch("http://localhost:5000/api/auth/verify-otp",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({email,otp})
});

const data = await res.json();

if(res.ok){
alert("Email verified. You can login now.");
navigate("/login");
}else{
alert(data.message);
}

};

const resendOtp = async ()=>{

const res = await fetch("http://localhost:5000/api/auth/resend-otp",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({email})
});

const data = await res.json();

if(res.ok){
alert("OTP resent to your email");
}else{
alert(data.message);
}

};

return(

<div style={{padding:"20px"}}>

<h2>Verify OTP</h2>

<p>OTP sent to: {email}</p>

<input
placeholder="Enter OTP"
value={otp}
onChange={(e)=>setOtp(e.target.value)}
/>

<br/><br/>

<button onClick={verifyOtp}>
Verify OTP
</button>

<br/><br/>

<button onClick={resendOtp}>
Resend OTP
</button>

</div>

)

}

export default VerifyOtp;