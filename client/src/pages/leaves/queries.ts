import { getLeave, getLeaves, getUserLeaves } from "@/api/leave";
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

export const getUserLeavesData = async ({
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
    queryKey: ["userLeaves", page],
    queryFn: () => getUserLeaves(page, token),
  });
};

export const getLeaveData = async (leaveId: string, token: string) => {
  if (!token) return null;
  return await queryClient.fetchQuery({
    queryKey: ["leave", leaveId],
    queryFn: () => getLeave(leaveId, token),
  });
};

// export const getAllLeavesData = async ({
//   request,
//   token,
// }: {
//   request: Request;
//   token: string;
// }) => {
//   const [leaves, userLeaves] = await Promise.all([
//     getLeavesData({ request, token }),
//     getUserLeavesData({ request, token }),
//   ]);
//   return { leaves, userLeaves };
// };
