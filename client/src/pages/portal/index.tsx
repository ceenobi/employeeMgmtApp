import { PageContainer } from "@/components";
import {
  EventFormData,
  LeaveFormData,
  PayrollFormData,
  TaskFormData,
  Userinfo,
} from "@/emply-types";
import { useAuthProvider } from "@/store/authProvider";
import { formatBirthDate, formatCurrency, formatDate } from "@/utils/format";
import {
  BadgeDollarSign,
  Battery,
  BatteryFull,
  BatteryWarning,
  BriefcaseBusiness,
  Calendar,
  CalendarDays,
  ChevronRight,
  CircleUser,
  IdCard,
  ListTodo,
  Lock,
  PlugZap,
  Trash2,
  UserPen,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Link, Outlet, useLoaderData, useMatch } from "react-router";

export function Component() {
  const match = useMatch("/portal");
  const { user } = useAuthProvider() as {
    user: Userinfo;
  };
  const data = useLoaderData();
  const { events, leaves, payrolls, tasks } = (data?.data as {
    events: EventFormData[];
    leaves: LeaveFormData[];
    payrolls: PayrollFormData[];
    tasks: TaskFormData[];
  }) || {
    events: [],
    leaves: [],
    payrolls: [],
    tasks: [],
  };

  return (
    <>
      <Helmet>
        <title>{`Portal - ${user?.firstName} ${user?.lastName}`}</title>
        <meta name="description" content="View relavant info" />
      </Helmet>
      <PageContainer>
        {match ? (
          <>
            <div className="md:grid grid-cols-12 gap-4 justify-between">
              <div className="col-span-7">
                <div className="md:flex justify-between">
                  <div className="bg-gray-900 shadow-lg md:w-[70%] mb-6 rounded-xl p-3 h-fit">
                    <div className="flex justify-between items-center">
                      <h1>Your profile</h1>
                      <CircleUser />
                    </div>
                    <div className="mt-2">
                      <h1 className="font-bold text-3xl mb-2">
                        {user?.firstName.concat(" ", user?.lastName)}
                      </h1>
                      <p>Email: {user?.email}</p>
                      <p>
                        Marital status: {user?.maritalStatus || "Not provided"}
                      </p>
                      <p>
                        Birthday: {formatBirthDate(user?.dateOfBirth as string)}
                      </p>
                      <p>Phone: {user?.phone}</p>
                      <p>Department: {user?.dept}</p>
                      <p>Role: {user?.role}</p>
                      <p>Last Login: {formatDate(user?.lastLogin as Date)}</p>
                    </div>
                  </div>
                  <div className="md:w-[28%] flex flex-col gap-5">
                    <div className="bg-base-200 shadow-lg flex flex-col items-center w-full rounded-xl p-3 border border-gray-600">
                      {user?.status === "active" && (
                        <BatteryFull className="text-green-600" />
                      )}
                      {user?.status === "leave" && (
                        <Battery className="text-yellow-600" />
                      )}
                      {user?.status === "sick" && (
                        <BatteryWarning className="text-red-600" />
                      )}
                      {user?.status === "other" && (
                        <PlugZap className="text-red-600" />
                      )}
                      <p className="font-bold capitalize">{user?.status}</p>
                    </div>
                    <div className="bg-base-200 shadow-lg flex flex-col items-center w-full rounded-xl p-3 border border-gray-600">
                      <BriefcaseBusiness />
                      <p className="font-bold capitalize">{user?.jobType}</p>
                    </div>
                    <div className="bg-base-200 shadow-lg flex flex-col items-center w-full rounded-xl p-3 border border-gray-600">
                      <IdCard />
                      <p className="font-bold capitalize">
                        Id: {user?.employeeId}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-2 bg-base-200 shadow-lg mb-6 rounded-xl p-3 h-fit border border-gray-600">
                  <h1>Activities</h1>
                  <Link
                    to="/portal/events"
                    className="mt-4 flex items-center justify-between group hover:bg-gray-900 p-3 rounded-lg"
                  >
                    <div className="flex gap-3">
                      <CalendarDays />
                      <p>Events ({events?.length})</p>
                    </div>
                    <ChevronRight />
                  </Link>
                  <Link
                    to="/leaves"
                    className="mt-4 flex items-center justify-between group hover:bg-gray-900 p-3 rounded-lg"
                  >
                    <div className="flex gap-3">
                      <Calendar />
                      <p>Leaves ({leaves?.length})</p>
                    </div>
                    <ChevronRight />
                  </Link>
                  <Link
                    to="/portal/tasks"
                    className="mt-4 flex items-center justify-between group hover:bg-gray-900 p-3 rounded-lg"
                  >
                    <div className="flex gap-3">
                      <ListTodo />
                      <p>Tasks ({tasks?.length})</p>
                    </div>
                    <ChevronRight />
                  </Link>
                </div>
                <div className="mt-2 bg-base-200 shadow-lg mb-6 rounded-xl p-3 h-fit border border-gray-600">
                  <h1>Security</h1>
                  <Link
                    to="/portal/change-password"
                    className="mt-4 flex items-center justify-between group hover:bg-gray-900 p-3 rounded-lg"
                  >
                    <div className="flex gap-3">
                      <Lock />
                      <p>Change password</p>
                    </div>
                    <ChevronRight />
                  </Link>
                  <div className="mt-4 flex items-center justify-between group hover:bg-gray-900 p-3 rounded-lg">
                    <button className=" flex gap-3" disabled>
                      <Trash2 />
                      <p>Delete account</p>
                    </button>
                    <ChevronRight />
                  </div>
                </div>
              </div>
              <div className="col-span-5">
                <Link
                  to="/portal/edit-profile"
                  className="bg-base-200 shadow-lg flex flex-col items-center w-full rounded-xl p-3  border border-gray-600"
                >
                  <UserPen />
                  <p className="font-bold capitalize">Edit Profile</p>
                </Link>
                <div className="mt-4 bg-gray-900 p-3 rounded-xl">
                  <div className="flex justify-between items-center">
                    <h1>Latest Payroll Info</h1>
                    <BadgeDollarSign />
                  </div>
                  {payrolls?.length > 0 ? (
                    <>
                      {payrolls?.map((payroll: PayrollFormData) => (
                        <div key={payroll?._id}>
                          <div className="mt-4 flex justify-between items-center">
                            <p>Net Pay</p>
                            <p>{formatCurrency(payroll?.net as number)}</p>
                          </div>
                          <div className="mt-4 flex justify-between items-center">
                            <p>Current payment status</p>
                            <button
                              className={`btn btn-xs ${
                                payroll?.status === "paid"
                                  ? "btn-success"
                                  : payroll?.status === "cancelled"
                                  ? "btn-error"
                                  : "btn-accent"
                              }`}
                            >
                              {payroll?.status}
                            </button>
                          </div>
                          <div className="mt-4 flex justify-between items-center">
                            <p>Payment Date</p>
                            <p>
                              {formatDate(payroll?.payPeriod?.start as string)}
                            </p>
                          </div>
                          <div className="mt-4 flex justify-between items-center">
                            <p>Last Autogenerated Payment</p>
                            <p>
                              {formatDate(payroll?.lastAutoGenerated as string)}
                            </p>
                          </div>
                          <div className="divider"></div>
                          <p>Breakdown</p>
                          <div className="mt-4 flex justify-between items-center">
                            <p>Salary</p>
                            <p>{formatCurrency(payroll?.salary)}</p>
                          </div>
                          <p className="mt-4">Allowances</p>
                          <div className="flex justify-between items-center text-sm text-gray-400">
                            <p>Transport</p>
                            <p>
                              {formatCurrency(payroll?.allowances?.transport)}
                            </p>
                          </div>
                          <div className="flex justify-between items-center text-sm text-gray-400">
                            <p>Food</p>
                            <p>{formatCurrency(payroll?.allowances?.food)}</p>
                          </div>
                          <div className="flex justify-between items-center text-sm text-gray-400">
                            <p>Miscellaneous</p>
                            <p>
                              {formatCurrency(
                                payroll?.allowances?.miscellaneous
                              )}
                            </p>
                          </div>
                          <p className="mt-4">Deductions</p>
                          <div className="flex justify-between items-center text-sm text-gray-400">
                            <p>Tax</p>
                            <p>{payroll?.tax}%</p>
                          </div>
                          <div className="flex justify-between items-center text-sm text-gray-400">
                            <p>Late</p>
                            <p>{formatCurrency(payroll?.deductions?.late)}</p>
                          </div>
                          <div className="flex justify-between items-center text-sm text-gray-400">
                            <p>Health</p>
                            <p>{formatCurrency(payroll?.deductions?.health)}</p>
                          </div>
                          <div className="flex justify-between items-center text-sm text-gray-400">
                            <p>Others</p>
                            <p>{formatCurrency(payroll?.deductions?.others)}</p>
                          </div>
                          <div className="flex justify-between items-center">
                            <p>Leave Without Pay</p>
                            <p>{payroll?.leaveWithoutPay}</p>
                          </div>
                          <div className="mt-4 w-full text-right">
                            <Link
                              to="/portal/payrolls"
                              className="text-secondary"
                            >
                              View payment history
                            </Link>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <h1 className="mt-4">
                      There are currently no payrolls generated for you.
                    </h1>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <Outlet />
        )}
      </PageContainer>
    </>
  );
}

Component.displayName = "Portal";
