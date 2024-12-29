import { useNavigate, useLocation } from "react-router";

export default function UnAuthorized() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  return (
    <div className="flex max-w-[600px] mx-auto items-center justify-center min-h-full">
      <div className="text-center">
        <h1 className="my-4 text-xl font-semibold">403</h1>
        <h1 className="text-2xl font-bold text-center">
          Sorry, you are not authorized to access this page
        </h1>
        <button
          className="mt-4 btn btn-error text-white"
          onClick={() => navigate(from, { replace: true })}
        >
          Go back
        </button>
      </div>
    </div>
  );
}
