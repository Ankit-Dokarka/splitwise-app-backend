import { Router } from "express";
import protect from "../middleware/protect.js";
import * as groupController from "../controllers/group.controller.js";

const router = Router();

router.post("/", protect, groupController.createGroup);
router.get("/", protect, groupController.getMyGroups);

export default router;
