import { Router } from "express";
import { verifyAuth, Roles } from "../middleware.js/verifyAuth.js";
import { cacheMiddleware } from "../config/cache.js";
import { getDashboardData } from "../controllers/dashboard.js";

const router = Router();

router.get(
  "/",
  verifyAuth(Roles.All),
  cacheMiddleware("dashboard", 300),
  getDashboardData
);
export default router;
