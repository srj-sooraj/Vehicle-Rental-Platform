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

<div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-purple-100 dark:from-gray-950 dark:via-gray-900 dark:to-black pt-28 px-6">

<div className="max-w-6xl mx-auto">

<div className="flex justify-between items-center mb-6">

<h1 className="text-3xl font-black text-gray-900 dark:text-gray-100">
Manage Vehicles
</h1>

<Link to="/admin/add-vehicle">
<button className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold">
Add Vehicle
</button>
</Link>

</div>

<div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg overflow-hidden">

<table className="w-full text-left">

<thead className="bg-gray-50 dark:bg-gray-800">

<tr>
<th className="p-4">Image</th>
<th className="p-4">Name</th>
<th className="p-4">Brand</th>
<th className="p-4">Type</th>
<th className="p-4">Price</th>
<th className="p-4">Status</th>
<th className="p-4">Actions</th>
</tr>

</thead>

<tbody>

{vehicles.map(v=>(

<tr key={v._id} className="border-t border-gray-200 dark:border-gray-700">

<td className="p-4">
{v.images?.length>0 && (
<img
src={`http://localhost:5000/uploads/${v.images[0]}`}
className="w-20 h-14 object-cover rounded"
/>
)}
</td>

<td className="p-4">{v.name}</td>
<td className="p-4">{v.brand}</td>
<td className="p-4">{v.type}</td>
<td className="p-4">₹{v.pricePerDay}</td>
<td className="p-4">{v.status}</td>

<td className="p-4 flex gap-2">

<Link to={`/admin/edit/${v._id}`}>
<button className="px-4 py-2 bg-blue-500 text-white rounded-lg">
Edit
</button>
</Link>

<button
onClick={()=>deleteVehicle(v._id)}
className="px-4 py-2 bg-red-500 text-white rounded-lg"
>
Delete
</button>

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

export default AdminVehicles;