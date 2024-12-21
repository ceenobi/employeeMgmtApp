import express from "express";
import {
  createPayroll,
  getPayrollById,
  getEmployeePayrolls,
  updatePayrollStatus,
  generatePayrolls,
  getLatestPayroll,
  deletePayroll,
  updatePayroll,
} from "../controllers/payroll.js";
import { verifyAuth, Roles } from "../middleware.js/verifyAuth.js";

const router = express.Router();

router.post("/create", verifyAuth(Roles.Admin), createPayroll);
router.get("/:id", verifyAuth(Roles.All), getPayrollById);
router.get("/employee", verifyAuth(Roles.All), getEmployeePayrolls);
router.patch("/:id/status", verifyAuth(Roles.Admin), updatePayrollStatus);
router.post("/generate", verifyAuth(Roles.Admin), generatePayrolls);
router.get("/latest/get", verifyAuth(Roles.Admin), getLatestPayroll);
router.delete("/:id", verifyAuth(Roles.Admin), deletePayroll);
router.patch("/update/:id", verifyAuth(Roles.Admin), updatePayroll);

export default router;
