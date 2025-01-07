import { Nav, Sidebar } from "@/components";
import { useToggleSidebar } from "@/store/stateProvider";
import { Outlet, ScrollRestoration, useNavigation } from "react-router";

export default function Root() {
  const { isOpenSideBar } = useToggleSidebar() as {
    isOpenSideBar: boolean;
  };
  const navigation = useNavigation();
  return (
    <>
      <Sidebar />
      <div
        className={`${
          isOpenSideBar ? "md:ml-[220px]" : "md:ml-[100px]"
        } flex-1`}
      >
        <div
          className={`max-w-[1280px] mx-auto ${
            navigation.state === "loading" ? "loading" : ""
          }`}
        >
          <Nav />
          <main>
            <Outlet />
          </main>
          <ScrollRestoration
            getKey={(location) => {
              return location.key;
            }}
          />
        </div>
      </div>
    </>
  );
}
