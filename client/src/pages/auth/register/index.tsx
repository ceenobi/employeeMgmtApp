import { ActionButton, Alert, TextField } from "@/components";
import { useSaveToken } from "@/store/stateProvider";
import { inputFields } from "@/utils/constants";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm, FieldValues } from "react-hook-form";
import { useLocation, useFetcher, useNavigate, Form } from "react-router";
import { toast } from "sonner";

export function Component() {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const fetcher = useFetcher();
  const { setToken } = useSaveToken() as { setToken: (state: string) => void };
  const from = location.state?.from || "/";
  const isSubmitting = fetcher.state === "submitting";

  useEffect(() => {
    if (fetcher.data?.status === 200) {
      toast.success(fetcher.data?.msg);
      setToken(fetcher.data?.token);
      navigate(from, { replace: true });
    }
    if (fetcher.data?.msg?.response?.data?.error) {
      setError(fetcher.data?.msg?.response?.data?.error);
    }
  }, [fetcher.data, from, navigate, setToken]);

  const formFields = ["email", "password", "firstName", "lastName"];

  const onFormSubmit = async (data: FieldValues) => {
    fetcher.submit(data, { method: "post" });
  };

  return (
    <>
      <Helmet>
        <title>Register EMPLY User</title>
        <meta name="description" content="Get access to Emply's dashboard" />
      </Helmet>
      <div>
        <Form
          method="post"
          action="/login"
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
                isVisible={isVisible}
                setIsVisible={setIsVisible}
              />
            ))}
          <ActionButton
            text="Log in"
            type="submit"
            loading={isSubmitting}
            classname="w-full btn-sm btn-secondary font-bold"
          />
          {error && <Alert error={error} />}
        </Form>
      </div>
    </>
  );
}

Component.displayName = "Register";
