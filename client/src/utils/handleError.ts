const handleError = (fn: (error: unknown) => void, error: unknown): void => {
  console.error(error);
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string" &&
    (error as { message: string }).message === "Network Error"
  ) {
    return fn("Server is down, pls wait a bit and try again.");
  }
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  ) {
    fn((error as { message: string }).message);
  }

  if (typeof error === "object" && error !== null && "response" in error) {
    const axiosError = error as { response?: { data?: { error?: string } } };
    fn(axiosError.response?.data?.error || axiosError.response?.data);
  } else {
    fn("An unknown error occurred");
  }
};

export default handleError;
