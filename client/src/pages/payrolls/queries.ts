import { getLatestPayroll } from "@/api/payroll";
import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

export const getLatestPayrollData = async (
  page: string | number,
  token: string
) => {
  if (!token) return null;
  return await queryClient.fetchQuery({
    queryKey: ["payroll", page],
    queryFn: () => getLatestPayroll(page, token),
  });
};
