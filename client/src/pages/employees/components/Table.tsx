/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { ActionButton, Alert, Modal } from "@/components";
import { Userinfo } from "@/emply-types";
import { employeeStatusColorMap } from "@/utils/constants";
import { formatDate } from "@/utils/format";
import handleError from "@/utils/handleError";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Form, Link, useFetcher, useNavigate } from "react-router";
import { toast } from "sonner";

const columns = [
  { name: "EMPLOYEE", uid: "employee" },
  { name: "EMAIL", uid: "email" },
  { name: "PHONE", uid: "phone" },
  { name: "DEPT", uid: "dept" },
  { name: "ROLE", uid: "role" },
  { name: "STATUS", uid: "status" },
  { name: "ACTIONS", uid: "actions" },
];
type EmployeeProps = {
  employees: Userinfo[];
  userInfo: Userinfo;
  jobTitle?: string;
  jobType?: string;
  role?: string;
  dept?: string;
  status?: string;
};

export default function Table({
  employees,
  userInfo,
  jobTitle,
  jobType,
  role,
  dept,
  status,
}: EmployeeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Userinfo | null>(
    null
  );
  const [error, setError] = useState<string>("");
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const isSubmitting = fetcher.state === "submitting";

  useEffect(() => {
    if (fetcher.data?.status === 200) {
      toast.success(fetcher.data?.msg);
      setIsOpenDelete(false);
      navigate("/employees", { replace: true });
    }
    if (fetcher.data?.error) {
      handleError(
        setError as unknown as (error: unknown) => void,
        fetcher.data?.error
      );
    }
  }, [fetcher.data, navigate]);

  const handleOpenModal = (user: Userinfo) => {
    setSelectedEmployee(user);
    setIsOpen(true);
  };
  const handleOpenDeleteModal = (user: Userinfo) => {
    setSelectedEmployee(user);
    setIsOpenDelete(true);
  };
  const handleCloseModal = () => {
    setSelectedEmployee(null);
    setIsOpen(false);
  };
  const handleCloseDeleteModal = () => {
    setSelectedEmployee(null);
    setIsOpenDelete(false);
  };

  const deleteEmployee = useCallback(async () => {
    fetcher.submit(
      { id: selectedEmployee?._id as string },
      {
        method: "delete",
      }
    );
  }, [fetcher, selectedEmployee?._id]);

  const renderCell = useCallback(
    (user: Userinfo, columnKey: React.Key) => () => {
      const cellValue = user[columnKey as keyof Userinfo];
      switch (columnKey) {
        case "employee":
          return (
            <div className="flex items-center gap-2">
              <div className="avatar placeholder">
                <div className="bg-neutral text-neutral-content w-12 rounded-full">
                  {user?.photo && (
                    <img src={user?.photo} alt={user?.firstName} />
                  )}
                  {!user?.photo && (
                    <span>
                      {user?.firstName.slice(0, 1) +
                        (user?.lastName.slice(0, 1) || "")}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col">
                <p className="font-bold text-sm mb-0">
                  {user?.firstName + " " + user?.lastName}
                </p>
                <p className="capitalize">{user?.jobTitle || user?.role}</p>
              </div>
            </div>
          );
        case "email":
          return (
            <div className="flex flex-col">
              <p className="text-sm">{user?.email}</p>
            </div>
          );
        case "phone":
          return (
            <div className="flex flex-col">
              <p className="text-sm">{user?.phone}</p>
            </div>
          );
        case "dept":
          return (
            <div className="flex flex-col">
              <p className="text-sm capitalize">{user?.dept}</p>
            </div>
          );
        case "status":
          return (
            <div
              className={`badge text-base-100 ${
                employeeStatusColorMap[
                  user.status as keyof typeof employeeStatusColorMap
                ]
              }`}
            >
              {cellValue as React.ReactNode}
            </div>
          );
        case "actions":
          return (
            <div className="flex gap-4">
              <button
                className="btn btn-xs btn-accent"
                onClick={() => handleOpenModal(user)}
              >
                View
              </button>
              {["admin", "super-admin"].includes(userInfo?.role) && (
                <button
                  className="btn btn-xs btn-error"
                  onClick={() => handleOpenDeleteModal(user)}
                >
                  Delete
                </button>
              )}
            </div>
          );
        default:
          return cellValue;
      }
    },
    [userInfo?.role]
  );

  const filteredEmployees = useMemo(() => {
    if (!jobTitle && !jobType && !role && !dept && !status) {
      return employees;
    }
    const filtered = employees.filter((employee: Userinfo) => {
      const matchesJobTitle = jobTitle ? employee.jobTitle === jobTitle : true;
      const matchesJobType = jobType ? employee.jobType === jobType : true;
      const matchesRole = role ? employee.role === role : true;
      const matchesDept = dept ? employee.dept === dept : true;
      const matchesStatus = status ? employee.status === status : true;

      return (
        matchesJobTitle &&
        matchesJobType &&
        matchesRole &&
        matchesDept &&
        matchesStatus
      );
    });
    return filtered;
  }, [dept, employees, jobTitle, jobType, role, status]);

  return (
    <>
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
            {filteredEmployees?.map((user: Userinfo, index) => (
              <tr key={user._id} className="hover">
                <td>{index + 1}</td>
                {columns.map((column) => (
                  <td key={column.uid}>{renderCell(user, column.uid)()}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal
        isOpen={isOpen}
        onClose={handleCloseModal}
        title="Employee Details"
        id="openEmployeeModal"
        classname="max-w-2xl"
      >
        <div className="mt-6 md:flex gap-4">
          <div className="md:w-1/4">
            <div>
              <div className="bg-neutral text-neutral-content w-full flex items-center justify-center text-center h-28 rounded">
                {selectedEmployee?.photo && (
                  <img
                    src={selectedEmployee?.photo}
                    alt={selectedEmployee?.firstName}
                  />
                )}
                {!selectedEmployee?.photo && (
                  <span className="text-3xl">
                    {selectedEmployee?.firstName.slice(0, 1) +
                      (selectedEmployee?.lastName.slice(0, 1) || "")}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="md:w-2/3">
            <h1 className="font-bold text-lg text-accent">
              {selectedEmployee?.firstName + " " + selectedEmployee?.lastName}
            </h1>
            <a
              href={`mailto:${selectedEmployee?.email}`}
              className="mt-2 text-sm tooltip tooltip-accent bg-accent p-1 rounded-full text-base-100 font-bold"
              data-tip={`Email ${selectedEmployee?.firstName}`}
            >
              {selectedEmployee?.email}
            </a>
            <p className="mt-2 text-md font-semibold capitalize">
              Gender: {selectedEmployee?.gender}
            </p>
            {userInfo._id === selectedEmployee?._id && (
              <p className="mt-2 text-md font-semibold">
                Date of Birth:{" "}
                {formatDate(selectedEmployee?.dateOfBirth as string)}
              </p>
            )}
            {selectedEmployee?.maritalStatus && (
              <p className="mt-2 text-md font-semibold">
                Marital Status: {selectedEmployee?.maritalStatus}
              </p>
            )}
            <p className="mt-2 text-md font-semibold">
              EmployeeId: {selectedEmployee?.employeeId}
            </p>
            <p className="mt-2 text-md font-semibold">
              Phone: {selectedEmployee?.phone}
            </p>
            <p className="mt-2 text-md font-semibold">
              Dept: {selectedEmployee?.dept}
            </p>
            <p className="mt-2 text-md font-semibold">
              Role: {selectedEmployee?.role}
            </p>
            <p className="mt-2 text-md font-semibold">
              Job Title: {selectedEmployee?.jobTitle}
            </p>
            <p className="mt-2 text-md font-semibold">
              Status: {selectedEmployee?.status}
            </p>
            <p className="mt-2 text-md font-semibold">
              Address:{" "}
              {selectedEmployee?.address
                ? selectedEmployee.address.homeAddress
                : "No address added yet."}
            </p>
            <p className="mt-2 text-md font-semibold">
              State:{" "}
              {selectedEmployee?.address
                ? selectedEmployee.address.state
                : "No state added yet."}
            </p>
            <p className="mt-2 text-md font-semibold">
              Country:{" "}
              {selectedEmployee?.address
                ? selectedEmployee.address.country
                : "No country added yet."}
            </p>
          </div>
        </div>
        <div className="modal-action items-center gap-4">
          <button className="btn btn-info btn-sm" onClick={handleCloseModal}>
            Close
          </button>
          {["admin", "super-admin"].includes(userInfo.role) && (
            <Link to={`/employees/edit/${selectedEmployee?.employeeId}`}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={handleCloseModal}
              >
                Edit
              </button>
            </Link>
          )}
        </div>
      </Modal>
      <Modal
        isOpen={isOpenDelete}
        onClose={handleCloseDeleteModal}
        title="Delete Employee"
        id="openEmployeeDeleteModal"
        classname="max-w-2xl"
      >
        <Form
          className="my-4"
          method="delete"
          action="/employees"
          onSubmit={deleteEmployee}
        >
          {error && <Alert error={error} />}
          <div className="text-center">
            Are you sure you want to delete? <br />
            <div className="font-bold text-2xl">
              {selectedEmployee?.firstName.concat(
                " ",
                selectedEmployee?.lastName
              )}
            </div>
          </div>
          <div className="mt-2 text-sm text-center">
            This action is permanent and cannot be reversed{" "}
          </div>
          <div className="modal-action items-center">
            <button
              className="btn btn-info btn-sm"
              onClick={handleCloseDeleteModal}
            >
              Close
            </button>
            <ActionButton
              type="submit"
              text="Delete"
              classname="w-fit bg-error btn-sm h-[24px]"
              loading={isSubmitting}
            />
          </div>
        </Form>
      </Modal>
    </>
  );
}
