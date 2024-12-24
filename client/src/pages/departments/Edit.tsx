import {
  Form,
  useFetcher,
  useLoaderData,
  useRouteLoaderData,
  useNavigate,
} from "react-router";
import { FieldValues, useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";
import {
  ActionButton,
  Alert,
  ErrorMsg,
  SelectField,
  TextField,
} from "@/components";
import { inputFields } from "@/utils/constants";
import { useEffect, useState } from "react";
import { Userinfo } from "@/emply-types";
import { validateField } from "@/utils/formValidate";
import { toast } from "sonner";
import handleError from "@/utils/handleError";

export function Component() {
  const [error, setError] = useState<string>("");
  const data = useLoaderData();
  const { employees } = useRouteLoaderData("departments-employees") as {
    employees: Userinfo[];
  };
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm();
  const { department } = data as {
    department: {
      _id: string;
      name: string;
      supervisor: string;
      supervisorEmployeeId: string;
    };
  };
  useEffect(() => {
    if (data.status === 200) {
      setValue("name", department?.name);
      setValue("employee", department?.supervisor);
      setValue("employeeId", department?.supervisorEmployeeId);
    }
  }, [data.status, department, setValue]);
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

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

  useEffect(() => {
    if (fetcher.data?.status === 200) {
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

  const formFields = ["name"];
  const formFields1 = ["employeeId"];

  const onFormSubmit = async (formData: FieldValues) => {
    fetcher.submit(
      { ...formData, id: department._id },
      { method: "patch", action: `/departments/${department?.name}/edit` }
    );
  };

  return (
    <>
      <Helmet>
        <title>Edit {department?.name} department</title>
        <meta name="description" content="Update a department information." />
      </Helmet>
      <div>
        <h1 className="font-bold px-2 mb-6">
          Edit {department?.name} department
        </h1>
        {data?.error && <ErrorMsg error={data?.error} />}
        {data?.status === 200 && (
          <div className="max-w-[450px] mx-auto px-2">
            {error && <Alert error={error} />}
            <Form
              method="patch"
              action={`/departments/${department?.name}/edit`}
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
                  Note: Selecting a supervisor will automatically set the
                  employeeId field in the form.
                </p>
                <div className="flex flex-col md:flex-row-reverse gap-6 items-center">
                  <ActionButton
                    type="submit"
                    text="Update"
                    classname="w-full md:w-[130px] bg-secondary text-base-200 btn-sm"
                    loading={isSubmitting}
                  />
                  <ActionButton
                    type="button"
                    text="Cancel"
                    classname="w-full md:w-[130px] btn-sm bg-primary text-base-200"
                    onClick={() => navigate("/departments")}
                  />
                </div>
              </div>
            </Form>
          </div>
        )}
      </div>
    </>
  );
}

Component.displayName = "EditDepartment";
