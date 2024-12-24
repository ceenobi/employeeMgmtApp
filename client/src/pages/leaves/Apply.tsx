import { ActionButton, Alert, SelectField, TextField } from "@/components";
import { useSaveForm } from "@/store/stateProvider";
import { inputFields, leaveType } from "@/utils/constants";
import { validateField } from "@/utils/formValidate";
import handleError from "@/utils/handleError";
import { lazy, Suspense, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { Form, useFetcher, useNavigate } from "react-router";
import { toast } from "sonner";
const SimpleMDE = lazy(() => import("react-simplemde-editor"));

export function Component() {
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [error, setError] = useState<string>("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    reset,
  } = useForm();
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const { form } = useSaveForm() as {
    form: {
      startDate: string;
      endDate: string;
      description: string;
      leaveType: string;
      leaveDoc: string;
    };
  };
  const formFields = ["startDate", "endDate"];
  const isSubmitting = fetcher.state === "submitting";
  const redirect = () => navigate("/tasks", { replace: true });

  useEffect(() => {
    if (form) {
      setValue("startDate", form.startDate);
      setValue("endDate", form.endDate);
      setValue("leaveType", form.leaveType);
      setValue("description", form.description);
      setValue("leaveDoc", form.leaveDoc);
    }
  }, [form, setValue]);

  useEffect(() => {
    if (fetcher.data?.status === 201) {
      toast.success(fetcher.data?.msg);
      useSaveForm.setState({ form: null });
      reset();
      setSelectedFile("");
      navigate("/leaves", { replace: true });
    }
    if (fetcher.data?.error) {
      handleError(
        setError as unknown as (error: unknown) => void,
        fetcher.data?.error
      );
    }
  }, [fetcher.data, navigate, reset]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size > 5 * 1000 * 1000) {
      setError("File with maximum size of 5MB is allowed");
      return false;
    }
    const reader = new FileReader();
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please upload only image files");
        return false;
      }
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

  const onFormSubmit = (data: FieldValues) => {
    const formData = {
      ...data,
      leaveDoc: selectedFile,
    };
    useSaveForm.setState({ form: formData });
    fetcher.submit(formData, { method: "post" });
  };

  return (
    <>
      <Helmet>
        <title>Apply for leave request</title>
        <meta name="description" content="Apply for leave request" />
      </Helmet>
      <h1 className="font-bold px-2 mb-6">Apply for leave</h1>
      {error && <Alert error={error} />}
      <div className="py-4 px-2">
        <Form
          method="post"
          action="/leaves/apply"
          onSubmit={handleSubmit(onFormSubmit)}
          className="flex flex-col min-h-[calc(100vh-200px)] justify-between"
        >
          <div className="grid md:grid-cols-3 gap-8">
            <div>
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
                label="Select Leave Type"
                name="leaveType"
                id="leaveType"
                register={register}
                errors={errors}
                placeholder="Select leave type"
                options={leaveType}
                validate={(value) =>
                  validateField(value, "Please select a leave type")
                }
                isRequired
              />
            </div>
            <div>
              <Suspense fallback={<div>Loading editor...</div>}>
                <label htmlFor="description">
                  Description <span className="text-red-600">*</span>
                </label>
                <Controller
                  name="description"
                  control={control}
                  rules={{ required: "Description is required" }}
                  render={({ field }) => (
                    <>
                      <SimpleMDE
                        placeholder="Reason for leave"
                        {...field}
                        className="mt-2"
                      />
                      {errors?.description && (
                        <span className="text-xs text-red-600">
                          {errors?.description?.message as string}
                        </span>
                      )}
                    </>
                  )}
                />
              </Suspense>
            </div>
            <div>
              <div>
                <label htmlFor="leaveDoc">Attach supporting doc.</label>
                <input
                  type="file"
                  className="file-input file-input-bordered w-full rounded-none p-2 mt-2"
                  id="leaveDoc"
                  accept="image/*"
                  {...register("leaveDoc")}
                  onChange={handleFile}
                />
                <p className="text-sm">Required for sick leave approval</p>
              </div>
              {selectedFile && (
                <div className="relative w-fit">
                  <img
                    src={selectedFile}
                    alt="Selected File"
                    className="w-32 h-32 object-cover mt-2"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile("");
                      setValue("leaveDoc", "");
                    }}
                    className="btn btn-error btn-sm absolute top-0 right-0 text-white rounded-full"
                  >
                    x
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="mt-6 flex flex-col md:flex-row-reverse gap-6 items-center">
            <ActionButton
              type="submit"
              text="Apply"
              classname="w-full md:w-[130px] bg-secondary text-zinc-800 btn-sm hover:text-white"
              loading={isSubmitting}
            />
            <ActionButton
              type="button"
              text="Cancel"
              classname="w-full md:w-[130px] btn-sm bg-primary text-zinc-800 hover:text-white"
              onClick={redirect}
            />
          </div>
        </Form>
      </div>
    </>
  );
}

Component.displayName = "Apply";
