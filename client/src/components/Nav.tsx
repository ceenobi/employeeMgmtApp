import { Userinfo } from "@/emply-types";
import { useAuthProvider } from "@/store/authProvider";
import { Bell, Search } from "lucide-react";
import { useLocation, useSearchParams, useNavigate } from "react-router";
import Drawer from "./Drawer";
import { useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function Nav() {
  const [searchParams] = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthProvider() as {
    user: Userinfo;
  };
  const query = searchParams.get("query") || inputRef.current?.value || "";
  const [inputValue, setInputValue] = useState(query);
  const path = location.pathname.split("/")[1];
  const unreadCount = 2;

  useEffect(() => {
    setInputValue(query);
  }, [query]);

  useEffect(() => {
    const inputElement = inputRef.current;
    return () => {
      if (inputElement) {
        inputElement.value = "";
      }
    };
  }, [location.pathname]);

  useEffect(() => {
    if (inputRef.current && inputRef.current?.value !== "") {
      const params = new URLSearchParams(searchParams);
      params.set("query", inputRef.current?.value);
      navigate(`${path}/search?${params.toString()}`);
    }
  }, [inputRef.current?.value, navigate, path, searchParams]);

  const handleSearch = useDebouncedCallback((e) => {
    e.preventDefault();
    const value = e.target.value;
    const params = new URLSearchParams(searchParams);
    if (value) {
      if (value.length > 3) {
        params.set("query", value);
        navigate(`${path}/search?${params.toString()}`);
      } else {
        params.delete("query");
      }
    }
  }, 400);

  const paths = ["/portal", "/departments"];

  return (
    <nav className="sticky top-0 z-40 bg-base-200 py-4 px-4 lg:px-6 border-b-2 border-b-gray-600">
      <div className="flex justify-between items-center">
        <div className="md:hidden">
          <Drawer />
        </div>
        <h1 className="hidden md:block text-2xl font-bold capitalize">
          {path === "/" ? "Dashboard" : path}
        </h1>
        <div className="flex gap-6 items-center">
          <label className="hidden md:flex input input-bordered items-center gap-2">
            <Search />
            <input
              type="text"
              className="grow"
              placeholder={`Search ${path}`}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                handleSearch(e);
              }}
              disabled={paths.some((path) =>
                location.pathname.startsWith(path)
              )}
            />
          </label>
          <div className="flex gap-4 items-center">
            <button
              className="relative p-2 hover:bg-base-200 rounded-full transition-colors duration-200 bg-gray-700"
              aria-label="Notifications"
            >
              <Bell />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-black transform translate-x-1/2 -translate-y-1/2 bg-success rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
            <div className="flex gap-2 items-center">
              <div className="avatar placeholder">
                <div className="bg-neutral text-neutral-content w-12 rounded-full">
                  {user?.photo && (
                    <img src={user?.photo} alt={user?.firstName} />
                  )}
                  {!user?.photo && (
                    <span>
                      {user?.firstName.slice(0, 1) +
                        (user?.lastName.slice(0, 1) || "")}
                    </span>
                  )}
                </div>
              </div>
              <div>
                <p className="font-semibold">
                  {user?.firstName.concat(" ", user?.lastName)}
                </p>
                <p className="text-sm">{user?.jobTitle || user?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
