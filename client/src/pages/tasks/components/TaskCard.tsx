import { TaskFormData, Userinfo } from "@/emply-types";
import {
  getRandomColor,
  taskPriorityColors,
  taskProgress,
  taskProgressColors,
  taskStatusColors,
} from "@/utils/constants";
import TimeAgo from "timeago-react";
import { useState } from "react";
import { Modal } from "@/components";
import { Helmet } from "react-helmet-async";
import { formatDate } from "@/utils/format";
import { Paperclip } from "lucide-react";
import { useAuthProvider } from "@/store/authProvider";
import { Link } from "react-router";

export default function TaskCard({
  task,
  index,
}: {
  task: TaskFormData;
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
        className="card bg-base-200 text-primary-content min-w-[100%] lg:min-w-[220px] shadow-lg border border-l-4 h-[220px]"
        style={{
          borderLeftColor: getRandomColor(task.priority),
        }}
      >
        <div className="card-body text-white p-4">
          <h2 className="card-title font-extrabold">{task.title}</h2>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-400">
              {formatTimeAgo(task.createdAt as number)}
            </p>
            <div
              className={`badge font-bold ${
                taskStatusColors[task.status as keyof typeof taskStatusColors]
              }`}
            >
              {task.status}
            </div>
          </div>
          <p className="text-zinc-300 text-sm">
            {task.description.length > 90
              ? task.description.slice(0, 90) + "..."
              : task.description}
          </p>
          <div className="card-actions justify-between items-center">
            <div className="progress">
              <div
                className="progress-bar h-[20px]"
                style={{
                  width: taskProgress[task.status as keyof typeof taskProgress],
                  backgroundColor:
                    taskProgressColors[
                      task.status as keyof typeof taskProgressColors
                    ],
                }}
              ></div>
            </div>
            <div className="avatar-group -space-x-6 rtl:space-x-reverse">
              {task?.members
                ?.slice(0, 2)
                .map((member: { _id: string; photo: string }) => (
                  <div className="avatar" key={member._id}>
                    <div className="w-6">
                      <img
                        src={
                          (member.photo as string) ||
                          "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                        }
                      />
                    </div>
                  </div>
                ))}
              {task?.members?.length > 2 && (
                <div className="avatar placeholder">
                  <div className="bg-neutral text-neutral-content w-6">
                    <span className="text-xs">
                      +{task?.members?.length - 2}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <button
              className="btn btn-xs btn-primary"
              onClick={() => handleOpenModal(index)}
            >
              View Task
            </button>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        onClose={handleCloseModal}
        title="Details"
        id="openTaskModal"
        classname="max-w-2xl"
      >
        {active === index && (
          <>
            <Helmet>
              <title>{`View Task ${task?.title}`}</title>
              <meta name="description" content="View task details" />
            </Helmet>
            <h1 className="mt-4 text-2xl font-bold">{task?.title}</h1>
            <div className="mt-4 flex items-center gap-2">
              <p>Priority:</p>
              <div className={`${taskPriorityColors[task?.priority]} badge`}>
                {task?.priority}
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <p>Progress:</p>
              <div className={`${taskStatusColors[task?.status]} badge`}>
                {task?.status}
              </div>
            </div>
            <div className="mt-6">
              <div className="divider"></div>
              <p>{task?.description}</p>
              <div className="divider"></div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <p>Start Date:</p>
              <p>{formatDate(task?.startDate)}</p>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <p>Due Date:</p>
              <p>
                {task?.dueDate ? formatDate(task?.dueDate) : "Non-specified"}
              </p>
            </div>
            <div className="divider"></div>
            {task?.tags && task?.tags?.length > 0 && (
              <div className="mt-4 flex items-center gap-2">
                <p>Tags:</p>
                <div className="flex flex-wrap gap-2">
                  {task?.tags.map((tag) => (
                    <div className="badge badge-primary" key={tag}>
                      #{tag}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-4 flex items-center gap-2">
              <p>Created By:</p>
              <div className="flex items-center gap-2">
                <img
                  src={
                    task?.createdBy?.photo ||
                    "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  }
                  alt="profile"
                  className="w-6 h-6 rounded-full"
                />
                <p className="text-sm">
                  {task?.createdBy?.firstName} {task?.createdBy?.lastName}
                </p>
              </div>
            </div>
            {task.members?.length > 0 && (
              <div className="mt-4 flex items-center gap-2">
                <p>Assignees:</p>
                {task?.members.map((member: Userinfo) => (
                  <div
                    className="flex flex-wrap items-center gap-2"
                    key={member._id}
                  >
                    <img
                      src={
                        member.photo ||
                        "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                      }
                      alt="profile"
                      className="w-6 h-6 rounded-full"
                    />
                    <p className="text-sm">
                      {member.firstName} {member.lastName}
                    </p>
                  </div>
                ))}
              </div>
            )}
            {task.file && (
              <div className="mt-4 flex items-center gap-2">
                <p>
                  <Paperclip />
                </p>
                <a
                  href={task?.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link link-hover tooltip"
                  data-tip="task-doc"
                >
                  View Document
                </a>
              </div>
            )}
            <div className="divider"></div>
            <div className="modal-action items-center gap-4">
              <button
                className="btn btn-info btn-sm"
                onClick={handleCloseModal}
              >
                Close
              </button>
              {user._id === task?.createdBy?._id && (
                <Link to={`/tasks/${task._id}/edit`}>
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
