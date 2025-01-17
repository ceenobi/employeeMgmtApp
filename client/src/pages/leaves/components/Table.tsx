import { ActionButton, Alert, Modal, SelectField } from "@/components";
import { LeaveFormData, Userinfo } from "@/emply-types";
import { leaveStatus, updateLeaveStatus } from "@/utils/constants";
import { calcLeaveDays, formatDate } from "@/utils/format";
import { validateField } from "@/utils/formValidate";
import handleError from "@/utils/handleError";
import { Paperclip } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { Form, Link, useFetcher, useNavigate } from "react-router";
import { toast } from "sonner";

type TableLeaveProps = {
  leaves: LeaveFormData[];
  user: Userinfo;
  roles: string[];
};

const columns = [
  { name: "EMPLOYEE", uid: "employee" },
  { name: "TYPE", uid: "type" },
  { name: "DATE", uid: "date" },
  { name: "DURATION", uid: "duration" },
  { name: "STATUS", uid: "status" },
  { name: "ACTION", uid: "action" },
];

export default function Table({ leaves, user, roles }: TableLeaveProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<LeaveFormData | null>(
    null
  );
  const [error, setError] = useState<string>("");
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();
  const isSubmitting = fetcher.state === "submitting";

  useEffect(() => {
    if (selectedLeave) {
      setValue("status", selectedLeave.status);
    }
  }, [selectedLeave, setValue]);

  useEffect(() => {
    if (fetcher.data?.status === 200) {
      toast.success(fetcher.data?.msg);
      setIsOpen(false);
      setIsOpenDelete(false);
      reset();
      navigate("/leaves");
    }
    if (fetcher.data?.error) {
      handleError(
        setError as unknown as (error: unknown) => void,
        fetcher.data?.error
      );
    }
  }, [fetcher.data, navigate, reset]);

  const handleOpenModal = (employee: LeaveFormData) => {
    setSelectedLeave(employee);
    setIsOpen(true);
  };
  const handleCloseModal = () => {
    setSelectedLeave(null);
    setIsOpen(false);
  };

  const handleOpenDeleteModal = (employee: LeaveFormData) => {
    setSelectedLeave(employee);
    setIsOpenDelete(true);
  };

  const handleCloseDeleteModal = () => {
    setSelectedLeave(null);
    setIsOpenDelete(false);
  };

  const onFormSubmit = useCallback(
    async (formData: FieldValues) => {
      fetcher.submit(
        {
          ...formData,
          _id: selectedLeave?._id as string,
        },
        { method: "patch", action: "/leaves" }
      );
    },
    [fetcher, selectedLeave?._id]
  );

  const deleteLeave = useCallback(async () => {
    fetcher.submit(
      { _id: selectedLeave?._id as string },
      {
        method: "delete",
      }
    );
  }, [fetcher, selectedLeave?._id]);

  const renderCell = useCallback(
    (leave: LeaveFormData, columnKey: string) => {
      switch (columnKey) {
        case "employee":
          return (
            <div className="flex items-center gap-2">
              <div className="avatar placeholder">
                <div className="bg-neutral text-neutral-content w-12 rounded-full">
                  {leave?.employee?.photo && (
                    <img
                      src={leave?.employee?.photo}
                      alt={leave?.employee?.firstName}
                    />
                  )}
                  {!leave?.employee?.photo && (
                    <span>
                      {leave?.employee?.firstName.slice(0, 1) +
                        (leave?.employee?.lastName.slice(0, 1) || "")}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col">
                <p className="font-bold text-sm mb-0">
                  {leave?.employee?.firstName + " " + leave?.employee?.lastName}
                </p>
                <p className="capitalize">{leave?.employee?.employeeId}</p>
              </div>
            </div>
          );
        case "type":
          return (
            <div className="flex flex-col">
              <p className="text-sm">{leave?.leaveType}</p>
            </div>
          );
        case "date":
          return (
            <div className="flex flex-col">
              <p className="text-sm">
                {formatDate(leave?.startDate as string) +
                  " - " +
                  formatDate(leave?.endDate as string)}
              </p>
            </div>
          );
        case "duration":
          return (
            <div className="flex flex-col">
              <p className="text-sm">{calcLeaveDays(leave)} days</p>
            </div>
          );
        case "status":
          return (
            <div
              className={`badge text-base-100 ${
                leaveStatus[leave?.status as keyof typeof leaveStatus]
              }`}
            >
              {leave?.status}
            </div>
          );
        case "action":
          return (
            <div className="flex gap-4">
              <button
                className="btn btn-xs btn-accent"
                onClick={() => handleOpenModal(leave)}
              >
                View
              </button>
              {user?._id === leave?.employee?._id && (
                <Link to={`/leaves/${leave?._id}/edit`}>
                  <button className="btn btn-xs btn-primary">Edit</button>
                </Link>
              )}
              {user?._id === leave?.employee?._id && (
                <button
                  className="btn btn-xs btn-error"
                  onClick={() => handleOpenDeleteModal(leave)}
                >
                  Delete
                </button>
              )}
            </div>
          );
        default:
          return "";
      }
    },
    [user?._id]
  );

  return (
    <>
      <div className="mt-6 overflow-x-auto">
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
            {leaves?.map((user: LeaveFormData, index) => (
              <tr key={user._id} className="hover">
                <td>{index + 1}</td>
                {columns.map((column) => (
                  <td key={column.uid}>{renderCell(user, column.uid)}</td>
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
        id="openLeaveModal"
        classname="max-w-2xl"
      >
        {error && <Alert error={error} />}
        <h1 className="mt-4 text-2xl font-bold">
          {selectedLeave?.employee?.firstName as string}{" "}
          {selectedLeave?.employee?.lastName as string}
        </h1>
        <p className="text-sm mt-4">
          Leave Status:{" "}
          <span
            className={`badge text-base-100 ${
              leaveStatus[selectedLeave?.status as keyof typeof leaveStatus]
            }`}
          >
            {selectedLeave?.status}
          </span>
        </p>
        <div className="divider"></div>
        <p>{selectedLeave?.description}</p>
        <div className="divider"></div>
        <div className="mt-4 flex items-center gap-2">
          <p>Start Date:</p>
          <p>{formatDate(selectedLeave?.startDate as string)}</p>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <p>End Date:</p>
          <p>{formatDate(selectedLeave?.endDate as string)}</p>
        </div>
        <div className="divider"></div>
        {selectedLeave?.leaveDoc && (
          <div className="mt-4 flex items-center gap-2">
            <p>
              <Paperclip />
            </p>
            <a
              href={selectedLeave?.leaveDoc}
              target="_blank"
              rel="noopener noreferrer"
              className="link link-hover tooltip"
              data-tip="leave-doc"
            >
              View Document supporting leave request
            </a>
            <div className="divider"></div>
          </div>
        )}
        {roles.includes(user?.role) ? (
          <Form
            method="patch"
            action="/leaves"
            onSubmit={handleSubmit(onFormSubmit)}
          >
            <SelectField
              label="Update Leave Status"
              name="status"
              id="status"
              register={register}
              errors={errors}
              placeholder="Select status"
              options={updateLeaveStatus}
              validate={(value) => validateField(value, "Status is required")}
              defaultValue={selectedLeave?.status as string}
              isRequired
            />
            <div className="modal-action w-full items-center gap-4">
              <ActionButton
                type="button"
                text="Close"
                classname="w-fit btn btn-info btn-sm text-zinc-900"
                onClick={handleCloseModal}
              />
              <ActionButton
                type="submit"
                text="Update"
                classname="w-fi btn btn-secondary btn-sm text-zinc-900"
                loading={isSubmitting}
              />
            </div>
          </Form>
        ) : (
          <div className="modal-action w-full items-center gap-4">
            <ActionButton
              type="button"
              text="Close"
              classname="w-fit btn btn-info btn-sm text-zinc-900"
              onClick={handleCloseModal}
            />
          </div>
        )}
      </Modal>
      <Modal
        isOpen={isOpenDelete}
        onClose={handleCloseDeleteModal}
        title="Delete Leave"
        id="openLeaveDeleteModal"
        classname="max-w-2xl"
      >
        <Form
          className="my-4"
          method="delete"
          action="/leaves"
          onSubmit={deleteLeave}
        >
          {error && <Alert error={error} />}
          <div className="text-center">Are you sure you want to delete?</div>
          <div className="mt-2 text-sm text-center">
            This action is permanent and cannot be reversed{" "}
          </div>
          <div className="modal-action items-center gap-4">
            <ActionButton
              type="button"
              onClick={handleCloseDeleteModal}
              text="Close"
              classname="w-fit btn btn-info btn-sm  text-zinc-900"
            />
            <ActionButton
              type="submit"
              text="Delete"
              classname="w-fit btn btn-error btn-sm text-zinc-900"
              loading={isSubmitting}
            />
          </div>
        </Form>
      </Modal>
    </>
  );
}
