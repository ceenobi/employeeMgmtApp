import { ErrorMsg, PageContainer, Pagination } from "@/components";
import { Userinfo } from "@/emply-types";
import { useAuthProvider } from "@/store/authProvider";
import { Plus } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Link, Outlet, useMatch, useLoaderData } from "react-router";
import Table from "./components/Table";
import TableFilterOptions from "@/components/TableFilterOptions";
import { useTableFilter } from "@/hooks";

export function Component() {
  const {
    jobType,
    jobTitle,
    role,
    dept,
    status,
    setJobTitle,
    setJobType,
    setRole,
    setDept,
    setStatus,
    resetFilter,
  } = useTableFilter();

  const match = useMatch("/employees");
  const { user } = useAuthProvider() as {
    user: Userinfo;
  };
  const data = useLoaderData() as {
    employees: {
      employees: Userinfo[];
      pagination: {
        currentPage: number;
        totalEmployees: number;
        hasMore: boolean;
        totalPages: number;
      };
    };
    error: {
      status: string;
      response: {
        data: {
          error: string;
        };
      };
    };
    status: number;
  };

  const roles = ["admin", "super-admin"];
  const { employees, pagination } = data?.employees ?? {};

  return (
    <>
      <Helmet>
        <title>EMPLY | Employees</title>
        <meta name="description" content="View all employees" />
      </Helmet>
      <PageContainer>
        {match ? (
          <>
            {roles.includes(user?.role) && (
              <div className="flex justify-end">
                <Link to="/employees/new">
                  <button className="btn btn-secondary font-bold">
                    <Plus />
                    Add Employee
                  </button>
                </Link>
              </div>
            )}
            {data?.error && <ErrorMsg error={data?.error} />}
            {data?.status === 200 && (
              <>
                {employees?.length > 0 ? (
                  <div className="flex flex-col min-h-[calc(100vh-200px)] justify-between">
                    <div>
                      <TableFilterOptions
                        jobType={jobType}
                        setJobType={setJobType}
                        jobTitle={jobTitle}
                        setJobTitle={setJobTitle}
                        role={role}
                        setRole={setRole}
                        dept={dept}
                        setDept={setDept}
                        status={status}
                        setStatus={setStatus}
                        resetFilter={resetFilter}
                      />
                      <Table
                        employees={employees}
                        userInfo={user}
                        jobTitle={jobTitle}
                        jobType={jobType}
                        role={role}
                        dept={dept}
                        status={status}
                      />
                    </div>
                    <Pagination
                      totalPages={pagination.totalPages}
                      count={pagination.totalEmployees}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[50vh]">
                    <h1 className="text-2xl font-bold text-white">
                      No employees found
                    </h1>
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <Outlet />
        )}
      </PageContainer>
    </>
  );
}

Component.displayName = "Employees";
