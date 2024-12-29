import { dashBoardStats } from "@/api/dashboard";
import { getDepartments } from "@/api/dept";
import { getEmployees } from "@/api/employee";
import { Userinfo } from "@/emply-types";
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
    queryKey: ["allEmployees", token],
    queryFn: () => getEmployees(token),
  });
};

export const getDashboardStats = async (token: string) => {
  return await queryClient.fetchQuery({
    queryKey: ["dashboard", token],
    queryFn: () => dashBoardStats(token),
  });
};

export const getDeptEmployeesNStats = async (token: string, user: Userinfo) => {
  if (!token || (user && !user?.isVerified)) return null;
  const [depts, employees, stats] = await Promise.all([
    getAllDepartments(token),
    getAllEmployees(token),
    getDashboardStats(token),
  ]);
  return { depts: depts?.data, employees: employees?.data, stats: stats?.data };
};
