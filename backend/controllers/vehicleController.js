import Vehicle from "../models/Vehicle.js";


// ADD VEHICLE
export const addVehicle = async (req,res)=>{
try{

const vehicle = await Vehicle.create(req.body);

res.status(201).json(vehicle);

}catch(error){
res.status(500).json({error:error.message});
}
};



// GET ALL VEHICLES
export const getVehicles = async (req,res)=>{
try{

const {type} = req.query;

let filter = {};

if(type){
filter.type = type;
}

const vehicles = await Vehicle.find(filter);

res.json(vehicles);

}catch(error){
res.status(500).json({error:error.message});
}
};



// GET SINGLE VEHICLE
export const getVehicle = async (req,res)=>{
try{

const vehicle = await Vehicle.findById(req.params.id);

res.json(vehicle);

}catch(error){
res.status(500).json({error:error.message});
}
};



// UPDATE VEHICLE
export const updateVehicle = async (req,res)=>{
try{

const vehicle = await Vehicle.findByIdAndUpdate(
req.params.id,
req.body,
{new:true}
);

res.json(vehicle);

}catch(error){
res.status(500).json({error:error.message});
}
};



// DELETE VEHICLE
export const deleteVehicle = async (req,res)=>{
try{

await Vehicle.findByIdAndDelete(req.params.id);

res.json({message:"Vehicle deleted"});

}catch(error){
res.status(500).json({error:error.message});
}
};