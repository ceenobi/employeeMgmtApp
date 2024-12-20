export function LazySpinner() {
  return (
    <div className="flex gap-2 justify-center items-center h-screen">
      <span className="loading loading-spinner loading-md bg-secondary"></span>
      <h1 className="text-2xl font-bold">EMPLY</h1>
    </div>
  );
}

export function DataSpinner() {
  return (
    <div className="flex justify-center items-center h-screen">
      <span className="loading loading-spinner loading-md bg-secondary"></span>
    </div>
  );
}
