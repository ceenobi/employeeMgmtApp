import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../config/cloudinary.js";
import mailService from "../config/mailService.js";
import Employee from "../models/employee.js";
import Leave from "../models/leave.js";
import createHttpError from "http-errors";
import dayjs from "dayjs";

export const createLeaveService = async (userId, req) => {
  let uploadResults;
  if (req.body.leaveDoc) {
    const uploadResult = await uploadToCloudinary(req.body.leaveDoc, {
      folder: "emplymgmt/leaves",
    });
    uploadResults = uploadResult;
  }
  const employee = await Employee.findById(userId);
  if (!employee) {
    throw new createHttpError(404, "Employee not found");
  }
  const leave = await Leave.create({
    ...req.body,
    employee: employee._id,
    leaveDoc: uploadResults?.url || "",
    leaveDocId: uploadResults?.public_id || "",
  });
  await leave.save();
  const viewLeaves = `${process.env.CLIENT_URL}/leaves`;
  await mailService({
    from: process.env.EMAIL,
    to: employee.email,
    subject: "Leave application",
    text: `You applied for a ${req.body.leaveType} leave. Kindly check back to see if your leave request was approved or rejected.`,
    username: employee.firstName.concat(" ", employee.lastName),
    link: viewLeaves,
    btnText: "Visit",
    instructions: "Click the button below to view your leaves",
  });
  return leave;
};

const leaveType = [
  "vacation",
  "maternity/paternity",
  "annual leave",
  "leave without pay",
  "other",
];
export const updateLeaveRequestService = async (leaveId, req) => {
  const updatedLeave = await Leave.findByIdAndUpdate(
    leaveId,
    { status: req.body.status },
    { new: true }
  );
  const employee = await Employee.findById(updatedLeave.employee);
  if (!employee) {
    throw new createHttpError(404, "Employee not found");
  }
  let startDateObj = dayjs(updatedLeave.startDate);
  let endDateObj = dayjs(updatedLeave.endDate);
  let differenceInDays = endDateObj.diff(startDateObj, "day") + 1;
  let leaveStatus = updatedLeave.status;
  if (leaveStatus === "approved") {
    employee.leaveCount -= differenceInDays;
    // updatedLeave.isApproved = true;
    if (updatedLeave.leaveType === "sick") {
      employee.status = "sick";
    } else if (leaveType.includes(updatedLeave.leaveType)) {
      employee.status = "leave";
    }
    await employee.save();
  }
  if (leaveStatus === "rejected") {
    employee.leaveCount += differenceInDays;
    employee.status = "active";
    await employee.save();
  }
  if (updatedLeave.leaveDocId) {
    await deleteFromCloudinary(updatedLeave.leaveDocId);
  }
  const viewLeaves = `${process.env.CLIENT_URL}/leaves`;
  await mailService({
    from: process.env.EMAIL,
    to: employee.email,
    subject: "Leave application",
    text: `You application for a ${updatedLeave.leaveType} leave was ${updatedLeave.status}. If this was not what you expected, please contact your supervisor.`,
    username: employee.firstName.concat(" ", employee.lastName),
    link: viewLeaves,
    btnText: "Visit",
    instructions: "Click the button below to view your leaves",
  });
  return updatedLeave;
};
