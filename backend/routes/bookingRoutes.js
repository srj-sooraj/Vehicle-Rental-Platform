import express from "express";
import {
createBooking,
getMyBookings,
getAllBookings,
checkOverdueBookings
} from "../controllers/bookingController.js";

import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/",authMiddleware,createBooking);
router.get("/my",authMiddleware,getMyBookings);
router.get("/",authMiddleware,getAllBookings);
router.put("/check-overdue",checkOverdueBookings);

export default router;