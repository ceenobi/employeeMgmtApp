import { registerUser } from "@/api/auth";
import { adminDeleteAccount, updateEmployee } from "@/api/employee";
import { UserAuthFormProps } from "@/emply-types";

export const registerAction = async (
  { request }: { request: Request },
  token: string
) => {
  const formData = await request.formData();
  const employee = Object.fromEntries(formData);
  const employeeData = employee as unknown as UserAuthFormProps;
  try {
    const res = await registerUser(employeeData, token);
    return {
      status: res.status,
      msg: res.data.msg,
    };
  } catch (error) {
    return { error };
  }
};

export const deleteEmployeeAction = async (
  { request }: { request: Request },
  token: string
) => {
  const formData = await request.formData();
  const id = Object.fromEntries(formData);
  const employeeId = id.id as string;
  try {
    const res = await adminDeleteAccount(employeeId, token);
    return {
      status: res.status,
      msg: res.data.msg,
    };
  } catch (error) {
    return { error };
  }
};

export const updateEmployeeAction = async (
  { request }: { request: Request },
  token: string
) => {
  const formData = await request.formData();
  const employee = Object.fromEntries(formData);
  const employeeId = employee.employeeId as string;
  const employeeData = employee as unknown as UserAuthFormProps;
  try {
    const res = await updateEmployee(employeeId, employeeData, token);
    return {
      status: res.status,
      msg: res.data.msg,
      updatedEmployee: res.data.updatedEmployee,
    };
  } catch (error) {
    return { error };
  }
};
