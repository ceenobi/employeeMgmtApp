import Payroll from "../models/payroll.js";
import createHttpError from "http-errors";
import Employee from "../models/employee.js";
import tryCatch from "../utils/tryCatchFn.js";
import { validatePayroll } from "../utils/validators.js";
import {
  createPayrollService,
  generatePayrollService,
  updatePayrollService,
  updatePayrollStatusService,
} from "../services/payroll.service.js";
import { clearCache } from "../config/cache.js";

export const createPayroll = tryCatch(async (req, res) => {
  const { error } = validatePayroll(req.body);
  if (error) throw new createHttpError(400, error.details[0].message);
  const employee = await Employee.findOne({ employeeId: req.body.employeeId });
  if (!employee) throw new createHttpError(404, "Employee not found");
  const payroll = await createPayrollService(employee, req);
  await payroll.save();
  clearCache("getPayroll");
  clearCache("employeePayrolls");
  clearCache("latestPayroll");
  res.status(201).json({
    msg: "Payroll created successfully",
    payroll,
  });
});

export const getPayrollById = tryCatch(async (req, res) => {
  const payroll = await Payroll.findOne({ _id: req.params.id }).populate(
    "userId",
    "firstName lastName"
  );
  if (!payroll) throw new createHttpError(404, "Payroll not found");
  res.json({
    msg: "Payroll fetched successfully",
    payroll,
  });
});

export const getEmployeePayrolls = tryCatch(async (req, res) => {
  const { employeeId, year, month } = req.query;
  const query = { employeeId };

  if (year) query.year = parseInt(year);
  if (month) query.month = parseInt(month);

  const payrolls = await Payroll.find(query).sort({ year: -1, month: -1 });
  res.json({
    msg: "Payrolls fetched successfully",
    payrolls,
  });
});

export const updatePayrollStatus = tryCatch(async (req, res) => {
  const { status } = req.body;
  const payroll = await Payroll.findOne({ _id: req.params.id });
  if (!payroll) throw new createHttpError(404, "Payroll not found");
  const employee = await Employee.findOne({ employeeId: payroll.employeeId });
  if (!employee) throw new createHttpError(404, "Employee not found");
  const updatedStatus = await updatePayrollStatusService(
    status,
    payroll,
    employee
  );
  clearCache("getPayroll");
  clearCache("employeePayrolls");
  clearCache("latestPayroll");
  res.json({
    msg: "Payroll status updated successfully",
    updatedStatus,
  });
});

export const generatePayrolls = tryCatch(async (req, res, next) => {
  const employeePayroll = await Payroll.find({
    autoGenerateEnabled: true,
  }).populate("userId", "firstName lastName");
  if (!employeePayroll || employeePayroll.length === 0) {
    return next(createHttpError(404, "No employees payrolls found"));
  }
  const generated = await generatePayrollService(employeePayroll);
  res.status(201).json({
    msg: `Generated ${generated.length} payrolls`,
    payrolls: generated,
  });
});

export const getLatestPayroll = tryCatch(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const latestPayroll = await Payroll.findOne().sort({ year: -1, month: -1 });
  let filter = {};
  if (latestPayroll) {
    // Step 2: Use the latest month and year to filter results
    filter = {
      month: latestPayroll.month,
      year: latestPayroll.year,
    };
  }

  const payrolls = await Payroll.find(filter)
    .populate("userId", "firstName lastName")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  if (!payrolls) {
    return next(createHttpError(404, "No payrolls found"));
  }
  const totalCount = await Payroll.countDocuments(filter);
  res.json({
    msg: "Payrolls fetched successfully",
    payrolls,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalPayrolls: totalCount,
      hasMore: skip + payrolls.length < totalCount,
    },
  });
});

export const deletePayroll = tryCatch(async (req, res, next) => {
  const { id: payrollId } = req.params;
  if (!payrollId) {
    return next(createHttpError(400, "Payroll id is required"));
  }
  const payroll = await Payroll.findByIdAndDelete(payrollId);
  if (!payroll) {
    return next(createHttpError(404, "Payroll not found"));
  }
  clearCache("getPayroll");
  clearCache("employeePayrolls");
  clearCache("latestPayroll");
  res.status(200).json({ msg: "Payroll deleted successfully" });
});

export const updatePayroll = tryCatch(async (req, res, next) => {
  const { id: payrollId } = req.params;
  if (!payrollId) {
    return next(createHttpError(400, "Payroll id is required"));
  }
  const payroll = await updatePayrollService(payrollId, req);
  if (!payroll) {
    return next(createHttpError(404, "Payroll not found"));
  }
  clearCache("getPayroll");
  clearCache("employeePayrolls");
  clearCache("latestPayroll");
  res.status(200).json({ msg: "Payroll updated successfully", payroll });
});

export const getPayroll = tryCatch(async (req, res, next) => {
  const { id: userId } = req.user;
  const { employeeId } = req.params;
  if (!employeeId) {
    return next(createHttpError(400, "Employee id is required"));
  }
  const getEmployee = await Employee.findById(userId);
  const payroll = await Payroll.find({ employeeId }).sort({ _id: -1 }).limit(1);

  if (!payroll) {
    return next(createHttpError(404, "Employee payroll not found"));
  }
  if (getEmployee.employeeId !== employeeId) {
    return next(createHttpError(403, "Access denied"));
  }
  res.status(200).json(payroll);
});
