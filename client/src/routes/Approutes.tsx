import { ErrorBoundary, LazySpinner } from "@/components";
import { Suspense } from "react";
import { createBrowserRouter, RouteObject, RouterProvider } from "react-router";
import { AuthLayout, RootLayout } from ".";
import { loginAction } from "@/pages/auth/login/action";
import {
  deleteEmployeeAction,
  registerAction,
  updateEmployeeAction,
} from "@/pages/employees/action";
import { PrivateRoutes, PublicRoutes } from "./ProtectedRoutes";
import { signInViaEmailAction } from "@/pages/auth/forgotPassword/action";
import verifyLoginLinkloader from "@/pages/auth/verifyLogin/loader";
import verifyEmailloader from "@/pages/auth/verifyEmail/loader";
import { useSaveToken } from "@/store/stateProvider";
import { getDeptEmployeesNStats } from "@/utils/queries";
import {
  getDepartmentLoader,
  getDeptEmployeesLoader,
} from "@/pages/departments/loader";
import {
  createDepartmentAction,
  updateDepartmentAction,
} from "@/pages/departments/action";
import {
  createPayrollAction,
  handlePayrollActions,
  updatePayrollAction,
} from "@/pages/payrolls/action";
import { getLatestPayrollData, getPayrollData } from "@/pages/payrolls/queries";
import { getAnEmployee, getEmployees } from "@/pages/employees/queries";
import {
  createTaskAction,
  deleteTaskAction,
  updateTaskAction,
} from "@/pages/tasks/action";
import { getSingleTask, getTasksData, searchTask } from "@/pages/tasks/queries";
import { Userinfo } from "@/emply-types";
import { resendEmailVerificationAction } from "@/pages/auth/verifyEmail/action";
import {
  applyLeaveAction,
  updateLeaveAction,
  updateLeaveStatusOrDeleteLeaveAction,
} from "@/pages/leaves/action";
import {
  getLeaveData,
  getLeavesData,
  getUserLeavesData,
} from "@/pages/leaves/queries";
import {
  createEventAction,
  updateOrDeleteEventAction,
} from "@/pages/events/action";
import { getEventsData, getSingleEvent } from "@/pages/events/queries";
import { getEmployeeSummaryData } from "@/pages/portal/queries";
import { updatePasswordAction } from "@/pages/portal/password/action";
import { useAuthProvider } from "@/store/authProvider";

