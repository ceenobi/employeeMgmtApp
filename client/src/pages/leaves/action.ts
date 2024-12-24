import { createLeave, updateLeaveStatus } from "@/api/leave";
import { LeaveFormData } from "@/emply-types";

export const applyLeaveAction = async (
  { request }: { request: Request },
  token: string
) => {
  const formData = await request.formData();
  const leave = Object.fromEntries(formData);
  const leaveData = { ...leave } as unknown as LeaveFormData;
  try {
    const res = await createLeave(leaveData, token);
    return {
      status: res.status,
      msg: res.data.msg,
      leave: res.data.leave,
    };
  } catch (error) {
    return { error };
  }
};

export const approveLeaveStatusAction = async (
  { request }: { request: Request },
  token: string
) => {
  const formData = await request.formData();
  const leave = Object.fromEntries(formData);
  const leaveData = { ...leave } as unknown as LeaveFormData;
  try {
    const res = await updateLeaveStatus(
      leaveData._id as string,
      leaveData,
      token
    );
    return {
      status: res.status,
      msg: res.data.msg,
      leave: res.data.leave,
    };
  } catch (error) {
    return { error };
  }
};
