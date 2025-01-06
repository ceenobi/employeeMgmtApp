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
  checkAuth: (token: string) => Promise<void> | void;
  isAuthenticated: boolean;
  error: unknown | null;
  logout: () => void;
  loading: boolean;
  refreshToken: (token: string) => Promise<void> | void;
};

const useAuthProvider = create<authType>((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  loading: false,
  checkAuth: async (token: string) => {
    if (!token) return;
    try {
      const { data } = await getAuthenticatedUser(token);
      set({
        user: data,
        isAuthenticated: true,
        error: null,
      });
    } catch (error: unknown) {
      set({ error, isAuthenticated: false });
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
      console.error("Authentication error:", error);
      set({ error });
      toast.error("Error logging out");
    }
  },
  refreshToken: async (token: string): Promise<void> => {
    if (!token) {
      useSaveToken.setState({ token: null });
      return;
    }
    const refresh = async () => {
      try {
        const decodedToken = jwtDecode(token);
        const expirationTime = decodedToken?.exp ?? 0;
        const currentTime = Date.now();
        const timeUntilExpiry = expirationTime * 1000 - currentTime;
        const refreshBuffer = 5 * 60 * 1000;
        const timeUntilRefresh = timeUntilExpiry - refreshBuffer;

        if (timeUntilRefresh <= 0) {
          const { data } = await refreshAccessToken();
          useSaveToken.setState({ token: data.accessToken });
        } else {
          const refreshTimer = setTimeout(async () => {
            try {
              const { data } = await refreshAccessToken();
              useSaveToken.setState({ token: data.accessToken });
            } catch (error) {
              console.error("Error refreshing access token:", error);
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
    };

    refresh();
  },
}));
export { useAuthProvider };
