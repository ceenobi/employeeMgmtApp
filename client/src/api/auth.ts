import { UserAuthFormProps } from "@/emply-types";
import axiosInstance from "@/utils/axiosInstance";

export const loginUser = async (formData: UserAuthFormProps) => {
  return await axiosInstance.post("/auth/login", formData);
};

export const registerUser = async (
  formData: UserAuthFormProps,
  token: string
) => {
  return await axiosInstance.post("/auth/register", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAuthenticatedUser = async (token: string) => {
  return await axiosInstance.get("/auth/user", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const logoutUser = async () => {
  return await axiosInstance.post(
    "/auth/logout",
    {},
    {
      withCredentials: true,
    }
  );
};

export const refreshAccessToken = async () => {
  return await axiosInstance.get("/auth/refreshAccessToken", {
    withCredentials: true,
  });
};

export const signInViaEmail = async (formData: UserAuthFormProps) => {
  return await axiosInstance.post("/auth/signinViaMail", formData);
};

export const verifyLoginLink = async (userId: string, loginToken: string) => {
  return await axiosInstance.get(
    `/auth/verifyLoginLink/${userId}/${loginToken}`
  );
};

export const verifyEmail = async (
  userId: string,
  verificationToken: string
) => {
  return await axiosInstance.patch(
    `/auth/verifyEmail/${userId}/${verificationToken}`
  );
};

export const sendVerificationEmail = async (
  email: UserAuthFormProps,
  token: string
) => {
  return await axiosInstance.post("/auth/sendVerificationEmail", email, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
