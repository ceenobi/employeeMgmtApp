import { Modal } from "@/components";
import { EventFormData, Userinfo } from "@/emply-types";
import { useAuthProvider } from "@/store/authProvider";
import { eventStatusColors, getRandomColor } from "@/utils/constants";
import { formatTime, renderDate } from "@/utils/format";
import { Paperclip } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import TimeAgo from "timeago-react";

export default function EventCard({
  event,
  index,
}: {
  event: EventFormData;
  index: number;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [active, setActive] = useState<number>(0);
  const { user } = useAuthProvider() as {
    user: Userinfo;
  };
  const formatTimeAgo = (timestamp: number) => {
    return <TimeAgo datetime={timestamp} locale="en-US" />;
  };
  const handleOpenModal = (index: number) => {
    setActive(index);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setActive(0);
    setIsOpen(false);
  };
  return (
    <>
      <div
        className="card bg-base-200 text-primary-content min-w-[100%] lg:min-w-[220px] shadow-lg border-l-2 h-[200px] rounded-lg"
        style={{
          borderLeftColor: getRandomColor(event?.status as string),
        }}
      >
        <div className="card-body text-white p-4">
          <h2 className="card-title font-extrabold">{event?.title}</h2>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-400">
              {formatTimeAgo(event?.createdAt as number)}
            </p>
            <div
              className={`badge font-bold ${
                eventStatusColors[
                  event?.status as keyof typeof eventStatusColors
                ]
              }`}
            >
              {event?.status}
            </div>
          </div>
          <p className="text-zinc-300 text-sm">
            {event?.description?.length > 50
              ? event?.description?.slice(0, 50) + "..."
              : event?.description}
          </p>
          <p className="text-sm text-gray-400">{renderDate(event)}</p>
          <div className="card-actions justify-between items-center">
            <div className="avatar placeholder">
              <div className="bg-neutral text-neutral-content w-8 rounded-full">
                {event?.employee?.photo && (
                  <img
                    src={event?.employee?.photo}
                    alt={event?.employee?.firstName}
                  />
                )}
                {!event?.employee?.photo && (
                  <span>
                    {event?.employee?.firstName?.slice(0, 1) +
                      (event?.employee?.lastName?.slice(0, 1) || "")}
                  </span>
                )}
              </div>
            </div>
            <button
              className="btn btn-xs btn-primary"
              onClick={() => handleOpenModal(index)}
            >
              View
            </button>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        onClose={handleCloseModal}
        title="Details"
        id="openEventModal"
        classname="max-w-2xl"
      >
        {active === index && (
          <>
            <h1 className="mt-4 text-2xl font-bold">{event?.title}</h1>
            <div className="mt-4 flex items-center gap-2">
              <p>Event status:</p>
              <div
                className={`${
                  eventStatusColors[
                    event?.status as keyof typeof eventStatusColors
                  ]
                } badge font-bold`}
              >
                {event?.status}
              </div>
            </div>
            <div className="mt-6">
              <div className="divider"></div>
              <p>{event?.description}</p>
              <div className="divider"></div>
            </div>
            <div>
              <div className="mt-4 flex items-center gap-2">
                <p>Date:</p>
                <p>{renderDate(event)}</p>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <p>Time:</p>
                <p>{formatTime(event?.time as string) || "Not specified"}</p>
              </div>
            </div>
            <div className="divider"></div>
            <div className="mt-4 flex items-center gap-2">
              <p>Location:</p>
              <p>{event?.location || "Not specified"}</p>
            </div>
            <div className="divider"></div>
            <div className="mt-4 flex items-center gap-2">
              <p>Created By:</p>
              <div className="flex items-center gap-2">
                <div className="avatar placeholder">
                  <div className="bg-neutral text-neutral-content w-8 rounded-full">
                    {event?.employee?.photo && (
                      <img
                        src={event?.employee?.photo}
                        alt={event?.employee?.firstName}
                      />
                    )}
                    {!event?.employee?.photo && (
                      <span>
                        {event?.employee?.firstName?.slice(0, 1) +
                          (event?.employee?.lastName?.slice(0, 1) || "")}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm">
                  {event?.employee?.firstName} {event?.employee?.lastName}
                </p>
              </div>
            </div>
            {event?.photo && (
              <>
                <div className="divider"></div>
                <div className="mt-4 flex items-center gap-2">
                  <p>
                    <Paperclip />
                  </p>
                  <a
                    href={event?.photo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link link-hover tooltip"
                    data-tip="event-doc"
                  >
                    View Document
                  </a>
                </div>
              </>
            )}
            <div className="divider"></div>
            <div className="modal-action items-center gap-4">
              <button
                className="btn btn-info btn-sm"
                onClick={handleCloseModal}
              >
                Close
              </button>
              {user?._id === event?.employee?._id && (
                <Link to={`/events/${event?._id}/edit`}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={handleCloseModal}
                  >
                    Edit
                  </button>
                </Link>
              )}
            </div>
          </>
        )}
      </Modal>
    </>
  );
}
