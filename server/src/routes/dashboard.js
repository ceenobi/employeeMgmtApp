import { Router } from "express";
import { verifyAuth, Roles } from "../middleware.js/verifyAuth.js";
import { cacheMiddleware } from "../config/cache.js";
import {
  deleteNotificationsData,
  getDashboardData,
  getNotificationsData,
} from "../controllers/dashboard.js";

const router = Router();

router.get(
  "/",
  verifyAuth(Roles.All),
  cacheMiddleware("dashboard", 300),
  getDashboardData
);
router.get("/notifications", verifyAuth(Roles.All), getNotificationsData);
router.delete(
  "/notifications/delete",
  verifyAuth(Roles.All),
  deleteNotificationsData
);
export default router;
