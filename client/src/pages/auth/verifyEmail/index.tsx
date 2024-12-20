import { ActionButton, Alert } from "@/components";
import { Userinfo } from "@/emply-types";
import { useAuthProvider } from "@/store/authProvider";
import handleError from "@/utils/handleError";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLoaderData, useLocation, useNavigate } from "react-router";

export function Component() {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();
  const data = useLoaderData();
  const { user } = useAuthProvider() as {
    user: Userinfo;
  };
  const from = location.state?.from || "/";

  console.log("ff", data);

  useEffect(() => {
    if (user?.isVerified) {
      navigate(from, { replace: true });
    } else if (data?.data?.success) {
      setSuccess(data.msg);
    } else {
      handleError(setError as unknown as (error: unknown) => void, data?.error);
    }
  }, [
    data,
    data.msg,
    data.success,
    data.token,
    from,
    navigate,
    user?.isVerified,
  ]);

  return (
    <>
      <Helmet>
        <title>Verify Email</title>
        <meta name="description" content="Verify your email" />
      </Helmet>
      <div>
        {error && <Alert error={error} />}
        {success && (
          <>
            <div role="alert" className="alert alert-success mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{success}</span>
            </div>
          </>
        )}
        <ActionButton
          text="Continue"
          type="button"
          classname="w-full btn-sm btn-secondary rounded-none"
          onClick={() => navigate(from, { replace: true })}
        />
      </div>
    </>
  );
}

Component.displayName = "VerifyEmail";
