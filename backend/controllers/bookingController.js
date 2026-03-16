import Booking from "../models/Booking.js";
import Vehicle from "../models/Vehicle.js";
import razorpay from "../utils/razorpay.js";

// Create booking
export async function createBooking(req, res) {

  try {
    const { vehicleId, startDate, endDate, customerPhone, customerLicense } = req.body;
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    // Check date conflict
    const conflict = await Booking.findOne({
      vehicle: vehicleId,
      status: { $in: ["booked", "active"] },
      $or: [
        {
          startDate: { $lte: endDate },
          endDate: { $gte: startDate }
        }
      ]
    });

    if (conflict) {
      return res.status(400).json({
        message: "Vehicle already booked for these dates"
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    const totalPrice = days * vehicle.pricePerDay;
    const booking = await Booking.create({
      user: req.user.id,
      vehicle: vehicleId,
      startDate: startDate,
      endDate: endDate,
      totalPrice: totalPrice,
      customerPhone: customerPhone,
      customerLicense: customerLicense
    });

    res.status(201).json(booking);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


// User bookings
export async function getMyBookings(req, res) {

  try {
    const bookings = await Booking.find({
      user: req.user.id
    }).populate("vehicle");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });

  }
}


// Admin bookings
export async function getAllBookings(req, res) {

  try {
    const bookings = await Booking.find()
      .populate("user")
      .populate("vehicle");

    res.json(bookings);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


// CHECK OVERDUE BOOKINGS
export async function checkOverdueBookings(req, res) {

  try {
    const today = new Date();
    await Booking.updateMany(
      {
        endDate: { $lt: today },
        status: "active"
      },
      {
        status: "overdue"
      }
    );

    res.json({
      message: "Overdue bookings updated"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


//Update booking status
export async function updateBookingStatus(req, res) {

  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: status },
      { returnDocument: "after" }
    );

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


// Vehicle bookings
export async function getVehicleBookings(req, res) {

  try {
    const { vehicleId } = req.params;
    const bookings = await Booking.find({
      vehicle: vehicleId,
      status: { $in: ["booked","active"] }
    }).select("startDate endDate");

    res.json(bookings);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Cron job function
export async function autoUpdateBookingStatus() {

  const today = new Date();
  await Booking.updateMany(
    {
      startDate: { $lte: today },
      endDate: { $gte: today },
      status: "booked"
    },
    {
      status: "active"
    }
  );

  await Booking.updateMany(
    {
      endDate: { $lt: today },
      status: "active"
    },
    {
      status: "completed"
    }
  );
}



export const cancelBooking = async(req,res)=>{

try{

const booking = await Booking.findById(req.params.id);

if(!booking){
return res.status(404).json({message:"Booking not found"});
}

if(booking.paymentStatus !== "paid"){
return res.status(400).json({message:"Payment not completed"});
}

await razorpay.payments.refund(booking.paymentId,{
amount: booking.totalPrice * 100
});

booking.paymentStatus = "refunded";
booking.bookingStatus = "cancelled";

await booking.save();

res.json({message:"Booking cancelled and refund processed"});

}catch(err){
res.status(500).json({error:err.message});
}

};