import { Pagination } from "@/components";
import { TaskFormData } from "@/emply-types";
import { lazy, Suspense, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLoaderData, useSearchParams } from "react-router";
import TableOptions from "./components/TableOptions";
const Table = lazy(() => import("./components/Table"));

export function Component() {
  const [selectPriority, setSelectPriority] = useState<string>("");
  const [selectProgress, setSelectProgress] = useState<string>("");
  const [selectDue, setSelectDue] = useState<string>("");
  const data = useLoaderData() as {
    data: {
      tasks: TaskFormData[];
      pagination: {
        currentPage: number;
        totalTasks: number;
        hasMore: boolean;
        totalPages: number;
      };
    };
  };
  const { tasks, pagination } = data?.data ?? {};
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("query") as string) || "";

  return (
    <>
      <Helmet>
        <title>Search results for &quot;{query}&quot; tasks</title>
        <meta name="description" content="View search query" />
      </Helmet>
      <h1 className="font-bold px-2 mb-6">
        {`Search results for: "${query}" tasks`}{" "}
      </h1>
      <TableOptions
        tasks={tasks}
        selectDue={selectDue}
        selectPriority={selectPriority}
        selectProgress={selectProgress}
        setSelectDue={setSelectDue}
        setSelectPriority={setSelectPriority}
        setSelectProgress={setSelectProgress}
      />
      {tasks.length > 0 ? (
        <div className="flex flex-col min-h-[calc(100vh-220px)] justify-between">
          <Suspense fallback={<div>Loading...</div>}>
            <Table filteredTasks={tasks} />
          </Suspense>
          <Pagination
            totalPages={pagination.totalPages}
            count={pagination.totalTasks}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <h1 className="text-2xl font-bold text-white">No results found</h1>
        </div>
      )}
    </>
  );
}

Component.displayName = "SearchTask";
