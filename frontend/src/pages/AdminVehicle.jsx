import {useEffect,useState} from "react";
import {Link} from "react-router-dom";

function AdminVehicles(){

const [vehicles,setVehicles] = useState([]);

const token = localStorage.getItem("token");

useEffect(()=>{

fetch("http://localhost:5000/api/vehicles")
.then(res=>res.json())
.then(data=>{

if(Array.isArray(data)){
setVehicles(data);
}else{
console.error("API Error:",data);
setVehicles([]);
}

})
.catch(err=>{
console.error(err);
setVehicles([]);
});

},[]);

const deleteVehicle = async(id)=>{

if(!window.confirm("Delete vehicle?")) return;

await fetch(`http://localhost:5000/api/vehicles/${id}`,{
method:"DELETE",
headers:{Authorization:`Bearer ${token}`}
});

setVehicles(vehicles.filter(v=>v._id !== id));

};

return(

<div style={{padding:"20px"}}>

<h1>Manage Vehicles</h1>

<Link to="/admin/add-vehicle">
<button>Add Vehicle</button>
</Link>

<table border="1" cellPadding="10" style={{marginTop:"20px",width:"100%"}}>

<thead>

<tr>
<th>Image</th>
<th>Name</th>
<th>Brand</th>
<th>Type</th>
<th>Price</th>
<th>Status</th>
<th>Actions</th>
</tr>

</thead>

<tbody>

{vehicles.map(v=>(
<tr key={v._id}>

<td>
{v.images?.length>0 && (
<img
src={`http://localhost:5000/uploads/${v.images[0]}`}
width="80"
/>
)}
</td>

<td>{v.name}</td>
<td>{v.brand}</td>
<td>{v.type}</td>
<td>₹{v.pricePerDay}</td>
<td>{v.status}</td>

<td>

<Link to={`/admin/edit/${v._id}`}>
<button>Edit</button>
</Link>

<button
onClick={()=>deleteVehicle(v._id)}
style={{marginLeft:"10px"}}
>
Delete
</button>

</td>

</tr>
))}

</tbody>

</table>

</div>

)

}

export default AdminVehicles;