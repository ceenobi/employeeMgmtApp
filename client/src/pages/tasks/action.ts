import {
  createTask,
  deleteTask,
  updateTask,
  updateTaskStatus,
} from "@/api/task";
import { TaskFormData } from "@/emply-types";

export const createTaskAction = async (
  { request }: { request: Request },
  token: string
) => {
  const formData = await request.formData();
  const task = Object.fromEntries(formData);
  const taskData = { ...task } as unknown as TaskFormData;
  try {
    const res = await createTask(taskData, token);
    return {
      status: res.status,
      msg: res.data.msg,
      task: res.data.task,
    };
  } catch (error) {
    return { error };
  }
};

export const updateTaskAction = async (
  { request }: { request: Request },
  token: string
) => {
  const formData = await request.formData();
  const task = Object.fromEntries(formData);
  const taskData = { ...task } as unknown as TaskFormData;
  try {
    const res = await updateTask(taskData._id as string, taskData, token);
    return {
      status: res.status,
      msg: res.data.msg,
      task: res.data.task,
    };
  } catch (error) {
    return { error };
  }
};

export const deleteTaskAction = async (
  { request }: { request: Request },
  token: string
) => {
  const formData = await request.formData();
  const task = Object.fromEntries(formData);
  const taskData = { ...task } as unknown as TaskFormData;
  try {
    const res = await deleteTask(taskData._id as string, token);
    return {
      status: res.status,
      msg: res.data.msg,
    };
  } catch (error) {
    return { error };
  }
};

export const updateStatusOrDeleteTaskAction = async (
  { request }: { request: Request },
  token: string
) => {
  const formData = await request.formData();
  const task = Object.fromEntries(formData);
  const taskData = { ...task } as unknown as TaskFormData;
  try {
    if (request.method === "PATCH") {
      const res = await updateTaskStatus(
        taskData._id as string,
        taskData,
        token
      );
      return {
        status: res.status,
        msg: res.data.msg,
        task: res.data.task,
      };
    }
    if (request.method === "DELETE") {
      const res = await deleteTask(taskData._id as string, token);
      return {
        status: res.status,
        msg: res.data.msg,
      };
    }
  } catch (error) {
    return { error };
  }
};
