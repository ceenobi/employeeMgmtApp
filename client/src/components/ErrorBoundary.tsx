import {
  isRouteErrorResponse,
  useLocation,
  useNavigate,
  useRouteError,
} from "react-router";
import ActionButton from "./ActionButton";
import { useAuthProvider } from "@/store/authProvider";

interface ErrorResponse {
  data?: string;
  error?: string;
  message?: string;
  response?: {
    data?: {
      error?: string;
    };
  };
}

interface RouteErrorResponse extends ErrorResponse {
  status: number;
}

export default function ErrorBoundary() {
  const navigate = useNavigate();
  const location = useLocation();
  const error = useRouteError() as RouteErrorResponse;
  console.error("Error object:", error);
  const { isAuthenticated } = useAuthProvider();

  const errorMessage: string =
    error?.data ||
    error?.error ||
    error?.response?.data?.error ||
    error?.message ||
    "An unknown error occurred";

  console.log("Error message:", errorMessage);

  const from = location.state?.from || "/";

  const redirect = () => {
    if (errorMessage === "Session expired, pls login" && isAuthenticated) {
      navigate(0);
    }
    navigate(from, { replace: true });
  };

  return (
    <div className="max-w-[768px] mx-auto p-4">
      <div className="flex flex-col justify-center align-items-center min-h-dvh">
        <h1 className="text-6xl text-center font-bold">Ooops!</h1>
        <div className="mt-4 text-center">
          <p className="text-xl text-sky-300">You have encountered an error</p>
          <div className="flex gap-2 justify-center">
            {isRouteErrorResponse(error) && error?.status && (
              <p className="text-xl text-sky-300 font-bold">{`${error?.status}`}</p>
            )}
            <p className="text-md text-sky-300 font-bold">{errorMessage}</p>
          </div>
          <div className="mt-4 text-center">
            <ActionButton
              classname="mx-auto font-semibold btn btn-error"
              onClick={redirect}
              type="button"
              text="Go Back"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
