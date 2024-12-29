import { Helmet } from "react-helmet-async";
import {
  Form,
  useFetcher,
  useNavigate,
  useRouteLoaderData,
} from "react-router";
import { FieldValues, useForm } from "react-hook-form";
import { toast } from "sonner";
import handleError from "@/utils/handleError";
import { Userinfo } from "@/emply-types";
import { useEffect, useState } from "react";
import { inputFields } from "@/utils/constants";
import { ActionButton, Alert, SelectField, TextField } from "@/components";
import { validateField } from "@/utils/formValidate";

export function Component() {
  const [error, setError] = useState<string>("");
  const { employees } = useRouteLoaderData("departments-employees") as {
    employees: Userinfo[];
  };
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm();

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
      const getEmployee = employees?.filter((item) =>
        employeeName?.includes(item.firstName.concat(" ", item.lastName))
      );
      const getEmployeeId = getEmployee.map((item) => item.employeeId);
      setValue("employeeId", getEmployeeId);
    }
  }, [employeeName, employees, setValue]);

  useEffect(() => {
    if (fetcher.data?.status === 201) {
      toast.success(fetcher.data?.msg);
      navigate("/departments", { replace: true });
    }
    if (fetcher.data?.error) {
      handleError(
        setError as unknown as (error: unknown) => void,
        fetcher.data?.error
      );
    }
  }, [fetcher.data, navigate]);

  const isSubmitting = fetcher.state === "submitting";
  const formFields = ["name"];
  const formFields1 = ["employeeId"];

  const onFormSubmit = async (data: FieldValues) => {
    fetcher.submit(data, { method: "post" });
  };

  return (
    <>
      <Helmet>
        <title>Create a new department</title>
        <meta
          name="description"
          content="Create a new department, appoint a supervisor."
        />
      </Helmet>
      <h1 className="font-bold px-2 mb-6">Create a new department</h1>
      {error && <Alert error={error} />}
      <div className="max-w-[450px] mx-auto px-2">
        <Form
          method="post"
          action="/departments/new"
          onSubmit={handleSubmit(onFormSubmit)}
        >
          <div className="flex flex-col gap-4">
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
            <SelectField
              label="Select supervisor"
              name="employee"
              id="employee"
              register={register}
              errors={errors}
              placeholder="Select supervisor"
              options={employeeNameObjects}
              validate={(value) =>
                validateField(value, "Please select a supervisor")
              }
              isRequired
            />
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
          </div>
          <div>
            <p className="text-sm mb-4">
              Note: Selecting a supervisor will automatically set the employeeId
              field in the form.
            </p>
            <div className="flex flex-col md:flex-row-reverse gap-6 items-center">
              <ActionButton
                type="submit"
                text="Create"
                classname="w-full md:w-[130px] bg-secondary text-base-200 btn-sm"
                loading={isSubmitting}
              />
              <ActionButton
                type="button"
                text="Cancel"
                classname="w-full md:w-[130px] btn-sm bg-primary text-base-200"
                onClick={() => navigate(-1)}
              />
            </div>
          </div>
        </Form>
      </div>
    </>
  );
}

Component.displayName = "NewDepartment";
