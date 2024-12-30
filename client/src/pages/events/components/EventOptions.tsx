import { eventStatus } from "@/utils/constants";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";

type Props = {
  selectStatus: string;
  setSelectStatus: React.Dispatch<React.SetStateAction<string>>;
};

export default function EventOptions({ selectStatus, setSelectStatus }: Props) {
  const [isSearch, setIsSearch] = useState(() => {
    const storedValue = sessionStorage.getItem("isSearch");
    return storedValue ? JSON.parse(storedValue) : false;
  });
  const navigate = useNavigate();

  const resetFilter = useCallback(() => {
    setSelectStatus("");
    setIsSearch(false);
    navigate("/events");
  }, [navigate, setSelectStatus]);

  useEffect(() => {
    sessionStorage.setItem("isSearch", JSON.stringify(isSearch));
  }, [isSearch]);

  useEffect(() => {
    if (isSearch) {
      if (selectStatus) {
        navigate(`/events/search?query=${selectStatus}`);
      }
    }
  }, [isSearch, navigate, selectStatus]);

  return (
    <div className="mt-6 hidden lg:flex items-center bg-base-200 p-4 rounded-lg shadow-md gap-6">
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
      <div className="flex flex-wrap gap-6 items-center w-full">
        <select
          className="select select-sm select-secondary w-full max-w-[150px]"
          value={selectStatus}
          onChange={(e) => setSelectStatus(e.target.value)}
        >
          <option disabled value="">
            Status
          </option>
          {eventStatus.map((item, index) => (
            <option key={index} value={item.value}>
              {item.value}
            </option>
          ))}
        </select>
        <button onClick={resetFilter} className="btn btn-sm btn-secondary">
          Reset
        </button>
      </div>
    </div>
  );
}
