import mongoose from "mongoose";
import mailService from "../config/mailService.js";
import Employee from "../models/employee.js";
import Task from "../models/task.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../config/cloudinary.js";

export const createTaskService = async (userId, req) => {
  let uploadResults;
  if (req.body.file) {
    const uploadResult = await uploadToCloudinary(req.body.file, {
      folder: "emplymgmt/tasks",
    });
    uploadResults = uploadResult;
  }
  const membersIds = req.body.members
    .split(",")
    .map((id) => mongoose.Types.ObjectId.createFromHexString(id.trim()));
  const tags = req.body.tags.split(",");
  const assignedMembers = await Employee.find({ _id: { $in: membersIds } });
  const task = await Task.create({
    ...req.body,
    members: assignedMembers,
    tags,
    createdBy: userId,
    file: uploadResults?.url,
    fileId: uploadResults?.public_id,
  });
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
