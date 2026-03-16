import express from "express";
import {
addVehicle,
getVehicles,
getVehicle,
updateVehicle,
deleteVehicle
} from "../controllers/vehicleController.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();


router.get("/",getVehicles);
router.get("/:id",getVehicle);
router.post("/",authMiddleware,adminMiddleware,upload.array("images",5), addVehicle);
router.put("/:id",authMiddleware,adminMiddleware,updateVehicle);
router.delete("/:id",authMiddleware,adminMiddleware,deleteVehicle);

export default router;