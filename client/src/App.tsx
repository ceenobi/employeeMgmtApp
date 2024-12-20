import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "sonner";
import { useAuthProvider } from "./store/authProvider";
import { useSaveToken } from "./store/stateProvider";
import { useEffect } from "react";
import AppRoutes from "@/routes/Approutes";

function App() {
  const { checkAuth, refreshToken } = useAuthProvider();
  const { token } = useSaveToken((state) => state) as {
    token: string | null;
  };

  useEffect(() => {
    if (token) {
      checkAuth(token);
    }
    const cleanup = refreshToken(token as string) ?? (() => {});
    return () => cleanup?.();
  }, [checkAuth, refreshToken, token]);
  // console.log(user);
  return (
    <>
      <HelmetProvider>
        <Toaster position="top-center" expand={true} richColors />
        <AppRoutes />
      </HelmetProvider>
    </>
  );
}

export default App;
