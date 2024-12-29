import { getEvent, getEvents } from "@/api/event";
import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

export const getEventsData = async ({
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
    queryKey: ["events", page],
    queryFn: () => getEvents(page, token),
  });
};

export const getSingleEvent = async (eventId: string, token: string) => {
  if (!token) return null;
  return await queryClient.fetchQuery({
    queryKey: ["single-event", eventId],
    queryFn: () => getEvent(eventId, token),
  });
};
