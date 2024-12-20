import { useNavigate } from "react-router";

interface Error {
  status: string;
  response: {
    data: {
      error: string;
    };
  };
}

export default function ErrorMsg({ error }: { error: Error }) {
  const navigate = useNavigate();
  const redirect = () => {
    navigate(-1);
  };

  return (
    <div className="flex max-w-[600px] mx-auto items-center justify-center min-h-[50vh]">
      <div className="text-center">
        <h1 className="my-4 text-xl font-semibold">{error?.status}</h1>
        <h1 className="text-xl font-bold text-center">
          {error?.response?.data?.error}
        </h1>
        <button className="mt-4 btn btn-error" onClick={redirect}>
          Go back
        </button>
      </div>
    </div>
  );
}
