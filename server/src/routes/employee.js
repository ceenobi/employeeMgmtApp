import { Router } from "express";
import { apiLimiter } from "../middleware.js/rateLimit.js";
import { Roles, verifyAuth } from "../middleware.js/verifyAuth.js";
import {
  adminDeleteUserAccount,
  getAllEmployees,
  getEmployee,
  getEmployees,
  updateEmployeeProfile,
} from "../controllers/employee.js";

const router = Router();

router.get("/get", apiLimiter, verifyAuth(Roles.All), getAllEmployees);
router.get("/all", apiLimiter, verifyAuth(Roles.All), getEmployees);

router.delete(
  "/:id/delete-account",
  verifyAuth(Roles.Admin),
  adminDeleteUserAccount
);

router.get("/employee/:employeeId", verifyAuth(Roles.All), getEmployee);

router.patch(
  "/profile-update/:employeeId",
  apiLimiter,
  verifyAuth(Roles.All),
  updateEmployeeProfile
);

export default router;
