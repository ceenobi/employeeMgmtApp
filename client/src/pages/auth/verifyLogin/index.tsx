import { Alert } from "@/components";
import { useSaveToken } from "@/store/stateProvider";
import handleError from "@/utils/handleError";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLoaderData, useLocation, useNavigate } from "react-router";
import { toast } from "sonner";

export function Component() {
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();
  const data = useLoaderData();
  const { setToken } = useSaveToken() as { setToken: (state: string) => void };
  const from = location.state?.from || "/";

  useEffect(() => {
    if (data?.status === 200) {
      setToken(data.token);
      toast.success(data.msg, { id: "verifyLogin" });
      navigate(from, { replace: true });
    } else {
      //setError(data?.msg?.response?.data?.error);
      handleError(setError as unknown as (error: unknown) => void, data?.error);
    }
  }, [
    data?.error,
    data?.msg,
    data?.status,
    data?.token,
    from,
    navigate,
    setToken,
  ]);

  return (
    <>
      <Helmet>
        <title>Login to EMPLY via email link</title>
        <meta name="description" content="Get access to Emply's dashboard" />
      </Helmet>
      <div>{error && <Alert error={error} />}</div>
    </>
  );
}

Component.displayName = "VerifyLogin";
