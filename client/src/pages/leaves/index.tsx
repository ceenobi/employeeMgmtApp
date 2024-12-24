import { PageContainer, Pagination } from "@/components";
import { LeaveFormData } from "@/emply-types";
// import { useAuthProvider } from "@/store/authProvider";
import { Plus } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Link, Outlet, useLoaderData, useMatch } from "react-router";
import { lazy, Suspense } from "react";
const Table = lazy(() => import("./components/Table"));

export function Component() {
  const match = useMatch("/leaves");
  //   const { user } = useAuthProvider() as {
  //     user: Userinfo;
  //   };
  const data = useLoaderData() as {
    data: {
      leaves: LeaveFormData[];
      pagination: {
        currentPage: number;
        totalLeaves: number;
        hasMore: boolean;
        totalPages: number;
      };
    };
  };
  const { leaves, pagination } = data?.data ?? {};
//   const roles = ["super-admin"];
//   console.log(leaves);

  return (
    <>
      <Helmet>
        <title>EMPLY | Leaves</title>
        <meta name="description" content="View all leaves" />
      </Helmet>
      <PageContainer>
        {match ? (
          <>
            <div className="flex justify-end">
              <Link to="/leaves/apply">
                <button className="btn btn-secondary font-bold">
                  <Plus />
                  Apply
                </button>
              </Link>
            </div>
            {leaves?.length > 0 ? (
              <div className="flex flex-col min-h-[calc(100vh-200px)] justify-between">
                <div>
                  <Suspense fallback={<div>Loading...</div>}>
                    <Table leaves={leaves} />
                  </Suspense>
                </div>
                <Pagination
                  totalPages={pagination.totalPages}
                  count={pagination.totalLeaves}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[50vh]">
                <h1 className="text-2xl font-bold text-white">
                  No leaves found
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

Component.displayName = "Leaves";
