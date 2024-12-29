import TableFilterOptions from "@/components/TableFilterOptions";
import { DepartmentsData, Userinfo } from "@/emply-types";
import { useTableFilter } from "@/hooks";
import { Helmet } from "react-helmet-async";
import {
  useLoaderData,
  useParams,
  useRouteLoaderData,
  Link,
} from "react-router";
import Table from "../employees/components/Table";
import { useAuthProvider } from "@/store/authProvider";
import { ErrorMsg, Pagination } from "@/components";
import { SquarePen } from "lucide-react";

export function Component() {
  const { name } = useParams();
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
  const { depts } = useRouteLoaderData("departments-employees") as {
    depts: {
      departments: DepartmentsData[];
      getDeptNames: string[];
      deptCount: { [key: string]: number };
    };
  };
  const { user } = useAuthProvider() as {
    user: Userinfo;
  };
  const getCurrentDepartment = depts?.departments?.filter(
    (dept) => dept.name === name
  );
  const { employees, pagination } = data?.employees ?? {};
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
  const roles = ["admin", "super-admin"];

  return (
    <>
      <Helmet>
        <title>Department | {name}. View employees in a department</title>
        <meta name="description" content="View all employees in a dept" />
      </Helmet>
      {data?.error && <ErrorMsg error={data?.error} />}
      {data?.status === 200 && (
        <div className="px-2">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="font-bold">{name}</h1>
              <p>
                <span className="font-semibold">Supervisor: </span>{" "}
                {getCurrentDepartment[0]?.supervisor}
              </p>
            </div>
            {roles.includes(user?.role) && (
              <div className="flex justify-end">
                <Link to={`/departments/${name}/edit`}>
                  <button className="btn btn-secondary font-bold">
                    <SquarePen />
                    Edit
                  </button>
                </Link>
              </div>
            )}
          </div>
          <div>
            {employees?.length > 0 ? (
              <div className="flex flex-col min-h-[calc(100vh-220px)] justify-between">
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
          </div>
        </div>
      )}
    </>
  );
}

Component.displayName = "EmployeesDept";
