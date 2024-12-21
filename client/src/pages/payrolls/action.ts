import {
  createPayroll,
  deletePayroll,
  updatePayrollStatus,
  updatePayroll,
} from "@/api/payroll";
import { PayrollFormData } from "@/emply-types";

export const createPayrollAction = async (
  { request }: { request: Request },
  token: string
) => {
  const formData = await request.formData();
  const payroll = Object.fromEntries(formData);
  const payrollData = {
    ...payroll,
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

export const updatePayrollAction = async (
  { request }: { request: Request },
  token: string
) => {
  const formData = await request.formData();
  const payroll = Object.fromEntries(formData);
  const payrollId = payroll.id as string;
  const payrollData = {
    ...payroll,
    payPeriod: {
      start: payroll.payPeriodStart as string,
      end: payroll.payPeriodEnd as string,
    },
  } as PayrollFormData;
  try {
    const res = await updatePayroll(payrollId, payrollData, token);
    return {
      status: res.status,
      msg: res.data.msg,
      payroll: res.data.payroll,
    };
  } catch (error) {
    return { error };
  }
};

export const handlePayrollStatusOrDeletePayrollAction = async (
  {
    request,
  }: {
    request: Request;
  },
  token: string
) => {
  const formData = await request.formData();
  const { id } = Object.fromEntries(formData) as { id: string };
  console.log(request.method);

  try {
    if (request.method === "DELETE") {
      const res = await deletePayroll(id, token);
      return {
        status: res.status,
        msg: res.data.msg,
      };
    }
    if (request.method === "PATCH") {
      const payroll = Object.fromEntries(formData);
      const payrollData = payroll as unknown as PayrollFormData;
      console.log(payrollData);
      const res = await updatePayrollStatus(id, payrollData, token);
      return {
        status: res.status,
        msg: res.data.msg,
        updatedStatus: res.data.updatedStatus,
      };
    }
  } catch (error) {
    return { error };
  }
};

// const parseAllowances = (input: string) => {
//   if (!input) return {};
//   const allowances: Record<string, number> = {};
//   input.split(",").forEach((item) => {
//     const [key, value] = item.split(":");
//     if (key && value) {
//       allowances[key.trim()] = parseFloat(value.trim());
//     }
//   });
//   return allowances;
// };

// const parseDeductions = (input: string) => {
//   if (!input) return {};
//   const deductions: Record<string, number> = {};
//   input.split(",").forEach((item) => {
//     const [key, value] = item.split(":");
//     if (key && value) {
//       deductions[key.trim()] = parseFloat(value.trim());
//     }
//   });
//   return deductions;
// };

// export const deletePayrollAction = async (
//   { request }: { request: Request },
//   token: string
// ) => {
//   const formData = await request.formData();
//   const id = Object.fromEntries(formData);
//   const payrollId = id.id as string;
//   try {
//     const res = await deletePayroll(payrollId, token);
//     return {
//       status: res.status,
//       msg: res.data.msg,
//     };
//   } catch (error) {
//     return { error };
//   }
// };

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
