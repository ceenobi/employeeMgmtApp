import { getTask, getTasks } from "@/api/task";
import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

export const getTasksData = async ({
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
    queryKey: ["tasks", page],
    queryFn: () => getTasks(page, token),
  });
};

export const getSingleTask = async (taskId: string, token: string) => {
  return await queryClient.fetchQuery({
    queryKey: ["single-task", taskId],
    queryFn: () => getTask(taskId, token),
  });
};