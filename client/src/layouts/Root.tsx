import { Nav, Sidebar } from "@/components";
import { Outlet, ScrollRestoration } from "react-router";

export default function Root() {
  return (
    <div className="flex w-full min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <div className="max-w-[1280px] mx-auto">
          <Nav />
          {<Outlet />}
          <ScrollRestoration
            getKey={(location) => {
              return location.key;
            }}
          />
        </div>
      </div>
    </div>
  );
}
