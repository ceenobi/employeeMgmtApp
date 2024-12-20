import { Helmet } from "react-helmet-async";
import { Form, useFetcher, useNavigate } from "react-router";
import { useForm, FieldValues } from "react-hook-form";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { inputFields } from "@/utils/constants";
import { ActionButton, Alert, TextField } from "@/components";
import { useSaveToken } from "@/store/stateProvider";
import handleError from "@/utils/handleError";

export function Component() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const fetcher = useFetcher();
  const [error, setError] = useState<string>("");
  const { setToken } = useSaveToken() as { setToken: (state: string) => void };
  const navigate = useNavigate();
  const isSubmitting = fetcher.state === "submitting";

  useEffect(() => {
    if (fetcher.data?.status === 200) {
      toast.success(fetcher.data?.msg);
      setToken(fetcher.data?.token);
      navigate("/");
    }
    if (fetcher.data?.error) {
      handleError(
        setError as unknown as (error: unknown) => void,
        fetcher.data?.error
      );
    }
  }, [fetcher.data, navigate, setToken]);

  const formFields = ["email"];

  const onFormSubmit = async (data: FieldValues) => {
    fetcher.submit(data, { method: "post" });
  };

  return (
    <>
      <Helmet>
        <title>Let&apos;s get you signed in</title>
        <meta name="description" content="Get access to Emply" />
      </Helmet>
      <div>
        <p className="text-center">
          Enter your email, and we&apos;ll send you a link to get back into your
          account.
        </p>
        <Form
          method="post"
          action="/forgot-password"
          onSubmit={handleSubmit(onFormSubmit)}
        >
          {inputFields
            .filter((item) => formFields.includes(item.name))
            .map(({ type, id, name, label, placeholder, validate }) => (
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
              />
            ))}
          <ActionButton
            text="Send Email Link"
            type="submit"
            loading={isSubmitting}
            classname="w-full btn-sm btn-secondary rounded-none"
          />
          {error && <Alert error={error} />}
        </Form>
      </div>
    </>
  );
}

Component.displayName = "ForgotPassword";
