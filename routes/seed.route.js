import express from "express";
import { seedDatabase } from "../controllers/seed.controller.js";

const router = express.Router();

router.post("/seed", seedDatabase);

export default router;
