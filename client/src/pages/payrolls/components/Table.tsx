/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { ActionButton, Alert, Modal, SelectField } from "@/components";
import { PayrollFormData, Userinfo } from "@/emply-types";
import { formatCurrency, formatDate } from "@/utils/format";
import handleError from "@/utils/handleError";
import { useCallback, useEffect, useState } from "react";
import { Form, Link, useFetcher, useNavigate } from "react-router";
import { toast } from "sonner";
import { FieldValues, useForm } from "react-hook-form";
import { payrollStatus } from "@/utils/constants";
import { validateField } from "@/utils/formValidate";
import { FilePenLine } from "lucide-react";

const columns = [
  { name: "PAYROLL ID", uid: "payrollId" },
  { name: "EMPLOYEE", uid: "employee" },
  { name: "PERIOD", uid: "period" },
  { name: "BASE PAY", uid: "basePay" },
  { name: "NET PAY", uid: "netPay" },
  { name: "STATUS", uid: "status" },
  { name: "CREATED AT", uid: "createdAt" },
  { name: "ACTIONS", uid: "actions" },
];

const statusColors = {
  draft: "bg-gray-200 text-gray-800",
  pending: "bg-yellow-200 text-yellow-800",
  paid: "bg-green-200 text-green-800",
  cancelled: "bg-red-200 text-red-800",
} as const;

type PayrollProps = {
  payrolls: PayrollFormData[];
  userInfo: Userinfo;
};

