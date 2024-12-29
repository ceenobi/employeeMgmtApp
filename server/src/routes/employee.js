import { Router } from "express";
import { apiLimiter } from "../middleware.js/rateLimit.js";
import { Roles, verifyAuth } from "../middleware.js/verifyAuth.js";
import {
  adminDeleteUserAccount,
  deleteAccount,
  getAllEmployees,
  getEmployee,
  getEmployees,
  getEmployeeSummary,
  updateEmployeeProfile,
  updatePassword,
} from "../controllers/employee.js";
import { cacheMiddleware } from "../config/cache.js";

const router = Router();

router.get(
  "/get",
  apiLimiter,
  verifyAuth(Roles.All),
  cacheMiddleware("employees", 300),
  getAllEmployees
);
router.get(
  "/all",
  verifyAuth(Roles.All),
  cacheMiddleware("allEmployees", 300),
  getEmployees
);

router.get(
  "/summary",
  verifyAuth(Roles.All),
  cacheMiddleware("employeeSummary", 300),
  getEmployeeSummary
);

router.delete(
  "/:id/delete-account",
  verifyAuth(Roles.Admin),
  adminDeleteUserAccount
);

router.get(
  "/employee/:employeeId",
  verifyAuth(Roles.All),
  cacheMiddleware("get-Employee", 300),
  getEmployee
);

router.patch(
  "/profile-update/:employeeId",
  apiLimiter,
  verifyAuth(Roles.All),
  updateEmployeeProfile
);

router.patch("/password", apiLimiter, verifyAuth(Roles.All), updatePassword);

router.delete(
  "/delete-account",
  apiLimiter,
  verifyAuth(Roles.All),
  deleteAccount
);

export default router;
