import { ActionButton, Alert, TextField } from "@/components";
import { Userinfo } from "@/emply-types";
import { useAuthProvider } from "@/store/authProvider";
import { inputFields } from "@/utils/constants";
import handleError from "@/utils/handleError";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { FieldValues, useForm } from "react-hook-form";
import { Form, useFetcher, useNavigate } from "react-router";
import { toast } from "sonner";

export function Component() {
  const [error, setError] = useState<string>("");
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const { user, logout } = useAuthProvider() as {
    user: Userinfo;
    logout: () => void;
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";
  const formFields = ["currentPassword", "newPassword"];

  const handleLogout = useCallback(() => {
    queryClient.clear();
    localStorage.clear();
    logout();
    navigate("/", { replace: true });
  }, [queryClient, logout, navigate]);

  useEffect(() => {
    if (fetcher.data?.status === 200) {
      toast.success(fetcher.data?.msg);
      handleLogout();
    }
    if (fetcher.data?.error) {
      handleError(
        setError as unknown as (error: unknown) => void,
        fetcher.data?.error
      );
    }
  }, [fetcher.data, handleLogout]);

  const onFormSubmit = async (formData: FieldValues) => {
    fetcher.submit({ ...formData }, { method: "patch" });
  };

  return (
    <>
      <Helmet>
        <title>{`Update Password - ${user?.firstName} ${user?.lastName}`}</title>
        <meta name="description" content="Update your password" />
      </Helmet>
      <h1 className="font-bold px-2 mb-6">Update your password</h1>
      <div className="max-w-[450px] mx-auto px-2">
        {error && <Alert error={error} />}
        <Form
          method="patch"
          action="/portal/change-password"
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
                    isVisible={isVisible}
                    setIsVisible={setIsVisible}
                  />
                )
              )}
          </div>
          <ActionButton
            type="submit"
            text="Update"
            classname="mt-4 w-full bg-secondary text-base-200 btn-sm rounded-none"
            loading={isSubmitting}
          />
          <p className="text-sm my-2">
            Note: Updating your password will log you out.
          </p>
        </Form>
      </div>
    </>
  );
}

Component.displayName = "UpdatePassword";