export default function Table({ payrolls, userInfo }: PayrollProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [selectedPayroll, setSelectedPayroll] =
    useState<PayrollFormData | null>(null);
  const [error, setError] = useState<string>("");
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const isSubmitting = fetcher.state === "submitting";

  useEffect(() => {
    if (fetcher.data?.status === 200) {
      toast.success(fetcher.data?.msg);
      setIsOpenDelete(false);
      setIsOpen(false);
      reset();
      navigate("/payrolls", { replace: true });
    }
    if (fetcher.data?.error) {
      handleError(
        setError as unknown as (error: unknown) => void,
        fetcher.data?.error
      );
    }
  }, [fetcher.data, navigate, reset]);

  const handleOpenDeleteModal = (payroll: PayrollFormData) => {
    setSelectedPayroll(payroll);
    setIsOpenDelete(true);
  };

  const handleCloseDeleteModal = () => {
    setSelectedPayroll(null);
    setIsOpenDelete(false);
  };

  const handleOpenModal = (payroll: PayrollFormData) => {
    setSelectedPayroll(payroll);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedPayroll(null);
    setIsOpen(false);
  };

  const deletePayroll = useCallback(async () => {
    fetcher.submit(
      { id: selectedPayroll?._id as string },
      {
        method: "delete",
      }
    );
  }, [fetcher, selectedPayroll?._id]);

  const onFormSubmit = useCallback(
    async (formData: FieldValues) => {
      fetcher.submit(
        {
          ...formData,
          id: selectedPayroll?._id as string,
        },
        { method: "patch" }
      );
    },
    [fetcher, selectedPayroll?._id]
  );

  const renderCell = useCallback(
    (payroll: PayrollFormData, columnKey: string) => {
      const cellValue = payroll[columnKey as keyof PayrollFormData];
      switch (columnKey) {
        case "payrollId":
          return (
            <div className="flex flex-col">
              <p className="text-sm">{payroll?.payrollId}</p>
            </div>
          );
        case "employee":
          return (
            <div className="flex flex-col">
              <p className="text-sm">
                {payroll?.userId?.firstName} {payroll?.userId?.lastName}
              </p>
            </div>
          );
        case "period":
          return (
            <div className="flex flex-col">
              <p className="text-sm">
                {formatDate(payroll?.payPeriod?.start as string)} -{" "}
                {formatDate(payroll?.payPeriod?.end as string)}
              </p>
            </div>
          );
        case "basePay":
          return (
            <div className="flex flex-col">
              <p className="text-sm">{formatCurrency(payroll?.salary)}</p>
            </div>
          );
        case "netPay":
          return (
            <div className="flex flex-col">
              <p className="text-sm">
                {formatCurrency(payroll?.net as number)}
              </p>
            </div>
          );
        case "status":
          return (
            <div
              className={`badge text-zinc-900 font-bold ${
                statusColors[payroll.status as keyof typeof statusColors]
              }`}
            >
              {cellValue as React.ReactNode}
            </div>
          );
        case "createdAt":
          return (
            <div className="flex flex-col">
              <p className="text-sm">{formatDate(cellValue as string)}</p>
            </div>
          );
        case "actions":
          return (
            <div className="flex gap-4">
              <button
                className="btn btn-xs btn-accent"
                onClick={() => handleOpenModal(payroll)}
              >
                View
              </button>
              {["admin", "super-admin"].includes(userInfo?.role) && (
                <button
                  className="btn btn-xs btn-error"
                  onClick={() => handleOpenDeleteModal(payroll)}
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
            {payrolls?.map((payroll: PayrollFormData, index) => (
              <tr key={payroll._id} className="hover">
                <td>{index + 1}</td>
                {columns.map((column) => (
                  <td key={column.uid}>{renderCell(payroll, column.uid)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal
        isOpen={isOpenDelete}
        onClose={handleCloseDeleteModal}
        title="Delete Payroll"
        id="openPayrollDeleteModal"
        classname="max-w-2xl"
      >
        <Form
          className="my-4"
          method="delete"
          action="/payrolls"
          onSubmit={deletePayroll}
        >
          {error && <Alert error={error} />}
          <div className="text-center">
            Are you sure you want to delete? <br />
            <p className="text-sm mt-4">
              Payroll Id: {selectedPayroll?.payrollId}
            </p>
            <div className="font-bold text-2xl">
              {selectedPayroll?.userId?.firstName as string}{" "}
              {selectedPayroll?.userId?.lastName as string}
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
      <Modal
        isOpen={isOpen}
        onClose={handleCloseModal}
        title="Payroll Details"
        id="openPayrollModal"
        classname="max-w-2xl"
      >
        <div className="mt-6 md:flex gap-4">
          <div className="w-full">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">
                {selectedPayroll?.userId?.firstName as string}{" "}
                {selectedPayroll?.userId?.lastName as string}
              </h1>
              <Link to={`/payrolls/${selectedPayroll?._id}/edit`}>
                <FilePenLine />
              </Link>
            </div>
            <p className="text-sm mt-4">
              Payroll Id: {selectedPayroll?.payrollId}
            </p>
            <p className="text-sm mt-4">
              Payroll Status:{" "}
              <span
                className={`badge text-base-100 ${
                  statusColors[
                    selectedPayroll?.status as keyof typeof statusColors
                  ]
                }`}
              >
                {selectedPayroll?.status}
              </span>
            </p>
            <p className="text-sm mt-4">
              Late Days: {selectedPayroll?.lateDays}
            </p>
            <p className="text-sm mt-4">
              Leave Without Pay: {selectedPayroll?.leaveWithoutPay}
            </p>
            <div className="divider"></div>
            <p className="mt-4">Allowances:</p>
            {selectedPayroll?.allowances &&
            Object.keys(selectedPayroll.allowances).length > 0 ? (
              <ul>
                {Object.entries(selectedPayroll.allowances).map(
                  ([key, value]) => (
                    <li key={key} className="text-sm">
                      {key}: {formatCurrency(value)}
                    </li>
                  )
                )}
              </ul>
            ) : (
              <p>No allowances available</p>
            )}
            <p className="mt-4">Deductions:</p>
            {selectedPayroll?.deductions &&
            Object.keys(selectedPayroll.deductions).length > 0 ? (
              <ul>
                {Object.entries(selectedPayroll.deductions).map(
                  ([key, value]) => (
                    <li key={key} className="text-sm capitalize">
                      {key}: {formatCurrency(value)}
                    </li>
                  )
                )}
              </ul>
            ) : (
              <p>No deductions available</p>
            )}
            <div className="divider"></div>
            <p className="text-sm mt-4">Tax Rate: {selectedPayroll?.tax}%</p>
            <p className="text-sm mt-4">
              Gross Pay: {formatCurrency(selectedPayroll?.salary as number)}
            </p>
            <p className="text-sm mt-4">
              Net Pay: {formatCurrency(selectedPayroll?.net as number)}
            </p>
            <p className="text-sm mt-4">
              Period: {formatDate(selectedPayroll?.payPeriod?.start as string)}{" "}
              - {formatDate(selectedPayroll?.payPeriod?.end as string)}
            </p>
            <div className="divider"></div>
          </div>
        </div>
        <Form
          method="patch"
          action="/payrolls"
          onSubmit={handleSubmit(onFormSubmit)}
        >
          <SelectField
            label="Payroll Status"
            name="status"
            id="status"
            register={register}
            errors={errors}
            placeholder="Select status"
            options={payrollStatus}
            validate={(value) => validateField(value, "Status is required")}
            defaultValue={selectedPayroll?.status as string}
            isRequired
          />
          <div className="modal-action items-center gap-4">
            <button className="btn btn-info btn-sm" onClick={handleCloseModal}>
              Close
            </button>
            <ActionButton
              type="submit"
              text="Update"
              classname="w-fit btn btn-secondary btn-sm h-[20px] text-zinc-900"
              loading={isSubmitting}
            />
          </div>
        </Form>
      </Modal>
    </>
  );
}
