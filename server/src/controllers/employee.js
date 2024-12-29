import Employee from "../models/employee.js";
import createHttpError from "http-errors";
import { isValidObjectId } from "mongoose";
import tryCatch from "../utils/tryCatchFn.js";
import {
  updateEmployeeService,
  updatePasswordService,
} from "../services/employee.service.js";
import { clearCache } from "../config/cache.js";
import Event from "../models/event.js";
import Leave from "../models/leave.js";
import Payroll from "../models/payroll.js";
import Task from "../models/task.js";
import { deleteFromCloudinary } from "../config/cloudinary.js";

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
  await Event.deleteMany({ userId: employeeId });
  await Leave.deleteMany(employeeId);
  await Employee.findByIdAndDelete(employeeId);
  //clear payroll too
  clearCache("employees");
  clearCache("allEmployees");
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
  clearCache("employees");
  clearCache("allEmployees");
  clearCache("get-Employee");
  res
    .status(200)
    .json({ msg: "Profile updated successfully", updatedEmployee });
});

export const getEmployees = tryCatch(async (req, res, next) => {
  const employees = await Employee.find();
  if (!employees) {
    return next(createHttpError(404, "No employees found"));
  }
  res.status(200).json(employees);
});

export const getEmployeeSummary = tryCatch(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const { id: userId } = req.user;
  const employee = await Employee.findById(userId);
  if (!employee) {
    return next(createHttpError(404, "Employee not found"));
  }
  const [employeeEvents, employeeLeaves, employeePayroll, employeeTasks] =
    await Promise.all([
      Event.find({ employee: userId })
        .populate("employee", "firstName lastName photo")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Leave.find({ employee: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Payroll.find({ userId: userId })
        .populate("userId", "firstName lastName")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Task.find({ members: userId })
        .populate("members", "firstName lastName photo")
        .populate("createdBy", "firstName lastName photo")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
    ]);
  const totalEventsCount = await Event.countDocuments({ employee: userId });
  const totalLeavesCount = await Leave.countDocuments({ employee: userId });
  const totalPayrollCount = await Payroll.countDocuments({ userId: userId });
  const totalTasksCount = await Task.countDocuments({ createdBy: userId });

  res.status(200).json({
    events: employeeEvents,
    leaves: employeeLeaves,
    payrolls: employeePayroll,
    tasks: employeeTasks,
    eventPagination: {
      currentPage: page,
      totalPages: Math.ceil(totalEventsCount / limit),
      totalEvents: totalEventsCount,
      hasMore: skip + employeeEvents.length < totalEventsCount,
    },
    leavesPagination: {
      currentPage: page,
      totalPages: Math.ceil(totalLeavesCount / limit),
      totalLeaves: totalLeavesCount,
      hasMore: skip + employeeLeaves.length < totalLeavesCount,
    },
    payrollsPagination: {
      currentPage: page,
      totalPages: Math.ceil(totalPayrollCount / limit),
      totalPayroll: totalPayrollCount,
      hasMore: skip + employeePayroll.length < totalPayrollCount,
    },
    tasksPagination: {
      currentPage: page,
      totalPages: Math.ceil(totalTasksCount / limit),
      totalTasks: totalTasksCount,
      hasMore: skip + employeeTasks.length < totalTasksCount,
    },
  });
});

export const updatePassword = tryCatch(async (req, res, next) => {
  const { id: userId } = req.user;
  const { currentPassword, newPassword } = req.body;
  if (!newPassword || !currentPassword) {
    throw createHttpError(400, "Password or New Password is required");
  }
  const employee = await Employee.findById(userId).select("+password");
  if (!employee) {
    return next(createHttpError(404, "Employee not found"));
  }
  await updatePasswordService(employee, currentPassword, newPassword);
  res.status(200).json({
    success: true,
    msg: "Password updated successfully, Login with new password",
  });
});

export const deleteAccount = tryCatch(async (req, res, next) => {
  const { id: userId } = req.user;
  const employee = await Employee.findById(userId);
  if (!employee) {
    return next(createHttpError(404, "Employee not found"));
  }
  // Delete profile photo if it exists
  if (employee.profilePhotoId) {
    await deleteFromCloudinary(employee.profilePhotoId);
  }
  await Employee.findByIdAndDelete(userId);
  res.status(200).json({
    success: true,
    msg: "Account deleted successfully",
  });
});
