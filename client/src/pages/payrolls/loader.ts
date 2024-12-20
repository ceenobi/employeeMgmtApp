import { getLatestPayrollData } from "./queries";

interface PayrollProp {
  request: Request;
  token: string;
}

export const getPayrollsLoader = async ({ request, token }: PayrollProp) => {
  const searchParams = new URL(request.url).searchParams;
  const page = searchParams.get("page") || 1;
  try {
    const res = await getLatestPayrollData(page, token);
    return {
      status: res?.status,
      payroll: res?.data,
    };
  } catch (error) {
    return { error };
  }
};
