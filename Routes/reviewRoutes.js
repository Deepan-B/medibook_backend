import express, { Router } from 'express'
import { getAllReviews, createReview } from '../Controllers/reviewController.js'
import { verifyToken , restrict } from "../auth/verifyToken.js";


const router = express.Router({ mergeParams: "true" })


router.route('/').get(getAllReviews).post(verifyToken, restrict(['patient']), createReview)



export default router;