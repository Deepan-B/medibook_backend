import express from "express";
import { verifyToken } from './../auth/verifyToken.js'
import { getCheckoutSession } from "../Controllers/bookingControllers.js";

const router = express.Router()

router.post('/checkout-session/:doctorId', verifyToken, getCheckoutSession)

export default router