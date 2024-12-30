import Leave from "../models/leave.js";
import createHttpError from "http-errors";
import { isValidObjectId } from "mongoose";
import tryCatch from "../utils/tryCatchFn.js";
import { validateLeave } from "../utils/validators.js";
import {
  createLeaveService,
  updateLeaveRequestService,
  updateLeaveService,
} from "../services/leave.service.js";
import { deleteFromCloudinary } from "../config/cloudinary.js";
import { clearCache } from "../config/cache.js";
import Employee from "../models/employee.js";

export const createLeave = tryCatch(async (req, res, next) => {
  const { error } = validateLeave(req.body);
  if (error) return next(createHttpError(400, error.details[0].message));
  const { id: userId } = req.user;
  const leave = await createLeaveService(userId, req);
  clearCache("leaves");
  clearCache("userLeaves");
  clearCache("getALeave");
  res.status(201).json({
    msg: "Leave created successfully",
    leave,
  });
});

export const getAllLeaves = tryCatch(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const employees = await Employee.find();
  if (!employees) {
    return next(createHttpError(404, "No employees found"));
  }
  const leaves = await Leave.find()
    .populate("employee", "firstName lastName photo employeeId")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  if (!leaves) {
    return next(createHttpError(404, "No leaves found"));
  }
  const totalCount = await Leave.countDocuments();
  res.status(200).json({
    success: true,
    leaves,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalLeaves: totalCount,
      hasMore: skip + leaves.length < totalCount,
    },
  });
});

export const getUserLeaves = tryCatch(async (req, res, next) => {
  const { id: userId } = req.user;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const leaves = await Leave.find({ employee: userId })
    .populate("employee", "firstName lastName photo employeeId")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  if (!leaves) {
    return next(createHttpError(404, "No leaves found"));
  }
  const totalCount = await Leave.countDocuments({ employee: userId });
  res.status(200).json({
    success: true,
    leaves,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalLeaves: totalCount,
      hasMore: skip + leaves.length < totalCount,
    },
  });
});

export const updateLeaveStatus = tryCatch(async (req, res, next) => {
  const { id: leaveId } = req.params;
  if (!leaveId || !isValidObjectId(leaveId))
    return next(createHttpError(400, "Leave id is required"));
  const leave = await Leave.findById(leaveId);
  if (!leave) {
    return next(createHttpError(404, "Leave not found"));
  }
  const updatedLeave = await updateLeaveRequestService(leaveId, req);
  clearCache("leaves");
  clearCache("userLeaves");
  clearCache("getALeave");
  res.status(200).json({
    msg: "Leave status updated successfully",
    leave: updatedLeave,
  });
});

export const updateLeave = tryCatch(async (req, res, next) => {
  const { id: leaveId } = req.params;
  if (!leaveId || !isValidObjectId(leaveId))
    return next(createHttpError(400, "Leave id is required"));
  const leave = await Leave.findById(leaveId);
  if (!leave) {
    return next(createHttpError(404, "Leave not found"));
  }
  const updatedLeave = await updateLeaveService(leaveId, leave, req);
  clearCache("leaves");
  clearCache("userLeaves");
  clearCache("getALeave");
  res.status(200).json({
    msg: "Leave updated successfully",
    leave: updatedLeave,
  });
});

export const getALeave = tryCatch(async (req, res, next) => {
  const { id: leaveId } = req.params;
  if (!leaveId) return next(createHttpError(400, "Leave id is required"));
  const leave = await Leave.findById(leaveId);
  if (!leave) {
    return next(createHttpError(404, "Leave not found"));
  }
  res.status(200).json({
    success: true,
    leave,
  });
});

export const deleteLeave = tryCatch(async (req, res, next) => {
  const { id: userId } = req.user;
  const { id: leaveId } = req.params;
  if (!leaveId) return next(createHttpError(400, "Leave id is required"));
  const leave = await Leave.findById(leaveId);
  if (!leave) {
    return next(createHttpError(404, "Leave not found"));
  }
  if (leave.employee.toString() !== userId) {
    return next(
      createHttpError(403, "You are not authorized to delete this leave")
    );
  }
  if (leave.leaveDocId) {
    await deleteFromCloudinary(leave.leaveDocId);
  }
  await leave.deleteOne();
  clearCache("leaves");
  clearCache("userLeaves");
  clearCache("getALeave");
  res.status(200).json({ msg: "Leave deleted successfully" });
});

export const searchLeaves = tryCatch(async (req, res, next) => {
  const { id: userId } = req.user;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const query = req.query.q;
  const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
  const endDate = req.query.endDate ? new Date(req.query.endDate) : null;

  if (!query && !startDate && !endDate) {
    return next(createHttpError(400, "At least one search criterion is required"));
  }

  const sanitizeQuery = query
    ? query.toLowerCase().replace(/[^\w\s]/gi, "")
    : null;

  const filter = {
    ...(sanitizeQuery && { $text: { $search: sanitizeQuery } }),
    ...(startDate && { startDate: { $gte: startDate } }),
    ...(endDate && { endDate: { $lte: endDate } }),
  };

  // Check user role
  const roles = ["admin", "super-admin"];
  if (!roles.includes(req.user.role)) {
    // If the user is not an admin or super-admin, filter by employee ID
    filter["employee"] = userId;
  }

  const leaves = await Leave.find(filter)
    .populate("employee", "firstName lastName photo")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  if (!leaves) {
    return next(createHttpError(404, "Search results not found"));
  }
  const totalCount = await Leave.countDocuments(filter);
  res.status(200).json({
    leaves,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalLeaves: totalCount,
      hasMore: skip + leaves.length < totalCount,
    },
  });
});
