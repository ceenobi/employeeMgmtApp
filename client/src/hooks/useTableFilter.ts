import { useState } from "react";

// interface TableFilterState {
//   jobType: string;
//   jobTitle: string;
//   role: string;
//   dept: string;
//   status: string;
// }

interface TableFilterHook {
  jobType: string;
  setJobType: (jobType: string) => void;
  jobTitle: string;
  setJobTitle: (jobTitle: string) => void;
  role: string;
  setRole: (role: string) => void;
  dept: string;
  setDept: (dept: string) => void;
  status: string;
  setStatus: (status: string) => void;
  resetFilter: () => void;
}

export default function useTableFilter(): TableFilterHook {
  const [jobType, setJobType] = useState<string>("");
  const [jobTitle, setJobTitle] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [dept, setDept] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const resetFilter = () => {
    setDept("");
    setRole("");
    setStatus("");
    setJobTitle("");
    setJobType("");
  };

  return {
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
  };
}
