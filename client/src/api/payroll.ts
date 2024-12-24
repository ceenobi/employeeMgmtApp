import { PayrollFormData } from "@/emply-types";
import axiosInstance from "@/utils/axiosInstance";

export const getPayroll = async (payrollId: string, token: string) => {
  return await axiosInstance.get(`/payrolls/${payrollId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createPayroll = async (
  formData: PayrollFormData,
  token: string
) => {
  return await axiosInstance.post("/payrolls/create", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updatePayrollStatus = async (
  payrollId: string,
  formData: PayrollFormData,
  token: string
) => {
  return await axiosInstance.patch(`/payrolls/${payrollId}/status`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updatePayroll = async (
  payrollId: string,
  formData: PayrollFormData,
  token: string
) => {
  return await axiosInstance.patch(`/payrolls/update/${payrollId}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getLatestPayroll = async (
  page: string | number,
  token: string
) => {
  return await axiosInstance.get(`/payrolls/latest/get?page=${page}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deletePayroll = async (payrollId: string, token: string) => {
  return await axiosInstance.delete(`/payrolls/${payrollId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const generatePayrolls = async (token: string) => {
  return await axiosInstance.post("/payrolls/generate", null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
