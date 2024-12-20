import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../config/cloudinary.js";
import Employee from "../models/employee.js";

export const updateEmployeeService = async (employeeId, employee, req) => {
  if (req.body.photo && employee.profilePhotoId !== "") {
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

  // Update employee profile photo
  employee.photo = uploadResult?.url || employee.photo;
  employee.profilePhotoId = uploadResult?.public_id || employee.profilePhotoId;
  Object.keys(req.body).forEach(
    (key) => req.body[key] === "" || null || (undefined && delete req.body[key])
  );
  const updatedEmployee = await Employee.findOneAndUpdate(
    { employeeId },
    { $set: req.body },
    {
      new: true,
    }
  );
  return updatedEmployee;
};
