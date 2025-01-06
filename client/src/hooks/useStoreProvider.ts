import { AuthStoreContext } from "@/store";
import { useContext } from "react";

export const useAuthProvider = () => useContext(AuthStoreContext);