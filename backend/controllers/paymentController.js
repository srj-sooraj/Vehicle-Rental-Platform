import razorpay from "../utils/razorpay.js";
import crypto from "crypto";

export const createOrder = async(req,res)=>{

try{

const {amount} = req.body;
const options = {
amount: amount * 100,
currency: "INR",
receipt: "receipt_order"
};

const order = await razorpay.orders.create(options);
res.json(order);

}catch(err){
res.status(500).json({error:err.message});
}

};


export const verifyPayment = async(req,res)=>{

const {razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body;
const sign = razorpay_order_id + "|" + razorpay_payment_id;
const expectedSign = crypto
.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
.update(sign)
.digest("hex");

if(expectedSign === razorpay_signature){
res.json({success:true});
}else{
res.status(400).json({success:false});
}};