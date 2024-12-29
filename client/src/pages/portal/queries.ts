import { getEmployeeSummary } from "@/api/employee";
import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

export const getEmployeeSummaryData = async (token: string) => {
  if (!token) return null;
  return await queryClient.fetchQuery({
    queryKey: ["employeeSummary"],
    queryFn: () => getEmployeeSummary(token),
  });
};
