import { EventFormData } from "@/emply-types";
import { eventStatusColors } from "@/utils/constants";
import { renderDate } from "@/utils/format";

export default function UpcomingEvents({
  eventsThisMonth,
}: {
  eventsThisMonth: EventFormData[];
}) {
  return (
    <div className="bg-base-200 shadow-lg p-4 rounded-lg overflow-auto h-[280px]">
      <p>Events this month</p>
      {eventsThisMonth?.slice(0, 10).map((event: EventFormData) => (
        <div key={event._id}>
          <div className="my-4">
            <div className="flex justify-between items-center">
              <p className="text-gray-400">{event.title}</p>
              <div
                className={`badge font-bold ${
                  eventStatusColors[
                    event.status as keyof typeof eventStatusColors
                  ]
                }`}
              >
                {event.status}
              </div>
            </div>
            <p>{event.description}</p>
            <p className="text-sm mt-1">{renderDate(event)}</p>
          </div>
          <div className="divider"></div>
        </div>
      ))}
    </div>
  );
}
