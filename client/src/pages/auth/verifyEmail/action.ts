import { sendVerificationEmail } from "@/api/auth";
import { UserAuthFormProps } from "@/emply-types";

export const resendEmailVerificationAction = async (
  { request }: { request: Request },
  token: string
) => {
  const formData = await request.formData();
  const user = Object.fromEntries(formData);
  try {
    const res = await sendVerificationEmail(
      user as unknown as UserAuthFormProps,
      token
    );
    return {
      status: res.status,
      msg: res.data.msg,
    };
  } catch (error) {
    return { error };
  }
};
