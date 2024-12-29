import { ActionButton, Alert, SelectField, TextField } from "@/components";
import { DepartmentsData } from "@/emply-types";
import { useSaveForm } from "@/store/stateProvider";
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
    setValue,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const { form } = useSaveForm() as {
    form: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      dateOfBirth: string;
      phone: string;
      gender: string;
      jobType: string;
      bank: string;
      accountName: string;
      accountNumber: string;
    };
  };
  const redirect = () => navigate("/employees");
  const isSubmitting = fetcher.state === "submitting";

  useEffect(() => {
    if (form) {
      setValue("email", form.email);
      setValue("password", form.password);
      setValue("firstName", form.firstName);
      setValue("lastName", form.lastName);
      setValue("dateOfBirth", form.dateOfBirth);
      setValue("phone", form.phone);
      setValue("gender", form.gender);
      setValue("jobType", form.jobType);
      setValue("bank", form.bank);
      setValue("accountName", form.accountName);
      setValue("accountNumber", form.accountNumber);
    }
  }, [form, setValue]);

  useEffect(() => {
    if (fetcher.data?.status === 201) {
      toast.success(fetcher.data?.msg);
      useSaveForm.setState({ form: null });
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
  const formFields2 = ["bank", "accountName", "accountNumber"];

  const onFormSubmit = async (data: FieldValues) => {
    fetcher.submit(data, { method: "post" });
    useSaveForm.setState({ form: data });
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
          className="flex flex-col min-h-[calc(100vh-220px)] justify-between"
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
