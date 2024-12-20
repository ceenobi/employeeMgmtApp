import { ActionButton, Alert, SelectField, TextField } from "@/components";
import { DepartmentsData } from "@/emply-types";
import {
  employeeRole,
  gender,
  inputFields,
  jobTitle,
  jobType,
} from "@/utils/constants";
import { validateField } from "@/utils/formValidate";
import handleError from "@/utils/handleError";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm, FieldValues } from "react-hook-form";
import {
  useFetcher,
  Form,
  useRouteLoaderData,
  useNavigate,
} from "react-router";
import { toast } from "sonner";

export function Component() {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const { depts } = useRouteLoaderData("departments-employees") as {
    depts: {
      departments: DepartmentsData[];
      getDeptNames: string[];
      deptCount: { [key: string]: number };
    };
  };
  const fetcher = useFetcher();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const redirect = () => navigate("/employees");
  const isSubmitting = fetcher.state === "submitting";

  useEffect(() => {
    if (fetcher.data?.status === 201) {
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

  const formFields1 = [
    "email",
    "password",
    "firstName",
    "lastName",
    "dateOfBirth",
    "phone",
    "gender",
    "jobType",
  ];

  const onFormSubmit = async (data: FieldValues) => {
    fetcher.submit(data, { method: "post" });
  };

  return (
    <>
      <Helmet>
        <title>Register a new employee to your organization</title>
        <meta
          name="description"
          content="Add a new worker to your organization."
        />
      </Helmet>
      <h1 className="font-bold px-2 mb-6">Add a new employee</h1>
      {error && <Alert error={error} />}
      <div className="py-4 px-2">
        <Form
          method="post"
          action="/employees/new"
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
                      isVisible={isVisible}
                      setIsVisible={setIsVisible}
                      isRequired={isRequired}
                    />
                  )
                )}
            </div>
            <div>
              <SelectField
                label="Gender"
                name="gender"
                id="gender"
                register={register}
                errors={errors}
                placeholder="Select gender"
                options={gender}
                validate={(value) => validateField(value, "Gender is required")}
                isRequired
              />
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
                validate={(value) => validateField(value, "Role is required")}
                isRequired
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row-reverse gap-6 items-center">
            <ActionButton
              type="submit"
              text="Register"
              classname="w-full md:w-[130px] bg-secondary text-base-200 btn-sm"
              loading={isSubmitting}
            />
            <ActionButton
              type="button"
              text="Cancel"
              classname="w-full md:w-[130px] btn-sm bg-primary text-base-200"
              onClick={redirect}
            />
          </div>
        </Form>
      </div>
    </>
  );
}

Component.displayName = "NewEmployee";
