import {
  createPayroll,
  deletePayroll,
  updatePayrollStatus,
} from "@/api/payroll";
import { PayrollFormData } from "@/emply-types";

const parseAllowances = (input: string) => {
  if (!input) return {};
  const allowances: Record<string, number> = {};
  input.split(",").forEach((item) => {
    const [key, value] = item.split(":");
    if (key && value) {
      allowances[key.trim()] = parseFloat(value.trim());
    }
  });
  return allowances;
};

const parseDeductions = (input: string) => {
  if (!input) return {};
  const deductions: Record<string, number> = {};
  input.split(",").forEach((item) => {
    const [key, value] = item.split(":");
    if (key && value) {
      deductions[key.trim()] = parseFloat(value.trim());
    }
  });
  return deductions;
};

export const createPayrollAction = async (
  { request }: { request: Request },
  token: string
) => {
  const formData = await request.formData();
  const payroll = Object.fromEntries(formData);
  const allowancesString = formData.get("allowances") as string;
  const deductionsString = formData.get("deductions") as string;
  const allowances = parseAllowances(allowancesString);
  const deductions = parseDeductions(deductionsString);
  const payrollData = {
    ...payroll,
    allowances,
    deductions,
    payPeriod: {
      start: payroll.payPeriodStart as string,
      end: payroll.payPeriodEnd as string,
    },
  } as PayrollFormData;
  try {
    const res = await createPayroll(payrollData, token);
    return {
      status: res.status,
      msg: res.data.msg,
      payroll: res.data.payroll,
    };
  } catch (error) {
    return { error };
  }
};

export const deletePayrollAction = async (
  { request }: { request: Request },
  token: string
) => {
  const formData = await request.formData();
  const id = Object.fromEntries(formData);
  const payrollId = id.id as string;
  try {
    const res = await deletePayroll(payrollId, token);
    return {
      status: res.status,
      msg: res.data.msg,
    };
  } catch (error) {
    return { error };
  }
};

// export const updatePayrollStatusAction = async (
//   { request }: { request: Request },
//   token: string
// ) => {
//   const formData = await request.formData();
//   const employee = Object.fromEntries(formData);
//   const employeeId = employee.id as string;
//   const employeeData = employee as unknown as PayrollFormData;
//   try {
//     const res = await updatePayrollStatus(employeeId, employeeData, token);
//     return {
//       status: res.status,
//       msg: res.data.msg,
//       updatedStatus: res.data.updatedStatus,
//     };
//   } catch (error) {
//     return { error };
//   }
// };

export const handlePayrollStatusOrDeletePayrollAction = async (
  {
    request,
  }: {
    request: Request;
  },
  token: string
) => {
  const formData = await request.formData();
  switch (request.method) {
    case "DELETE": {
      const id = Object.fromEntries(formData);
      const payrollId = id.id as string;
      try {
        const res = await deletePayroll(payrollId, token);
        return {
          status: res.status,
          msg: res.data.msg,
        };
      } catch (error) {
        return { error };
      }
    }
    case "PATCH": {
      const employee = Object.fromEntries(formData);
      const employeeId = employee.id as string;
      const employeeData = employee as unknown as PayrollFormData;
      try {
        const res = await updatePayrollStatus(employeeId, employeeData, token);
        return {
          status: res.status,
          msg: res.data.msg,
          updatedStatus: res.data.updatedStatus,
        };
      } catch (error) {
        return { error };
      }
    }
    default:
      break;
  }
};
