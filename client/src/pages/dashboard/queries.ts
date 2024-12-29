import { dashBoardStats } from "@/api/dashboard";
import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

export const getDashboardStats = async (token: string) => {
  if (!token) return null;
  return await queryClient.fetchQuery({
    queryKey: ["dashboard", token],
    queryFn: () => dashBoardStats(token),
  });
};
