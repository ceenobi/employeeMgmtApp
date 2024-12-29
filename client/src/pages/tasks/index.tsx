import { PageContainer, Pagination } from "@/components";
import { TaskFormData, Userinfo } from "@/emply-types";
import { useAuthProvider } from "@/store/authProvider";
import { taskPriority, taskProgress } from "@/utils/constants";
import { formatDate } from "@/utils/format";
import { Plus } from "lucide-react";
import { lazy, Suspense, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, Outlet, useLoaderData, useMatch } from "react-router";
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

  const resetFilter = () => {
    setSelectPriority("");
    setSelectProgress("");
    setSelectDue("");
  };

  const getDueDates = useMemo(() => {
    const dueDates = tasks?.map((item, index) => ({
      date: item.dueDate,
      index,
    }));
    // Remove duplicates based on the date
    const uniqueDueDates = Array.from(
      new Map(dueDates.map((item) => [item.date, item])).values()
    );
    return uniqueDueDates;
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
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
                <select
                  className="select select-sm select-secondary w-full max-w-[150px]"
                  value={selectDue}
                  onChange={(e) => setSelectDue(e.target.value)}
                >
                  <option disabled value="">
                    Filter Due Dates
                  </option>
                  {getDueDates?.map(({ date, index }) => (
                    <option key={index} value={formatDate(date as Date)}>
                      {formatDate(date as Date)}
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
              <div className="flex flex-col min-h-[calc(100vh-220px)] justify-between">
                <Suspense fallback={<div>Loading...</div>}>
                  <Table filteredTasks={filteredTasks} />
                  {/* <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-center">
                    {filteredTasks.map((task, index) => (
                      <TaskCard key={task._id} task={task} index={index} />
                    ))}
                  </div> */}
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
