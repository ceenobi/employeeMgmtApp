import mongoose from "mongoose";
import mailService from "../config/mailService.js";
import Employee from "../models/employee.js";
import Task from "../models/task.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../config/cloudinary.js";
import pusher from "../config/notification.js";
import dayjs from "dayjs";
import Notification from "../models/notifications.js";

export const createTaskService = async (userId, req) => {
  let uploadResults;
  if (req.body.file) {
    const uploadResult = await uploadToCloudinary(req.body.file, {
      folder: "emplymgmt/tasks",
    });
    uploadResults = uploadResult;
  }
  let assignedMembers;
  if (req.body.members === "") {
    assignedMembers = [];
  } else {
    const membersIds = req.body.members
      .split(",")
      .map((id) => mongoose.Types.ObjectId.createFromHexString(id.trim()));
    assignedMembers = await Employee.find({ _id: { $in: membersIds } });
  }
  const tags = req.body.tags.split(",");
  const task = await Task.create({
    ...req.body,
    members: assignedMembers,
    tags,
    createdBy: userId,
    file: uploadResults?.url,
    fileId: uploadResults?.public_id,
  });
  // Trigger Pusher notification
  pusher.trigger("task-channel", "new-task", {
    taskId: task._id,
    message: `New task created: ${task.title}`,
  });
  const notification = new Notification({
    message: `New task created: ${task.title}`,
    type: "task",
    notificationId: `task-${task._id}`,
  });
  await notification.save();
  const sendMembersMail = assignedMembers.map((member) => {
    return mailService({
      from: process.env.EMAIL,
      to: member.email,
      subject: "You have been assigned a task",
      text: `Task ${task.title} project has been created successfully. Feel free to visit the task page to view the details.`,
      username: member.firstName.concat(" ", member.lastName),
      link: `${process.env.CLIENT_URL}/tasks/${task._id}`,
      instructions: "Click the button below to view the task",
      btnText: "View task",
    });
  });
  await Promise.all(sendMembersMail);
  await task.save();
  return task;
};

export const updateTaskService = async (task, req) => {
  if (task.fileId) {
    await deleteFromCloudinary(task.fileId);
  }
  let uploadResults;
  if (req.body.file) {
    const uploadResult = await uploadToCloudinary(req.body.file, {
      folder: "emplymgmt/tasks",
    });
    uploadResults = uploadResult;
  }

  const updatedFields = {
    ...req.body,
    file: uploadResults?.url,
    fileId: uploadResults?.public_id,
    tags: req.body.tags.split(","),
    members: req.body.members
      .split(",")
      .map((id) => mongoose.Types.ObjectId.createFromHexString(id.trim())),
  };

  Object.keys(updatedFields).forEach((key) => {
    if (
      updatedFields[key] === "" ||
      updatedFields[key] === null ||
      updatedFields[key] === undefined
    ) {
      delete updatedFields[key];
    }
  });
  const updatedTask = await Task.findOneAndUpdate(
    { _id: task._id },
    { ...updatedFields },
    { new: true }
  );
  return updatedTask;
};

export const trackTaskStatus = async (tasks) => {
  const updatedTasks = await Promise.all(
    tasks.map(async (task) => {
      if (!task || !task.dueDate) return task;

      const dueDateObj = dayjs(task.dueDate);
      const currentDate = dayjs();
      if (
        dueDateObj.isBefore(currentDate, "day") &&
        task.status !== "completed"
      ) {
        task.status = "overdue";
      }
      try {
        await task.save();
      } catch (error) {
        console.error(`Failed to save task ${task._id}:`, error);
      }

      return task;
    })
  );

  return updatedTasks;
};

// export const trackTaskStatus = async (tasks) => {
//   const updatedTasks = await Promise.all(
//     tasks.map(async (task) => {
//       const dueDateObj = dayjs(task.dueDate);
//       const currentDate = dayjs();
//       if (
//         dueDateObj.isBefore(currentDate, "day") &&
//         task.status !== "completed"
//       ) {
//         task.status = "overdue";
//       }
//       await task.save();
//       return task;
//     })
//   );
//   return updatedTasks;
// };
