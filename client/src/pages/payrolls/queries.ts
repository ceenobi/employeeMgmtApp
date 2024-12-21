import { getLatestPayroll, getPayroll } from "@/api/payroll";
import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

export const getLatestPayrollData = async ({
  request,
  token,
}: {
  request: Request;
  token: string;
}) => {
  if (!token) return null;
  const searchParams = new URL(request.url).searchParams;
  const page = searchParams.get("page") || 1;
  return await queryClient.fetchQuery({
    queryKey: ["payrolls", page],
    queryFn: () => getLatestPayroll(page, token),
  });
};

export const getPayrollData = async (payrollId: string, token: string) => {
  if (!token) return null;
  return await queryClient.fetchQuery({
    queryKey: ["payroll", payrollId],
    queryFn: () => getPayroll(payrollId, token),
  });
};
