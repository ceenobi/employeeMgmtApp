import crypto from "crypto";
import mailService from "../config/mailService.js";
import createHttpError from "http-errors";
import Employee from "../models/employee.js";

export const createEmployee = async (employee) => {
  const verifyToken = crypto.randomBytes(20).toString("hex");
  employee.verificationToken = verifyToken;
  employee.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;
  const employeeCreated = await employee.save();
  const verifyEmailLink = `${process.env.CLIENT_URL}/verify-email/${employeeCreated._id}/${employeeCreated.verificationToken}`;
  await mailService({
    from: process.env.EMAIL,
    to: employeeCreated.email,
    subject: "Email verification",
    text: `Welcome to Emply! Click the link below to verify your email: ${verifyEmailLink}. Link expires in 24 hours.`,
    username: employeeCreated.firstName.concat(" ", employeeCreated.lastName),
    link: verifyEmailLink,
    btnText: "Verify",
  });
  return employeeCreated;
};

export const sendLoginEmailLink = async (employee) => {
  const emailToken = crypto.randomBytes(20).toString("hex");
  employee.token = emailToken;
  employee.tokenExpires = Date.now() + 15 * 60 * 1000;
  const employeeSaved = await employee.save();
  const emailLoginLink = `${process.env.CLIENT_URL}/verify-login/${employeeSaved._id}/${emailToken}`;
  await mailService({
    from: process.env.EMAIL,
    to: employeeSaved.email,
    subject: "Email Login",
    text: `Click the link below to login to your account: ${emailLoginLink}. Link expires in 15 minutes. Ignore if you did not request this.`,
    username: employeeSaved.firstName.concat(" ", employeeSaved.lastName),
    link: emailLoginLink,
    btnText: "Login",
  });
  return employeeSaved;
};

export const verifyLoginToken = async (userId, emailToken) => {
  const employee = await Employee.findOne({
    _id: userId,
    token: emailToken,
  }).select("+token +tokenExpires");

  if (!employee) {
    throw createHttpError(404, "Invalid or expired login link");
  }
  // Check if token has expired
  if (employee.tokenExpires < Date.now()) {
    // Invalidate the token
    employee.token = undefined;
    employee.tokenExpires = undefined;
    await employee.save();
    throw createHttpError(
      401,
      "Login link has expired. Please request a new one."
    );
  }
  // Clear the token after successful verification
  employee.token = undefined;
  employee.tokenExpires = undefined;
  employee.lastLogin = Date.now();
  const employeeSaved = await employee.save();
  return employeeSaved;
};

export const verifyEmailStatus = async (userId, verificationToken) => {
  const employee = await Employee.findOne({
    _id: userId,
    verificationToken: verificationToken,
  }).select("+verificationToken +verificationTokenExpires");
  if (!employee) {
    throw createHttpError(404, "User id  or verification token not found");
  }
  if (employee.verificationTokenExpires < Date.now()) {
    employee.verificationToken = undefined;
    employee.verificationTokenExpires = undefined;
    await employee.save();
    throw createHttpError(401, "Verification link has expired");
  }
  employee.isVerified = true;
  employee.verificationToken = undefined;
  employee.verificationTokenExpires = undefined;
  const employeeSaved = await employee.save();
  return employeeSaved;
};

export const sendVerifyEmailLink = async (employee) => {
  const verifyToken = crypto.randomBytes(20).toString("hex");
  employee.verificationToken = verifyToken;
  employee.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;
  const employeeSaved = await employee.save();
  const verifyEmailLink = `${process.env.CLIENT_URL}/verify-email/${employeeSaved._id}/${employeeSaved.verificationToken}`;
  await mailService({
    from: process.env.EMAIL,
    to: employeeSaved.email,
    subject: "Email verification",
    text: `Verify your email! Click the link below to verify your email: ${verifyEmailLink}. Link expires in 24 hours.`,
    username: employeeSaved.firstName.concat(" ", employeeSaved.lastName),
    link: verifyEmailLink,
    btnText: "Verify",
  });
  return employeeSaved;
};
