import { loginUser } from "@/api/auth";
import { UserAuthFormProps } from "@/emply-types";

export const loginAction = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const user = Object.fromEntries(formData);
  try {
    const res = await loginUser(user as unknown as UserAuthFormProps);
    return {
      status: res.status,
      msg: res.data.msg,
      token: res.data.accessToken,
    };
  } catch (error) {
    return { error };
  }
};
