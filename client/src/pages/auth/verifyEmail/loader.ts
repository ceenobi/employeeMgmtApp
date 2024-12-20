import { verifyEmail } from "@/api/auth";

interface Params {
  userId: string;
  verificationToken: string;
}

const verifyEmailloader = async ({ userId, verificationToken }: Params) => {
  try {
    const res = await verifyEmail(userId, verificationToken);
    return {
      status: res.status,
      msg: res.data.msg,
    };
  } catch (error) {
    return { error };
  }
};

export default verifyEmailloader;
