import { ActionButton, Alert, SelectField, TextField } from "@/components";
import { Userinfo } from "@/emply-types";
import { inputFields, months } from "@/utils/constants";
import { validateField } from "@/utils/formValidate";
import handleError from "@/utils/handleError";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { FieldValues, useForm } from "react-hook-form";
import {
  Form,
  useFetcher,
  useNavigate,
  useRouteLoaderData,
} from "react-router";
import { toast } from "sonner";

export function Component() {
  const [error, setError] = useState<string>("");
  const { employees } = useRouteLoaderData("departments-employees") as {
    employees: Userinfo[];
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

  useEffect(() => {
    if (fetcher.data?.status === 201) {
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
    }
  }, [employeeName, employees, setValue]);

  const formFields = ["employeeId"];
  const formFields1 = ["year", "payPeriodStart", "payPeriodEnd"];
  const formFields2 = [
    "salary",
    "leaveWithoutPay",
    "lateDays",
    "transport",
    "food",
    "miscellaneous",
  ];
  const formFields3 = ["late", "health", "others", "tax"];

  const onFormSubmit = async (data: FieldValues) => {
    const formData = {
      ...data,
    };
    fetcher.submit(formData, { method: "post" });
  };

  return (
    <>
      <Helmet>
        <title>Create a new payroll</title>
        <meta name="description" content="Create a new payroll." />
      </Helmet>
      <h1 className="font-bold px-2 mb-6">Create a new payroll</h1>
      {error && <Alert error={error} />}
      <div className="py-4 px-2">
        <Form
          method="post"
          action="/payroll/new"
          onSubmit={handleSubmit(onFormSubmit)}
          className="flex flex-col min-h-[calc(100vh-200px)] justify-between"
        >
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <SelectField
                label="Select employee"
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
              text="Create"
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
  );
}

Component.displayName = "NewPayroll";
