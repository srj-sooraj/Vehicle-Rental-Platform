import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./connection.js";
import authRoutes from "./routes/authRoutes.js"
import vehicleRoutes from "./routes/vehicleRoutes.js"
import bookingRoutes from "./routes/bookingRoutes.js"

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth",authRoutes);
app.use("/api/vehicles",vehicleRoutes);
app.use("/api/bookings",bookingRoutes);

app.get("/", (req, res) => {
  res.send("RideHub API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running http://localhost:${PORT}`);
});