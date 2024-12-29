import { createEvent, deleteEvent, updateEvent } from "@/api/event";
import { EventFormData } from "@/emply-types";

export const createEventAction = async (
  { request }: { request: Request },
  token: string
) => {
  const formData = await request.formData();
  const task = Object.fromEntries(formData);
  const eventData = { ...task } as unknown as EventFormData;
  try {
    const res = await createEvent(eventData, token);
    return {
      status: res.status,
      msg: res.data.msg,
      event: res.data.event,
    };
  } catch (error) {
    return { error };
  }
};

// export const updateEventAction = async (
//   { request }: { request: Request },
//   token: string
// ) => {
//   const formData = await request.formData();
//   const event = Object.fromEntries(formData);
//   const eventData = { ...event } as unknown as EventFormData;
//   try {
//     const res = await updateEvent(eventData._id as string, eventData, token);
//     return {
//       status: res.status,
//       msg: res.data.msg,
//       event: res.data.event,
//     };
//   } catch (error) {
//     return { error };
//   }
// };

// export const deleteEventAction = async (
//   { request }: { request: Request },
//   token: string
// ) => {
//   const formData = await request.formData();
//   const event = Object.fromEntries(formData);
//   const eventData = { ...event } as unknown as EventFormData;
//   try {
//     const res = await deleteEvent(eventData._id as string, token);
//     return {
//       status: res.status,
//       msg: res.data.msg,
//     };
//   } catch (error) {
//     return { error };
//   }
// };

export const updateOrDeleteEventAction = async (
  { request }: { request: Request },
  token: string
) => {
  const formData = await request.formData();
  const event = Object.fromEntries(formData);
  const eventData = { ...event } as unknown as EventFormData;
  try {
    if (request.method === "PATCH") {
      const res = await updateEvent(eventData._id as string, eventData, token);
      return {
        status: res.status,
        msg: res.data.msg,
        event: res.data.event,
      };
    }
    if (request.method === "DELETE") {
      const res = await deleteEvent(eventData._id as string, token);
      return {
        status: res.status,
        msg: res.data.msg,
      };
    }
  } catch (error) {
    return { error };
  }
};
