import { Pagination } from "@/components";
import { PayrollFormData, Userinfo } from "@/emply-types";
import { useAuthProvider } from "@/store/authProvider";
import { lazy, Suspense } from "react";
import { Helmet } from "react-helmet-async";
import { useLoaderData, useSearchParams } from "react-router";
const Table = lazy(() => import("./components/Table"));

export function Component() {
  const [searchParams] = useSearchParams();
  const { user } = useAuthProvider() as {
    user: Userinfo;
  };
  const query = (searchParams.get("query") as string) || "";
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

  return (
    <>
      <Helmet>
        <title>Search results for &quot;{query}&quot; payroll</title>
        <meta name="description" content="View search query" />
      </Helmet>
      <h1 className="font-bold px-2 mb-6">
        {`Search results for: "${query}" payroll`}{" "}
      </h1>
      {payrolls?.length > 0 ? (
        <div className="flex flex-col min-h-[calc(100vh-220px)] justify-between">
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
          <h1 className="text-2xl font-bold text-white">No payrolls found</h1>
        </div>
      )}
    </>
  );
}

Component.displayName = "SearchPayroll";
