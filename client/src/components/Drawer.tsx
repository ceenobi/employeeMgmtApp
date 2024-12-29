import { Userinfo } from "@/emply-types";
import { useAuthProvider } from "@/store/authProvider";
import { sidebarLinks } from "@/utils/constants";
import { useQueryClient } from "@tanstack/react-query";
import { Fence, LogOut, Menu } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router";

export default function Drawer() {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, user } = useAuthProvider() as {
    user: Userinfo;
    logout: () => void;
  };
  const queryClient = useQueryClient();

  const handleLogout = () => {
    queryClient.clear();
    localStorage.clear();
    logout();
  };
  const mainLinks = [
    "Dashboard",
    "Tasks",
    "Departments",
    "Employees",
    "Events",
    "Leaves",
    "Payrolls",
    "Portal",
  ];

  const authRole = ["admin", "super-admin"];

  return (
    <>
      <Menu onClick={() => setIsOpen(!isOpen)} size={28} />
      <div className="drawer md:hidden z-50">
        <input
          type="checkbox"
          className="drawer-toggle"
          checked={isOpen}
          onChange={() => setIsOpen(!isOpen)}
        />

        <div className="drawer-side">
          <label
            className="drawer-overlay"
            onClick={() => setIsOpen(false)}
          ></label>
          <div className="menu bg-base-100 text-base-content min-h-full w-80 p-4">
            <div className="flex flex-col h-full justify-between py-4">
              <div className="flex flex-col">
                <Link to="/" onClick={() => setIsOpen(false)}>
                  <button className="px-2 btn btn-ghost focus:outline-none font-bold hover:bg-transparent w-fit">
                    <Fence size={28} className="text-secondary" />
                    EMPLY
                  </button>
                </Link>
                <div className="mt-6 flex flex-col">
                  {sidebarLinks
                    .filter((item) =>
                      authRole.includes(user?.role)
                        ? mainLinks.includes(item.name) ||
                          item.name === "Payroll"
                        : mainLinks.includes(item.name) &&
                          item.name !== "Payroll"
                    )
                    .map(({ id, Icon, name, path }) => (
                      <NavLink
                        to={`${path}`}
                        key={id}
                        viewTransition
                        onClick={() => setIsOpen(false)}
                      >
                        {({ isActive }) => (
                          <span
                            className={`flex items-center my-2 p-2 hover:bg-secondary hover:rounded-md hover:transition duration-150 ease-out hover:ease-in gap-2 hover:text-white
                       ${
                         isActive
                           ? "bg-secondary text-base-300 w-full rounded-md"
                           : "text-sky-100"
                       }`}
                          >
                            <Icon size="1.5rem" className="mr-1" />
                            <div className="text-lg font-bold">{name}</div>
                          </span>
                        )}
                      </NavLink>
                    ))}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="px-2 mt-10 btn btn-ghost focus:outline-none font-bold hover:bg-transparent w-fit"
              >
                <LogOut size="28px" />
                Log out
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="drawer md:hidden z-40">
        <input
          type="checkbox"
          className="drawer-toggle"
          checked={isOpen}
          onChange={() => setIsOpen(!isOpen)}
        />

        <div className="drawer-side">
          <label
            className="drawer-overlay"
            onClick={() => setIsOpen(false)}
          ></label>
          <div className="menu bg-base-100 text-base-content min-h-full w-80 p-4">
            <div className="flex flex-col h-full justify-between py-4">
              <div className="flex flex-col">
                <Link to="/" onClick={() => setIsOpen(false)}>
                  <button className="px-2 btn btn-ghost focus:outline-none font-bold hover:bg-transparent w-fit">
                    <Fence size={28} className="text-secondary" />
                    EMPLY
                  </button>
                </Link>
                <div className="mt-6 flex flex-col ">
                  {sidebarLinks
                    .filter((item) =>
                      authRole.includes(user?.role)
                        ? mainLinks.includes(item.name) ||
                          item.name === "Payroll"
                        : mainLinks.includes(item.name) &&
                          item.name !== "Payroll"
                    )
                    .map(({ id, Icon, name, path }) => (
                      <NavLink
                        to={`${path}`}
                        key={id}
                        viewTransition
                        onClick={() => setIsOpen(false)}
                      >
                        {({ isActive }) => (
                          <span
                            className={`flex items-center my-2 p-2 hover:bg-secondary hover:rounded-md hover:transition duration-150 ease-out hover:ease-in gap-2 hover:text-white
                         ${
                           isActive
                             ? "bg-cream-100 text-sky-600 w-full rounded-md"
                             : "text-sky-100"
                         }`}
                          >
                            <Icon size="1.5rem" className="mr-1" />
                            <div className="text-lg font-bold">{name}</div>
                          </span>
                        )}
                      </NavLink>
                    ))}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="px-2 mt-10 btn btn-ghost focus:outline-none font-bold hover:bg-transparent w-fit"
              >
                <LogOut size="28px" />
                Log out
              </button>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
}
