import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "sonner";
import { useAuthProvider } from "./store/authProvider";
import { useSaveToken } from "./store/stateProvider";
import { useEffect, useState } from "react";
import AppRoutes from "@/routes/Approutes";
import { LazySpinner } from "./components";

function App() {
  const [loading, setLoading] = useState(true);
  const { checkAuth, refreshToken, isAuthenticated } = useAuthProvider();
  const { token } = useSaveToken((state) => state) as {
    token: string | null;
  };

  useEffect(() => {
    const authenticate = async () => {
      if (token) {
        await checkAuth(token);
      }
      await refreshToken(token as string);
      setLoading(false);
    };

    authenticate();
  }, [token, checkAuth, refreshToken, isAuthenticated]);

  if (loading) {
    return <LazySpinner />;
  }

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
