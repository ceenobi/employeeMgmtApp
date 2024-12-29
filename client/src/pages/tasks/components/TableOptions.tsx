import { TaskFormData } from "@/emply-types";
import { taskPriority, taskProgress } from "@/utils/constants";
import { formatDate } from "@/utils/format";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";

type TableOptionsProps = {
//   getDueDates?: {
//     date: Date;
//     index: number;
//   }[];
  selectPriority: string;
  setSelectPriority: (value: string) => void;
  selectProgress: string;
  setSelectProgress: (value: string) => void;
  selectDue: string;
  setSelectDue: (value: string) => void;
  tasks: TaskFormData[];
};

export default function TableOptions({
  selectPriority,
  setSelectPriority,
  selectProgress,
  setSelectProgress,
  selectDue,
  setSelectDue,
  tasks,
}: TableOptionsProps) {
  const [isSearch, setIsSearch] = useState(() => {
    const storedValue = sessionStorage.getItem("isSearch");
    return storedValue ? JSON.parse(storedValue) : false;
  });
  const navigate = useNavigate();

  const getDueDates = useMemo(() => {
    const dueDates = tasks?.map((item, index) => ({
      date: item.dueDate,
      index,
    }));
    // Remove duplicates based on the date
    const uniqueDueDates = Array.from(
      new Map(dueDates.map((item) => [item.date, item])).values()
    );
    return uniqueDueDates;
  }, [tasks]);

  const resetFilter = useCallback(() => {
    setSelectPriority("");
    setSelectProgress("");
    setSelectDue("");
  }, [setSelectDue, setSelectPriority, setSelectProgress]);

  useEffect(() => {
    sessionStorage.setItem("isSearch", JSON.stringify(isSearch));
  }, [isSearch]);

  useEffect(() => {
    if (selectPriority === "") return;
    navigate(`/tasks/search?query=${selectPriority}`);
    resetFilter();
  }, [navigate, resetFilter, selectPriority]);

  useEffect(() => {
    if (selectProgress === "") return;
    navigate(`/tasks/search?query=${selectProgress}`);
    resetFilter();
  }, [navigate, resetFilter, selectProgress]);

  return (
    <div className="mt-6 hidden lg:flex items-center justify-between bg-base-200 p-4 rounded-lg shadow-md gap-6">
      <div className="flex items-center">
        <input
          type="checkbox"
          className="toggle toggle-secondary tooltip tooltip-top mx-2"
          checked={isSearch}
          onClick={() => setIsSearch(!isSearch)}
          id="toggle-sidebar"
          data-tip={isSearch ? "Toggle Filter" : "Toggle Search"}
        />
        <h1>{isSearch ? "Search" : "Filter"}</h1>
      </div>
      <div className="w-full">
        {isSearch ? (
          <div className="flex flex-wrap gap-6 items-center">
            <select
              className="select select-sm select-secondary w-full max-w-[150px]"
              value={selectPriority}
              onChange={(e) => setSelectPriority(e.target.value)}
            >
              <option disabled value="">
                Search Priority
              </option>
              {taskPriority.map((item, index) => (
                <option key={index} value={item.value}>
                  {item.value}
                </option>
              ))}
            </select>
            <select
              className="select select-sm select-secondary w-full max-w-[150px]"
              value={selectProgress}
              onChange={(e) => setSelectProgress(e.target.value)}
            >
              <option disabled value="">
                Search Progress
              </option>
              {Object.keys(taskProgress).map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="flex flex-wrap gap-6 items-center">
            <select
              className="select select-sm select-secondary w-full max-w-[150px]"
              value={selectPriority}
              onChange={(e) => setSelectPriority(e.target.value)}
            >
              <option disabled value="">
                Filter Priority
              </option>
              {taskPriority.map((item, index) => (
                <option key={index} value={item.value}>
                  {item.value}
                </option>
              ))}
            </select>
            <select
              className="select select-sm select-secondary w-full max-w-[150px]"
              value={selectProgress}
              onChange={(e) => setSelectProgress(e.target.value)}
            >
              <option disabled value="">
                Filter Progress
              </option>
              {Object.keys(taskProgress).map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <select
              className="select select-sm select-secondary w-full max-w-[150px]"
              value={selectDue}
              onChange={(e) => setSelectDue(e.target.value)}
            >
              <option disabled value="">
                Filter Due Dates
              </option>
              {getDueDates?.map(({ date, index }) => (
                <option key={index} value={formatDate(date as Date)}>
                  {formatDate(date as Date)}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      <button onClick={resetFilter} className="btn btn-sm btn-secondary">
        Reset
      </button>
    </div>
  );
}
