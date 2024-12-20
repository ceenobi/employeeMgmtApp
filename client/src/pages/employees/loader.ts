import { getAnEmployee, getEmployees } from "./queries";

interface Params {
  employeeId: string;
  token: string;
}

export const getEmployeeLoader = async ({ employeeId, token }: Params) => {
  try {
    const res = await getAnEmployee(employeeId, token);
    return {
      status: res?.status,
      employee: res?.data,
    };
  } catch (error) {
    return { error };
  }
};

interface EmployeesProp {
  request: Request;
  token: string;
}

export const getEmployeesLoader = async ({ request, token }: EmployeesProp) => {
  const searchParams = new URL(request.url).searchParams;
  const page = searchParams.get("page") || 1;
  try {
    const res = await getEmployees(page, token);
    return {
      status: res?.status,
      employees: res?.data,
    };
  } catch (error) {
    return { error };
  }
};
