import express from "express";
import {registerUser,loginUser} from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";
import {uploadLicense} from "../controllers/authController.js";

const router=express.Router();

router.post("/register",registerUser);
router.post("/login",loginUser);
router.post("/upload-license",authMiddleware,upload.single("license"),uploadLicense);

export default router;