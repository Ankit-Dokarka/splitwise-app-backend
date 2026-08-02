import { Router } from "express";
import protect from "../middleware/protect.js";
import * as memberController from "../controllers/member.controller.js";

const router = Router();

router.get("/", protect, memberController.getMembers);

export default router;
