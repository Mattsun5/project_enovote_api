import express from "express";
import { 
    allElections, 
    getElection, 
    updateElection, 
    createElection 
} from "../controllers/elections.controller.js";
import { vote } from "../controllers/vote.controller.js";
import { authenticate } from "../middlewares/auth.js";
// import { refresh } from "../controllers/candidates.controller.js";
// import { logout } from "../controllers/results.controller.js";
import { getLiveResults } from "../controllers/results.controller.js";
const router = express.Router();

router.post("/:id", createElection);
router.get("/", authenticate, allElections);
router.get("/:id",authenticate, getElection);
router.post("/:id/vote",authenticate, vote);
router.patch("/:id", authenticate, updateElection);
// router.post("/refresh", refresh);
// router.post("/logout", logout);
router.get("/:id/results", authenticate, getLiveResults);

export default router;
