import {
  ActionButton,
  Alert,
  SelectField,
  TextField,
  UnAuthorized,
} from "@/components";
import { PayrollFormData, Userinfo } from "@/emply-types";
import { useAuthProvider } from "@/store/authProvider";
import { inputFields, months } from "@/utils/constants";
import { formatFullDate } from "@/utils/format";
import { validateField } from "@/utils/formValidate";
import handleError from "@/utils/handleError";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { FieldValues, useForm } from "react-hook-form";
import {
  Form,
  useFetcher,
  useLoaderData,
  useNavigate,
  useRouteLoaderData,
} from "react-router";
import { toast } from "sonner";

export function Component() {
  const [error, setError] = useState<string>("");
  const { user } = useAuthProvider() as {
    user: Userinfo;
  };
  const { employees } = useRouteLoaderData("departments-employees") as {
    employees: Userinfo[];
  };
  const data = useLoaderData() as {
    data: {
      payroll: PayrollFormData;
    };
    error: {
      status: string;
      response: {
        data: {
          error: string;
        };
      };
    };
    status: number;
  };
  const { payroll } = data.data as {
    payroll: PayrollFormData;
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm();
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const redirect = () => navigate("/payrolls", { replace: true });
  const isSubmitting = fetcher.state === "submitting";
  const authRole = ["admin", "super-admin"];

  //   const parseAllowances = (allowances: Record<string, number>) => {
  //     return Object.entries(allowances).map(([key, value]) => ({
  //       name: key,
  //       value: value,
  //     }));
  //   };
  //   const allowances = parseAllowances(payroll?.allowances || {});
  //   const deductions = parseAllowances(payroll?.deductions || {});
  const empName = useMemo(() => {
    return payroll?.userId?.firstName + " " + payroll?.userId?.lastName;
  }, [payroll]);

  useEffect(() => {
    if (payroll) {
      setValue("employeeId", payroll?.employeeId);
      setValue("month", payroll?.month);
      setValue("year", payroll?.year);
      setValue("salary", payroll?.salary);
      setValue("tax", payroll?.tax);
      setValue("leaveWithoutPay", payroll?.leaveWithoutPay || "0");
      setValue("lateDays", payroll?.lateDays || "0");
      setValue("status", payroll?.status);
      setValue("payPeriodStart", formatFullDate(payroll?.payPeriod?.start));
      setValue("payPeriodEnd", formatFullDate(payroll?.payPeriod?.end));
      setValue("transport", payroll?.allowances?.transport || "0");
      setValue("food", payroll?.allowances?.food || "0");
      setValue("miscellaneous", payroll?.allowances?.miscellaneous || "0");
      setValue("late", payroll?.deductions?.late || "0");
      setValue("health", payroll?.deductions?.health || "0");
      setValue("others", payroll?.deductions?.others || "0");
      setValue("bank", payroll?.bank);
      setValue("accountNumber", payroll?.accountNumber);
      setValue("accountName", payroll?.accountName);
    }
  }, [payroll, setValue]);

  useEffect(() => {
    if (fetcher.data?.status === 200) {
      toast.success(fetcher.data?.msg);
      navigate("/payrolls", { replace: true });
    }
    if (fetcher.data?.error) {
      handleError(
        setError as unknown as (error: unknown) => void,
        fetcher.data?.error
      );
    }
  }, [fetcher.data, navigate]);

  const filterEmployeeNames = employees?.map((item: Userinfo) =>
    item.firstName.concat(" ", item.lastName)
  );

  const employeeNameObjects =
    filterEmployeeNames?.map((name: string, index: number) => ({
      _id: String(index + 1),
      name: name,
    })) || [];

  const employeeName = watch("employee");

  useEffect(() => {
    if (employeeName) {
      const getEmployee = employees.filter((item) =>
        employeeName?.includes(item.firstName.concat(" ", item.lastName))
      );
      const getEmployeeId = getEmployee.map((item) => item.employeeId);
      setValue("employeeId", getEmployeeId);
      const getEmployeeBank = getEmployee.map((item) => item.bank);
      setValue("bank", getEmployeeBank);
      const getEmployeeAccountName = getEmployee.map(
        (item) => item.accountName
      );
      setValue("accountName", getEmployeeAccountName);
      const getEmployeeAccountNumber = getEmployee.map(
        (item) => item.accountNumber
      );
      setValue("accountNumber", getEmployeeAccountNumber);
    }
  }, [employeeName, employees, setValue]);

  const formFields = ["employeeId", "bank", "accountNumber", "accountName"];
  const formFields1 = ["payPeriodStart", "payPeriodEnd"];
  const formFields2 = [
    "year",
    "salary",
    "leaveWithoutPay",
    "lateDays",
    "transport",
    "food",
    "miscellaneous",
  ];
  const formFields3 = ["late", "health", "others", "tax"];

  const onFormSubmit = async (formData: FieldValues) => {
    fetcher.submit(
      {
        ...formData,
        id: payroll?._id as string,
      },
      { method: "patch" }
    );
  };

  return (
    <>
      <Helmet>
        <title>
          {` Edit ${payroll?.userId?.firstName} ${payroll?.userId?.lastName} payroll`}
        </title>
        <meta name="description" content="Edit payroll." />
      </Helmet>
      <>
        {!authRole?.includes(user?.role) ? (
          <UnAuthorized />
        ) : (
          <>
            {" "}
            <h1 className="font-bold px-2">
              Edit {payroll?.userId?.firstName} {payroll?.userId?.lastName}{" "}
              payroll
            </h1>
            <div className="mt-6 py-4 px-2">
              {error && <Alert error={error} />}
              <Form
                method="patch"
                action={`/payrolls/${payroll?._id}/edit`}
                className="flex flex-col min-h-[calc(100vh-200px)] justify-between"
                onSubmit={handleSubmit(onFormSubmit)}
              >
                <div className="grid md:grid-cols-3 gap-8">
                  <div>
                    <SelectField
                      label="Select Employee"
                      name="employee"
                      id="employee"
                      register={register}
                      errors={errors}
                      placeholder="Select employee"
                      options={employeeNameObjects}
                      validate={(value) =>
                        validateField(value, "Please select an employee")
                      }
                      isRequired
                      defaultValue={empName}
                    />
                    {inputFields
                      .filter((item) => formFields.includes(item.name))
                      .map(
                        ({
                          type,
                          id,
                          name,
                          label,
                          placeholder,
                          validate,
                          isRequired,
                        }) => (
                          <TextField
                            type={type}
                            id={id}
                            name={name}
                            register={register}
                            label={label}
                            placeholder={placeholder}
                            key={id}
                            errors={errors}
                            validate={(value) => validate(value) || undefined}
                            isRequired={isRequired}
                          />
                        )
                      )}
                    <div className="form-control mb-3 flex flex-col gap-2">
                      <label htmlFor="month" className="label-text">
                        Month <span className="text-red-600">*</span>
                        <select
                          className="mt-2 select select-bordered w-full border-[1.5px] p-2 text-sm rounded-none"
                          id="month"
                          {...register("month", { required: true })}
                        >
                          <option disabled value="">
                            Select month
                          </option>
                          {months.map((option, index) => (
                            <option
                              key={index}
                              value={option.value}
                              className="capitalize"
                            >
                              {option.name}
                            </option>
                          ))}
                        </select>
                      </label>
                      {errors?.month && (
                        <span className="text-xs text-red-600">
                          This field is required
                        </span>
                      )}
                    </div>
                    {inputFields
                      .filter((item) => formFields1.includes(item.name))
                      .map(
                        ({
                          type,
                          id,
                          name,
                          label,
                          placeholder,
                          validate,
                          isRequired,
                          min,
                          max,
                        }) => (
                          <TextField
                            type={type}
                            id={id}
                            name={name}
                            register={register}
                            label={label}
                            placeholder={placeholder}
                            key={id}
                            errors={errors}
                            validate={(value) => validate(value) || undefined}
                            isRequired={isRequired}
                            min={min}
                            max={max}
                          />
                        )
                      )}
                  </div>
                  <div>
                    {inputFields
                      .filter((item) => formFields2.includes(item.name))
                      .map(
                        ({
                          type,
                          id,
                          name,
                          label,
                          placeholder,
                          validate,
                          isRequired,
                          min,
                        }) => (
                          <TextField
                            type={type}
                            id={id}
                            name={name}
                            register={register}
                            label={label}
                            placeholder={placeholder}
                            key={id}
                            errors={errors}
                            validate={(value) => validate(value) || undefined}
                            isRequired={isRequired}
                            min={min}
                          />
                        )
                      )}
                  </div>
                  <div>
                    {inputFields
                      .filter((item) => formFields3.includes(item.name))
                      .map(
                        ({
                          type,
                          id,
                          name,
                          label,
                          placeholder,
                          validate,
                          isRequired,
                          min,
                        }) => (
                          <TextField
                            type={type}
                            id={id}
                            name={name}
                            register={register}
                            label={label}
                            placeholder={placeholder}
                            key={id}
                            errors={errors}
                            validate={(value) => validate(value) || undefined}
                            isRequired={isRequired}
                            min={min}
                          />
                        )
                      )}
                  </div>
                </div>
                <div className="flex flex-col md:flex-row-reverse gap-6 items-center">
                  <ActionButton
                    type="submit"
                    text="Update"
                    classname="w-full md:w-[130px] bg-secondary text-zinc-800 btn-sm"
                    loading={isSubmitting}
                  />
                  <ActionButton
                    type="button"
                    text="Cancel"
                    classname="w-full md:w-[130px] btn-sm bg-primary text-zinc-800"
                    onClick={redirect}
                  />
                </div>
              </Form>
            </div>
          </>
        )}
      </>
    </>
  );
}

Component.displayName = "EditPayroll";
