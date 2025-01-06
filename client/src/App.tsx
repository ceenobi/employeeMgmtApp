import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "sonner";
import AppRoutes from "@/routes/Approutes";
import { LazySpinner } from "./components";
import { useAuthProvider } from "./store/authProvider";

function App() {
  const { loading } = useAuthProvider();

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
