import { LeaveFormData } from "@/emply-types";
import axiosInstance from "@/utils/axiosInstance";

export const createLeave = async (formData: LeaveFormData, token: string) => {
  return await axiosInstance.post("/leaves/create", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getLeaves = async (page: string | number, token: string) => {
  return await axiosInstance.get(`/leaves?page=${page}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateLeaveStatus = async (
  id: string,
  formData: LeaveFormData,
  token: string
) => {
  return await axiosInstance.patch(`/leaves/${id}/status`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
