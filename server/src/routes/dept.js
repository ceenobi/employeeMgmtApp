import { Router } from "express";
import {
  createDepartment,
  getADepartment,
  getDepartments,
  getEmployeesByDept,
  updateDepartment,
} from "../controllers/dept.js";
import { verifyAuth, Roles } from "../middleware.js/verifyAuth.js";
import { cacheMiddleware } from "../config/cache.js";

const router = Router();

router.post("/create", verifyAuth(Roles.Super), createDepartment);
router.get(
  "/get",
  verifyAuth(Roles.All),
  //cacheMiddleware("departments", 300),
  getDepartments
);

router.get(
  "/get/:dept",
  verifyAuth(Roles.All),
  cacheMiddleware("employeesDept", 300),
  getEmployeesByDept
);

router.patch(
  "/update/:departmentId",
  verifyAuth(Roles.Super),
  updateDepartment
);

router.get(
  "/:departmentName",
  verifyAuth(Roles.All),
  cacheMiddleware("getADepartment", 300),
  getADepartment
);

export default router;
