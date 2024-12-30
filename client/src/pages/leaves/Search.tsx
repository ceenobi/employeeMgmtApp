import { LeaveFormData, Userinfo } from "@/emply-types";
import { lazy, useMemo, useState, Suspense } from "react";
import { Helmet } from "react-helmet-async";
import { useLoaderData, useSearchParams } from "react-router";
import LeaveOptions from "./components/LeaveOptions";
import { Pagination } from "@/components";
import { useAuthProvider } from "@/store/authProvider";
const Table = lazy(() => import("./components/Table"));

export function Component() {
  const [selectLeaveType, setSelectLeaveType] = useState<string>("");
  const [selectLeaveStatus, setSelectLeaveStatus] = useState<string>("");
  const [searchParams] = useSearchParams();
  const { user } = useAuthProvider() as {
    user: Userinfo;
  };
  const query = (searchParams.get("query") as string) || "";
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
  const roles = ["admin", "super-admin"];

  const filteredLeaves = useMemo(() => {
    if (!selectLeaveType && !selectLeaveStatus) {
      return leaves;
    }
    const filtered = leaves?.filter((leave: LeaveFormData) => {
      const matchesLeaveType = selectLeaveType
        ? leave.leaveType === selectLeaveType
        : true;
      const matchesLeaveStatus = selectLeaveStatus
        ? leave.status === selectLeaveStatus
        : true;

      return matchesLeaveType && matchesLeaveStatus;
    });
    return filtered;
  }, [leaves, selectLeaveStatus, selectLeaveType]);

  return (
    <>
      <Helmet>
        <title>Search results for &quot;{query}&quot; leaves</title>
        <meta name="description" content="View search query" />
      </Helmet>
      <h1 className="font-bold px-2 mb-6">
        {`Search results for: "${query}" leaves`}{" "}
      </h1>
      <LeaveOptions
        selectLeaveStatus={selectLeaveStatus}
        setSelectLeaveStatus={setSelectLeaveStatus}
        selectLeaveType={selectLeaveType}
        setSelectLeaveType={setSelectLeaveType}
      />
      {leaves?.length > 0 ? (
        <div className="flex flex-col min-h-[calc(100vh-200px)] justify-between">
          <div>
            <Suspense fallback={<div>Loading...</div>}>
              <Table leaves={filteredLeaves} user={user} roles={roles} />
            </Suspense>
          </div>
          <Pagination
            totalPages={pagination.totalPages}
            count={pagination.totalLeaves}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <h1 className="text-2xl font-bold text-white">No leaves found</h1>
        </div>
      )}
    </>
  );
}

Component.displayName = "SearchLeaves";
