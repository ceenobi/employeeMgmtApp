import { ReactNode, useEffect, useState } from "react";
import { useSaveToken } from "./stateProvider";
import { useAuthProvider } from "./authProvider";
import { AuthStoreContext } from ".";

export const AuthProviderContext = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { token } = useSaveToken((state) => state) as {
    token: string | null;
  };
  const { checkAuth, refreshToken } = useAuthProvider();

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    const fetchUser = async () => {
      try {
        await checkAuth(token);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    refreshToken(token);
  }, [token, refreshToken, checkAuth]);

  const contextData = { loading };
  return (
    <AuthStoreContext.Provider value={contextData}>
      {children}
    </AuthStoreContext.Provider>
  );
};
