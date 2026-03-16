import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import connectDB from "./connection.js";
import authRoutes from "./routes/authRoutes.js"
import vehicleRoutes from "./routes/vehicleRoutes.js"
import bookingRoutes from "./routes/bookingRoutes.js"
import aiRoutes from "./routes/aiRoutes.js"
import cron from "node-cron";
import { autoUpdateBookingStatus } from "./controllers/bookingController.js";
import paymentRoutes from "./routes/paymentRoutes.js";


const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth",authRoutes);
app.use("/api/vehicles",vehicleRoutes);
app.use("/api/bookings",bookingRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/ai",aiRoutes);
app.use("/api/payment", paymentRoutes);

app.get("/", (req, res) => {
  res.send("RideHub API Running");
});


cron.schedule("0 0 * * *", async () => {

console.log("Running booking status automation");

await autoUpdateBookingStatus();

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running http://localhost:${PORT}`);
});