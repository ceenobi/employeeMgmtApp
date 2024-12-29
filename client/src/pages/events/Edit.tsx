import {
  ActionButton,
  Alert,
  Modal,
  SelectField,
  TextField,
  UnAuthorized,
} from "@/components";
import { EventFormData, Userinfo } from "@/emply-types";
import { useAuthProvider } from "@/store/authProvider";
import { eventStatus, inputFields } from "@/utils/constants";
import { formatFullDate } from "@/utils/format";
import { validateField } from "@/utils/formValidate";
import handleError from "@/utils/handleError";
import { useEffect, useState, lazy, Suspense, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { useForm, Controller, FieldValues } from "react-hook-form";
import { Form, useFetcher, useLoaderData, useNavigate } from "react-router";
import { toast } from "sonner";
const SimpleMDE = lazy(() => import("react-simplemde-editor"));

export function Component() {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<string>("");
  const { user } = useAuthProvider() as {
    user: Userinfo;
  };
  const data = useLoaderData() as {
    data: {
      event: EventFormData;
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
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";
  const { event } = data?.data ?? {};
  const redirect = () => {
    setSelectedFile("");
    setValue("photo", "");
    navigate("/events", { replace: true });
  };
  const formFields = ["title", "startDate", "endDate", "location", "time"];

  useEffect(() => {
    if (event) {
      setValue("title", event.title);
      setValue("description", event.description);
      setValue("startDate", formatFullDate(event.startDate));
      setValue("dueDate", formatFullDate(event.endDate));
      setValue("status", event.status);
      setValue("location", event.location);
      setValue("time", event.time);
    }
  }, [event, setValue]);

  useEffect(() => {
    if (fetcher.data?.status === 200) {
      toast.success(fetcher.data?.msg);
      setIsOpen(false);
      navigate("/events", { replace: true });
    }
    if (fetcher.data?.error) {
      handleError(
        setError as unknown as (error: unknown) => void,
        fetcher.data?.error
      );
    }
  }, [fetcher.data, navigate]);

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

  const handleOpenModal = () => {
    setIsOpen(true);
  };
  const handleCloseModal = () => {
    setIsOpen(false);
  };
  const onFormSubmit = async (formEntry: FieldValues) => {
    const formData = {
      ...formEntry,
      photo: selectedFile,
      _id: event?._id as string,
    };
    fetcher.submit(formData, { method: "patch" });
  };

  const deleteEvent = useCallback(async () => {
    fetcher.submit(
      { _id: event?._id as string },
      {
        method: "delete",
      }
    );
  }, [fetcher, event?._id]);

  return (
    <>
      <Helmet>
        <title>{`Edit Task ${event?.title}`}</title>
        <meta name="description" content="View and edit event details" />
      </Helmet>
      {user._id !== event?.employee?._id ? (
        <UnAuthorized />
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h1 className="font-bold px-2 mb-6">Edit event</h1>
            <ActionButton
              type="button"
              text="Delete Event"
              classname="w-fit bg-error btn-sm h-[20px] text-zinc-900"
              onClick={handleOpenModal}
            />
          </div>
          {error && <Alert error={error} />}
          <div className="py-4 px-2">
            <Form
              method="patch"
              action={`/events/${event._id}/edit`}
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
                  <SelectField
                    label="Select status"
                    name="status"
                    id="status"
                    register={register}
                    errors={errors}
                    placeholder="Select status"
                    options={eventStatus}
                    validate={(value) =>
                      validateField(value, "Please select a status")
                    }
                    isRequired
                  />
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
                  {selectedFile && event?.photo !== selectedFile && (
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
                  {event?.photo && !selectedFile && (
                    <div className="relative w-fit">
                      <img
                        src={event?.photo}
                        alt="Selected File"
                        className="w-32 h-32 object-cover mt-2"
                        loading="lazy"
                      />
                    </div>
                  )}
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
      <Modal
        isOpen={isOpen}
        onClose={handleCloseModal}
        title="Delete Event"
        id="openEventDeleteModal"
        classname="max-w-2xl"
      >
        <Form
          className="my-4"
          method="delete"
          action={`/events/${event._id}/edit`}
          onSubmit={deleteEvent}
        >
          {error && <Alert error={error} />}
          <div className="text-center">
            Are you sure you want to delete this event?
          </div>
          <div className="modal-action items-center">
            <ActionButton
              type="button"
              text="Close"
              classname="w-fit bg-info btn-sm h-[20px] text-zinc-900 hover:text-white"
              onClick={handleCloseModal}
            />
            <ActionButton
              type="submit"
              text="Delete"
              classname="w-fit bg-error btn-sm h-[20px] text-zinc-900 hover:text-white"
              loading={isSubmitting}
            />
          </div>
        </Form>
      </Modal>
    </>
  );
}

Component.displayName = "EditEvent";
