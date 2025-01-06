import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "easymde/dist/easymde.min.css";
import "@fontsource/lato";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProviderContext } from "./store/AuthContext.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProviderContext>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </AuthProviderContext>
  </StrictMode>
);
