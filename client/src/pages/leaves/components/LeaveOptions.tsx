import { Userinfo } from "@/emply-types";
import { useAuthProvider } from "@/store/authProvider";
import { leaveStatus, leaveType } from "@/utils/constants";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

type TableOptionsProps = {
  setSelectLeaveType: (value: string) => void;
  setSelectLeaveStatus: (value: string) => void;
  selectLeaveType: string;
  selectLeaveStatus: string;
};

export default function LeaveOptions({
  setSelectLeaveType,
  setSelectLeaveStatus,
  selectLeaveType,
  selectLeaveStatus,
}: TableOptionsProps) {
  const [isSearch, setIsSearch] = useState(() => {
    const storedValue = sessionStorage.getItem("isSearch");
    return storedValue ? JSON.parse(storedValue) : false;
  });
  const { user } = useAuthProvider() as {
    user: Userinfo;
  };
  const navigate = useNavigate();
  const roles = ["admin", "super-admin"];

  const resetFilter = useCallback(() => {
    setSelectLeaveType("");
    setSelectLeaveStatus("");
    setIsSearch(false);
    navigate("/leaves");
  }, [setSelectLeaveType, setSelectLeaveStatus, navigate]);

  useEffect(() => {
    sessionStorage.setItem("isSearch", JSON.stringify(isSearch));
  }, [isSearch]);

  useEffect(() => {
    if (isSearch) {
      if (selectLeaveType) {
        navigate(`/leaves/search?query=${selectLeaveType}`);
      }
      if (selectLeaveStatus) {
        navigate(`/leaves/search?query=${selectLeaveStatus}`);
      }
    }
  }, [isSearch, navigate, selectLeaveStatus, selectLeaveType]);

  useEffect(() => {
    if (isSearch) {
      if (selectLeaveStatus) {
        navigate(`/leaves/search?query=${selectLeaveStatus}`);
      }
    }
  }, [isSearch, navigate, selectLeaveStatus]);

  return (
    <div className="mt-6 hidden lg:flex items-center justify-between bg-base-200 p-4 rounded-lg shadow-md">
      <div className="flex items-center w-full gap-6">
        <h1 className="font-bold">
          Leave count: <span>({user?.leaveCount})</span>
        </h1>
        <div className="flex gap-2">
          <input
            type="checkbox"
            className="toggle toggle-secondary tooltip tooltip-top"
            defaultChecked={isSearch}
            onClick={() => setIsSearch(!isSearch)}
            id="toggle-sidebar"
            data-tip={isSearch ? "Toggle Filter" : "Toggle Search"}
          />
          <h1>{isSearch ? "Search" : "Filter"}</h1>
        </div>
      </div>
      <div className="w-full flex flex-wrap gap-6 items-center">
        <select
          className="select select-sm select-secondary w-full max-w-[150px]"
          value={selectLeaveType}
          onChange={(e) => setSelectLeaveType(e.target.value)}
        >
          <option disabled value="">
            Type
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
            Status
          </option>
          {Object.keys(leaveStatus).map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      <button onClick={resetFilter} className="btn btn-sm btn-secondary">
        Reset
      </button>
      {roles.includes(user?.role) && (
        <Link
          to="/leaves/all-leaves"
          className="text-primary text-sm text-right hover:underline w-full"
        >
          Approve leaves requests
        </Link>
      )}
    </div>
  );
}
