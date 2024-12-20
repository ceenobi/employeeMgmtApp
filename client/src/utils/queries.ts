import { getDepartments } from "@/api/dept";
import { getEmployees } from "@/api/employee";
import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

export const getAllDepartments = async (token: string) => {
  return await queryClient.fetchQuery({
    queryKey: ["departments", token],
    queryFn: () => getDepartments(token),
  });
};

export const getAllEmployees = async (token: string) => {
  return await queryClient.fetchQuery({
    queryKey: ["employeesss", token],
    queryFn: () => getEmployees(token),
  });
};

export const getDeptNEmployees = async (token: string) => {
  if (!token) return null;
  const [depts, employees] = await Promise.all([
    getAllDepartments(token),
    getAllEmployees(token),
  ]);
  return { depts: depts.data, employees: employees.data };
};
