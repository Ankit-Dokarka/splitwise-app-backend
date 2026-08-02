import { Router } from "express";

import protect from "../middleware/protect.js";
import * as userController from "../controllers/user.controller.js";
import { upload } from "../config/multer.js";

const router = Router();

router.get("/profile", protect, userController.getProfile);

router.patch("/profile", protect, userController.updateProfile);

router.patch(
  "/profile/avatar",
  protect,
  upload.single("avatar"),
  userController.updateAvatar,
);

export default router;
