import { getLeaves } from "@/api/leave";
import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

export const getLeavesData = async ({
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
    queryKey: ["leaves", page],
    queryFn: () => getLeaves(page, token),
  });
};
