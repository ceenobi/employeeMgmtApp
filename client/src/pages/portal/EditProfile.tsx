import { ActionButton, Alert, SelectField, TextField } from "@/components";
import { DepartmentsData, Userinfo } from "@/emply-types";
import { useAuthProvider } from "@/store/authProvider";
import { useSaveToken } from "@/store/stateProvider";
import {
  employeeRole,
  inputFields,
  jobTitle,
  jobType,
  maritalStatus,
} from "@/utils/constants";
import { formatFullDate } from "@/utils/format";
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
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { depts } = useRouteLoaderData("departments-employees") as {
    depts: {
      departments: DepartmentsData[];
      getDeptNames: string[];
      deptCount: { [key: string]: number };
    };
  };
  const { user, checkAuth } = useAuthProvider() as {
    user: Userinfo;
    checkAuth: (token: string) => void;
  };
  const { token } = useSaveToken((state) => state) as {
    token: string | null;
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const isSubmitting = fetcher.state === "submitting";

  useEffect(() => {
    if (user) {
      setValue("firstName", user?.firstName);
      setValue("lastName", user?.lastName);
      setValue("email", user?.email);
      setValue("phone", user?.phone);
      setValue("dateOfBirth", formatFullDate(user?.dateOfBirth as string));
      setValue("dept", user?.dept);
      setValue("jobType", user?.jobType);
      setValue("jobTitle", user?.jobTitle);
      setValue("role", user?.role);
      setValue("gender", user?.gender);
      setValue("maritalStatus", user?.maritalStatus);
      setValue("homeAddress", user?.address?.homeAddress);
      setValue("state", user?.address?.state);
      setValue("country", user?.address?.country);
      setValue("bank", user?.bank);
      setValue("accountName", user?.accountName);
      setValue("accountNumber", user?.accountNumber);
    }
  }, [user, setValue]);

  useEffect(() => {
    if (fetcher.data?.status === 200) {
      toast.success(fetcher.data?.msg);
      checkAuth(token as string);
    }
    if (fetcher.data?.error) {
      handleError(
        setError as unknown as (error: unknown) => void,
        fetcher.data?.error
      );
    }
  }, [checkAuth, fetcher.data, token]);

  const formFields1 = [
    "email",
    "firstName",
    "lastName",
    "dateOfBirth",
    "jobType",
    "phone",
    "bank",
    "accountName",
    "accountNumber",
  ];
  const formFields2 = ["homeAddress", "state", "country"];
  const roles = ["admin", "super-admin"];

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size > 5 * 1000 * 1000) {
      setError("File with maximum size of 5MB is allowed");
      return false;
    }
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onerror = () => {
        console.error("Error reading file:", file.name);
        setError("Error reading file");
      };
      reader.onloadend = () => {
        setSelectedFile(reader.result as string);
      };
    }
  };

  const onFormSubmit = async (formData: FieldValues) => {
    fetcher.submit(
      {
        ...formData,
        photo: selectedFile,
        employeeId: user?.employeeId as string,
      },
      { method: "patch" }
    );
  };

  return (
    <>
      {" "}
      <Helmet>
        <title>{`Update your profile - ${user?.firstName} ${user?.lastName}`}</title>
        <meta name="description" content="Update your profile" />
      </Helmet>
      <h1 className="font-bold px-2">
        Update your profile
        <span className="mx-2">
          {user?.firstName.concat(" ", user?.lastName)}
        </span>
      </h1>
      <p className="text-sm text-gray-400 px-2">
        Disabled fields can only be updated by an admin
      </p>
      <div className="mt-6 py-4 px-2">
        {error && <Alert error={error} />}
        <Form
          method="patch"
          action="/portal/edit-profile"
          encType="multipart/form-data"
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
                      disabled={!roles.includes(user?.role as string)}
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
                disabled={!roles.includes(user?.role as string)}
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
                disabled={!roles.includes(user?.role as string)}
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
                disabled={!roles.includes(user?.role as string)}
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
                disabled={!roles.includes(user?.role as string)}
              />
              <SelectField
                label="Marital Status"
                name="maritalStatus"
                id="maritalStatus"
                register={register}
                errors={errors}
                placeholder="Select marital status"
                options={maritalStatus}
                validate={(value) =>
                  validateField(value, "This field is required")
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
              <div className="mt-4">
                <label htmlFor="photo">Profile Photo</label>
                <input
                  type="file"
                  className="file-input file-input-bordered w-full rounded-none p-2 mt-2"
                  id="photo"
                  name="photo"
                  onChange={handleFile}
                />
                {selectedFile && user?.photo !== selectedFile && (
                  <div className="relative w-fit">
                    <img
                      src={selectedFile}
                      alt="Selected File"
                      className="w-32 h-32 object-cover mt-2"
                      loading="lazy"
                    />
                    {selectedFile && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile("");
                          setValue("photo", "");
                        }}
                        className="btn btn-error btn-sm absolute top-0 right-0 text-white rounded-full"
                      >
                        x
                      </button>
                    )}
                  </div>
                )}
                {user?.photo && !selectedFile && (
                  <div className="relative w-fit">
                    <img
                      src={user?.photo}
                      alt="Selected File"
                      className="w-24 h-24 object-cover mt-2"
                      loading="lazy"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="mt-6 lg:mt-0 flex flex-col md:flex-row-reverse gap-6 items-center">
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
              onClick={() => {
                setSelectedFile("");
                setValue("photo", "");
                navigate("/portal", { replace: true });
              }}
            />
          </div>
        </Form>
      </div>
    </>
  );
}

Component.displayName = "EditProfile";
