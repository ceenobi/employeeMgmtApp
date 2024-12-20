import { PageContainer } from "@/components";
import { DepartmentsData, Userinfo } from "@/emply-types";
import { useAuthProvider } from "@/store/authProvider";
import { getRandomColor } from "@/utils/constants";
import { Plus } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useMatch, useRouteLoaderData, Outlet, Link } from "react-router";

export function Component() {
  const match = useMatch("/departments");
  const { user } = useAuthProvider() as {
    user: Userinfo;
  };
  const { depts } = useRouteLoaderData("departments-employees") as {
    depts: {
      departments: DepartmentsData[];
      getDeptNames: string[];
      deptCount: { [key: string]: number };
    };
  };
  const roles = ["admin", "super-admin"];
  
  return (
    <>
      <Helmet>
        <title>Departments</title>
        <meta name="description" content="See companys departments" />
      </Helmet>
      <PageContainer>
        {match ? (
          <>
            {roles.includes(user?.role) && (
              <div className="flex justify-end">
                <Link to="/departments/new">
                  <button className="btn btn-secondary font-bold">
                    <Plus />
                    Add Department
                  </button>
                </Link>
              </div>
            )}
            <div className="mt-8 grid md:grid-cols-4 gap-4 items-center">
              {depts?.getDeptNames
                .sort()
                .map((names: string, index: number) => (
                  <div
                    className="card bg-base-200 text-primary-content min-w-[100%] lg:min-w-[220px] shadow-lg border border-l-4"
                    style={{
                      borderLeftColor: getRandomColor(names as string),
                    }}
                    key={index}
                  >
                    <div className="card-body text-white">
                      <h2 className="card-title">{names}</h2>
                      <p> No of employees ({depts?.deptCount[names] || 0})</p>
                      <div className="card-actions justify-end">
                        <Link to={`/departments/${names}`}>
                          <button className="btn btn-xs btn-secondary">
                            Details
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </>
        ) : (
          <Outlet />
        )}
      </PageContainer>
    </>
  );
}

Component.displayName = "Departments";
