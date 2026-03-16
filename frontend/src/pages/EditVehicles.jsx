import {useState,useEffect} from "react";
import {useParams,useNavigate} from "react-router-dom";

function EditVehicle(){

const {id} = useParams();
const navigate = useNavigate();

const [name,setName] = useState("");
const [brand,setBrand] = useState("");
const [type,setType] = useState("");
const [pricePerDay,setPricePerDay] = useState("");
const [description,setDescription] = useState("");
const [status,setStatus] = useState("available");
const [city,setCity] = useState("");
const [location,setLocation] = useState("");

useEffect(()=>{

fetch(`http://localhost:5000/api/vehicles/${id}`)
.then(res=>res.json())
.then(data=>{
if(data){
setName(data.name || "");
setBrand(data.brand || "");
setType(data.type || "");
setPricePerDay(data.pricePerDay || "");
setDescription(data.description || "");
setStatus(data.status);
setCity(data.city || "");
setLocation(data.location || "");
}
})
.catch(err=>console.log(err));

},[id]);


const updateVehicle = async ()=>{

const token = localStorage.getItem("token");

await fetch(`http://localhost:5000/api/vehicles/${id}`,{
method:"PUT",
headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},
body:JSON.stringify({
name,
brand,
type,
pricePerDay,
description,
status,
city,
location
})
});

alert("Vehicle updated");

navigate("/admin/vehicles");

};

return(

<div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-purple-100 dark:from-gray-950 dark:via-gray-900 dark:to-black pt-28 px-6">

<div className="max-w-3xl mx-auto bg-white/80 dark:bg-gray-900/70 backdrop-blur-xl border border-gray-200 dark:border-gray-700 p-10 rounded-[2rem] shadow-xl">

<h1 className="text-3xl font-black mb-8 text-gray-900 dark:text-gray-100">
Edit Vehicle
</h1>

<div className="space-y-5">

<input
value={name}
onChange={(e)=>setName(e.target.value)}
placeholder="Name"
className="w-full px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
/>

<input
value={brand}
onChange={(e)=>setBrand(e.target.value)}
placeholder="Brand"
className="w-full px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
/>

<input
value={type}
onChange={(e)=>setType(e.target.value)}
placeholder="Type"
className="w-full px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
/>

<input
value={pricePerDay}
onChange={(e)=>setPricePerDay(e.target.value)}
placeholder="Price"
className="w-full px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
/>

<textarea
value={description}
onChange={(e)=>setDescription(e.target.value)}
placeholder="Description"
className="w-full px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
/>

<input
value={city}
onChange={(e)=>setCity(e.target.value)}
placeholder="City"
className="w-full px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
/>

<input
value={location}
onChange={(e)=>setLocation(e.target.value)}
placeholder="Pickup Location"
className="w-full px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
/>

<select
value={status}
onChange={(e)=>setStatus(e.target.value)}
className="w-full px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
>

<option value="available">Available</option>
<option value="booked">Booked</option>
<option value="maintenance">Maintenance</option>

</select>

<button
onClick={updateVehicle}
className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold hover:scale-105 transition"
>
Update Vehicle
</button>

</div>

</div>

</div>

)

}

export default EditVehicle;