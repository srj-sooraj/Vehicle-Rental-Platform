import Booking from "../models/Booking.js";
import Vehicle from "../models/Vehicle.js";


// CREATE BOOKING
export const createBooking = async (req,res)=>{
try{

const {vehicleId,startDate,endDate} = req.body;

const vehicle = await Vehicle.findById(vehicleId);

if(!vehicle){
return res.status(404).json({message:"Vehicle not found"});
}

// CHECK DATE CONFLICT
const conflict = await Booking.findOne({
vehicle:vehicleId,
$or:[
{
startDate:{$lte:endDate},
endDate:{$gte:startDate}
}
]
});

if(conflict){
return res.status(400).json({
message:"Vehicle already booked for these dates"
});
}


// CALCULATE DAYS
const start = new Date(startDate);
const end = new Date(endDate);

const days = Math.ceil((end-start)/(1000*60*60*24)) + 1;

const totalPrice = days * vehicle.pricePerDay;


// CREATE BOOKING
const booking = await Booking.create({

user:req.user.id,
vehicle:vehicleId,
startDate,
endDate,
totalPrice

});

res.status(201).json(booking);

}catch(error){
res.status(500).json({error:error.message});
}
};



// USER BOOKINGS
export const getMyBookings = async (req,res)=>{
try{

const bookings = await Booking.find({user:req.user.id})
.populate("vehicle");

res.json(bookings);

}catch(error){
res.status(500).json({error:error.message});
}
};



// ADMIN ALL BOOKINGS
export const getAllBookings = async (req,res)=>{
try{

const bookings = await Booking.find()
.populate("user")
.populate("vehicle");

res.json(bookings);

}catch(error){
res.status(500).json({error:error.message});
}
};

export const checkOverdueBookings = async (req,res)=>{

try{

const today = new Date();

const overdueBookings = await Booking.updateMany(
{
endDate:{$lt:today},
status:"active"
},
{
status:"overdue"
}
);

res.json({
message:"Overdue bookings updated"
});

}catch(error){

res.status(500).json({error:error.message});

}

};