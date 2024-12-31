import { TaskFormData } from "@/emply-types";
import { taskStatusColors } from "@/utils/constants";
import { formatDate } from "@/utils/format";

export default function TaskThisMonth({
  getTasksThisMonth,
}: {
  getTasksThisMonth: TaskFormData[];
}) {
  return (
    <div className="bg-base-200 shadow-lg p-4 rounded-lg overflow-auto h-[280px]">
      <p className="text-secondary">Tasks this month</p>
      {getTasksThisMonth?.length === 0 ? (
        <p className="text-gray-400 mt-1">No tasks this month</p>
      ) : (
        <>
          {getTasksThisMonth?.slice(0, 10).map((task: TaskFormData) => (
            <div key={task._id}>
              <div className="my-4">
                <div className="flex justify-between items-center">
                  <p className="text-gray-400">{task.title}</p>
                  <div
                    className={`${
                      task ? taskStatusColors[task?.status] : "bg-gray-200"
                    } badge`}
                  >
                    {task ? task?.status : "No Status"}
                  </div>
                </div>
                <p>{task.description}</p>
                <div className="mt-1 flex gap-4">
                  <p className="text-sm text-gray-300">
                    Start Date: {formatDate(task?.startDate as Date)}
                  </p>
                  <p className="text-sm text-gray-300">
                    Due Date:{" "}
                    {formatDate(task?.dueDate as Date) || "Non-specified"}
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <p className="text-sm">Created By:</p>
                  <div className="flex items-center gap-2">
                    <div className="avatar placeholder">
                      <div className="bg-neutral text-neutral-content w-8 rounded-full">
                        {task?.createdBy?.photo && (
                          <img
                            src={task?.createdBy?.photo}
                            alt={task?.createdBy?.firstName}
                          />
                        )}
                        {!task?.createdBy?.photo && (
                          <span>
                            {task?.createdBy?.firstName.slice(0, 1) +
                              (task?.createdBy?.lastName.slice(0, 1) || "")}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm">
                      {task?.createdBy?.firstName} {task?.createdBy?.lastName}
                    </p>
                  </div>
                </div>
              </div>
              <div className="divider"></div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
