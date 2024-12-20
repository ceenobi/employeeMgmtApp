import { createDepartment, updateDepartment } from "@/api/dept";
import { DepartmentsData } from "@/emply-types";

export const updateDepartmentAction = async (
  { request }: { request: Request },
  token: string
) => {
  const formData = await request.formData();
  const department = Object.fromEntries(formData);
  const departmentId = department.id as string;
  const departmentData = department as unknown as DepartmentsData;
  try {
    const res = await updateDepartment(departmentId, departmentData, token);
    return {
      status: res.status,
      msg: res.data.msg,
      department: res.data.department,
    };
  } catch (error) {
    return { error };
  }
};

export const createDepartmentAction = async (
  { request }: { request: Request },
  token: string
) => {
  const formData = await request.formData();
  const department = Object.fromEntries(formData);
  const departmentData = department as unknown as DepartmentsData;
  try {
    const res = await createDepartment(departmentData, token);
    return {
      status: res.status,
      msg: res.data.msg,
      department: res.data.department,
    };
  } catch (error) {
    return { error };
  }
};
