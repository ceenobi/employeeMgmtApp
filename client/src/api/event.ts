import axiosInstance from "@/utils/axiosInstance";
import { EventFormData } from "@/emply-types";

export const createEvent = async (formData: EventFormData, token: string) => {
  return await axiosInstance.post("/events/create", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getEvents = async (page: string | number, token: string) => {
  return await axiosInstance.get(`/events?page=${page}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getEvent = async (id: string, token: string) => {
  return await axiosInstance.get(`/events/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteEvent = async (id: string, token: string) => {
  return await axiosInstance.delete(`/events/delete/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateEvent = async (
  id: string,
  formData: EventFormData,
  token: string
) => {
  return await axiosInstance.patch(`/events/${id}/update`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
