import { verifyLoginLink } from "@/api/auth";

interface Params {
  userId: string;
  loginToken: string;
}

const verifyLoginLinkloader = async ({ userId, loginToken }: Params) => {
  try {
    const res = await verifyLoginLink(userId, loginToken);
    return {
      status: res.status,
      msg: res.data.msg,
      token: res.data.accessToken,
    };
  } catch (error) {
    return { error };
  }
};

export default verifyLoginLinkloader;
