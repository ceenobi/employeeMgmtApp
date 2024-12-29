import { DepartmentsData, Userinfo } from "@/emply-types";
import { useAuthProvider } from "@/store/authProvider";
import { Helmet } from "react-helmet-async";
import {
  Form,
  useFetcher,
  useLoaderData,
  useNavigate,
  useRouteLoaderData,
} from "react-router";
import { FieldValues, useForm } from "react-hook-form";
import {
  ActionButton,
  Alert,
  SelectField,
  TextField,
  UnAuthorized,
} from "@/components";
import {
  employeeRole,
  inputFields,
  jobTitle,
  jobType,
} from "@/utils/constants";
import { formatFullDate } from "@/utils/format";
import { validateField } from "@/utils/formValidate";
import handleError from "@/utils/handleError";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function Component() {
  const [error, setError] = useState<string>("");
  const { user } = useAuthProvider() as {
    user: Userinfo;
  };
  const navigate = useNavigate();
  const data = useLoaderData() as {
    data: Userinfo;
  };
  const { depts } = useRouteLoaderData("departments-employees") as {
    depts: {
      departments: DepartmentsData[];
      getDeptNames: string[];
      deptCount: { [key: string]: number };
    };
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";
  const employee = data?.data;

  useEffect(() => {
    if (employee) {
      setValue("firstName", employee?.firstName);
      setValue("lastName", employee?.lastName);
      setValue("email", employee?.email);
      setValue("phone", employee?.phone);
      setValue("dateOfBirth", formatFullDate(employee?.dateOfBirth as string));
      setValue("dept", employee?.dept);
      setValue("jobType", employee?.jobType);
      setValue("jobTitle", employee?.jobTitle);
      setValue("role", employee?.role);
      setValue("bank", employee?.bank);
      setValue("accountName", employee?.accountName);
      setValue("accountNumber", employee?.accountNumber);
    }
  }, [employee, setValue]);

  useEffect(() => {
    if (fetcher.data?.status === 200) {
      toast.success(fetcher.data?.msg);
      navigate("/employees", { replace: true });
    }
    if (fetcher.data?.error) {
      handleError(
        setError as unknown as (error: unknown) => void,
        fetcher.data?.error
      );
    }
  }, [fetcher.data, navigate]);

  const authRole = ["admin", "super-admin"];
  const formFields1 = [
    "email",
    "firstName",
    "lastName",
    "dateOfBirth",
    "jobType",
    "phone",
  ];
  const formFields2 = ["bank", "accountName", "accountNumber"];

  const onFormSubmit = async (formData: FieldValues) => {
    fetcher.submit(
      {
        ...formData,
        employeeId: employee?.employeeId as string,
      },
      { method: "patch" }
    );
  };

  return (
    <>
      <Helmet>
        <title>{`Edit Employee ${employee?.firstName} ${employee?.lastName}`}</title>
        <meta name="description" content="Edit employee details" />
      </Helmet>
      <>
        {!authRole?.includes(user?.role) ? (
          <UnAuthorized />
        ) : (
          <>
            <>
              <h1 className="font-bold px-2">
                Edit employee -
                <span className="">
                {" "} {employee?.firstName.concat(" ", employee?.lastName)}
                </span>
              </h1>
              <div className="mt-6 py-4 px-2">
                {error && <Alert error={error} />}
                <Form
                  method="patch"
                  action={`/employees/${employee?.employeeId}`}
                  onSubmit={handleSubmit(onFormSubmit)}
                  className="flex flex-col min-h-[calc(100vh-200px)] justify-between"
                >
                  <div className="grid md:grid-cols-3 gap-8">
                    <div>
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
                      <SelectField
                        label="Job Type"
                        name="jobType"
                        id="jobType"
                        register={register}
                        errors={errors}
                        placeholder="Select job type"
                        options={jobType}
                        validate={(value) =>
                          validateField(value, "Job type is required")
                        }
                        isRequired
                      />
                      <SelectField
                        label="Job Title"
                        name="jobTitle"
                        id="jobTitle"
                        register={register}
                        errors={errors}
                        placeholder="Select job title"
                        options={jobTitle}
                        validate={(value) =>
                          validateField(value, "Job title is required")
                        }
                        isRequired
                      />
                      <SelectField
                        label="Department"
                        name="dept"
                        id="dept"
                        register={register}
                        errors={errors}
                        placeholder="Select department"
                        options={depts?.departments}
                        validate={(value) =>
                          validateField(value, "Please select a department")
                        }
                        isRequired
                      />
                      <SelectField
                        label="Role"
                        name="role"
                        id="role"
                        register={register}
                        errors={errors}
                        placeholder="Select role"
                        options={employeeRole}
                        validate={(value) =>
                          validateField(value, "Role is required")
                        }
                        isRequired
                      />
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
                  </div>
                  <div className="flex flex-col md:flex-row-reverse gap-6 items-center">
                    <ActionButton
                      type="submit"
                      text="Update"
                      classname="w-full md:w-[130px] bg-secondary btn-sm text-zinc-800"
                      loading={isSubmitting}
                    />
                    <ActionButton
                      type="button"
                      text="Cancel"
                      classname="w-full md:w-[130px] btn-sm bg-primary text-zinc-800"
                      onClick={() => navigate("/employees", { replace: true })}
                    />
                  </div>
                </Form>
              </div>
            </>
          </>
        )}
      </>
    </>
  );
}

Component.displayName = "EditProfile";
