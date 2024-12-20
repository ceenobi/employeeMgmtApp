import { Userinfo } from "@/emply-types";
import { useAuthProvider } from "@/store/authProvider";
import { useToggleSidebar } from "@/store/stateProvider";
import { sidebarLinks } from "@/utils/constants";
import { useQueryClient } from "@tanstack/react-query";
import { Fence, LogOut } from "lucide-react";
import { Link, NavLink } from "react-router";

export default function Sidebar() {
  const { isOpenSideBar, setIsOpenSideBar, setHideSideBar } =
    useToggleSidebar() as {
      isOpenSideBar: boolean;
      setIsOpenSideBar: (isOpen: boolean) => void;
      setHideSideBar: (hide: boolean) => void;
    };
  const { logout, user } = useAuthProvider() as {
    user: Userinfo;
    logout: () => void;
  };
  const queryClient = useQueryClient();

  const mainLinks = [
    "Dashboard",
    "Tasks",
    "Departments",
    "Employees",
    "Events",
    "Leaves",
    "Payrolls",
    "Settings",
  ];

  const authRole = ["admin", "super-admin"];

  const handleLogout = () => {
    queryClient.clear();
    localStorage.clear();
    logout();
  };

  const handleToggle = () => {
    setIsOpenSideBar(!isOpenSideBar);
    setHideSideBar(false);
  };

  return (
    <div
      className={`${
        isOpenSideBar ? "w-[220px]" : "w-[100px]"
      } hidden md:block bg-base-200 h-screen`}
    >
      <div className="flex flex-col h-full justify-between p-4">
        <div className="flex flex-col">
          <Link to="/">
            <button className="px-2 btn btn-ghost focus:outline-none font-bold hover:bg-transparent">
              <Fence className="mx-auto text-secondary" size={28} />
              EMPLY
            </button>
          </Link>
          <div
            className={`mt-6 flex flex-col ${
              isOpenSideBar ? "" : "items-center"
            }`}
          >
            {sidebarLinks
              .filter((item) =>
                authRole.includes(user?.role)
                  ? mainLinks.includes(item.name) || item.name === "Payroll"
                  : mainLinks.includes(item.name) && item.name !== "Payroll"
              )
              .map(({ id, Icon, name, path }) => (
                <NavLink
                  to={`${path}`}
                  key={id}
                  className="tooltip tooltip-right"
                  data-tip={isOpenSideBar ? undefined : name}
                  viewTransition
                >
                  {({ isActive }) => (
                    <span
                      className={`flex items-center my-2 p-2 hover:bg-gray-600 hover:rounded-md hover:transition duration-150 ease-out hover:ease-in gap-2 hover:text-white
                         ${
                           isActive
                             ? "bg-secondary text-base-300 w-full rounded-md"
                             : "text-sky-100"
                         }`}
                    >
                      <Icon
                        size="1.5rem"
                        className={`${isOpenSideBar ? "" : "mr-1"}`}
                      />
                      <div
                        className={`text-lg font-bold ${
                          isOpenSideBar ? "hidden lg:block" : "hidden"
                        }`}
                      >
                        {name}
                      </div>
                    </span>
                  )}
                </NavLink>
              ))}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <input
            type="checkbox"
            className="toggle tooltip tooltip-right mx-2"
            defaultChecked={isOpenSideBar}
            onClick={handleToggle}
            id="toggle-sidebar"
            data-tip={isOpenSideBar ? "Close sidebar" : "Open sidebar"}
          />
          <button
            onClick={handleLogout}
            className="px-2 btn btn-ghost focus:outline-none font-bold hover:bg-transparent w-fit"
          >
            <LogOut size="28px" />
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}
