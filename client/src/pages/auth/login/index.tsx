import { ActionButton, Alert, TextField } from "@/components";
import { useSaveToken } from "@/store/stateProvider";
import { inputFields } from "@/utils/constants";
import handleError from "@/utils/handleError";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm, FieldValues } from "react-hook-form";
import { useLocation, useFetcher, useNavigate, Form, Link } from "react-router";
import { toast } from "sonner";

export function Component() {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [remember, setRemember] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const {
    register,
    handleSubmit,
    setValue,
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
      toast.success(fetcher.data?.msg, { id: "login" });
      setToken(fetcher.data?.token);
      navigate(from, { replace: true });
    }
    if (fetcher.data?.error) {
      //   setError(fetcher.data?.msg?.response?.data?.error);
      handleError(
        setError as unknown as (error: unknown) => void,
        fetcher.data?.error
      );
    }
  }, [fetcher.data, from, navigate, setToken]);

  useEffect(() => {
    const getEmail = sessionStorage.getItem("emplyLoginEmail");
    const getRemember = sessionStorage.getItem("rememberMe");
    if (getEmail && getRemember) {
      setValue("email", JSON.parse(getEmail));
      setValue("remember", JSON.parse(getRemember));
    } else {
      setValue("email", "demo@testmail.com");
      setValue("password", "password");
    }
  }, [setValue]);

  const formFields = ["email", "password"];
  const rememberUser: () => void = () => {
    setRemember((prev: boolean) => !prev);
  };

  const onFormSubmit = async (data: FieldValues) => {
    if (remember) {
      sessionStorage.setItem("emplyLoginEmail", JSON.stringify(data.email));
      sessionStorage.setItem("rememberMe", JSON.stringify(remember));
    }
    fetcher.submit(data, { method: "post" });
  };

  return (
    <>
      <Helmet>
        <title>Login to EMPLY</title>
        <meta name="description" content="Get access to Emply's dashboard" />
      </Helmet>
      <div>
        <h2 className="text-center text-2xl font-bold">Welcome back</h2>
        <p className="text-center">Let's get you signed in</p>
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
          <div className="flex justify-between items-center mb-5">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rememberMe"
                value={remember ? "true" : "false"}
                onChange={rememberUser}
                defaultChecked={JSON.parse(
                  sessionStorage.getItem("rememberMe") as string
                )}
              />
              <label
                className="font-medium text-sm text-sky-300"
                htmlFor="rememberMe"
              >
                Remember me
              </label>
            </div>
            <Link to="/forgot-password" viewTransition>
              <button
                type="button"
                className="font-medium text-sm text-sky-300"
              >
                Forgot your password?
              </button>
            </Link>
          </div>
          <ActionButton
            text="Log in"
            type="submit"
            loading={isSubmitting}
            classname="mt-4 w-full btn-sm btn-secondary rounded-none"
          />
          {error && <Alert error={error} />}
        </Form>
      </div>
    </>
  );
}

Component.displayName = "Login";
