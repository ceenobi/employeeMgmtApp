import { createTask, updateTask } from "@/api/task";
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
