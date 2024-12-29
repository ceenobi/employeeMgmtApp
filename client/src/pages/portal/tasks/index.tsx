import { Pagination } from "@/components";
import { TaskFormData, Userinfo } from "@/emply-types";
import { useAuthProvider } from "@/store/authProvider";
import { taskPriority, taskProgress } from "@/utils/constants";
import { Plus } from "lucide-react";
import { lazy, Suspense, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useRouteLoaderData } from "react-router";
const Table = lazy(() => import("@/pages/tasks/components/Table"));

export function Component() {
  const [selectPriority, setSelectPriority] = useState<string>("");
  const [selectProgress, setSelectProgress] = useState<string>("");
  const { user } = useAuthProvider() as {
    user: Userinfo;
  };
  const data = useRouteLoaderData("employee-summary");
  const { tasks, tasksPagination } = data?.data as {
    tasks: TaskFormData[];
    tasksPagination: {
      currentPage: number;
      totalTasks: number;
      hasMore: boolean;
      totalPages: number;
    };
  };
  const roles = ["admin", "super-admin"];
  console.log(tasks);
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
        <title>{`Portal - ${user?.firstName} ${user?.lastName} tasks`}</title>
        <meta name="description" content="View your assigned tasks" />
      </Helmet>
      <div className="flex justify-between items-center">
        <h1 className="font-bold px-2 mb-6">Your Tasks</h1>
        {roles.includes(user?.role) && (
          <Link to="/tasks/new">
            <button className="btn btn-secondary font-bold">
              <Plus />
              Create Task
            </button>
          </Link>
        )}
      </div>
      <div className="mt-6 hidden lg:flex items-center bg-base-200 p-4 rounded-lg shadow-md gap-6">
        <h1 className="font-bold">Filter:</h1>
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
          <button onClick={resetFilter} className="btn btn-sm btn-secondary">
            Reset
          </button>
        </div>
      </div>
      {tasks.length > 0 ? (
        <div className="flex flex-col min-h-[calc(100vh-220px)] justify-between">
          <Suspense fallback={<div>Loading...</div>}>
            <Table filteredTasks={filteredTasks} />
          </Suspense>
          <Pagination
            totalPages={tasksPagination.totalPages}
            count={tasksPagination.totalTasks}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <h1 className="text-2xl font-bold text-white">
            You have not been assigned a task.
          </h1>
        </div>
      )}
    </>
  );
}

Component.displayName = "EmployeeTasks";
