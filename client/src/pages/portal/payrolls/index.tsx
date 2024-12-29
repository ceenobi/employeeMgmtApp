import { Pagination } from "@/components";
import { PayrollFormData, Userinfo } from "@/emply-types";
import { useAuthProvider } from "@/store/authProvider";
import { Suspense, lazy } from "react";
import { Helmet } from "react-helmet-async";
import { useRouteLoaderData } from "react-router";
const Table = lazy(() => import("@/pages/payrolls/components/Table"));

export function Component() {
  const { user } = useAuthProvider() as {
    user: Userinfo;
  };
  const data = useRouteLoaderData("employee-summary");
  const { payrolls, payrollsPagination} = data?.data as {
    payrolls: PayrollFormData[];
    payrollsPagination: {
      currentPage: number;
      totalPayrolls: number;
      hasMore: boolean;
      totalPages: number;
    };
  };
  
  return (
    <>
      <Helmet>
        <title>{`Portal - ${user?.firstName} ${user?.lastName} payroll history`}</title>
        <meta name="description" content="View your payment history" />
      </Helmet>
      <h1 className="font-bold px-2 mb-6">Your Payrolls</h1>
      {payrolls?.length > 0 ? (
        <div className="flex flex-col min-h-[calc(100vh-220px)] justify-between">
          <Suspense fallback={<div>Loading...</div>}>
            <Table payrolls={payrolls} userInfo={user} />
          </Suspense>
          <Pagination
            totalPages={payrollsPagination.totalPages}
            count={payrollsPagination.totalPayrolls}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <h1 className="text-2xl font-bold text-white">No payrolls found</h1>
        </div>
      )}
    </>
  );
}

Component.displayName = "EmployeePayrolls";
