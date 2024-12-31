import { PageContainer } from "@/components";
import { Userinfo } from "@/emply-types";
import { Helmet } from "react-helmet-async";
import { useRouteLoaderData } from "react-router";
import {
  Battery,
  BatteryFull,
  BatteryWarning,
  Calendar,
  CalendarClock,
  ListChecks,
  PlugZap,
  UsersRound,
} from "lucide-react";
import { Suspense, lazy } from "react";
import { useAuthProvider } from "@/store/authProvider";

const InfoCard = lazy(() => import("./components/InfoCard"));
const RecentHires = lazy(() => import("./components/RecentHires"));
const Leaves = lazy(() => import("./components/Leaves"));
const UpcomingEvents = lazy(() => import("./components/UpcomingEvents"));
const Payroll = lazy(() => import("./components/Payroll"));
const TaskInfo = lazy(() => import("./components/TaskInfo"));
const TaskThisMonth = lazy(() => import("./components/TaskThisMonth"));

export function Component() {
  const { user } = useAuthProvider() as {
    user: Userinfo;
  };
  const data = useRouteLoaderData("departments-employees");
  const { stats } = data;
  const { employee, leave, task, event, payroll } = stats?.data ?? {};
  const { employeeCount, recentEmployees, employeesPercentage } =
    employee ?? {};
  const {
    leaveCount,
    getApprovedLeaves,
    getPendingLeaves,
    getRejectedLeaves,
    leavesPercentage,
  } = leave ?? {};
  const {
    getTasksThisMonth,
    tasksPercentage,
    totalTasks,
    pendingTasks,
    overdueTasks,
    tasksByPriority,
    completedTask,
    inprogressTasks,
  } = task ?? {};
  const { getEventsThisMonth, eventsPercentage } = event ?? {};
  const {
    getPayrollHistoryNetpay,
    payrollPercentageChange,
    getTotalDeductions,
    getTotalAllowances,
    totalDeductions,
    totalAllowances,
    averagePayrollAmount,
    payrollGrowthRate,
    budgetComparisonPercentage,
    budget,
    upcomingPayrollDates,
    netPayDistributionPercentage,
    chartData,
  } = payroll ?? {};

  return (
    <>
      <Helmet>
        <title>EMPLY | Dashboard - see relevant information</title>
        <meta name="description" content="View statistics" />
      </Helmet>
      <PageContainer>
        <div className="flex items-center justify-between px-2">
          <h1 className="font-bold text-2xl">
            Hello, {user?.firstName} {user?.lastName} 👋🏼
          </h1>
          <div className="flex gap-2 items-center">
            <p className="capitalize font-bold">{user?.status}:</p>
            {user?.status === "active" && (
              <BatteryFull className="text-green-600" />
            )}
            {user?.status === "leave" && (
              <Battery className="text-yellow-600" />
            )}
            {user?.status === "sick" && (
              <BatteryWarning className="text-red-600" />
            )}
            {user?.status === "other" && <PlugZap className="text-red-600" />}
          </div>
        </div>
        <div className="mt-8 flex w-[95vw] md:w-full overflow-x-scroll md:grid md:grid-cols-3 lg:grid-cols-4 gap-4 items-center px-2">
          <Suspense fallback={<div>Loading...</div>}>
            <InfoCard
              title="Staff Strength"
              count={employeeCount}
              icon={<UsersRound />}
              desc={`${employeesPercentage.toFixed(0)}% hires for the month`}
            />
          </Suspense>
          <Suspense fallback={<div>Loading...</div>}>
            <InfoCard
              title="Events"
              count={getEventsThisMonth?.length}
              icon={<CalendarClock />}
              desc={`${eventsPercentage.toFixed(0)}% events created this month`}
            />
          </Suspense>
          <Suspense fallback={<div>Loading...</div>}>
            <InfoCard
              title="Leaves"
              count={leaveCount}
              desc={`${leavesPercentage.toFixed(
                0
              )}% leaves approved this month`}
              icon={<Calendar />}
            />
          </Suspense>
          <Suspense fallback={<div>Loading...</div>}>
            <InfoCard
              title="Tasks"
              count={getTasksThisMonth?.length}
              desc={`${tasksPercentage.toFixed(0)}% tasks completed this month`}
              icon={<ListChecks />}
            />
          </Suspense>
        </div>
        <div className="px-2 mt-8">
          <div className="grid lg:grid-cols-12 gap-4">
            <div className="col-span-12 lg:col-span-8">
              <Suspense fallback={<div>Loading...</div>}>
                <TaskThisMonth getTasksThisMonth={getTasksThisMonth} />
              </Suspense>
              <Suspense fallback={<div>Loading...</div>}>
                <UpcomingEvents eventsThisMonth={getEventsThisMonth} />
              </Suspense>
              <Suspense fallback={<div>Loading...</div>}>
                <Payroll
                  user={user}
                  getPayrollHistoryNetpay={getPayrollHistoryNetpay}
                  payrollPercentageChange={payrollPercentageChange}
                  getTotalDeductions={getTotalDeductions}
                  getTotalAllowances={getTotalAllowances}
                  totalDeductions={totalDeductions}
                  totalAllowances={totalAllowances}
                  averagePayrollAmount={averagePayrollAmount}
                  payrollGrowthRate={payrollGrowthRate}
                  budgetComparisonPercentage={budgetComparisonPercentage}
                  budget={budget}
                  upcomingPayrollDates={upcomingPayrollDates}
                  netPayDistributionPercentage={netPayDistributionPercentage}
                  chartData={chartData}
                />
              </Suspense>
            </div>
            <div className="col-span-12 lg:col-span-4">
              <Suspense fallback={<div>Loading...</div>}>
                <RecentHires recentEmployees={recentEmployees} />
              </Suspense>
              <div className="divider"></div>
              <Suspense fallback={<div>Loading...</div>}>
                <TaskInfo
                  totalTasks={totalTasks}
                  pendingTasks={pendingTasks}
                  overdueTasks={overdueTasks}
                  tasksByPriority={tasksByPriority}
                  completedTask={completedTask}
                  inprogressTasks={inprogressTasks}
                />
              </Suspense>
              <div className="divider"></div>
              <Suspense fallback={<div>Loading...</div>}>
                <Leaves
                  approvedLeaves={getApprovedLeaves}
                  pendingLeaves={getPendingLeaves}
                  rejectedLeaves={getRejectedLeaves}
                />
              </Suspense>
            </div>
          </div>
        </div>
      </PageContainer>
    </>
  );
}

Component.displayName = "Dashboard";
