import { PageContainer, Pagination } from "@/components";
import { LeaveFormData, Userinfo } from "@/emply-types";
import { Plus } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Link, Outlet, useLoaderData, useMatch } from "react-router";
import { lazy, Suspense, useMemo, useState } from "react";
import { useAuthProvider } from "@/store/authProvider";
import LeaveOptions from "./components/LeaveOptions";

const Table = lazy(() => import("./components/Table"));

export function Component() {
  const [selectLeaveType, setSelectLeaveType] = useState<string>("");
  const [selectLeaveStatus, setSelectLeaveStatus] = useState<string>("");
  const match = useMatch("/leaves");
  const { user } = useAuthProvider() as {
    user: Userinfo;
  };
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
  // const resetFilter = () => {
  //   setSelectLeaveType("");
  //   setSelectLeaveStatus("");
  // };

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
            <LeaveOptions
              selectLeaveStatus={selectLeaveStatus}
              setSelectLeaveStatus={setSelectLeaveStatus}
              selectLeaveType={selectLeaveType}
              setSelectLeaveType={setSelectLeaveType}
            />
            {/* <div className="mt-6 hidden lg:flex items-center justify-between bg-base-200 p-4 rounded-lg shadow-md gap-6 w-full">
              <h1 className="font-bold">
                Leave count: <span>({user?.leaveCount})</span>
              </h1>
              <div className="flex items-center gap-6">
                <h1 className="font-bold">Filter:</h1>
                <select
                  className="select select-sm select-secondary w-full max-w-[150px]"
                  value={selectLeaveType}
                  onChange={(e) => setSelectLeaveType(e.target.value)}
                >
                  <option disabled value="">
                    Filter Type
                  </option>
                  {leaveType.map((item, index) => (
                    <option key={index} value={item.value}>
                      {item.value}
                    </option>
                  ))}
                </select>
                <select
                  className="select select-sm select-secondary w-full max-w-[150px]"
                  value={selectLeaveStatus}
                  onChange={(e) => setSelectLeaveStatus(e.target.value)}
                >
                  <option disabled value="">
                    Filter Status
                  </option>
                  {Object.keys(leaveStatus).map((item, index) => (
                    <option key={index} value={item}>
                      {item}
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

              {roles.includes(user?.role) && (
                <Link
                  to="all-leaves"
                  className="text-primary text-sm text-right hover:underline"
                >
                  Approve leaves requests
                </Link>
              )}
            </div> */}
            {leaves?.length > 0 ? (
              <div className="flex flex-col min-h-[calc(100vh-220px)] justify-between">
                <Suspense fallback={<div>Loading...</div>}>
                  <Table leaves={filteredLeaves} user={user} roles={roles} />
                </Suspense>

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
