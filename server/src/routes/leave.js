import { Router } from "express";
import {
  createLeave,
  getAllLeaves,
  updateLeaveStatus,
} from "../controllers/leave.js";
import { verifyAuth, Roles } from "../middleware.js/verifyAuth.js";

const router = Router();

router.post("/create", verifyAuth(Roles.All), createLeave);
router.get("/", verifyAuth(Roles.Admin), getAllLeaves);
router.patch("/:id/status", verifyAuth(Roles.Admin), updateLeaveStatus);

export default router;
