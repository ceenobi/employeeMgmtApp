import { getADepartment, getEmployeesByDepartments } from "@/api/dept";
import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

export const getEmployeesByDept = async (
  name: string,
  page: string | number,
  token: string
) => {
  if (!token) return null;
  return await queryClient.fetchQuery({
    queryKey: ["employeesByDept", name, page],
    queryFn: () => getEmployeesByDepartments(name, page, token),
  });
};

export const getDepartment = async (departmentName: string, token: string) => {
  if (!token) return null;
  return await queryClient.fetchQuery({
    queryKey: ["single-department", departmentName],
    queryFn: () => getADepartment(departmentName, token),
  });
};
