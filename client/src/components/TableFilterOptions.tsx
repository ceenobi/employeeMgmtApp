import {
  employeeRole,
  jobType as employeeJobType,
  jobTitle as employeeJobTitle,
  employeeStatus,
} from "@/utils/constants";
import { useRouteLoaderData } from "react-router";
import { DepartmentsData } from "@/emply-types";

interface TableFilterOptionsProps {
  jobType: string;
  setJobType: (value: string) => void;
  jobTitle: string;
  setJobTitle: (value: string) => void;
  role: string;
  setRole: (value: string) => void;
  dept: string;
  setDept: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  resetFilter: () => void;
}

export default function TableFilterOptions({
  jobType,
  setJobType,
  jobTitle,
  setJobTitle,
  role,
  setRole,
  dept,
  setDept,
  status,
  setStatus,
  resetFilter,
}: TableFilterOptionsProps) {
  const { depts } = useRouteLoaderData("departments-employees") as {
    depts: {
      departments: DepartmentsData[];
      getDeptNames: string[];
      deptCount: { [key: string]: number };
    };
  };

  return (
    <div className="mt-6 hidden lg:flex flex-wrap gap-6  items-center bg-base-200 p-4 rounded-lg shadow-md">
      <select
        className="select select-sm select-secondary w-full max-w-[150px]"
        value={jobType}
        onChange={(e) => setJobType(e.target.value)}
      >
        <option disabled value="">
          Filter Job type
        </option>
        {employeeJobType.map((item, index) => (
          <option key={index} value={item.value}>
            {item.value}
          </option>
        ))}
      </select>
      <select
        className="select select-sm select-secondary w-full max-w-[150px]"
        value={jobTitle}
        onChange={(e) => setJobTitle(e.target.value)}
      >
        <option disabled value="">
          Filter Job title
        </option>
        {employeeJobTitle.map((item, index) => (
          <option key={index} value={item.value}>
            {item.value}
          </option>
        ))}
      </select>
      <select
        className="select select-sm select-secondary w-full max-w-[150px]"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option disabled value="">
          Filter Role
        </option>
        {employeeRole.map((item, index) => (
          <option key={index} value={item.value}>
            {item.value}
          </option>
        ))}
      </select>
      <select
        className="select select-sm select-secondary w-full max-w-[150px]"
        value={dept}
        onChange={(e) => setDept(e.target.value)}
      >
        <option disabled value="">
          Filter Department
        </option>
        {depts.getDeptNames.map((item, index) => (
          <option key={index} value={item}>
            {item}
          </option>
        ))}
      </select>
      <select
        className="select select-sm select-secondary w-full max-w-[150px]"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option disabled value="">
          Filter Status
        </option>
        {employeeStatus.map((item, index) => (
          <option key={index} value={item.value}>
            {item.value}
          </option>
        ))}
      </select>
      <button onClick={resetFilter} className="btn btn-sm btn-secondary">
        Reset
      </button>
    </div>
  );
}
