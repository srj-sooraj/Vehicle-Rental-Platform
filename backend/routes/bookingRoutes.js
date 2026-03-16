import express from "express";
import {
createBooking,
getMyBookings,
getAllBookings,
checkOverdueBookings,
updateBookingStatus,
getVehicleBookings,
cancelBooking
} from "../controllers/bookingController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const router = express.Router();

router.get("/",authMiddleware,adminMiddleware,getAllBookings);
router.post("/",authMiddleware,createBooking);
router.get("/my",authMiddleware,getMyBookings);
router.put("/check-overdue",checkOverdueBookings);
router.put("/:id/status",authMiddleware,updateBookingStatus);
router.get("/vehicle/:vehicleId",getVehicleBookings);
router.put("/cancel/:id", authMiddleware, cancelBooking);



export default router;