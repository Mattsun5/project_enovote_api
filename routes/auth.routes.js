import express from "express";
import { login } from "../controllers/auth.controller.js";
import { refresh } from "../controllers/auth.refresh.controller.js";
import { logout } from "../controllers/auth.logout.js";
import { getMe } from "../controllers/getMe.controller.js";
import { verifyOtp } from "../controllers/otp.controller.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", async (req, res) => {
    await sendOtp(req.body.email);
    res.json({ success: true });
});
router.post("/login", login);
router.get("/me", authenticate, getMe);
router.post("/refresh", authenticate, refresh);
router.post("/logout", authenticate, logout);

export default router;
