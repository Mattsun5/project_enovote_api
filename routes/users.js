import express from "express";
import { allUsers, createNewUser, getUser, updateUser, deleteUser } from "../controllers/users.controller.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", createNewUser);


router.get("/", allUsers);
// router.get("/:id", authenticate, getUser);
router.patch("/:id", authenticate, updateUser);
// router.delete("/", authenticate, deleteUser);

export default router;