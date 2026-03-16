import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({

user:{
type:mongoose.Schema.Types.ObjectId,
ref:"User",
required:true
},

vehicle:{
type:mongoose.Schema.Types.ObjectId,
ref:"Vehicle",
required:true
},

startDate:{
type:Date,
required:true
},

endDate:{
type:Date,
required:true
},

totalPrice:{
type:Number,
required:true
},

status:{
type:String,
enum:["booked","active","completed","cancelled","overdue"],
default:"booked"
},
customerPhone:{
type:String,
required:true
},

customerLicense:{
type:String,
required:true
},
paymentStatus:{
type:String,
enum:["pending","paid"],
default:"pending"
},
paymentId:{
type:String
},

orderId:{
type:String
}

},{timestamps:true});

export default mongoose.model("Booking",bookingSchema);