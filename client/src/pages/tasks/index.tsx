import { PageContainer, Pagination } from "@/components";
import { TaskFormData, Userinfo } from "@/emply-types";
import { useAuthProvider } from "@/store/authProvider";
import { formatDate } from "@/utils/format";
import { Plus } from "lucide-react";
import { lazy, Suspense, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, Outlet, useLoaderData, useMatch } from "react-router";
import TableOptions from "./components/TableOptions";
const Table = lazy(() => import("./components/Table"));

export function Component() {
  const [selectPriority, setSelectPriority] = useState<string>("");
  const [selectProgress, setSelectProgress] = useState<string>("");
  const [selectDue, setSelectDue] = useState<string>("");
  const match = useMatch("/tasks");
  const { user } = useAuthProvider() as {
    user: Userinfo;
  };
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
  const roles = ["admin", "super-admin"];

  const filteredTasks = useMemo(() => {
    return tasks?.filter((task) => {
      const matchesPriority = selectPriority
        ? task.priority === selectPriority
        : true;
      const matchesProgress = selectProgress
        ? task.status === selectProgress
        : true;
      const matchesDueDate = selectDue
        ? formatDate(task.dueDate as Date) === selectDue
        : true;
      return matchesPriority && matchesProgress && matchesDueDate;
    });
  }, [tasks, selectPriority, selectProgress, selectDue]);

  return (
    <>
      <Helmet>
        <title>EMPLY | Tasks</title>
        <meta name="description" content="View all tasks" />
      </Helmet>
      <PageContainer>
        {match ? (
          <>
            {roles.includes(user?.role) && (
              <div className="flex justify-end">
                <Link to="/tasks/new">
                  <button className="btn btn-secondary font-bold">
                    <Plus />
                    Add Task
                  </button>
                </Link>
              </div>
            )}
            <TableOptions
              tasks={tasks}
              selectDue={selectDue}
              selectPriority={selectPriority}
              selectProgress={selectProgress}
              setSelectDue={setSelectDue}
              setSelectPriority={setSelectPriority}
              setSelectProgress={setSelectProgress}
            />
            {tasks?.length > 0 ? (
              <div className="flex flex-col min-h-[calc(100vh-220px)] justify-between">
                <Suspense fallback={<div>Loading...</div>}>
                  <Table filteredTasks={filteredTasks} />
                </Suspense>
                <Pagination
                  totalPages={pagination.totalPages}
                  count={pagination.totalTasks}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[50vh]">
                <h1 className="text-2xl font-bold text-white">
                  No tasks created
                </h1>
              </div>
            )}
          </>
        ) : (
          <Outlet />
        )}
      </PageContainer>
    </>
  );
}

Component.displayName = "Tasks";
