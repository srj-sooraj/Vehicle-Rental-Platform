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
}

},{timestamps:true});

export default mongoose.model("Booking",bookingSchema);