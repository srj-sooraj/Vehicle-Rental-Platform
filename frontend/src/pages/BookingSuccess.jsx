import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { CheckCircle, Car, Calendar, Download, Home, BookOpen } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import jsPDF from "jspdf";

function BookingSuccess(){

const navigate = useNavigate();
const location = useLocation();

const booking = location.state?.booking;

const [showConfetti,setShowConfetti] = useState(true);

useEffect(()=>{

setTimeout(()=>{
setShowConfetti(false);
},5000);

},[]);


const downloadInvoice = () => {

const doc = new jsPDF();

doc.setFontSize(22);
doc.text("RideHub Invoice", 20, 20);

doc.setFontSize(14);
doc.text(`Booking ID: ${booking?._id}`, 20, 40);

doc.text(`Start Date: ${new Date(booking?.startDate).toLocaleDateString()}`, 20, 50);

doc.text(`End Date: ${new Date(booking?.endDate).toLocaleDateString()}`, 20, 60);

doc.text(`Vehicle ID: ${booking?.vehicle}`, 20, 70);

doc.text("Thank you for choosing RideHub!", 20, 90);

doc.save("invoice.pdf");

};

return(

<div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-blue-100 dark:from-gray-950 dark:via-gray-900 dark:to-black flex items-center justify-center px-6">

{showConfetti && <Confetti />}

<motion.div
initial={{opacity:0,y:30}}
animate={{opacity:1,y:0}}
transition={{duration:0.6}}
className="max-w-3xl w-full bg-white/80 dark:bg-gray-900/70 backdrop-blur-xl border border-gray-200 dark:border-gray-700 p-12 rounded-[3rem] shadow-2xl text-center"
>

{/* success icon */}

<motion.div
initial={{scale:0}}
animate={{scale:1}}
transition={{type:"spring",delay:0.2}}
className="flex justify-center mb-6"
>

<CheckCircle className="w-28 h-28 text-green-500"/>

</motion.div>

<h1 className="text-5xl font-black text-gray-900 dark:text-gray-100 mb-4">
Booking Confirmed 🎉
</h1>

<p className="text-gray-600 dark:text-gray-400 mb-10 text-lg">
Your payment was successful and your vehicle has been reserved.
</p>

{/* booking info */}

<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

<div className="bg-purple-50 dark:bg-gray-800 p-6 rounded-2xl">

<Car className="w-10 h-10 mx-auto text-purple-600 mb-3"/>

<p className="font-bold text-gray-700 dark:text-gray-200">
Vehicle Reserved
</p>

</div>

<div className="bg-blue-50 dark:bg-gray-800 p-6 rounded-2xl">

<Calendar className="w-10 h-10 mx-auto text-blue-600 mb-3"/>

<p className="font-bold text-gray-700 dark:text-gray-200">
Dates Locked
</p>

</div>

<div className="bg-green-50 dark:bg-gray-800 p-6 rounded-2xl">

<CheckCircle className="w-10 h-10 mx-auto text-green-600 mb-3"/>

<p className="font-bold text-gray-700 dark:text-gray-200">
Payment Success
</p>

</div>

</div>

{/* booking card */}

<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8 rounded-3xl shadow-md mb-10">

<h2 className="text-2xl font-black mb-6 text-gray-900 dark:text-gray-100">
Booking Details
</h2>

<div className="space-y-3 text-left">

<p className="flex justify-between">
<span className="font-semibold text-gray-500">Booking ID</span>
<span className="font-bold text-purple-600">
{booking?._id}
</span>
</p>

<p className="flex justify-between">
<span className="font-semibold text-gray-500">Start Date</span>
<span className="font-bold">
{booking?.startDate ? new Date(booking.startDate).toLocaleDateString() : ""}
</span>
</p>

<p className="flex justify-between">
<span className="font-semibold text-gray-500">End Date</span>
<span className="font-bold">
{booking?.endDate ? new Date(booking.endDate).toLocaleDateString() : ""}
</span>
</p>

</div>

</div>

{/* buttons */}

<div className="flex flex-col sm:flex-row gap-4 justify-center">

<button
onClick={()=>navigate("/")}
className="flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold hover:scale-105 transition"
>

<Home className="w-5 h-5"/>

Home

</button>

<button
onClick={()=>navigate("/my-bookings")}
className="flex items-center gap-2 px-8 py-4 rounded-xl border border-gray-300 dark:border-gray-700 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition"
>

<BookOpen className="w-5 h-5"/>

My Bookings

</button>

{/* <button
className="flex items-center gap-2 px-8 py-4 rounded-xl bg-green-500 text-white font-bold hover:scale-105 transition"
>

<Download className="w-5 h-5"/>

Download Invoice

</button> */}

<button
onClick={downloadInvoice}
className="flex items-center gap-2 px-8 py-4 rounded-xl bg-green-500 text-white font-bold hover:scale-105 transition"
>
Download Invoice
</button>

</div>

</motion.div>

</div>

);

}

export default BookingSuccess;