import express from "express";
import { allUsers, createNewUser, getUser, updateUser, deleteUser } from "../controllers/users.controller.js";

const router = express.Router();

router.get("/", allUsers);
router.get("/:id", getUser);
router.post("/", createNewUser);
router.patch("/:id", updateUser);
router.delete("/", deleteUser);

export default router;