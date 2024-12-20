import Employee from "../models/employee.js";
import createHttpError from "http-errors";
import { isValidObjectId } from "mongoose";
import tryCatch from "../utils/tryCatchFn.js";
import { updateEmployeeService } from "../services/employee.service.js";
import { clearCache } from "../config/cache.js";

export const getAllEmployees = tryCatch(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const employees = await Employee.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  if (!employees) {
    return next(createHttpError(404, "No employees found"));
  }
  const totalCount = await Employee.countDocuments();
  res.status(200).json({
    success: true,
    message: "Employees fetched successfully",
    employees,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalEmployees: totalCount,
      hasMore: skip + employees.length < totalCount,
    },
  });
});

export const adminDeleteUserAccount = tryCatch(async (req, res, next) => {
  const { id: employeeId } = req.params;
  if (!employeeId || !isValidObjectId(employeeId)) {
    return next(createHttpError(401, "Employee not found"));
  }
  // await Event.deleteMany({ userId: employeeId });
  // await Leave.deleteMany(employeeId);
  await Employee.findByIdAndDelete(employeeId);
  res.status(200).json({ msg: "Account deleted!" });
});

export const getEmployee = tryCatch(async (req, res, next) => {
  const { employeeId } = req.params;
  if (!employeeId) {
    return next(createHttpError(401, "Employee not found"));
  }
  const employee = await Employee.findOne({ employeeId });
  if (!employee) {
    return next(createHttpError(404, "Employee not found"));
  }
  res.status(200).json(employee);
});

export const updateEmployeeProfile = tryCatch(async (req, res, next) => {
  const { employeeId } = req.params;
  if (!employeeId) {
    return next(createHttpError(401, "Employee not found"));
  }
  const employee = await Employee.findOne({ employeeId });
  if (!employee) {
    return next(createHttpError(404, "Employee not found"));
  }

  const updatedEmployee = await updateEmployeeService(
    employeeId,
    employee,
    req
  );

  res
    .status(200)
    .json({ msg: "Profile updated successfully", updatedEmployee });
});

export const getEmployees = tryCatch(async (req, res, next) => {
  const employees = await Employee.find();
  if (!employees) {
    return next(createHttpError(404, "No employees found"));
  }
  clearCache("employees");
  res.status(200).json(employees);
});
