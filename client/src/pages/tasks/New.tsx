import { ActionButton, Alert, SelectField, TextField } from "@/components";
import { Userinfo } from "@/emply-types";
import { useSaveForm } from "@/store/stateProvider";
import { inputFields, taskPriority, taskStatus } from "@/utils/constants";
import { validateField } from "@/utils/formValidate";
import handleError from "@/utils/handleError";
import { lazy, useEffect, useState, Suspense } from "react";
import { Helmet } from "react-helmet-async";
import { useForm, Controller, FieldValues } from "react-hook-form";
import {
  Form,
  useFetcher,
  useNavigate,
  useRouteLoaderData,
} from "react-router";
import { toast } from "sonner";
const SimpleMDE = lazy(() => import("react-simplemde-editor"));

export function Component() {
  const [error, setError] = useState<string>("");
  const [member, setMember] = useState<string>("");
  const [selectedMembers, setSelectedMembers] = useState<Userinfo[]>([]);
  const [selectedMembersId, setSelectedMembersId] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [tag, setTag] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const { employees } = useRouteLoaderData("departments-employees") as {
    employees: Userinfo[];
  };
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
  const { form } = useSaveForm() as {
    form: {
      title: string;
      startDate: string;
      dueDate: string;
      priority: string;
      status: string;
      description: string;
      tags: string[];
      members: string[];
    };
  };

  useEffect(() => {
    if (form) {
      setValue("title", form.title);
      setValue("startDate", form.startDate);
      setValue("dueDate", form.dueDate);
      setValue("priority", form.priority);
      setValue("status", form.status);
      setValue("description", form.description);
      setValue("tags", form.tags);
      setValue("members", form.members);
    }
  }, [form, setValue]);

  useEffect(() => {
    if (fetcher.data?.status === 201) {
      toast.success(fetcher.data?.msg);
      useSaveForm.setState({ form: null });
      reset();
      setSelectedFile("");
      navigate("/tasks", { replace: true });
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

  const handleTags = (currentInput: string[]) => {
    if (currentInput.length > 0) {
      setTags([...tags, ...currentInput]);
      setTag("");
    }
  };

  const deleteTag = (index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    setTags(newTags);
  };

  const handleMemberId = (id: string) => {
    setSelectedMembersId([...selectedMembersId, id]);
  };

  const deleteMemberId = (id: string) => {
    const spreadIds = selectedMembersId.filter((item) => item !== id);
    setSelectedMembersId(spreadIds);
  };

  useEffect(() => {
    if (member) {
      const lowerCaseMember = member.toLowerCase();
      const result = employees.filter((item) =>
        item.firstName.toLowerCase().includes(lowerCaseMember)
      );
      setSelectedMembers((prev) => Array.from(new Set([...prev, ...result])));
    } else {
      setSelectedMembers((prev) =>
        prev.filter((item) => selectedMembersId.includes(item._id as string))
      );
    }
  }, [employees, member, selectedMembersId]);

  const isSubmitting = fetcher.state === "submitting";
  const redirect = () => navigate("/tasks", { replace: true });
  const formFields = ["title", "startDate", "dueDate"];

  const onFormSubmit = async (data: FieldValues) => {
    const formData = {
      ...data,
      tags,
      members: selectedMembersId,
      file: selectedFile,
    };
    useSaveForm.setState({ form: formData });
    fetcher.submit(formData, { method: "post" });
  };

  return (
    <>
      <Helmet>
        <title>Create a new task</title>
        <meta name="description" content="Create a new task." />
      </Helmet>
      <h1 className="font-bold px-2 mb-6">Create a new task</h1>
      {error && <Alert error={error} />}
      <div className="py-4 px-2">
        <Form
          method="post"
          action="/tasks/new"
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
                label="Select Status"
                name="status"
                id="status"
                register={register}
                errors={errors}
                placeholder="Select task status"
                options={taskStatus}
                validate={(value) =>
                  validateField(value, "Please select a status")
                }
                isRequired
              />
              <SelectField
                label="Select Priority"
                name="priority"
                id="priority"
                register={register}
                errors={errors}
                placeholder="Select task priority"
                options={taskPriority}
                validate={(value) =>
                  validateField(value, "Please select a priority")
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
              <div className="mb-4">
                <label htmlFor="members">Assign Members</label>
                <input
                  type="text"
                  id="members"
                  name="members"
                  placeholder="Search for members, click on them to assign"
                  className="mt-2 input input-bordered w-full border-[1.5px] p-2 text-sm rounded-none"
                  value={member}
                  onChange={(e) => setMember(e.target.value)}
                />
                <div className="mt-4 flex flex-wrap gap-3 items-center">
                  {selectedMembers?.map((item, index) => (
                    <div
                      className={`badge cursor-pointer ${
                        selectedMembersId?.includes(item?._id as string)
                          ? "badge-accent"
                          : "badge-error"
                      }`}
                      key={index}
                      onClick={() => {
                        const isSelected = selectedMembersId?.includes(
                          item?._id as string
                        );
                        if (isSelected) {
                          deleteMemberId(item?._id as string);
                        } else {
                          handleMemberId(item?._id as string);
                        }
                      }}
                    >
                      {item?.firstName?.concat(" ", item?.lastName)}{" "}
                      {selectedMembersId?.includes(item?._id as string) &&
                        "\u2716"}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="tags">Tags</label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  placeholder="Add tags"
                  className="mt-2 input input-bordered w-full border-[1.5px] p-2 text-sm rounded-none"
                  value={tag.toLowerCase()}
                  onChange={(e) => setTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const currentInput = e.currentTarget.value
                        .split(", ")
                        .filter((tag) => tag);
                      handleTags(currentInput);
                      e.currentTarget.value = "";
                    }
                  }}
                />
                <div className="mt-4 flex flex-wrap gap-3 items-center">
                  {tags.length > 0 && (
                    <>
                      {tags.map((tag, index) => (
                        <div
                          key={index}
                          onClick={() => deleteTag(index)}
                          className="badge badge-secondary cursor-pointer hover:text-red-400"
                        >
                          {tag} &#10006;
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="file">File</label>
                <input
                  type="file"
                  className="file-input file-input-bordered w-full rounded-none p-2 mt-2"
                  id="file"
                  name="file"
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

Component.displayName = "NewTask";
