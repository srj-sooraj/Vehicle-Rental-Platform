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

<div style={{padding:"20px"}}>

<h1>Add Vehicle</h1>

<form onSubmit={handleSubmit}>

<input
type="text"
placeholder="Vehicle Name"
value={name}
onChange={(e)=>setName(e.target.value)}
required
/>

<br/><br/>

<input
type="text"
placeholder="Brand"
value={brand}
onChange={(e)=>setBrand(e.target.value)}
required
/>

<br/><br/>

<input
type="text"
placeholder="Type (car,bike...)"
value={type}
onChange={(e)=>setType(e.target.value)}
required
/>

<br/><br/>

<input
type="file"
multiple
accept="image/*"
onChange={(e)=>setImages(e.target.files)}
/>

<br/><br/>

<input
type="number"
placeholder="Price Per Day"
value={pricePerDay}
onChange={(e)=>setPricePerDay(e.target.value)}
required
/>

<br/><br/>

<textarea
placeholder="Description"
value={description}
onChange={(e)=>setDescription(e.target.value)}
/>

<br/><br/>

<input
type="text"
placeholder="City"
value={city}
onChange={(e)=>setCity(e.target.value)}
required
/>

<br/><br/>

<input
type="text"
placeholder="Pickup Location"
value={location}
onChange={(e)=>setLocation(e.target.value)}
required
/>

<br/><br/>

<button type="submit">Add Vehicle</button>

</form>

</div>

);

}

export default AddVehicle;
