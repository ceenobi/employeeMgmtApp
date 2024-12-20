import { getDepartment, getEmployeesByDept } from "./queries";

interface Params {
  request: Request;
  params: {
    name: string;
    token: string;
  };
}

export const getDeptEmployeesLoader = async ({
  request,
  params: { name, token },
}: Params) => {
  const searchParams = new URL(request.url).searchParams;
  const page = searchParams.get("page") || 1;
  try {
    const res = await getEmployeesByDept(name, page, token);
    return {
      status: res?.status,
      employees: res?.data,
    };
  } catch (error) {
    return { error };
  }
};

interface DeptParam {
  departmentName: string;
  token: string;
}

export const getDepartmentLoader = async ({
  departmentName,
  token,
}: DeptParam) => {
  try {
    const res = await getDepartment(departmentName, token);
    return {
      status: res?.status,
      department: res?.data,
    };
  } catch (error) {
    return { error };
  }
};
