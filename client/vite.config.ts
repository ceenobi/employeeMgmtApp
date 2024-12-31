import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  server: {
    host: "0.0.0.0",
    port:4100,
    open:true,
    proxy:{
      "/api":{
        target: "http://localhost:5500",
        changeOrigin:true,
        secure:false,
      }
    }
  },
});
