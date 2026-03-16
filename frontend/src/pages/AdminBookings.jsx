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

<div style={{padding:"20px"}}>

<h1>Booking Management</h1>

<table border="1" cellPadding="10" style={{width:"100%"}}>

<thead>
<tr>
<th>User</th>
<th>Email</th>
<th>Phone</th>
<th>License No</th>
<th>License Image</th>
<th>Vehicle</th>
<th>Start</th>
<th>End</th>
<th>Total</th>
<th>Status</th>
<th>Actions</th>
</tr>
</thead>

<tbody>

{bookings.map((b)=>(

<tr key={b._id}>

<td>{b.user?.name}</td>

<td>{b.user?.email}</td>

<td>{b.customerPhone}</td>

<td>{b.customerLicense}</td>

<td>
{b.user?.drivingLicense && (
<img
src={`http://localhost:5000/${b.user.drivingLicense}`}
alt="license"
style={{
width:"80px",
height:"50px",
objectFit:"cover"
}}
/>
)}
</td>

<td>
{b.vehicle?.name} ({b.vehicle?.brand})
</td>

<td>{new Date(b.startDate).toLocaleDateString()}</td>

<td>{new Date(b.endDate).toLocaleDateString()}</td>

<td>₹{b.totalPrice}</td>

<td>{b.status}</td>

<td>

<button onClick={()=>updateStatus(b._id,"active")}>
Approve
</button>

<button onClick={()=>updateStatus(b._id,"cancelled")}>
Cancel
</button>

<button onClick={()=>updateStatus(b._id,"completed")}>
Complete
</button>

{b.status === "active" && (
<button onClick={()=>markReturned(b._id)}>
Mark Returned
</button>
)}

</td>
</tr>
))}

</tbody>

</table>

</div>

)

}

export default AdminBookings;