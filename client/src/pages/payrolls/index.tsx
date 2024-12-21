import { PageContainer, Pagination } from "@/components";
import { Helmet } from "react-helmet-async";
import { Link, Outlet, useLoaderData, useMatch } from "react-router";
import { Plus } from "lucide-react";
import { useAuthProvider } from "@/store/authProvider";
import { PayrollFormData, Userinfo } from "@/emply-types";
import { lazy, Suspense } from "react";
const Table = lazy(() => import("./components/Table"));

export function Component() {
  const match = useMatch("/payrolls");
  const { user } = useAuthProvider() as {
    user: Userinfo;
  };
  const data = useLoaderData() as {
    data: {
      payrolls: PayrollFormData[];
      pagination: {
        currentPage: number;
        totalPayrolls: number;
        hasMore: boolean;
        totalPages: number;
      };
    };
  };
  const { payrolls, pagination } = data?.data ?? {};
  const roles = ["admin", "super-admin"];

  return (
    <>
      <Helmet>
        <title>Payroll Management</title>
        <meta name="description" content="Manage employee payrolls" />
      </Helmet>
      <PageContainer>
        {match ? (
          <>
            {roles.includes(user?.role) && (
              <div className="flex justify-end">
                <Link to="/payrolls/new">
                  <button className="btn btn-secondary font-bold">
                    <Plus />
                    Create New Payroll
                  </button>
                </Link>
              </div>
            )}
            <>
              {payrolls?.length > 0 ? (
                <div className="flex flex-col min-h-[calc(100vh-200px)] justify-between">
                  <Suspense fallback={<div>Loading...</div>}>
                    <Table payrolls={payrolls} userInfo={user} />
                  </Suspense>
                  <Pagination
                    totalPages={pagination.totalPages}
                    count={pagination.totalPayrolls}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[50vh]">
                  <h1 className="text-2xl font-bold text-white">
                    No payrolls found
                  </h1>
                </div>
              )}
            </>
          </>
        ) : (
          <Outlet />
        )}
      </PageContainer>
    </>
  );
}

Component.displayName = "Payrolls";
