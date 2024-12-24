import Leave from "../models/leave.js";
import createHttpError from "http-errors";
import { isValidObjectId } from "mongoose";
import tryCatch from "../utils/tryCatchFn.js";
import { validateLeave } from "../utils/validators.js";
import {
  createLeaveService,
  updateLeaveRequestService,
} from "../services/leave.service.js";

export const createLeave = tryCatch(async (req, res, next) => {
  const { error } = validateLeave(req.body);
  if (error) return next(createHttpError(400, error.details[0].message));
  const { id: userId } = req.user;
  const leave = await createLeaveService(userId, req);
  res.status(201).json({
    msg: "Leave created successfully",
    leave,
  });
});

export const getAllLeaves = tryCatch(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
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

export const updateLeaveStatus = tryCatch(async (req, res, next) => {
  const { id: leaveId } = req.params;
  if (!leaveId || !isValidObjectId(leaveId))
    return next(createHttpError(400, "Leave id is required"));
  const leave = await Leave.findById(leaveId);
  if (!leave) {
    return next(createHttpError(404, "Leave not found"));
  }
  const updatedLeave = await updateLeaveRequestService(leaveId, req);
  res.status(200).json({
    msg: "Leave status updated successfully",
    leave: updatedLeave,
  });
});
