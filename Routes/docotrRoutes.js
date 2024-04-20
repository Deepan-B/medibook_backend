import express from "express";
import {
  deleteDoctor,
  findAllDoctor,
  findDoctor,
  getDoctorProfile,
  updateDoctor,
} from "../Controllers/doctorController.js";

import { verifyToken, restrict } from "../auth/verifyToken.js";

import reviewRouter from "./reviewRoutes.js";

const router = express.Router();

router.use("/:doctorId/reviews", reviewRouter);

router.get("/:id", verifyToken , restrict(['doctor' , 'patient']) , findDoctor);
router.get("/", findAllDoctor);
router.put("/:id",verifyToken , restrict(['doctor']) , updateDoctor);
router.delete("/:id", verifyToken, restrict(['doctor']), deleteDoctor);
router.get("/profile/me", verifyToken, restrict(['doctor']), getDoctorProfile);


export default router;
