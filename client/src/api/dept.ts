import { DepartmentsData } from "@/emply-types";
import axiosInstance from "@/utils/axiosInstance";

export const getDepartments = async (token: string) => {
  return await axiosInstance.get("/departments/get", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getADepartment = async (departmentName: string, token: string) => {
  return await axiosInstance.get(`/departments/${departmentName}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getEmployeesByDepartments = async (
  name: string,
  page: string | number,
  token: string
) => {
  return await axiosInstance.get(`/departments/get/${name}?page=${page}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateDepartment = async (
  deptId: string,
  formData: DepartmentsData,
  token: string
) => {
  return await axiosInstance.patch(`/departments/update/${deptId}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createDepartment = async (
  formData: DepartmentsData,
  token: string
) => {
  return await axiosInstance.post("/departments/create", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
