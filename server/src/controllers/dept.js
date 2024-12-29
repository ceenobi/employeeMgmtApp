import { clearCache } from "../config/cache.js";
import Dept from "../models/dept.js";
import Employee from "../models/employee.js";
import tryCatch from "../utils/tryCatchFn.js";
import createHttpError from "http-errors";

export const createDepartment = tryCatch(async (req, res, next) => {
  const { name, employeeId } = req.body;
  if (!name || !employeeId) {
    return next(createHttpError(400, "Department or EmployeeId is required"));
  }
  const deptNameExists = await Dept.findOne({ name: name });
  if (deptNameExists) {
    return next(createHttpError(400, "Department name already exists"));
  }
  const findEmployee = await Employee.findOne({ employeeId });
  if (!findEmployee) {
    return next(createHttpError(400, "Employee not found"));
  }
  const department = await Dept.create({
    name,
    supervisor: findEmployee.firstName.concat(" ", findEmployee.lastName),
    supervisorEmployeeId: findEmployee.employeeId,
  });
  clearCache("departments");
  clearCache("employeesByDept");
  clearCache("getADepartment");
  res
    .status(201)
    .json({ department, msg: `${name} department was created successfully` });
});

export const getDepartments = tryCatch(async (req, res, next) => {
  const departments = await Dept.find();
  if (!departments) {
    return next(createHttpError(400, "No departments found"));
  }
  const getDeptNames = departments.map((dept) => dept.name);
  const employee = await Employee.find();
  const getEmployeeDepts = employee.map((dept) => dept.dept);
  const deptCount = getEmployeeDepts.reduce((acc, dept) => {
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});
  res.status(200).json({ departments, getDeptNames, deptCount });
});

export const getEmployeesByDept = tryCatch(async (req, res, next) => {
  const { dept } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  if (!dept) {
    return next(createHttpError(400, "Department name is required"));
  }
  const employees = await Employee.find({ dept })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  if (!employees) {
    return next(createHttpError(404, "No employees found"));
  }
  const totalCount = await Employee.countDocuments({ dept });
  res.status(200).json({
    success: true,
    message: "Employees fetched successfully",
    employees,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalEmployees: totalCount,
      hasMore: skip + employees.length < totalCount,
    },
  });
});

export const updateDepartment = tryCatch(async (req, res, next) => {
  const { departmentId } = req.params;
  const { name, employeeId } = req.body;
  if (!departmentId) {
    return next(createHttpError(400, "Dept id params is required"));
  }
  const findEmployee = await Employee.findOne({ employeeId });
  if (!findEmployee) {
    return next(createHttpError(400, "Employee not found"));
  }
  const updatedFields = {
    name,
    supervisor: findEmployee.firstName.concat(" ", findEmployee.lastName),
    supervisorEmployeeId: findEmployee.employeeId,
  };

  Object.keys(updatedFields).forEach(
    (key) =>
      updatedFields[key] === "" ||
      null ||
      (undefined && delete updatedFields[key])
  );
  const department = await Dept.findByIdAndUpdate(departmentId, updatedFields, {
    new: true,
  });
  clearCache("departments");
  clearCache("employeesByDept");
  clearCache("getADepartment");
  res.status(200).json({ department, msg: "Department updated" });
});

export const getADepartment = tryCatch(async (req, res, next) => {
  const { departmentName } = req.params;
  if (!departmentName) {
    return next(createHttpError(400, "Department name is required"));
  }
  const department = await Dept.findOne({ name: departmentName });
  if (!department) {
    return next(createHttpError(400, "Department not found"));
  }
  res.status(200).json(department);
});
