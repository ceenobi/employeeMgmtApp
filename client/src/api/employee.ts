import axiosInstance from "@/utils/axiosInstance";
import { UserAuthFormProps } from "@/emply-types";

export const getAllEmployees = async (page: string | number, token: string) => {
  return await axiosInstance.get(`/employees/get?page=${page}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getEmployees = async (token: string) => {
  return await axiosInstance.get(`/employees/all`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const adminDeleteAccount = async (employeeId: string, token: string) => {
  return await axiosInstance.delete(`/employees/${employeeId}/delete-account`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getEmployee = async (employeeId: string, token: string) => {
  return await axiosInstance.get(`/employees/employee/${employeeId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateEmployee = async (
  employeeId: string,
  formData: UserAuthFormProps,
  token: string
) => {
  return await axiosInstance.patch(
    `/employees/profile-update/${employeeId}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
