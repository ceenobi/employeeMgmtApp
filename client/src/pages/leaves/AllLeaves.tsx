import { Pagination } from "@/components";
import { LeaveFormData, Userinfo } from "@/emply-types";
import { Helmet } from "react-helmet-async";
import { useLoaderData, useNavigate } from "react-router";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { useAuthProvider } from "@/store/authProvider";
import LeaveOptions from "./components/LeaveOptions";
const Table = lazy(() => import("./components/Table"));

export function Component() {
  const [selectLeaveType, setSelectLeaveType] = useState<string>("");
  const [selectLeaveStatus, setSelectLeaveStatus] = useState<string>("");
  const navigate = useNavigate();
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

  useEffect(() => {
    const roles = ["admin", "super-admin"];
    if (!roles.includes(user?.role)) {
      navigate("/leaves", { replace: true });
    }
  }, [navigate, user?.role]);

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
      <>
        <h1 className="font-bold px-2 mb-6">Leave records</h1>
        <LeaveOptions
          selectLeaveStatus={selectLeaveStatus}
          setSelectLeaveStatus={setSelectLeaveStatus}
          selectLeaveType={selectLeaveType}
          setSelectLeaveType={setSelectLeaveType}
        />
        {leaves?.length > 0 ? (
          <div className="flex flex-col min-h-[calc(100vh-220px)] justify-between">
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
    </>
  );
}

Component.displayName = "AllLeaves";
