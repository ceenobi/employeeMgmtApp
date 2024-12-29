import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../config/cloudinary.js";
import Employee from "../models/employee.js";
import bcrypt from "bcrypt";
import createHttpError from "http-errors";

export const updateEmployeeService = async (employeeId, employee, req) => {
  if (employee.profilePhotoId) {
    await deleteFromCloudinary(employee.profilePhotoId);
  }
  let uploadResult;
  if (req.body.photo) {
    uploadResult = await uploadToCloudinary(req.body.photo, {
      folder: "emplymgmt/profiles",
      transformation: [
        { width: 500, height: 500, crop: "fill" },
        { quality: "auto" },
        { fetch_format: "auto" },
      ],
    });
  }
  const updatedFields = {
    ...req.body,
    photo: uploadResult?.url,
    profilePhotoId: uploadResult?.public_id,
    address: {
      homeAddress: req.body.homeAddress,
      state: req.body.state,
      country: req.body.country,
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
  const updatedEmployee = await Employee.findOneAndUpdate(
    { employeeId },
    { ...updatedFields },
    {
      new: true,
    }
  );
  return updatedEmployee;
};

export const updatePasswordService = async (
  employee,
  currentPassword,
  newPassword
) => {
  const isPasswordValid = await bcrypt.compare(
    currentPassword,
    employee.password
  );
  if (!isPasswordValid) {
    throw new createHttpError(401, "Invalid current password");
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);
  employee.password = hashedPassword;
  await employee.save();
};
