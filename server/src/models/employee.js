import mongoose, { Schema, model } from "mongoose";

const employeeSchema = new Schema(
  {
    employeeId: {
      type: String,
      required: true,
      unique: true,
    },
    photo: {
      type: String,
      default: "",
    },
    profilePhotoId: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    address: {
      homeAddress: { type: String },
      state: { type: String },
      country: { type: String },
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      unique: true,
    },
    bank: {
      type: String,
      required: true,
    },
    accountNumber: {
      type: Number,
      required: true,
    },
    accountName: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    maritalStatus: {
      type: String,
      enum: ["single", "married", "divorced", "widowed"],
    },
    dept: {
      type: String,
      required: true,
    },
    jobType: {
      type: String,
      enum: ["full-time", "part-time", "contract", "hybrid", "remote"],
      default: "full-time",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "leave", "sick", "other"],
      default: "active",
    },
    jobTitle: {
      type: String,
      enum: [
        "Web developer",
        "Customer service",
        "Student laison",
        "Facility manager",
        "Utility",
        "Social media handler",
        "Head of Products",
        "HR manager",
        "UI/UX designer",
        "Data analyst",
      ],
    },
    role: {
      type: String,
      enum: ["user", "admin", "super-admin"],
      default: "user",
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String,
      select: false,
    },
    tokenExpires: {
      type: Date,
      select: false,
    },
    verificationToken: {
      type: String,
      select: false,
    },
    verificationTokenExpires: {
      type: Date,
      select: false,
    },
    leaveCount: {
      type: Number,
      default: 20,
    },
    salary: {
      type: Number,
    },
    allowance: {
      type: Number,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Employee = mongoose.models.Employee || model("Employee", employeeSchema);

export default Employee;
