import { Router } from "express";

import protect from "../middleware/protect.js";
import * as userController from "../controllers/user.controller.js";

const router = Router();

router.get("/profile", protect, userController.getProfile);

router.patch("/profile", protect, userController.updateProfile);

export default router;
