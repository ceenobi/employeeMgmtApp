import { Router } from "express";
import {
  createLeave,
  deleteLeave,
  getALeave,
  getAllLeaves,
  getUserLeaves,
  updateLeave,
  updateLeaveStatus,
} from "../controllers/leave.js";
import { verifyAuth, Roles } from "../middleware.js/verifyAuth.js";
import { cacheMiddleware } from "../config/cache.js";

const router = Router();

router.post("/create", verifyAuth(Roles.All), createLeave);
router.get(
  "/",
  verifyAuth(Roles.Admin),
  cacheMiddleware("leaves", 300),
  getAllLeaves
);
router.get(
  "/user",
  verifyAuth(Roles.All),
  cacheMiddleware("userLeaves", 300),
  getUserLeaves
);
router.get(
  "/:id",
  verifyAuth(Roles.All),
  cacheMiddleware("getALeave", 300),
  getALeave
);
router.patch("/:id/status", verifyAuth(Roles.Admin), updateLeaveStatus);
router.patch("/update/:id", verifyAuth(Roles.All), updateLeave);
router.delete("/:id/delete", verifyAuth(Roles.All), deleteLeave);

export default router;
