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
import { getDeptNEmployees } from "@/utils/queries";
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
  handlePayrollStatusOrDeletePayrollAction,
  updatePayrollAction,
} from "@/pages/payrolls/action";
import { getLatestPayrollData, getPayrollData } from "@/pages/payrolls/queries";
import { getAnEmployee, getEmployees } from "@/pages/employees/queries";

export default function AppRoutes() {
  const { token } = useSaveToken((state) => state) as {
    token: string;
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
      loader: () => getDeptNEmployees(token),
      children: [
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
          action: ({ request }) =>
            handlePayrollStatusOrDeletePayrollAction({ request }, token),
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
  ] as RouteObject[];

  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
}
