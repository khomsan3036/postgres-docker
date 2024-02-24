import express from "express";
import { createUser, getUsers, getUserById, updateUser, deleteUser } from "../controllers/userController";

// สร้าง express router
const router = express.Router();

// สร้าง route สำหรับสร้าง user
router.post("/", createUser);
router.get("/", getUsers);
router.get("/:userId", getUserById);
router.put("/:userId", updateUser);
router.delete("/:userId", deleteUser);

export default router;
