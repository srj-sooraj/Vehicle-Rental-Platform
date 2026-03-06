import express from "express";
import {
addVehicle,
getVehicles,
getVehicle,
updateVehicle,
deleteVehicle
} from "../controllers/vehicleController.js";

const router = express.Router();

router.post("/",addVehicle);
router.get("/",getVehicles);
router.get("/:id",getVehicle);
router.put("/:id",updateVehicle);
router.delete("/:id",deleteVehicle);

export default router;