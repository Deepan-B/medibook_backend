import express from "express";
import {
  deleteUser,
  findAllUser,
  findUser,
  getMyAppoinments,
  getUserProfile,
  updateUser,
} from "../Controllers/UserController.js";

import { verifyToken , restrict } from "../auth/verifyToken.js";

const router = express.Router();


router.get("/:id", verifyToken , restrict(['patient']) , findUser);
router.get("/", verifyToken , restrict(['admin']) , findAllUser);
router.put("/:id", verifyToken , restrict(['patient']) , updateUser);
router.delete("/:id", verifyToken, restrict(['patient']), deleteUser);
router.get("/profile/me", verifyToken, restrict(['patient']), getUserProfile);
router.get("/appoinments/my-appoinments", verifyToken, restrict(['patient']), getMyAppoinments);


export default router;

