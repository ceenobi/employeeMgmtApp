import createHttpError from "http-errors";
import { validateTask } from "../utils/validators.js";
import Task from "../models/task.js";
import {
  createTaskService,
  updateTaskService,
} from "../services/task.service.js";
import tryCatch from "../utils/tryCatchFn.js";

export const createTask = tryCatch(async (req, res, next) => {
  const { error } = validateTask(req.body);
  if (error) return next(createHttpError(400, error.details[0].message));
  const { id: userId } = req.user;
  const task = await createTaskService(userId, req);
  res.status(201).json({
    msg: "Task created successfully",
    task,
  });
});

export const getTasks = tryCatch(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const tasks = await Task.find()
    .populate("members", "firstName lastName photo")
    .populate("createdBy", "firstName lastName photo")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  if (!tasks) {
    return next(createHttpError(404, "No tasks found"));
  }
  const totalCount = await Task.countDocuments();
  res.status(200).json({
    success: true,
    tasks,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalTasks: totalCount,
      hasMore: skip + tasks.length < totalCount,
    },
  });
});

export const getTask = tryCatch(async (req, res, next) => {
  const { id: taskId } = req.params;
  if (!taskId) return next(createHttpError(400, "Task id is required"));
  const task = await Task.findById(taskId)
    .populate("members", "firstName lastName photo")
    .populate("createdBy", "firstName lastName photo");
  if (!task) {
    return next(createHttpError(404, "Task not found"));
  }
  res.status(200).json({
    success: true,
    task,
  });
});

export const updateTask = tryCatch(async (req, res, next) => {
  const { id: userId } = req.user;
  const { id: taskId } = req.params;
  if (!taskId) return next(createHttpError(400, "Task id is required"));
  const task = await Task.findById(taskId);
  if (!task) {
    return next(createHttpError(404, "Task not found"));
  }
  if (task.createdBy.toString() !== userId) {
    return next(
      createHttpError(403, "You are not authorized to update this task")
    );
  }
  const updatedTask = await updateTaskService(task, req);
  res.status(200).json({
    msg: "Task updated successfully",
    task: updatedTask,
  });
});
