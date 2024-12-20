import { Userinfo } from "@/emply-types";
import { useAuthProvider } from "@/store/authProvider";
import { Bell, Search } from "lucide-react";
import { useLocation } from "react-router";
import Drawer from "./Drawer";

export default function Nav() {
  const location = useLocation();
  const { user } = useAuthProvider() as {
    user: Userinfo;
  };
  const path = location.pathname.split("/")[1];
  const unreadCount = 2;

  return (
    <div className="sticky top-0 z-40 bg-base-200 py-4 px-4 lg:px-6 border-b-2 border-b-gray-600">
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
            <input type="text" className="grow" placeholder="Search" />
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
              <div className="avatar">
                <div className="w-12 rounded-xl">
                  <img
                    src={
                      user?.photo ||
                      "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                    }
                  />
                </div>
              </div>
              <div>
                <p className="font-semibold">
                  {user?.firstName.concat(" ", user?.lastName)}
                </p>
                <p className="text-sm">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
