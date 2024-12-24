import {
  ActionButton,
  Alert,
  SelectField,
  TextField,
  UnAuthorized,
} from "@/components";
import { TaskFormData, Userinfo } from "@/emply-types";
import { useAuthProvider } from "@/store/authProvider";
import { inputFields, taskPriority, taskStatus } from "@/utils/constants";
import { formatFullDate } from "@/utils/format";
import { validateField } from "@/utils/formValidate";
import handleError from "@/utils/handleError";
import { useEffect, useState, lazy, Suspense } from "react";
import { Helmet } from "react-helmet-async";
import { useForm, Controller, FieldValues } from "react-hook-form";
import {
  Form,
  useFetcher,
  useLoaderData,
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
  const data = useLoaderData() as {
    data: {
      task: TaskFormData;
    };
  };
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm();
  const { user } = useAuthProvider() as {
    user: Userinfo;
  };
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";
  const { task } = data?.data ?? {};
  const redirect = () => navigate("/tasks", { replace: true });
  const formFields = ["title", "startDate", "dueDate"];

  useEffect(() => {
    if (fetcher.data?.status === 200) {
      toast.success(fetcher.data?.msg);
      navigate("/tasks", { replace: true });
    }
    if (fetcher.data?.error) {
      handleError(
        setError as unknown as (error: unknown) => void,
        fetcher.data?.error
      );
    }
  }, [fetcher.data, navigate]);

  useEffect(() => {
    if (task) {
      setValue("title", task.title);
      setValue("description", task.description);
      setValue("startDate", formatFullDate(task.startDate));
      setValue("dueDate", formatFullDate(task.dueDate as Date));
      setValue("priority", task.priority);
      setValue("status", task.status);
    }
  }, [task, setValue]);

  useEffect(() => {
    if (member) {
      const lowerCaseMember = member.toLowerCase();
      const result = employees.filter((item) =>
        item.firstName.toLowerCase().includes(lowerCaseMember)
      );

      setSelectedMembers((prev) => Array.from(new Set([...prev, ...result])));
    } else if (task.members.length > 0) {
      setSelectedMembers(task.members);
    } else {
      setSelectedMembers((prev) =>
        prev.filter((item) => selectedMembersId.includes(item._id as string))
      );
    }
  }, [employees, member, selectedMembersId, task.members]);

  useEffect(() => {
    if (task.tags && task.tags?.length > 0) {
      setTags([...task.tags]);
    }
    if (task.members.length > 0) {
      setSelectedMembersId(
        task.members.map((item: Userinfo) => item._id as string)
      );
    }
  }, [task.members, task.tags]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size > 5 * 1000 * 1000) {
      toast.error("File with maximum size of 5MB is allowed");
      return false;
    }
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
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

  const onFormSubmit = async (formEntry: FieldValues) => {
    const formData = {
      ...formEntry,
      tags,
      members: selectedMembersId,
      file: selectedFile,
      _id: task?._id as string,
    };
    fetcher.submit(formData, { method: "patch" });
  };

  return (
    <>
      {" "}
      <Helmet>
        <title>{`Edit Task ${task?.title}`}</title>
        <meta name="description" content="View task details" />
      </Helmet>
      {user._id !== task.createdBy?._id ? (
        <UnAuthorized />
      ) : (
        <>
          <h1 className="font-bold px-2 mb-6">Edit task</h1>
          {error && <Alert error={error} />}
          <div className="py-4 px-2">
            <Form
              method="patch"
              action={`/tasks/${task._id}/edit`}
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
                    <label htmlFor="file">
                      {task.file ? "Update File" : "File"}
                    </label>
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
                  text="Update"
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
      )}
    </>
  );
}

Component.displayName = "EditTask";
