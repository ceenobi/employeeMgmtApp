import { ActionButton, Alert, Modal, SelectField } from "@/components";
import { TaskFormData, Userinfo } from "@/emply-types";
import { useAuthProvider } from "@/store/authProvider";
import {
  taskPriorityColors,
  taskProgress,
  taskProgressColors,
  taskStatus,
  taskStatusColors,
} from "@/utils/constants";
import { formatDate } from "@/utils/format";
import { validateField } from "@/utils/formValidate";
import handleError from "@/utils/handleError";
import { FilePenLine, Paperclip } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { Form, Link, useFetcher, useNavigate } from "react-router";
import { toast } from "sonner";

const columns = [
  { name: "CREATEDBY", uid: "createdBy" },
  { name: "TITLE", uid: "title" },
  { name: "DUE", uid: "dueDate" },
  { name: "ASSIGNEES", uid: "asignees" },
  { name: "PRIORITY", uid: "priority" },
  { name: "PROGRESS", uid: "progress" },
  { name: "ACTION", uid: "action" },
];

type TasksProps = {
  filteredTasks: TaskFormData[];
};

export default function Table({ filteredTasks }: TasksProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskFormData | null>(null);
  const [error, setError] = useState<string>("");
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const isSubmitting = fetcher.state === "submitting";
  const { user } = useAuthProvider() as {
    user: Userinfo;
  };
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (fetcher.data?.status === 200) {
      toast.success(fetcher.data?.msg);
      setIsOpenDelete(false);
      setIsOpen(false);
      setSelectedTask(null)
      navigate("/tasks", { replace: true });
    }
    if (fetcher.data?.error) {
      handleError(
        setError as unknown as (error: unknown) => void,
        fetcher.data?.error
      );
    }
  }, [fetcher.data, navigate]);

  useEffect(() => {
    if (selectedTask) {
      setValue("status", selectedTask.status);
    }
  }, [selectedTask, setValue]);

  const handleOpenModal = (task: TaskFormData) => {
    setSelectedTask(task);
    setIsOpen(true);
    setError("");
  };
  const handleCloseModal = () => {
    setSelectedTask(null);
    setIsOpen(false);
    setError("");
  };
  const handleOpenDeleteModal = (task: TaskFormData) => {
    setSelectedTask(task);
    setIsOpenDelete(true);
    setError("");
  };
  const handleCloseDeleteModal = () => {
    setSelectedTask(null);
    setIsOpenDelete(false);
    setError("");
  };

  const handleTagClick = (tag: string) => {
    navigate(`/tasks/search?query=${tag}`);
    setIsOpen(false);
  };

  const deleteTask = useCallback(async () => {
    fetcher.submit(
      { _id: selectedTask?._id as string },
      {
        method: "delete",
      }
    );
  }, [fetcher, selectedTask?._id]);

  const onFormSubmit = useCallback(
    async (formData: FieldValues) => {
      fetcher.submit(
        {
          ...formData,
          _id: selectedTask?._id as string,
        },
        { method: "patch" }
      );
    },
    [fetcher, selectedTask?._id]
  );

  const renderCell = useCallback(
    (task: TaskFormData, columnKey: React.Key) => () => {
      switch (columnKey) {
        case "createdBy":
          return (
            <div className="flex items-center gap-2">
              {task?.createdBy?.photo && (
                <img
                  src={task?.createdBy?.photo}
                  alt={task?.createdBy?.firstName}
                  className="w-8 h-8 rounded-full"
                />
              )}
              {!task?.createdBy?.photo && (
                <span>
                  {task?.createdBy?.firstName.slice(0, 1) +
                    (task?.createdBy?.lastName.slice(0, 1) || "")}
                </span>
              )}
              <p className="text-sm">
                {task?.createdBy?.firstName} {task?.createdBy?.lastName}
              </p>
            </div>
          );
        case "title":
          return <p className="text-zinc-300 text-sm">{task?.title}</p>;
        case "dueDate":
          return (
            <p>{task?.dueDate ? formatDate(task?.dueDate) : "Non-specified"}</p>
          );
        case "asignees":
          return (
            <>
              {task?.members.map((member: Userinfo) => (
                <div
                  className="flex flex-wrap items-center gap-2"
                  key={member._id}
                >
                  {member?.photo && (
                    <img
                      src={member?.photo}
                      alt={member?.firstName}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  {!member?.photo && (
                    <span>
                      {member?.firstName.slice(0, 1) +
                        (member?.lastName.slice(0, 1) || "")}
                    </span>
                  )}
                </div>
              ))}
            </>
          );
        case "priority":
          return (
            <div className={`${taskPriorityColors[task?.priority]} badge`}>
              {task?.priority}
            </div>
          );
        case "progress":
          return (
            <div className="progress">
              <div
                className="progress-bar h-[20px]"
                style={{
                  width:
                    taskProgress[task?.status as keyof typeof taskProgress],
                  backgroundColor:
                    taskProgressColors[
                      task?.status as keyof typeof taskProgressColors
                    ],
                }}
              ></div>
            </div>
          );
        case "action":
          return (
            <div className="flex gap-4">
              <button
                className="btn btn-xs btn-accent"
                onClick={() => handleOpenModal(task)}
              >
                View
              </button>
              {user?._id === task?.createdBy?._id && (
                <button
                  className="btn btn-xs btn-error"
                  onClick={() => handleOpenDeleteModal(task)}
                >
                  Delete
                </button>
              )}
            </div>
          );
        default:
          return task[columnKey as keyof TaskFormData];
      }
    },
    [user?._id]
  );
  return (
    <>
      {" "}
      <div className="mt-6 overflow-x-auto w-[90vw] md:w-full">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>#</th>
              {columns.map((item) => (
                <th key={item.uid}>{item.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredTasks?.map((task: TaskFormData, index) => (
              <tr key={task?._id} className="hover">
                <td>{index + 1}</td>
                {columns.map((column) => (
                  <td key={column.uid}>{renderCell(task, column.uid)()}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal
        isOpen={isOpen}
        onClose={handleCloseModal}
        title="Details"
        id="openTaskModal"
        classname="max-w-2xl"
      >
        <>
          {error && <Alert error={error} />}
          <div className="mt-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">{selectedTask?.title}</h1>
            {user?._id === selectedTask?.createdBy?._id && (
              <Link
                to={`/tasks/${selectedTask?._id}/edit`}
                className="tooltip"
                onClick={handleCloseModal}
                data-tip="Edit task"
              >
                <FilePenLine />
              </Link>
            )}
          </div>
          <div className="mt-4 flex items-center gap-2">
            <p>Priority:</p>
            <div
              className={`${
                selectedTask
                  ? taskPriorityColors[selectedTask.priority]
                  : "bg-gray-200"
              } badge`}
            >
              {selectedTask ? selectedTask.priority : "No Priority"}
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <p>Progress:</p>
            <div
              className={`${
                selectedTask
                  ? taskStatusColors[selectedTask?.status]
                  : "bg-gray-200"
              } badge`}
            >
              {selectedTask ? selectedTask?.status : "No Status"}
            </div>
          </div>
          <div className="mt-6">
            <div className="divider"></div>
            <p>{selectedTask?.description}</p>
            <div className="divider"></div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <p>Start Date:</p>
            <p>{formatDate(selectedTask?.startDate as Date)}</p>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <p>Due Date:</p>
            <p>
              {selectedTask?.dueDate
                ? formatDate(selectedTask?.dueDate)
                : "Non-specified"}
            </p>
          </div>
          <div className="divider"></div>
          {selectedTask?.tags && selectedTask?.tags?.length > 0 && (
            <div className="mt-4 flex items-center gap-2">
              <p>Tags:</p>
              <div className="flex flex-wrap gap-2">
                {selectedTask?.tags.map((tag) => (
                  <div
                    className="badge badge-primary cursor-pointer"
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                  >
                    #{tag}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="mt-4 flex items-center gap-2">
            <p>Created By:</p>
            <div className="flex items-center gap-2">
              {selectedTask?.createdBy?.photo && (
                <img
                  src={selectedTask?.createdBy?.photo}
                  alt={selectedTask?.createdBy?.firstName}
                  className="w-8 h-8 rounded-full"
                />
              )}
              {!selectedTask?.createdBy?.photo && (
                <span>
                  {selectedTask?.createdBy?.firstName.slice(0, 1) +
                    (selectedTask?.createdBy?.lastName.slice(0, 1) || "")}
                </span>
              )}
              <p className="text-sm">
                {selectedTask?.createdBy?.firstName}{" "}
                {selectedTask?.createdBy?.lastName}
              </p>
            </div>
          </div>
          {selectedTask?.members?.length > 0 && (
            <div className="mt-4 flex items-center gap-2">
              <p>Assignees:</p>
              {selectedTask?.members.map((member: Userinfo) => (
                <div
                  className="flex flex-wrap items-center gap-2"
                  key={member._id}
                >
                  {member?.photo && (
                    <img
                      src={member?.photo}
                      alt={member?.firstName}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  {!member?.photo && (
                    <span>
                      {member?.firstName.slice(0, 1) +
                        (member?.lastName.slice(0, 1) || "")}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
          {selectedTask && selectedTask.file && (
            <div className="mt-4 flex items-center gap-2">
              <p>
                <Paperclip />
              </p>
              <a
                href={selectedTask?.file}
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
          <Form
            className="my-4"
            method="patch"
            action="/tasks"
            onSubmit={handleSubmit(onFormSubmit)}
          >
            {user?._id === selectedTask?.createdBy?._id && (
              <SelectField
                label="Update Task Status"
                name="status"
                id="status"
                register={register}
                errors={errors}
                placeholder="Select status"
                options={taskStatus}
                validate={(value) => validateField(value, "Status is required")}
                defaultValue={selectedTask?.status as string}
                isRequired
              />
            )}
            <div className="modal-action items-center gap-4">
              <ActionButton
                type="button"
                text="Close"
                classname="w-fit btn btn-info btn-sm text-zinc-900"
                onClick={handleCloseModal}
              />
              {user?._id === selectedTask?.createdBy?._id && (
                <ActionButton
                  type="submit"
                  text="Update"
                  classname="w-fit btn btn-secondary btn-sm h-[20px] text-zinc-900"
                  loading={isSubmitting}
                />
              )}
            </div>
          </Form>
        </>
      </Modal>
      <Modal
        isOpen={isOpenDelete}
        onClose={handleCloseDeleteModal}
        title="Delete Task"
        id="openTaskDeleteModal"
        classname="max-w-2xl"
      >
        <Form
          className="my-4"
          method="delete"
          action="/tasks"
          onSubmit={deleteTask}
        >
          {error && <Alert error={error} />}
          <div className="text-center">
            Are you sure you want to delete? <br />
            <div className="font-bold text-2xl">{selectedTask?.title}</div>
          </div>
          <div className="mt-2 text-sm text-center">
            This action is permanent and cannot be reversed{" "}
          </div>
          <div className="modal-action items-center">
            <ActionButton
              type="button"
              text="Close"
              classname="w-fit bg-accent btn-sm h-[20px] text-zinc-900"
              onClick={handleCloseDeleteModal}
            />
            <ActionButton
              type="submit"
              text="Delete"
              classname="w-fit bg-error btn-sm h-[20px] text-zinc-900"
              loading={isSubmitting}
            />
          </div>
        </Form>
      </Modal>
    </>
  );
}
