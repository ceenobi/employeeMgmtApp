import { signInViaEmail } from "@/api/auth";
import { UserAuthFormProps } from "@/emply-types";

export const signInViaEmailAction = async ({
  request,
}: {
  request: Request;
}) => {
  const formData = await request.formData();
  const user = Object.fromEntries(formData);
  try {
    const res = await signInViaEmail(user as unknown as UserAuthFormProps);
    return {
      status: res.status,
      msg: res.data.msg,
    };
  } catch (error) {
    return { error };
  }
};
