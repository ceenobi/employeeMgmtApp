import jwt from "jsonwebtoken";
import Employee from "../models/employee.js";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../config/generateToken.js";
import { clearCache } from "../config/cache.js";
import tryCatch from "../utils/tryCatchFn.js";
import {
  createEmployee,
  sendLoginEmailLink,
  sendVerifyEmailLink,
  verifyEmailStatus,
  verifyLoginToken,
} from "../services/auth.service.js";
import { generateRandomUniqueId } from "../utils/generateRandomId.js";

const cookieOptions = {
  httpOnly: true, // Prevents client-side access to the cookie
  secure: process.env.NODE_ENV === "production", // HTTPS only in production
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 60 * 60 * 1000, // 1 hour
  path: "/", // Cookie is accessible on all paths
};

export const register = tryCatch(async (req, res, next) => {
  const {
    email,
    password,
    firstName,
    lastName,
    dept,
    phone,
    role,
    gender,
    dateOfBirth,
    jobType,
    jobTitle,
  } = req.body;
  if (
    !email ||
    !password ||
    !firstName ||
    !lastName ||
    !dept ||
    !phone ||
    !role ||
    !gender ||
    !dateOfBirth
  ) {
    return next(createHttpError(400, "Please fill all form fields"));
  }
  const employeeExists = await Employee.findOne({ email });
  if (employeeExists) {
    return next(
      createHttpError(400, "Employee already exists with that email")
    );
  }
  const phoneExists = await Employee.findOne({ phone });
  if (phoneExists) {
    return next(createHttpError(400, "Phone number already exists"));
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const employee = await Employee.create({
    email,
    password: hashedPassword,
    firstName,
    lastName,
    dept,
    phone,
    role,
    gender,
    dateOfBirth,
    jobType,
    jobTitle,
    employeeId: generateRandomUniqueId(),
  });
  const employeeCreated = await createEmployee(employee);
  res.status(201).json({
    employeeCreated,
    msg: "Registration success",
  });
});

export const login = tryCatch(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(createHttpError(400, "Email or password is missing"));
  }
  const employee = await Employee.findOne({ email }).select("+password");
  if (!employee) {
    return next(createHttpError(401, "Invalid email or password"));
  }
  const isPasswordValid = await bcrypt.compare(password, employee.password);
  if (!isPasswordValid) {
    return next(createHttpError(401, "Invalid email or password"));
  }
  const accessToken = generateAccessToken(employee._id, employee.role);
  const refreshToken = generateRefreshToken(employee._id, employee.role);
  res.cookie("refreshToken", refreshToken, cookieOptions);
  res.status(200).json({
    accessToken,
    msg: `Authenticated as ${employee.firstName + " " + employee.lastName}`,
  });
});

export const authenticateEmployee = tryCatch(async (req, res, next) => {
  const { id } = req.user;
  const employee = await Employee.findById(id);
  if (!employee) {
    return next(createHttpError(404, "User not found"));
  }
  // clearCache(`auth_user_${req.user.id}`);
  res.status(200).json(employee);
});

export const signInViaEmail = tryCatch(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(createHttpError(400, "Email is required"));
  }
  const employee = await Employee.findOne({ email });
  if (!employee) {
    return next(createHttpError(404, "User not found"));
  }
  await sendLoginEmailLink(employee);
  res.status(200).json({
    msg: "Email link has been sent",
  });
});

export const verifyLoginLink = tryCatch(async (req, res, next) => {
  const { userId, emailToken } = req.params;
  if (!emailToken || !userId) {
    throw createHttpError(400, "Email token or user Id not provided");
  }
  const employeeVerified = await verifyLoginToken(userId, emailToken);
  const accessToken = generateAccessToken(
    employeeVerified._id,
    employeeVerified.role
  );
  const refreshToken = generateRefreshToken(
    employeeVerified._id,
    employeeVerified.role
  );
  res.cookie("refreshToken", refreshToken, cookieOptions);
  res.status(200).json({
    accessToken,
    msg: `Authenticated as ${
      employeeVerified.firstName + " " + employeeVerified.lastName
    }`,
  });
});

export const verifyEmail = tryCatch(async (req, res, next) => {
  const { userId, verificationToken } = req.params;
  if (!userId || !verificationToken) {
    throw createHttpError(400, "UserId or verificationToken not provided");
  }
  await verifyEmailStatus(userId, verificationToken);
  res.status(200).json({
    msg: "Email verified successfully",
  });
});

export const resendVerificationEmail = tryCatch(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(createHttpError(400, "Email is required"));
  }
  const employee = await Employee.findOne({ email });
  if (!employee) {
    return next(createHttpError(404, "User not found"));
  }
  await sendVerifyEmailLink(employee);
  res.status(200).json({
    msg: "Verification Email link has been sent",
  });
});

export const refreshAccessToken = tryCatch(async (req, res, next) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return next(createHttpError(401, "No refresh token found"));
  }
  jwt.verify(refreshToken, process.env.JWT_SECRET_KEY, async (err, decoded) => {
    if (err) {
      res.clearCookie("refreshToken", cookieOptions);
      return next(createHttpError(401, "Invalid or expired refresh token"));
    }

    try {
      const employee = await Employee.findById(decoded.id);
      if (!employee) {
        return next(createHttpError(401, "Employee no longer exists"));
      }

      const accessToken = generateAccessToken(employee._id, employee.role);
      const newRefreshToken = generateRefreshToken(employee._id, employee.role);

      res.cookie("refreshToken", newRefreshToken, cookieOptions);

      res.status(200).json({
        accessToken,
        msg: "Tokens refreshed successfully",
      });
    } catch (error) {
      return next(error);
    }
  });
});

export const logout = tryCatch(async (req, res, next) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  });
  res.status(200).json({
    msg: "Logged out successfully",
  });
});
