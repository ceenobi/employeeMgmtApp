import { TaskFormData } from "@/emply-types";
import axiosInstance from "@/utils/axiosInstance";

export const createTask = async (formData: TaskFormData, token: string) => {
  return await axiosInstance.post("/tasks/create", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getTasks = async (page: string | number, token: string) => {
  return await axiosInstance.get(`/tasks?page=${page}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getTask = async (id: string, token: string) => {
  return await axiosInstance.get(`/tasks/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const deleteTask = async (id: string, token: string) => {
  return await axiosInstance.delete(`/tasks/delete/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateTask = async (
  id: string,
  formData: TaskFormData,
  token: string
) => {
  return await axiosInstance.patch(`/tasks/${id}/update`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const searchTasks = async (
  searchQuery: string,
  page: string | number,
  token: string
) => {
  return await axiosInstance.get(
    `/tasks/search?q=${searchQuery}&page=${page}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
