import { useLoaderData } from "react-router";

export function Component() {
  const data = useLoaderData();
  console.log(data);

  return <div>Search</div>;
}

Component.displayName = "SearchTask";
