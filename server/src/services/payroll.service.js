import mailService from "../config/mailService.js";
import Payroll from "../models/payroll.js";
import createHttpError from "http-errors";

export const createPayrollService = async (employee, req) => {
  const payroll = new Payroll({
    ...req.body,
    userId: employee._id,
    payrollId: Payroll.generatePayrollId(
      req.body.employeeId,
      req.body.month,
      req.body.year
    ),
  });
  await payroll.save();
  await mailService({
    from: process.env.EMAIL,
    to: employee.email,
    subject: "Payroll created successfully",
    text: `Your payroll has been created payroll for the month of ${req.body.month} ${req.body.year}.`,
    username: employee.firstName.concat(" ", employee.lastName),
    btnText: "Visit",
  });
  return payroll;
};

export const updatePayrollStatusService = async (status, payroll, employee) => {
  payroll.status = status;
  await payroll.save();
  if (payroll.status === "paid") {
    await mailService({
      from: process.env.EMAIL,
      to: employee.email,
      subject: "Payroll updated successfully",
      text: `Your payroll has been updated to ${status} for the month of ${payroll.month} ${payroll.year}.`,
      username: employee.firstName.concat(" ", employee.lastName),
      btnText: "Visit",
    });
  }
  return payroll;
};

export const updatePayrollService = async (payrollId, req) => {
  const payroll = await Payroll.findOne({ payrollId });
  if (!payroll) {
    throw createHttpError(404, "Payroll not found");
  }
  Object.keys(req.body).forEach(
    (key) => req.body[key] === "" || null || (undefined && delete req.body[key])
  );
  const updatedPayroll = await Payroll.findOneAndUpdate(
    { payrollId },
    { $set: req.body },
    {
      new: true,
    }
  );
  return updatedPayroll;
};
