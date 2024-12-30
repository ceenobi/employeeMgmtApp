import { Pagination } from "@/components";
import { EventFormData } from "@/emply-types";
import { lazy, Suspense, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLoaderData, useSearchParams } from "react-router";
import EventOptions from "./components/EventOptions";
const EventCard = lazy(() => import("./components/EventCard"));

export function Component() {
  const [selectStatus, setSelectStatus] = useState<string>("");
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("query") as string) || "";
  const data = useLoaderData() as {
    data: {
      events: EventFormData[];
      pagination: {
        currentPage: number;
        totalEvents: number;
        hasMore: boolean;
        totalPages: number;
      };
    };
  };
  const { events, pagination } = data?.data ?? {};

  const filteredEvents = useMemo(() => {
    if (!selectStatus) {
      return events;
    }
    const filtered = events?.filter((event: EventFormData) => {
      const matchesStatus = selectStatus ? event.status === selectStatus : true;
      return matchesStatus;
    });
    return filtered;
  }, [events, selectStatus]);

  return (
    <>
      <Helmet>
        <title>Search results for &quot;{query}&quot; events</title>
        <meta name="description" content="View search query" />
      </Helmet>
      <h1 className="font-bold px-2 mb-6">
        {`Search results for: "${query}" events`}{" "}
      </h1>
      <EventOptions
        selectStatus={selectStatus}
        setSelectStatus={setSelectStatus}
      />
      {events?.length > 0 ? (
        <div className="flex flex-col min-h-[calc(100vh-220px)] justify-between">
          <Suspense fallback={<div>Loading...</div>}>
            <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-center">
              {filteredEvents?.map((event, index) => (
                <EventCard key={event?._id} event={event} index={index} />
              ))}
            </div>
          </Suspense>
          <Pagination
            totalPages={pagination.totalPages}
            count={pagination.totalEvents}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <h1 className="text-2xl font-bold text-white">No events found</h1>
        </div>
      )}
    </>
  );
}

Component.displayName = "SearchEvents";
