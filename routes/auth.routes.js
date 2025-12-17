import express from "express";
import { login } from "../controllers/auth.controller.js";
import { refresh } from "../controllers/auth.refresh.controller.js";
import { logout } from "../controllers/auth.logout.js";
import { getMe } from "../controllers/getMe.controller.js"
import { authenticate } from "../middlewares/auth.js"

const router = express.Router();

router.post("/login", login);
router.get("/me", authenticate, getMe);
router.post("/refresh", authenticate, refresh);
router.post("/logout", authenticate, logout);

export default router;
