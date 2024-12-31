import mailService from "../config/mailService.js";
import Payroll from "../models/payroll.js";
import createHttpError from "http-errors";
import { getMonthValue } from "../utils/generateRandomId.js";

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
  payroll.lastAutoGenerated = new Date();
  await payroll.save();
  await mailService({
    from: process.env.EMAIL,
    to: employee.email,
    subject: "Payroll created successfully",
    text: `Payroll for the month of ${getMonthValue()} ${
      payroll.year
    } has been created successfully.`,
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
      text: `Salary payment for the month of ${getMonthValue()} ${
        payroll.year
      } has been paid. Enjoy!`,
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

export const generatePayrollService = async (employeePayroll) => {
  const generated = [];
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  for (const employee of employeePayroll) {
    if (Payroll.shouldGeneratePayroll(employee.lastAutoGenerated)) {
      const existingPayroll = await Payroll.findOne({
        employeeId: employee.employeeId,
        month: currentMonth,
        year: currentYear,
      });
      if (existingPayroll) {
        console.log(
          `Payroll for employee ${employee.employeeId} already exists for ${currentMonth}/${currentYear}. Skipping...`
        );
        continue;
      }
      const payrollId = Payroll.generatePayrollId(employee.employeeId);
      const payrolls = new Payroll({
        employeeId: employee.employeeId,
        userId: employee.userId._id,
        month: now.getMonth() + 1,
        year: now.getFullYear(),
        bank: employee.bank,
        accountNumber: employee.accountNumber,
        accountName: employee.accountName,
        salary: employee.salary,
        tax: employee.tax,
        allowances: {
          transport: employee.allowances.transport,
          food: employee.allowances.food,
          miscellaneous: employee.allowances.miscellaneous,
        },
        deductions: {
          late: employee.deductions.late,
          health: employee.deductions.health,
          others: employee.deductions.others,
        },
        lateDays: employee.lateDays,
        leaveWithoutPay: employee.leaveWithoutPay,
        status: "draft",
        payPeriod: {
          start: new Date(now.getFullYear(), now.getMonth(), 25),
          end: new Date(now.getFullYear(), now.getMonth() + 1, 0),
        },
        payrollId,
      });
      const generatedPayroll = await payrolls.save();
      pusher.trigger("payroll-channel", "new-payroll", {
        payrollId: generatedPayroll._id,
        message: `New payroll created: ${generatedPayroll.employeeId}`,
      });
      const notification = new Notification({
        message: `New payroll created: ${generatedPayroll.employeeId}`,
        type: "payroll",
        notificationId: `payroll-${generatedPayroll._id}`,
      });
      await notification.save();
      // Populate user information
      generatedPayroll.userId = {
        _id: employee.userId._id,
        firstName: employee.userId.firstName,
        lastName: employee.userId.lastName,
      };
      generated.push(generatedPayroll);
    } else {
      throw new createHttpError(
        400,
        `Payroll for employee ${employee.employeeId} already exists for ${currentMonth}/${currentYear}. Skipping...`
      );
    }
  }
  return generated;
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
