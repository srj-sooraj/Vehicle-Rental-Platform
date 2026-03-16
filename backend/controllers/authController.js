import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";


// Register
// export async function registerUser(req, res) {
//   try {
//     const { name, email, password } = req.body;
//     const userExist = await User.findOne({ email });
//     if (userExist) {
//       return res.status(400).json({ message: "User already exists" });
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = await User.create({
//       name: name,
//       email: email,
//       password: hashedPassword
//     });

//     res.status(201).json({
//       message: "User registered successfully"
//     });

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// }


export async function registerUser(req,res){

try{
const {name,email,password} = req.body;
let user = await User.findOne({email});

if(user){

// If user exists but NOT verified → resend OTP
if(!user.isVerified){
const otp = Math.floor(100000 + Math.random()*900000);
user.emailOtp = otp;
user.otpExpire = Date.now() + 10*60*1000;

await user.save();
await sendEmail(
email,
"Your OTP Code",
`Your OTP is ${otp}`
);

return res.json({
message:"OTP resent. Please verify your email"
});

}

//If already verified 
return res.status(400).json({
message:"User already exists. Please login"
});

}

const hashedPassword = await bcrypt.hash(password,10);

const otp = Math.floor(100000 + Math.random()*900000);
console.log(otp);

user = await User.create({
name,
email,
password:hashedPassword,
emailOtp:otp,
otpExpire:Date.now() + 10*60*1000,
isVerified:false
});

await sendEmail(
email,
"Your OTP Code",
`Your OTP is ${otp}`
);



res.json({
message:"OTP sent to email"
});

}catch(error){  
console.log("REGISTER ERROR:", error);
res.status(500).json({error:error.message});
}

}


export async function verifyOtp(req,res){

try{
const {email,otp} = req.body;
const user = await User.findOne({email});

if(!user){
return res.status(400).json({message:"User not found"});
}

if(user.emailOtp != otp){
return res.status(400).json({message:"Invalid OTP"});
}

if(user.otpExpire < Date.now()){
return res.status(400).json({message:"OTP expired"});
}

user.isVerified = true;
user.emailOtp = null;

await user.save();

res.json({
message:"Email verified successfully"
});

}catch(error){
res.status(500).json({error:error.message});
}

}


// Login
export async function loginUser(req, res) {

try {

const { email, password } = req.body;

const user = await User.findOne({ email });

if (!user) {
return res.status(400).json({ message: "Invalid credentials" });
}

if(user.isVerified === false){
return res.status(400).json({
message:"Email not verified. Please verify OTP."
});
}

const isMatch = await bcrypt.compare(password, user.password);

if (!isMatch) {
return res.status(400).json({ message: "Invalid credentials" });
}

const token = jwt.sign(
{ id: user._id, role: user.role },
process.env.JWT_SECRET,
{ expiresIn: "7d" }
);

res.json({
token,
user: {
id: user._id,
name: user.name,
role: user.role
}
});

} catch (error) {
res.status(500).json({ error: error.message });
}

}

export async function resendOtp(req,res){

try{

const {email} = req.body;

const user = await User.findOne({email});

if(!user){
return res.status(400).json({message:"User not found"});
}

if(user.isVerified){
return res.status(400).json({message:"Email already verified"});
}

const otp = Math.floor(100000 + Math.random()*900000);

user.emailOtp = otp;
user.otpExpire = Date.now() + 10*60*1000;

await user.save();

await sendEmail(
email,
"Your New OTP Code",
`Your new OTP is ${otp}`
);

res.json({
message:"OTP resent successfully"
});

}catch(error){
res.status(500).json({error:error.message});
}

}

// Upload license
export async function uploadLicense(req, res) {

  try {

    const user = await User.findById(req.user.id);
    user.drivingLicense = req.file.path;
    await user.save();

    res.json({
      message: "License uploaded successfully",
      license: user.drivingLicense
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}


export async function forgotPassword(req,res){

try{

const {email} = req.body;

const user = await User.findOne({email});

if(!user){
return res.status(400).json({message:"User not found"});
}

const resetToken = Math.floor(100000 + Math.random()*900000);

user.resetPasswordToken = resetToken;
user.resetPasswordExpire = Date.now() + 10*60*1000;

await user.save();

await sendEmail(
email,
"RideHub Password Reset",
`Your password reset code is ${resetToken}`
);

res.json({
message:"Reset code sent to your email"
});

}catch(error){
res.status(500).json({error:error.message});
}

}

export async function resetPassword(req,res){

try{

const {email,token,newPassword} = req.body;

const user = await User.findOne({email});

if(!user){
return res.status(400).json({message:"User not found"});
}

if(user.resetPasswordToken != token){
return res.status(400).json({message:"Invalid reset code"});
}

if(user.resetPasswordExpire < Date.now()){
return res.status(400).json({message:"Reset code expired"});
}

const hashedPassword = await bcrypt.hash(newPassword,10);

user.password = hashedPassword;
user.resetPasswordToken = null;
user.resetPasswordExpire = null;

await user.save();

res.json({
message:"Password reset successful"
});

}catch(error){
res.status(500).json({error:error.message});
}

}
