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
    allowances: {
      transport: req.body.transport,
      food: req.body.food,
      miscellaneous: req.body.miscellaneous,
    },
    deductions: {
      late: req.body.late,
      health: req.body.health,
      others: req.body.others,
    },
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
  const payroll = await Payroll.findById(payrollId);
  if (!payroll) {
    throw createHttpError(404, "Payroll not found");
  }
  const updatedFields = {
    ...req.body,
    allowances: {
      transport: req.body.transport,
      food: req.body.food,
      miscellaneous: req.body.miscellaneous,
    },
    deductions: {
      late: req.body.late,
      health: req.body.health,
      others: req.body.others,
    },
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
  const grossSalary = parseFloat(updatedFields.salary) || 0;
  const totalAllowances = Object.values(updatedFields.allowances).reduce(
    (acc, allowance) => acc + (parseFloat(allowance) || 0),
    0
  );

  const totalDeductions = Object.values(updatedFields.deductions).reduce(
    (acc, deduction) => acc + (parseFloat(deduction) || 0),
    0
  );
  const taxAmount = (grossSalary + totalAllowances) * (req.body.tax / 100 || 0);

  payroll.net = grossSalary + totalAllowances - totalDeductions - taxAmount;
  const updatedPayroll = await Payroll.findOneAndUpdate(
    { _id: payrollId },
    { $set: { ...updatedFields, net: payroll.net } },
    {
      new: true,
    }
  );
  return updatedPayroll;
};

//   if (req.body.allowances) {
//     Object.keys(req.body.allowances).forEach((key) => {
//       if (payroll.allowances.hasOwnProperty(key)) {
//         payroll.allowances[key] =
//           req.body.allowances[key] || payroll.allowances[key];
//       } else {
//         payroll.allowances[key] = req.body.allowances[key];
//       }
//     });
//   }

//   if (req.body.deductions) {
//     Object.keys(req.body.deductions).forEach((key) => {
//       if (payroll.deductions.hasOwnProperty(key)) {
//         payroll.deductions[key] =
//           req.body.deductions[key] || payroll.deductions[key];
//       } else {
//         payroll.deductions[key] = req.body.deductions[key];
//       }
//     });
//   }
