import axiosInstance from "@/utils/axiosInstance";

export const dashBoardStats = async (token: string) => {
  return await axiosInstance.get("/dashboard", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
