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

images:[
{
type:String
}
],

description:{
type:String
},

location:{
type:String
},
city:{
    type:String
},

status:{
type:String,
enum:["available","booked","maintenance"],
default:"available"
},
rating:{
type:Number,
default:4
}

},{timestamps:true});

export default mongoose.model("Vehicle",vehicleSchema);