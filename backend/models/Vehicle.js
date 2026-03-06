import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({

name:{
type:String,
required:true
},

brand:{
type:String,
required:true
},

type:{
type:String,
enum:["car","bike","van","bicycle","scooter"],
required:true
},

pricePerDay:{
type:Number,
required:true
},

image:{
type:String
},

description:{
type:String
},

location:{
type:String
},

status:{
type:String,
enum:["available","booked","maintenance"],
default:"available"
}

},{timestamps:true});

export default mongoose.model("Vehicle",vehicleSchema);