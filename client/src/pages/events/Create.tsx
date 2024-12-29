import { ActionButton, Alert, TextField } from "@/components";
import { useSaveForm } from "@/store/stateProvider";
import { inputFields } from "@/utils/constants";
import handleError from "@/utils/handleError";
import { lazy, Suspense, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm, Controller, FieldValues } from "react-hook-form";
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
    reset,
    setValue,
  } = useForm();
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const formFields = ["title", "startDate", "endDate", "location", "time"];
  const isSubmitting = fetcher.state === "submitting";
  const redirect = () => {
    setSelectedFile("");
    setValue("photo", "");
    navigate("/events", { replace: true });
  };
  const { form } = useSaveForm() as {
    form: {
      title: string;
      startDate: string;
      endDate: string;
      location: string;
      time: string;
      description: string;
    };
  };

  useEffect(() => {
    if (form) {
      setValue("title", form.title);
      setValue("startDate", form.startDate);
      setValue("endDate", form.endDate);
      setValue("location", form.location);
      setValue("time", form.time);
      setValue("description", form.description);
    }
  }, [form, setValue]);

  useEffect(() => {
    if (fetcher.data?.status === 201) {
      toast.success(fetcher.data?.msg);
      useSaveForm.setState({ form: null });
      reset();
      setSelectedFile("");
      navigate("/events", { replace: true });
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

  const onFormSubmit = async (data: FieldValues) => {
    const formData = {
      ...data,
      photo: selectedFile,
    };
    useSaveForm.setState({ form: formData });
    fetcher.submit(formData, { method: "post" });
  };

  return (
    <>
      {" "}
      <Helmet>
        <title>Create a new event</title>
        <meta name="description" content="Create a new event." />
      </Helmet>
      <h1 className="font-bold px-2 mb-6">Create a new event</h1>
      {error && <Alert error={error} />}
      <div className="py-4 px-2">
        <Form
          method="post"
          action="/tasks/new"
          onSubmit={handleSubmit(onFormSubmit)}
          className="flex flex-col min-h-[calc(100vh-220px)] justify-between"
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
                        placeholder="Description"
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
              <div className="mt-4">
                <label htmlFor="photo">Event Photo</label>
                <input
                  type="file"
                  className="file-input file-input-bordered w-full rounded-none p-2 mt-2"
                  id="photo"
                  name="photo"
                  onChange={handleFile}
                />
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-col md:flex-row-reverse gap-6 items-center">
            <ActionButton
              type="submit"
              text="Create"
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

Component.displayName = "CreateEvent";
