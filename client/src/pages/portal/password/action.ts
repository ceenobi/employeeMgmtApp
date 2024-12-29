import { updatePassword } from "@/api/employee";
import { UserAuthFormProps } from "@/emply-types";

export const updatePasswordAction = async (
  { request }: { request: Request },
  token: string
) => {
  const formData = await request.formData();
  const password = Object.fromEntries(formData);
  const passwordData = { ...password } as unknown as UserAuthFormProps;
    try {
      const res = await updatePassword(passwordData, token);
      return {
        status: res.status,
        msg: res.data.msg,
      };
    } catch (error) {
      return { error };
    }
};
