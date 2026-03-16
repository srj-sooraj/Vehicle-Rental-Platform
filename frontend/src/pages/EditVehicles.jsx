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

<div style={{padding:"20px"}}>

<h1>Edit Vehicle</h1>

<input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Name"/>
<br/><br/>

<input value={brand} onChange={(e)=>setBrand(e.target.value)} placeholder="Brand"/>
<br/><br/>

<input value={type} onChange={(e)=>setType(e.target.value)} placeholder="Type"/>
<br/><br/>

<input value={pricePerDay} onChange={(e)=>setPricePerDay(e.target.value)} placeholder="Price"/>
<br/><br/>

<textarea value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Description"/>
<br/><br/>

<input
value={city}
onChange={(e)=>setCity(e.target.value)}
placeholder="City"
/>

<br/><br/>

<input
value={location}
onChange={(e)=>setLocation(e.target.value)}
placeholder="Pickup Location"
/>

<br/><br/>

<select value={status} onChange={(e)=>setStatus(e.target.value)}>

<option value="available">Available</option>
<option value="booked">Booked</option>
<option value="maintenance">Maintenance</option>



</select>

<br /><br />

<button onClick={updateVehicle}>Update Vehicle</button>

</div>

)

}

export default EditVehicle;