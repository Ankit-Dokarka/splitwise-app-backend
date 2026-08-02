import { Router } from "express";
import {
  checkAuth,
  googleAuth,
  logout,
} from "../controllers/auth.controller.js";
import protect from "../middleware/protect.js";

const router = Router();

router.post("/google", googleAuth);
router.post("/logout", logout);
router.get("/check", protect, checkAuth);

export default router;
