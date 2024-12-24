import { ActionButton, Alert } from "@/components";
import { Userinfo } from "@/emply-types";
import { useAuthProvider } from "@/store/authProvider";
import handleError from "@/utils/handleError";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Form, useFetcher, useNavigate } from "react-router";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export function Component() {
  const [error, setError] = useState<string>("");
  const { user, logout } = useAuthProvider() as {
    user: Userinfo;
    logout: () => void;
  };
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isSubmitting = fetcher.state === "submitting";

  const handleLogout = () => {
    queryClient.clear();
    localStorage.clear();
    logout();
    navigate("/", { replace: true });
  };

  useEffect(() => {
    if (!user || user?.isVerified) {
      navigate("/", { replace: true });
    }
  }, [navigate, user, user?.isVerified]);

  useEffect(() => {
    if (fetcher.data?.status === 200) {
      toast.success(fetcher.data?.msg, { id: "verifiedLink" });
      navigate("/", { replace: true });
    }
    if (fetcher.data?.error) {
      handleError(
        setError as unknown as (error: unknown) => void,
        fetcher.data?.error
      );
    }
  }, [fetcher.data, navigate]);

  const onFormSubmit = async () => {
    const formData = {
      email: user?.email,
    };
    fetcher.submit(formData, { method: "post" });
  };

  return (
    <>
      {" "}
      <Helmet>
        <title>Verify Email Check - Resend verification email</title>
        <meta
          name="description"
          content="Redirect here if employee is not verified"
        />
      </Helmet>
      <div className="flex flex-col justify-center items-center h-screen w-full max-w-[400px] mx-auto">
        <h1 className="text-xl">
          Hi, {user?.firstName} {user?.lastName}
        </h1>
        <h1 className="mt-2 text-2xl font-bold">
          You have not verified your email yet.
        </h1>
        <p>You will be unable to continue unless you do so.</p>
        <Form
          method="post"
          action="/verify-redirect"
          onSubmit={onFormSubmit}
          className="my-4 w-[90%]"
        >
          <ActionButton
            text="Resend Link"
            type="submit"
            loading={isSubmitting}
            classname="w-full btn-sm btn-secondary rounded-none"
          />
        </Form>
        <button
          className="btn btn-primary rounded-none w-[90%] text-white"
          onClick={handleLogout}
        >
          Logout
        </button>
        {error && <Alert error={error} />}
      </div>
    </>
  );
}

Component.displayName = "VerifyRedirect";
