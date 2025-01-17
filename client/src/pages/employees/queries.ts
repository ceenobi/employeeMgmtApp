import { getAllEmployees, getEmployee } from "@/api/employee";
import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

export const getEmployees = async ({
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
    queryKey: ["employees", page],
    queryFn: () => getAllEmployees(page, token),
  });
};

export const getAnEmployee = async (employeeId: string, token: string) => {
  if (!token) return null;
  return await queryClient.fetchQuery({
    queryKey: ["employee", employeeId],
    queryFn: () => getEmployee(employeeId, token),
  });
};
