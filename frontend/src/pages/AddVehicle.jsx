import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddVehicle(){

const [name,setName] = useState("");
const [type,setType] = useState("");
const [pricePerDay,setPricePerDay] = useState("");
const [description,setDescription] = useState("");
const [brand,setBrand] = useState("");
const [images,setImages] = useState([]);
const [city,setCity] = useState("");
const [location,setLocation] = useState("");

const navigate = useNavigate();

const handleSubmit = async (e)=>{

e.preventDefault();

const token = localStorage.getItem("token");

const formData = new FormData();

formData.append("name",name);
formData.append("brand",brand);
formData.append("type",type);
formData.append("pricePerDay",pricePerDay);
formData.append("description",description);
formData.append("city",city);
formData.append("location",location);

for(let i=0;i<images.length;i++){
formData.append("images",images[i]);
}

const res = await fetch("http://localhost:5000/api/vehicles",{
method:"POST",
headers:{
Authorization:`Bearer ${token}`
},
body:formData
});

const data = await res.json();

if(res.ok){
alert("Vehicle added successfully 🚗");
navigate("/admin");
}else{
alert(data.message || "Failed");
}

};

return(

<div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-purple-100 dark:from-gray-950 dark:via-gray-900 dark:to-black pt-28 px-6">

<div className="max-w-3xl mx-auto bg-white/80 dark:bg-gray-900/70 backdrop-blur-xl border border-gray-200 dark:border-gray-700 p-10 rounded-[2rem] shadow-xl">

<h1 className="text-3xl font-black mb-8 text-gray-900 dark:text-gray-100">
Add Vehicle
</h1>

<form onSubmit={handleSubmit} className="space-y-5">

<input
type="text"
placeholder="Vehicle Name"
value={name}
onChange={(e)=>setName(e.target.value)}
required
className="w-full px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
/>

<input
type="text"
placeholder="Brand"
value={brand}
onChange={(e)=>setBrand(e.target.value)}
required
className="w-full px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
/>

<input
type="text"
placeholder="Type (car,bike...)"
value={type}
onChange={(e)=>setType(e.target.value)}
required
className="w-full px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
/>

<input
type="file"
multiple
accept="image/*"
onChange={(e)=>setImages(e.target.files)}
className="w-full"
/>

<input
type="number"
placeholder="Price Per Day"
value={pricePerDay}
onChange={(e)=>setPricePerDay(e.target.value)}
required
className="w-full px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
/>

<textarea
placeholder="Description"
value={description}
onChange={(e)=>setDescription(e.target.value)}
className="w-full px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
/>

<input
type="text"
placeholder="City"
value={city}
onChange={(e)=>setCity(e.target.value)}
required
className="w-full px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
/>

<input
type="text"
placeholder="Pickup Location"
value={location}
onChange={(e)=>setLocation(e.target.value)}
required
className="w-full px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
/>

<button
type="submit"
className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold hover:scale-105 transition"
>
Add Vehicle
</button>

</form>

</div>
</div>

);

}

export default AddVehicle;
