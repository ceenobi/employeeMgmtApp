import { Alert, PageContainer, Pagination } from "@/components";
import { Helmet } from "react-helmet-async";
import {
  Form,
  Link,
  Outlet,
  useFetcher,
  useLoaderData,
  useMatch,
  useNavigate,
} from "react-router";
import { Plus } from "lucide-react";
import { useAuthProvider } from "@/store/authProvider";
import { PayrollFormData, Userinfo } from "@/emply-types";
import { lazy, Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import handleError from "@/utils/handleError";
const Table = lazy(() => import("./components/Table"));

export function Component() {
  const match = useMatch("/payrolls");
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");
  const { user } = useAuthProvider() as {
    user: Userinfo;
  };
  const data = useLoaderData() as {
    data: {
      payrolls: PayrollFormData[];
      pagination: {
        currentPage: number;
        totalPayrolls: number;
        hasMore: boolean;
        totalPages: number;
      };
    };
  };
  const { payrolls, pagination } = data?.data ?? {};
  const roles = ["admin", "super-admin"];
  const isSubmitting = fetcher.state === "submitting";

  useEffect(() => {
    if (fetcher.data?.status === 201) {
      toast.success(fetcher.data?.msg);
      navigate("/payrolls", { replace: true });
    }
    if (fetcher.data?.error) {
      handleError(
        setError as unknown as (error: unknown) => void,
        fetcher.data?.error
      );
    }
  }, [fetcher.data, navigate]);

  const onFormSubmit = async () => {
    fetcher.submit(null, { method: "post" });
  };

  return (
    <>
      <Helmet>
        <title>Payroll Management</title>
        <meta name="description" content="Manage employee payrolls" />
      </Helmet>
      <PageContainer>
        {error && <Alert error={error} />}
        {match ? (
          <>
            {roles.includes(user?.role) && (
              <div className="flex justify-end">
                <Link to="/payrolls/new">
                  <button className="btn btn-secondary font-bold">
                    <Plus />
                    Create New Payroll
                  </button>
                </Link>
              </div>
            )}
            <>
              <Form method="post" action="/payrolls" onSubmit={onFormSubmit}  className="mt-6 flex items-center bg-base-200 p-4 rounded-lg shadow-md h-full">
                <div>
                  <button
                    className="btn btn-ghost border border-secondary btn-sm"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      "Generate New Payroll"
                    )}
                  </button>
                </div>
              </Form>
              {payrolls?.length > 0 ? (
                <div className="flex flex-col min-h-[calc(100vh-220px)] justify-between">
                  <Suspense fallback={<div>Loading...</div>}>
                    <Table payrolls={payrolls} userInfo={user} />
                  </Suspense>
                  <Pagination
                    totalPages={pagination.totalPages}
                    count={pagination.totalPayrolls}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[50vh]">
                  <h1 className="text-2xl font-bold text-white">
                    No payrolls found
                  </h1>
                </div>
              )}
            </>
          </>
        ) : (
          <Outlet />
        )}
      </PageContainer>
    </>
  );
}

Component.displayName = "Payrolls";