export default function AppRoutes() {
  const { token } = useSaveToken((state) => state) as {
    token: string;
  };
  const { user } = useAuthProvider() as {
    user: Userinfo;
  };

  const routes = [
    {
      path: "/",
      id: "departments-employees",
      errorElement: <ErrorBoundary />,
      element: (
        <PrivateRoutes>
          <Suspense fallback={<LazySpinner />}>
            <RootLayout />
          </Suspense>
        </PrivateRoutes>
      ),
      loader: () => getDeptEmployeesNStats(token, user),
      children: [
        {
          index: true,
          lazy: () => import("@/pages/dashboard"),
        },
        {
          path: "employees",
          id: "employees",
          lazy: () => import("@/pages/employees"),
          loader: ({ request }) => getEmployees({ request, token }),
          action: ({ request }) => deleteEmployeeAction({ request }, token),
          children: [
            {
              path: "new",
              lazy: () => import("@/pages/employees/New"),
              action: ({ request }) => registerAction({ request }, token),
            },
            {
              path: "edit/:employeeId",
              lazy: () => import("@/pages/employees/Edit"),
              action: ({ request }) => updateEmployeeAction({ request }, token),
              loader: ({ params }) =>
                getAnEmployee(params.employeeId ?? "defaultEmployeeId", token),
            },
          ],
        },
        {
          path: "departments",
          lazy: () => import("@/pages/departments"),
          children: [
            {
              path: ":name",
              lazy: () => import("@/pages/departments/Employees"),
              loader: ({ request, params }) =>
                getDeptEmployeesLoader({
                  request: request,
                  params: {
                    name: params.name ?? "defaultDept",
                    token: token,
                  },
                }),
            },
            {
              path: ":name/edit",
              lazy: () => import("@/pages/departments/Edit"),
              loader: ({ params }) =>
                getDepartmentLoader({
                  departmentName: params.name ?? "defaultDept",
                  token: token,
                }),
              action: ({ request }) =>
                updateDepartmentAction({ request }, token),
            },
            {
              path: "new",
              lazy: () => import("@/pages/departments/New"),
              action: ({ request }) =>
                createDepartmentAction({ request }, token),
            },
          ],
        },
        {
          path: "payrolls",
          lazy: () => import("@/pages/payrolls"),
          loader: ({ request }) => getLatestPayrollData({ request, token }),
          action: ({ request }) => handlePayrollActions({ request }, token),
          children: [
            {
              path: "new",
              lazy: () => import("@/pages/payrolls/New"),
              action: ({ request }) => createPayrollAction({ request }, token),
            },
            {
              path: ":id/edit",
              lazy: () => import("@/pages/payrolls/Edit"),
              loader: ({ params }) =>
                getPayrollData(params.id ?? "payrollId", token),
              action: ({ request }) => updatePayrollAction({ request }, token),
            },
          ],
        },
        {
          path: "tasks",
          lazy: () => import("@/pages/tasks"),
          loader: ({ request }) => getTasksData({ request, token }),
          action: ({ request }) => deleteTaskAction({ request }, token),
          children: [
            {
              path: "new",
              lazy: () => import("@/pages/tasks/New"),
              action: ({ request }) => createTaskAction({ request }, token),
            },
            {
              path: ":id/edit",
              lazy: () => import("@/pages/tasks/Edit"),
              loader: ({ params }) =>
                getSingleTask(params.id ?? "taskId", token),
              action: ({ request }) => updateTaskAction({ request }, token),
            },
            {
              path:"search",
              lazy:()=> import("@/pages/tasks/Search"), 
              loader: ({ request }) => searchTask({ request, token }),
            }
          ],
        },
        {
          path: "leaves",
          lazy: () => import("@/pages/leaves"),
          loader: ({ request }) => getUserLeavesData({ request, token }),
          action: ({ request }) =>
            updateLeaveStatusOrDeleteLeaveAction({ request }, token),
          children: [
            {
              path: "apply",
              lazy: () => import("@/pages/leaves/Apply"),
              action: ({ request }) => applyLeaveAction({ request }, token),
            },
            {
              path: "all-leaves",
              lazy: () => import("@/pages/leaves/AllLeaves"),
              loader: ({ request }) => getLeavesData({ request, token }),
            },
            {
              path: ":id/edit",
              lazy: () => import("@/pages/leaves/Edit"),
              loader: ({ params }) =>
                getLeaveData(params.id ?? "leaveId", token),
              action: ({ request }) => updateLeaveAction({ request }, token),
            },
          ],
        },
        {
          path: "events",
          lazy: () => import("@/pages/events"),
          loader: ({ request }) => getEventsData({ request, token }),
          children: [
            {
              path: "create",
              lazy: () => import("@/pages/events/Create"),
              action: ({ request }) => createEventAction({ request }, token),
            },
            {
              path: ":id/edit",
              lazy: () => import("@/pages/events/Edit"),
              loader: ({ params }) =>
                getSingleEvent(params.id ?? "eventId", token),
              action: ({ request }) =>
                updateOrDeleteEventAction({ request }, token),
            },
          ],
        },
        {
          path: "portal",
          lazy: () => import("@/pages/portal"),
          id: "employee-summary",
          loader: () => getEmployeeSummaryData(token),
          children: [
            {
              path: "edit-profile",
              lazy: () => import("@/pages/portal/EditProfile"),
              action: ({ request }) => updateEmployeeAction({ request }, token),
            },
            {
              path: "events",
              lazy: () => import("@/pages/portal/events"),
            },
            {
              path: "tasks",
              lazy: () => import("@/pages/portal/tasks"),
            },
            {
              path: "payrolls",
              lazy: () => import("@/pages/portal/payrolls"),
            },
            {
              path: "change-password",
              lazy: () => import("@/pages/portal/password"),
              action: ({ request }) => updatePasswordAction({ request }, token),
            },
          ],
        },
      ],
    },
    {
      element: (
        <PublicRoutes>
          <Suspense fallback={<LazySpinner />}>
            <AuthLayout />
          </Suspense>
        </PublicRoutes>
      ),
      children: [
        {
          path: "login",
          lazy: () => import("@/pages/auth/login"),
          action: loginAction,
        },
        {
          path: "register",
          lazy: () => import("@/pages/auth/register"),
        },
        {
          path: "forgot-password",
          lazy: () => import("@/pages/auth/forgotPassword"),
          action: signInViaEmailAction,
        },
        {
          path: "verify-login/:userId/:loginToken",
          lazy: () => import("@/pages/auth/verifyLogin"),
          loader: ({ params }) =>
            verifyLoginLinkloader({
              userId: params.userId ?? "defaultUserId",
              loginToken: params.loginToken ?? "defaultLoginToken",
            }),
        },
        {
          path: "verify-email/:userId/:verificationToken",
          lazy: () => import("@/pages/auth/verifyEmail"),
          loader: ({ params }) =>
            verifyEmailloader({
              userId: params.userId ?? "defaultUserId",
              verificationToken:
                params.verificationToken ?? "defaultVerificationToken",
            }),
        },
      ],
    },
    {
      path: "verify-redirect",
      lazy: () => import("@/pages/auth/verifyEmail/VerifiedRedirect"),
      action: ({ request }) =>
        resendEmailVerificationAction({ request }, token),
    },
  ] as RouteObject[];

  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
}
