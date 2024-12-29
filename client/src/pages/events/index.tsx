import { PageContainer, Pagination } from "@/components";
import { EventFormData } from "@/emply-types";
import { Plus } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Link, Outlet, useLoaderData, useMatch } from "react-router";
import { Suspense, lazy, useMemo, useState } from "react";
import { eventStatus } from "@/utils/constants";
const EventCard = lazy(() => import("./components/EventCard"));

export function Component() {
  const [selectStatus, setSelectStatus] = useState<string>("");
  const match = useMatch("/events");
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
  const resetFilter = () => {
    setSelectStatus("");
  };

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
        <title>EMPLY | Events - Create, Edit, View</title>
        <meta name="description" content="View all events" />
      </Helmet>
      <PageContainer>
        {match ? (
          <>
            <div className="flex justify-end">
              <Link to="/events/create">
                <button className="btn btn-secondary font-bold">
                  <Plus />
                  Create Event
                </button>
              </Link>
            </div>
            <div className="mt-6 hidden lg:flex items-center bg-base-200 p-4 rounded-lg shadow-md gap-6">
              <h1 className="font-bold">Filter:</h1>
              <div className="flex flex-wrap gap-6 items-center w-full">
                <select
                  className="select select-sm select-secondary w-full max-w-[150px]"
                  value={selectStatus}
                  onChange={(e) => setSelectStatus(e.target.value)}
                >
                  <option disabled value="">
                    Filter Status
                  </option>
                  {eventStatus.map((item, index) => (
                    <option key={index} value={item.value}>
                      {item.value}
                    </option>
                  ))}
                </select>
                <button
                  onClick={resetFilter}
                  className="btn btn-sm btn-secondary"
                >
                  Reset
                </button>
              </div>
            </div>
            {events.length > 0 ? (
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
                <h1 className="text-2xl font-bold text-white">
                  No events created
                </h1>
              </div>
            )}
          </>
        ) : (
          <Outlet />
        )}
      </PageContainer>
    </>
  );
}

Component.displayName = "Events";
