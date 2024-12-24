import { PageContainer, Pagination } from "@/components";
import { TaskFormData, Userinfo } from "@/emply-types";
import { useAuthProvider } from "@/store/authProvider";
import { taskPriority, taskProgress } from "@/utils/constants";
import { Plus } from "lucide-react";
import { lazy, Suspense, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, Outlet, useLoaderData, useMatch } from "react-router";
const TaskCard = lazy(() => import("./components/TaskCard"));

export function Component() {
  const [selectPriority, setSelectPriority] = useState<string>("");
  const [selectProgress, setSelectProgress] = useState<string>("");
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

  const resetFilter = () => {
    setSelectPriority("");
    setSelectProgress("");
  };

  const filteredTasks = useMemo(() => {
    if (!selectPriority && !selectProgress) {
      return tasks;
    }
    const filtered = tasks.filter((task: TaskFormData) => {
      const matchesPriority = selectPriority
        ? task.priority === selectPriority
        : true;
      const matchesProgress = selectProgress
        ? task.status === selectProgress
        : true;

      return matchesPriority && matchesProgress;
    });
    return filtered;
  }, [selectPriority, selectProgress, tasks]);

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
            <div className="mt-6 hidden lg:flex items-center bg-base-200 p-4 rounded-lg shadow-md gap-6">
              <h1 className="font-bold">Sort:</h1>
              <div className="flex flex-wrap gap-6 items-center w-full">
                <select
                  className="select select-sm select-secondary w-full max-w-[150px]"
                  value={selectPriority}
                  onChange={(e) => setSelectPriority(e.target.value)}
                >
                  <option disabled value="">
                    Filter Priority
                  </option>
                  {taskPriority.map((item, index) => (
                    <option key={index} value={item.value}>
                      {item.value}
                    </option>
                  ))}
                </select>
                <select
                  className="select select-sm select-secondary w-full max-w-[150px]"
                  value={selectProgress}
                  onChange={(e) => setSelectProgress(e.target.value)}
                >
                  <option disabled value="">
                    Filter Progress
                  </option>
                  {Object.keys(taskProgress).map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <button
                  onClick={resetFilter}
                  className="btn btn-sm btn-secondary"
                >
                  Reset
                </button>
              </div>
            </div>
            {tasks.length > 0 ? (
              <div className="flex flex-col min-h-[calc(100vh-250px)] justify-between">
                <Suspense fallback={<div>Loading...</div>}>
                  <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-center">
                    {filteredTasks.map((task, index) => (
                      <TaskCard key={task._id} task={task} index={index} />
                    ))}
                  </div>
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
