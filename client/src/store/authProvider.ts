import { create } from "zustand";
import {
  getAuthenticatedUser,
  logoutUser,
  refreshAccessToken,
} from "@/api/auth";
import { toast } from "sonner";
import { useSaveToken } from "./stateProvider";
import { jwtDecode } from "jwt-decode";

type authType = {
  user: null | unknown;
  checkAuth: (token: string) => void;
  isAuthenticated: boolean;
  error: unknown | null;
  logout: () => void;
  refreshToken: (token: string) => (() => void) | void;
};

const useAuthProvider = create<authType>((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  checkAuth: async (token: string) => {
    try {
      const { data } = await getAuthenticatedUser(token);
      set({
        user: data,
        isAuthenticated: true,
        error: null,
      });
    } catch (error) {
      set({ error: error, isAuthenticated: false });
    }
  },

  logout: async () => {
    try {
      await logoutUser();
      useSaveToken.setState({ token: null });
      set({
        user: null,
        isAuthenticated: false,
        error: null,
      });
      toast.success("Successfully logged out");
    } catch (error) {
      set({ error: error });
      toast.error("Error logging out");
    }
  },

  refreshToken: (token: string): (() => void) | void => {
    if (!token) {
      useSaveToken.setState({ token: null });
      return;
    }
    try {
      const decodedToken = jwtDecode(token);
      const expirationTime = decodedToken?.exp ?? 0;
      const currentTime = Date.now();
      const timeUntilExpiry = expirationTime - currentTime;

      const refreshBuffer = 5 * 60 * 1000;
      const timeUntilRefresh = timeUntilExpiry - refreshBuffer;
      if (timeUntilRefresh <= 0) {
        refreshAccessToken()
          .then(({ data }) => {
            useSaveToken.setState({ token: data.accessToken });
          })
          .catch(async () => {
            await logoutUser();
            useSaveToken.setState({ token: null });
          });
      } else {
        const refreshTimer = setTimeout(async () => {
          try {
            const { data } = await refreshAccessToken();
            useSaveToken.setState({ token: data.accessToken });
          } catch (error) {
            console.error(error);
            await logoutUser();
            useSaveToken.setState({ token: null });
          }
        }, timeUntilRefresh);

        return () => clearTimeout(refreshTimer);
      }
    } catch (error) {
      console.error("Error setting up token refresh:", error);
      useSaveToken.setState({ token: null });
    }
  },
}));

export { useAuthProvider };
