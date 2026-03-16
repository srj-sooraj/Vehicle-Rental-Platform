import {useEffect,useState} from "react";

function AdminBookings(){

const [bookings,setBookings] = useState([]);

const token = localStorage.getItem("token");

useEffect(()=>{

fetch("http://localhost:5000/api/bookings",{
headers:{Authorization:`Bearer ${token}`}
})
.then(res=>res.json())
.then(data=>setBookings(data));

},[]);


// Update Status
const updateStatus = async(id,status)=>{

await fetch(`http://localhost:5000/api/bookings/${id}/status`,{
method:"PUT",
headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},
body:JSON.stringify({status})
});

setBookings(prev =>
prev.map(b =>
b._id === id ? {...b,status} : b
)
);

};


// Mark Returned
const markReturned = async(id)=>{

await fetch(`http://localhost:5000/api/bookings/${id}/status`,{
method:"PUT",
headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},
body:JSON.stringify({
status:"completed"
})
});

alert("Vehicle returned");

setBookings(prev =>
prev.map(b =>
b._id === id ? {...b,status:"completed"} : b
)
);

};

return(

<div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-purple-100 dark:from-gray-950 dark:via-gray-900 dark:to-black pt-28 px-6">

<div className="max-w-7xl mx-auto">

<h1 className="text-3xl font-black mb-6 text-gray-900 dark:text-gray-100">
Booking Management
</h1>

<div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg overflow-x-auto">

<table className="w-full text-left">

<thead className="bg-gray-50 dark:bg-gray-800">

<tr>
<th className="p-4">User</th>
<th className="p-4">Email</th>
<th className="p-4">Phone</th>
<th className="p-4">License</th>
<th className="p-4">Image</th>
<th className="p-4">Vehicle</th>
<th className="p-4">Start</th>
<th className="p-4">End</th>
<th className="p-4">Total</th>
<th className="p-4">Status</th>
<th className="p-4">Actions</th>
</tr>

</thead>

<tbody>

{bookings.map((b)=>(

<tr key={b._id} className="border-t border-gray-200 dark:border-gray-700">

<td className="p-4">{b.user?.name}</td>
<td className="p-4">{b.user?.email}</td>
<td className="p-4">{b.customerPhone}</td>
<td className="p-4">{b.customerLicense}</td>

<td className="p-4">
{b.user?.drivingLicense && (
<img
src={`http://localhost:5000/${b.user.drivingLicense}`}
className="w-20 h-12 object-cover rounded"
/>
)}
</td>

<td className="p-4">
{b.vehicle?.name} ({b.vehicle?.brand})
</td>

<td className="p-4">{new Date(b.startDate).toLocaleDateString()}</td>
<td className="p-4">{new Date(b.endDate).toLocaleDateString()}</td>
<td className="p-4">₹{b.totalPrice}</td>
<td className="p-4">{b.status}</td>

<td className="p-4 flex flex-wrap gap-2">

<button onClick={()=>updateStatus(b._id,"active")} className="px-3 py-1 bg-green-500 text-white rounded">
Approve
</button>

<button onClick={()=>updateStatus(b._id,"cancelled")} className="px-3 py-1 bg-red-500 text-white rounded">
Cancel
</button>

<button onClick={()=>updateStatus(b._id,"completed")} className="px-3 py-1 bg-blue-500 text-white rounded">
Complete
</button>

{b.status === "active" && (
<button onClick={()=>markReturned(b._id)} className="px-3 py-1 bg-purple-600 text-white rounded">
Mark Returned
</button>
)}

</td>

</tr>

))}

</tbody>

</table>

</div>
</div>
</div>

)

}

export default AdminBookings;